import { NextRequest, NextResponse } from "next/server";
import { getTenantClient, getPublicClient } from "@book-in/db";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * Real Slot Generation Engine
 * 
 * Algorithm:
 * 1. Fetch service duration & buffers
 * 2. Determine staff pool (specific staff or all staff that can perform the service)
 * 3. Fetch overrides, working hours, and bookings for ALL staff in bulk
 * 4. For each staff member, check for date overrides or working hours
 * 5. Generate all possible time slots within their working window
 * 6. Subtract existing booked slots (with buffers) → availability windows
 * 7. Deduplicate and merge slots across all staff (if "any available" selected)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");           // YYYY-MM-DD
    const serviceId = searchParams.get("serviceId");
    const staffId = searchParams.get("staffId");     // optional — null means "any"
    const clinicSlug = searchParams.get("clinicSlug");

    if (!date || !serviceId || !clinicSlug) {
      return NextResponse.json(
        { error: "Missing required params: date, serviceId, clinicSlug" },
        { status: 400 }
      );
    }

    // Validate date
    const requestedDate = new Date(date + "T00:00:00Z");
    if (isNaN(requestedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
    }

    const publicDb = getPublicClient();
    const clinic = await publicDb.tenant.findUnique({ where: { slug: clinicSlug } });
    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    // 1. Fetch service
    const service = await tenantDb.service.findFirst({
      where: { id: serviceId, is_public: true, deleted_at: null },
      select: { 
        id: true, name: true, duration_minutes: true, 
        buffer_before_minutes: true, buffer_after_minutes: true,
        min_advance_hours: true, max_advance_days: true
      }
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const duration = service.duration_minutes || 30;
    const bufferBefore = service.buffer_before_minutes || 0;
    const bufferAfter = service.buffer_after_minutes || 0;
    const slotStep = duration + bufferAfter; // each slot occupies this many minutes

    // Minimum advance hours check
    const minAdvanceHours = service.min_advance_hours || 1;
    const minBookableTime = new Date(Date.now() + minAdvanceHours * 60 * 60 * 1000);

    // 2. Determine applicable staff
    const dayOfWeek = requestedDate.getUTCDay(); // 0 = Sunday, 6 = Saturday

    const staffWhere: any = {
      is_accepting_bookings: true,
      deleted_at: null,
      services: { some: { service_id: serviceId } }
    };
    if (staffId) {
      staffWhere.id = staffId;
    }

    const staffList = await tenantDb.staff.findMany({
      where: staffWhere,
      select: { id: true, first_name: true, last_name: true }
    });

    if (!staffList.length) {
      return NextResponse.json({ success: true, slots: [], message: "No available staff for this service." });
    }

    const staffIds = staffList.map((s: any) => s.id);
    const dateParsed = new Date(date + "T00:00:00Z");

    // 3. Bulk fetch overrides, working hours, and bookings to avoid N+1 inside the loop
    const [overridesList, workingHoursList, bookingsList] = await Promise.all([
      tenantDb.staffDateOverride.findMany({
        where: { staff_id: { in: staffIds }, date: dateParsed },
        select: { staff_id: true, type: true, is_day_off: true, start_time: true, end_time: true }
      }),
      tenantDb.staffWorkingHours.findMany({
        where: { staff_id: { in: staffIds }, day_of_week: dayOfWeek },
        select: { staff_id: true, start_time: true, end_time: true, is_day_off: true }
      }),
      tenantDb.$queryRaw<any[]>`
        SELECT staff_id, starts_at, ends_at, buffer_before, buffer_after
        FROM bookings
        WHERE staff_id IN (${Prisma.join(staffIds.map((id: string) => Prisma.sql`${id}::uuid`))})
          AND status NOT IN ('CANCELLED', 'NO_SHOW')
          AND DATE(starts_at AT TIME ZONE 'UTC') = ${dateParsed}::date
        ORDER BY starts_at;
      `
    ]);

    const overridesMap = new Map();
    overridesList.forEach((o: any) => overridesMap.set(o.staff_id, o));

    const workingHoursMap = new Map();
    workingHoursList.forEach((w: any) => workingHoursMap.set(w.staff_id, w));

    const bookingsMap = new Map();
    bookingsList.forEach((b: any) => {
      if (!bookingsMap.has(b.staff_id)) bookingsMap.set(b.staff_id, []);
      bookingsMap.get(b.staff_id).push(b);
    });

    const allSlots: Map<string, { time: string; available: boolean; staffIds: string[] }> = new Map();

    // 4. For each staff member, compute available slots in memory
    for (const staff of staffList) {
      let workStart: string | null = null;
      let workEnd: string | null = null;

      const override = overridesMap.get(staff.id);
      
      if (override) {
        if (override.is_day_off || override.type === "DAY_OFF" || override.type === "HOLIDAY") {
          continue; // This staff member is off today
        }
        
        const formatTime = (d: any) => d ? new Date(d).toISOString().split("T")[1]!.substring(0, 8) : null;
        workStart = typeof override.start_time === "string" ? override.start_time : formatTime(override.start_time);
        workEnd = typeof override.end_time === "string" ? override.end_time : formatTime(override.end_time);
      } else {
        const hours = workingHoursMap.get(staff.id);
        if (!hours || hours.is_day_off) {
          continue; // No schedule defined or day off
        }

        const formatTime = (d: any) => d ? new Date(d).toISOString().split("T")[1]!.substring(0, 8) : null;
        workStart = typeof hours.start_time === "string" ? hours.start_time : formatTime(hours.start_time);
        workEnd = typeof hours.end_time === "string" ? hours.end_time : formatTime(hours.end_time);
      }

      if (!workStart || !workEnd) continue;

      // Parse work window
      const [startH = 0, startM = 0] = workStart.split(":").map(Number);
      const [endH = 0, endM = 0] = workEnd.split(":").map(Number);
      const workStartMinutes = startH * 60 + startM;
      const workEndMinutes = endH * 60 + endM;

      // 5. Compute busy windows for this staff
      const existingBookings = bookingsMap.get(staff.id) || [];
      const busyWindows: Array<{ start: number; end: number }> = existingBookings.map((b: any) => {
        const bStart = new Date(b.starts_at);
        const bEnd = new Date(b.ends_at);
        const bufBefore = parseInt(b.buffer_before) || 0;
        const bufAfter = parseInt(b.buffer_after) || 0;
        const startMin = bStart.getUTCHours() * 60 + bStart.getUTCMinutes() - bufBefore;
        const endMin = bEnd.getUTCHours() * 60 + bEnd.getUTCMinutes() + bufAfter;
        return { start: startMin, end: endMin };
      });

      // 6. Generate candidate slots
      let currentMin = workStartMinutes;

      while (currentMin + duration <= workEndMinutes) {
        const slotEnd = currentMin + duration + bufferAfter;

        // Check if slot conflicts with any busy window
        const conflictsWithExisting = busyWindows.some(
          (busy) => currentMin < busy.end && slotEnd > busy.start
        );

        // Check minimum advance time
        const slotDateTime = new Date(date + "T" +
          `${Math.floor(currentMin / 60).toString().padStart(2, "0")}:${(currentMin % 60).toString().padStart(2, "0")}:00Z`
        );

        const isPast = slotDateTime <= minBookableTime;

        if (!conflictsWithExisting && !isPast) {
          const timeStr = `${Math.floor(currentMin / 60).toString().padStart(2, "0")}:${(currentMin % 60).toString().padStart(2, "0")}`;
          const existing = allSlots.get(timeStr);
          if (existing) {
            existing.staffIds.push(staff.id);
          } else {
            allSlots.set(timeStr, { time: timeStr, available: true, staffIds: [staff.id] });
          }
        }

        currentMin += slotStep || 30;
      }
    }

    // 7. Sort slots chronologically
    const slots = Array.from(allSlots.values()).sort((a, b) => a.time.localeCompare(b.time));

    return NextResponse.json({
      success: true,
      slots,
      service: {
        name: service.name,
        duration_minutes: duration,
      }
    });

  } catch (error: any) {
    console.error("[GET_SLOTS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to compute available slots" }, { status: 500 });
  }
}
