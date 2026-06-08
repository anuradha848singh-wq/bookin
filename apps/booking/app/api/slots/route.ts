import { NextRequest, NextResponse } from "next/server";
import { getTenantClient, getPublicClient } from "@book-in/db";

export const dynamic = "force-dynamic";

/**
 * Real Slot Generation Engine
 * 
 * Algorithm:
 * 1. Fetch service duration & buffers
 * 2. Determine staff pool (specific staff or all staff that can perform the service)
 * 3. For each staff member, load their working hours for the requested day-of-week
 * 4. Check for date overrides (day-off, custom hours, holidays)
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
    const services = (await tenantDb.$queryRawUnsafe(`
      SELECT id, name, duration_minutes, buffer_before_minutes, buffer_after_minutes,
             min_advance_hours, max_advance_days
      FROM services 
      WHERE id = $1::uuid AND is_public = true AND deleted_at IS NULL
      LIMIT 1;
    `, serviceId)) as any[];

    if (!services.length) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const service = services[0];
    const duration = parseInt(service.duration_minutes) || 30;
    const bufferBefore = parseInt(service.buffer_before_minutes) || 0;
    const bufferAfter = parseInt(service.buffer_after_minutes) || 0;
    const slotStep = duration + bufferAfter; // each slot occupies this many minutes

    // Minimum advance hours check
    const minAdvanceHours = parseInt(service.min_advance_hours) || 1;
    const minBookableTime = new Date(Date.now() + minAdvanceHours * 60 * 60 * 1000);

    // 2. Determine applicable staff
    const dayOfWeek = requestedDate.getUTCDay(); // 0 = Sunday, 6 = Saturday

    let staffQuery = `
      SELECT DISTINCT s.id, s.first_name, s.last_name
      FROM staff s
      INNER JOIN staff_services ss ON ss.staff_id = s.id
      WHERE ss.service_id = $1::uuid
        AND s.is_accepting_bookings = true
        AND s.deleted_at IS NULL
    `;
    const staffParams: any[] = [serviceId];

    if (staffId) {
      staffQuery += ` AND s.id = $2::uuid`;
      staffParams.push(staffId);
    }

    const staffList = (await tenantDb.$queryRawUnsafe(staffQuery, ...staffParams)) as any[];

    if (!staffList.length) {
      return NextResponse.json({ success: true, slots: [], message: "No available staff for this service." });
    }

    const allSlots: Map<string, { time: string; available: boolean; staffIds: string[] }> = new Map();

    // 3. For each staff member, compute available slots
    for (const staff of staffList) {
      // Check for date override (day off / custom hours)
      const overrides = (await tenantDb.$queryRawUnsafe(`
        SELECT type, is_day_off, start_time, end_time
        FROM staff_date_overrides
        WHERE staff_id = $1::uuid AND date = $2::date
        LIMIT 1;
      `, staff.id, date)) as any[];

      let workStart: string | null = null;
      let workEnd: string | null = null;

      if (overrides.length > 0) {
        const override = overrides[0];
        if (override.is_day_off || override.type === "DAY_OFF" || override.type === "HOLIDAY") {
          continue; // This staff member is off today
        }
        workStart = override.start_time;
        workEnd = override.end_time;
      } else {
        // 4. Fetch regular working hours
        const hours = (await tenantDb.$queryRawUnsafe(`
          SELECT start_time, end_time, break_start, break_end, is_day_off
          FROM staff_working_hours
          WHERE staff_id = $1::uuid AND day_of_week = $2
          LIMIT 1;
        `, staff.id, dayOfWeek)) as any[];

        if (!hours.length || hours[0].is_day_off) {
          continue; // No schedule defined or day off
        }

        workStart = hours[0].start_time; // e.g. "09:00:00"
        workEnd = hours[0].end_time;     // e.g. "17:00:00"
      }

      if (!workStart || !workEnd) continue;

      // Parse work window
      const [startH = 0, startM = 0] = workStart.split(":").map(Number);
      const [endH = 0, endM = 0] = workEnd.split(":").map(Number);
      const workStartMinutes = startH * 60 + startM;
      const workEndMinutes = endH * 60 + endM;

      // 5. Fetch existing bookings for this staff on this date
      const existingBookings = (await tenantDb.$queryRawUnsafe(`
        SELECT starts_at, ends_at, buffer_before, buffer_after
        FROM bookings
        WHERE staff_id = $1::uuid
          AND status NOT IN ('CANCELLED', 'NO_SHOW')
          AND DATE(starts_at AT TIME ZONE 'UTC') = $2::date
        ORDER BY starts_at;
      `, staff.id, date)) as any[];

      // Build busy windows in minutes from midnight UTC
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
