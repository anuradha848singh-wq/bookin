import { addMinutes, isBefore, isAfter, parse, format, addDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";

export interface TimePeriod {
  start: Date;
  end: Date;
}

export interface Slot {
  starts_at: Date;
  ends_at: Date;
  staff_id: string;
}

export function generateSlots(
  date: Date,
  workingPeriods: TimePeriod[], // Array of periods they work today, e.g. [{start: 9am, end: 12pm}, {start: 1pm, end: 5pm}]
  bookings: TimePeriod[],       // Array of existing blocked periods (including their buffers)
  durationMinutes: number,
  bufferBeforeMinutes: number,
  bufferAfterMinutes: number,
  intervalMinutes: number = 15,  // Slide window every 15 mins
  staffId: string
): Slot[] {
  const slots: Slot[] = [];
  const now = new Date();
  
  const totalRequiredMinutes = bufferBeforeMinutes + durationMinutes + bufferAfterMinutes;

  for (const period of workingPeriods) {
    let currentStart = new Date(period.start);

    while (true) {
      const currentEnd = addMinutes(currentStart, totalRequiredMinutes);
      
      // If the slot extends past the working period, stop checking this period
      if (isAfter(currentEnd, period.end)) {
        break;
      }

      // Check if it's in the past
      if (isBefore(currentStart, now)) {
        currentStart = addMinutes(currentStart, intervalMinutes);
        continue;
      }

      // Check against bookings
      let hasConflict = false;
      for (const booking of bookings) {
        // Two intervals [A_start, A_end] and [B_start, B_end] overlap if:
        // A_start < B_end AND A_end > B_start
        if (isBefore(currentStart, booking.end) && isAfter(currentEnd, booking.start)) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        slots.push({
          starts_at: addMinutes(currentStart, bufferBeforeMinutes), // The actual appointment starts after the pre-buffer
          ends_at: addMinutes(currentStart, bufferBeforeMinutes + durationMinutes),
          staff_id: staffId
        });
      }

      // Slide the window
      currentStart = addMinutes(currentStart, intervalMinutes);
    }
  }

  return slots;
}

export function parseTimeToDate(dateStr: string, timeStr: string): Date {
  // dateStr is 'YYYY-MM-DD', timeStr is 'HH:mm:ss'
  return parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm:ss', new Date());
}

export function buildWorkingPeriods(dateStr: string, hoursInfo: any): TimePeriod[] {
  if (hoursInfo.is_day_off) return [];

  const periods: TimePeriod[] = [];
  
  if (hoursInfo.start_time && hoursInfo.end_time) {
    const dayStart = parseTimeToDate(dateStr, hoursInfo.start_time);
    const dayEnd = parseTimeToDate(dateStr, hoursInfo.end_time);

    if (hoursInfo.break_start && hoursInfo.break_end) {
      const breakStart = parseTimeToDate(dateStr, hoursInfo.break_start);
      const breakEnd = parseTimeToDate(dateStr, hoursInfo.break_end);
      
      // Period 1: Start -> Break Start
      periods.push({ start: dayStart, end: breakStart });
      // Period 2: Break End -> End
      periods.push({ start: breakEnd, end: dayEnd });
    } else {
      periods.push({ start: dayStart, end: dayEnd });
    }
  }

  return periods;
}
