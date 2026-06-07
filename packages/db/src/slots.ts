import { getPublicClient, getTenantClient } from "./index";
import { parseTimeToMinutes } from "@book-in/lib";
import { Prisma } from "@prisma/client";

// Helper to convert JavaScript getDay() (0=Sun, 6=Sat) to ISO weekday (1=Mon, 7=Sun)
function getIsoWeekday(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

/**
 * Cancels bookings that have been pending for more than 15 minutes.
 */
export async function cancelStalePendingBookings(tenantSchema: string): Promise<number> {
  const tenantDb = getTenantClient(tenantSchema) as any;
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  
  // Find bookings pending and older than 15 minutes (bounded to batch of 50)
  const staleBookings = await tenantDb.booking.findMany({
    where: {
      status: "PENDING", // Status is uppercase in new schema
      created_at: {
        lt: fifteenMinutesAgo
      }
    },
    take: 50,
    select: {
      id: true,
    }
  });

  if (staleBookings.length === 0) return 0;
  const staleIds = staleBookings.map((b: any) => b.id);

  // Atomic batch updates for bookings
  await tenantDb.booking.updateMany({
    where: { id: { in: staleIds } },
    data: { 
      status: "CANCELLED",
      cancel_reason: "Payment timeout (15m)",
      cancelled_at: new Date()
    }
  });
  
  console.log(`[Cron] Successfully batch cancelled ${staleBookings.length} stale unpaid bookings.`);
  return staleBookings.length;
}

/**
 * Dynamically generates available slots in-memory for a given service and date range.
 * This replaces the old method of querying pre-generated slots from the database.
 */
export async function generateSlots(input: {
  serviceId: string;
  startDate: Date;
  endDate: Date;
  tenantDb: any;
}): Promise<any[]> {
  const { serviceId, startDate, endDate, tenantDb } = input;
  
  // 1. Fetch Service to get duration and buffers
  const services = await tenantDb.$queryRaw`
    SELECT duration_minutes, buffer_before_minutes, buffer_after_minutes
    FROM services WHERE id = ${serviceId}::uuid LIMIT 1;
  ` as any[];
  
  if (!services.length) return [];
  const service = services[0];
  const duration = service.duration_minutes || 60;
  const bufBefore = service.buffer_before_minutes || 0;
  const bufAfter = service.buffer_after_minutes || 0;

  // 2. Fetch Eligible Staff
  const staffMembers = await tenantDb.$queryRaw`
    SELECT s.id FROM staff s
    JOIN staff_services ss ON s.id = ss.staff_id
    WHERE ss.service_id = ${serviceId}::uuid 
    AND s.is_accepting_bookings = true 
    AND s.deleted_at IS NULL;
  ` as any[];

  if (staffMembers.length === 0) return [];
  const staffIds = staffMembers.map((s: any) => s.id);
  const staffIdsList = Prisma.join(staffIds.map((id: string) => Prisma.sql`${id}::uuid`));

  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  // 3. Bulk Fetch Overrides
  const overrides = await tenantDb.$queryRaw`
    SELECT staff_id, date, start_time, end_time, break_start, break_end, is_day_off 
    FROM staff_date_overrides 
    WHERE staff_id IN (${staffIdsList}) 
    AND date >= ${startDateStr}::date AND date <= ${endDateStr}::date;
  ` as any[];

  // 4. Bulk Fetch Weekly Hours
  const weekly = await tenantDb.$queryRaw`
    SELECT staff_id, day_of_week, start_time, end_time, break_start, break_end, is_day_off 
    FROM staff_working_hours 
    WHERE staff_id IN (${staffIdsList});
  ` as any[];

  // 5. Bulk Fetch Bookings
  const existingBookingsRaw = await tenantDb.$queryRaw`
    SELECT staff_id, starts_at, ends_at, buffer_before, buffer_after 
    FROM bookings 
    WHERE staff_id IN (${staffIdsList}) 
    AND status NOT IN ('CANCELLED', 'NO_SHOW')
    AND starts_at >= ${startDate.toISOString()}::timestamptz
    AND starts_at <= ${endDate.toISOString()}::timestamptz;
  ` as any[];

  const bookedRanges = existingBookingsRaw.map((b: any) => ({
    staff_id: b.staff_id,
    start: new Date(b.starts_at).getTime() - (b.buffer_before || 0) * 60000,
    end: new Date(b.ends_at).getTime() + (b.buffer_after || 0) * 60000
  }));

  const slots: any[] = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0,0,0,0);
  const endLimit = new Date(endDate);
  endLimit.setHours(23,59,59,999);
  
  const now = new Date().getTime();
  const totalRequiredMinutes = bufBefore + duration + bufAfter;

  while (currentDate <= endLimit) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay();

    for (const staffId of staffIds) {
      let hoursInfo: any = null;
      
      const override = overrides.find((o: any) => o.staff_id === staffId && new Date(o.date).toISOString().split('T')[0] === dateStr);
      if (override) {
        hoursInfo = override;
      } else {
        const staffWeekly = weekly.find((w: any) => w.staff_id === staffId && w.day_of_week === dayOfWeek);
        if (staffWeekly) hoursInfo = staffWeekly;
      }

      if (!hoursInfo || hoursInfo.is_day_off) continue;

      if (!hoursInfo.start_time || !hoursInfo.end_time) continue;

      const periods = [];
      const parseTime = (ts: string) => new Date(`${dateStr}T${ts}Z`).getTime();
      const dayStart = parseTime(hoursInfo.start_time);
      const dayEnd = parseTime(hoursInfo.end_time);

      if (hoursInfo.break_start && hoursInfo.break_end) {
        periods.push({ start: dayStart, end: parseTime(hoursInfo.break_start) });
        periods.push({ start: parseTime(hoursInfo.break_end), end: dayEnd });
      } else {
        periods.push({ start: dayStart, end: dayEnd });
      }

      const staffBookings = bookedRanges.filter((b: any) => b.staff_id === staffId);

      for (const p of periods) {
        let currentStart = p.start;
        while (currentStart + totalRequiredMinutes * 60000 <= p.end) {
          const slotRealStart = currentStart + bufBefore * 60000;
          const currentEnd = currentStart + totalRequiredMinutes * 60000;

          if (currentStart < now) {
            currentStart += 15 * 60000;
            continue;
          }

          let hasConflict = false;
          for (const b of staffBookings) {
            if (currentStart < b.end && currentEnd > b.start) {
              hasConflict = true;
              break;
            }
          }

          if (!hasConflict) {
            const slotStart = new Date(slotRealStart);
            const slotEnd = new Date(slotRealStart + duration * 60000);
            const vId = encodeURIComponent([slotStart.toISOString(), slotEnd.toISOString(), staffId, serviceId].join('|'));
            
            slots.push({
              virtual_id: vId,
              service_id: serviceId,
              staff_id: staffId,
              starts_at: slotStart,
              ends_at: slotEnd,
              status: "available",
            });
          }

          currentStart += 15 * 60000;
        }
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return slots;
}
