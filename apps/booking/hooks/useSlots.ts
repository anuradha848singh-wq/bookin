import { useState, useEffect, useCallback } from 'react';
import type { Slot } from '../types/booking';

export interface UseSlotsProps {
  clinicSlug: string;
  serviceId: string | null;
  date: Date;
}

export function useSlots({ clinicSlug, serviceId, date }: UseSlotsProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsByDate, setSlotsByDate] = useState<Record<string, Slot[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    if (!serviceId) {
      setSlots([]);
      setSlotsByDate({});
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dateStr = date.toISOString().split('T')[0] || '';
      const res = await fetch(
        `/api/clinic/${clinicSlug}/slots?serviceId=${serviceId}&date=${dateStr}`
      );
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load available slots');
      }

      const groupedData = data.data || {};
      setSlotsByDate(groupedData);

      // Extract slots for the selected date
      setSlots(groupedData[dateStr] || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch slots');
      setSlots([]);
      setSlotsByDate({});
    } finally {
      setIsLoading(false);
    }
  }, [clinicSlug, serviceId, date]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return {
    slots,
    slotsByDate,
    isLoading,
    error,
    refetch: fetchSlots,
  };
}
