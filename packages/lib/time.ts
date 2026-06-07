/**
 * Convert "HH:MM" string to minutes from start of day
 */
export function parseTimeToMinutes(timeStr: string): number {
  const [hours = 0, minutes = 0] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}
