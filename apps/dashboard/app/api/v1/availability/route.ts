import { NextResponse } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { Prisma } from "@prisma/client";
import { generateSlots, buildWorkingPeriods, TimePeriod } from "@/lib/availability";
import { subMinutes, addMinutes } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tenantSlug = url.searchParams.get("tenant");
  const dateStr = url.searchParams.get("date"); // YYYY-MM-DD
  const serviceId = url.searchParams.get("service_id");
  let staffId = url.searchParams.get("staff_id");

  if (!tenantSlug || !dateStr || !serviceId) {
    return NextResponse.json({ error: "tenant, date, and service_id are required" }, { status: 400 });
  }

  const tenantDb = getTenantClient(`tenant_${tenantSlug}`) as any;

  try {
    // 1. Fetch Service Details
    const services = await tenantDb.$queryRaw`
      SELECT * FROM services WHERE id = ${serviceId}::uuid AND deleted_at IS NULL LIMIT 1;
    ` as any[];

    if (!services || services.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    const service = services[0];

    // 2. Fetch Eligible Staff
    let staffMembers: any[] = [];
    if (staffId) {
      staffMembers = await tenantDb.$queryRaw`
        SELECT * FROM staff WHERE id = ${staffId}::uuid AND is_accepting_bookings = true AND deleted_at IS NULL LIMIT 1;
      ` as any[];
    } else {
      staffMembers = await tenantDb.$queryRaw`
        SELECT s.* FROM staff s
        JOIN staff_services ss ON s.id = ss.staff_id
        WHERE ss.service_id = ${serviceId}::uuid 
        AND s.is_accepting_bookings = true 
        AND s.deleted_at IS NULL;
      ` as any[];
    }

    if (staffMembers.length === 0) {
      return NextResponse.json({ success: true, slots: [] }); // No staff available for this service
    }

    // 3. Prepare Date Context
    const targetDate = new Date(dateStr);
    const dayOfWeek = targetDate.getDay(); // 0-6

    const staffIds = staffMembers.map(s => s.id);
    const staffIdsList = Prisma.join(staffIds.map((id: string) => Prisma.sql`${id}::uuid`));

    // A. Bulk Fetch Overrides
    const overrides = staffIds.length > 0 ? await tenantDb.$queryRaw`
      SELECT * FROM staff_date_overrides 
      WHERE staff_id IN (${staffIdsList}) AND date = ${dateStr}::date;
    ` as any[] : [];

    // B. Bulk Fetch Weekly Hours
    const weekly = staffIds.length > 0 ? await tenantDb.$queryRaw`
      SELECT * FROM staff_working_hours 
      WHERE staff_id IN (${staffIdsList}) AND day_of_week = ${dayOfWeek};
    ` as any[] : [];

    // C. Bulk Fetch Bookings
    const existingBookingsRaw = staffIds.length > 0 ? await tenantDb.$queryRaw`
      SELECT staff_id, starts_at, ends_at, buffer_before, buffer_after 
      FROM bookings 
      WHERE staff_id IN (${staffIdsList}) 
      AND status NOT IN ('CANCELLED', 'NO_SHOW')
      AND starts_at >= ${dateStr}::date
      AND starts_at < (${dateStr}::date + interval '1 day');
    ` as any[] : [];

    let allSlots: any[] = [];

    // Process availability per staff member in memory
    for (const staff of staffMembers) {
      
      // A. Determine Working Hours
      let hoursInfo: any = null;
      
      // Check for Date Overrides first
      const staffOverride = overrides.find(o => o.staff_id === staff.id);

      if (staffOverride) {
        hoursInfo = staffOverride;
      } else {
        // Fallback to weekly template
        const staffWeekly = weekly.find(w => w.staff_id === staff.id);
        
        if (staffWeekly) {
          hoursInfo = staffWeekly;
        }
      }

      if (!hoursInfo || hoursInfo.is_day_off) {
        continue; // Staff doesn't work today
      }

      const workingPeriods = buildWorkingPeriods(dateStr, hoursInfo);
      if (workingPeriods.length === 0) continue;

      // B. Extract Existing Bookings for this Staff on this Date
      const staffBookings = existingBookingsRaw.filter(b => b.staff_id === staff.id);
      const existingBookings: TimePeriod[] = staffBookings.map(b => ({
        start: subMinutes(new Date(b.starts_at), b.buffer_before || 0),
        end: addMinutes(new Date(b.ends_at), b.buffer_after || 0)
      }));

      // C. Generate Slots
      const slots = generateSlots(
        targetDate,
        workingPeriods,
        existingBookings,
        service.duration_minutes,
        service.buffer_before_minutes || 0,
        service.buffer_after_minutes || 0,
        15, // 15 min sliding window intervals
        staff.id
      );

      allSlots.push(...slots);
    }

    // Sort all slots chronologically
    allSlots.sort((a, b) => a.starts_at.getTime() - b.starts_at.getTime());

    return NextResponse.json({ success: true, date: dateStr, slots: allSlots });
  } catch (error: any) {
    console.error("[GET_AVAILABILITY_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to calculate availability" }, { status: 500 });
  }
}

