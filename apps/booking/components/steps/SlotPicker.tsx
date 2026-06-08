import React, { useState, useEffect } from 'react';
import type { Slot, SlotsByDate } from '../../types/booking';
import { Spinner } from '@book-in/ui';
import styles from './SlotPicker.module.css';

export interface SlotPickerProps {
  clinicSlug: string;
  serviceId: string;
  selectedSlot: Slot | null;
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;
  onSlotSelect: (slot: Slot) => void;
  onDateChange: (date: Date) => void;
  onBack: () => void;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  clinicSlug,
  serviceId,
  selectedSlot,
  selectedDate,
  isLoading: parentLoading,
  error: parentError,
  onSlotSelect,
  onDateChange,
  onBack,
}) => {
  const [slotsByDate, setSlotsByDate] = useState<SlotsByDate>({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Fetch slots when service changes
  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setSlotsError(null);

      try {
        const response = await fetch(
          `/api/clinic/${clinicSlug}/slots?serviceId=${serviceId}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load slots');
        }

        setSlotsByDate(data.data || {});
      } catch (err) {
        setSlotsError(err instanceof Error ? err.message : 'Failed to load slots');
      } finally {
        setIsLoadingSlots(false);
      }
    };

    if (serviceId) {
      fetchSlots();
    }
  }, [clinicSlug, serviceId]);

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0] || '';
  };

  const selectedDateKey = formatDateKey(selectedDate);
  const slotsForSelectedDate = slotsByDate[selectedDateKey] || [];

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateTab = (date: Date) => {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    return { weekday, dayNum };
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select Date & Time</h2>

      {/* Date Tabs */}
      <div className={styles.dateTabs} role="tablist" aria-label="Select date">
        {dates.map((date) => {
          const dateKey = formatDateKey(date);
          const { weekday, dayNum } = formatDateTab(date);
          const isActive = dateKey === selectedDateKey;
          const hasSlots = (slotsByDate[dateKey] || []).length > 0;

          return (
            <button
              key={dateKey}
              className={`${styles.dateTab} ${isActive ? styles.active : ''} ${
                !hasSlots && !isLoadingSlots ? styles.disabled : ''
              }`}
              onClick={() => onDateChange(date)}
              disabled={!hasSlots && !isLoadingSlots}
              role="tab"
              aria-selected={isActive}
              aria-label={`${weekday} ${dayNum}, ${hasSlots ? 'slots available' : 'no slots'}`}
            >
              <div className={styles.dateTabDay}>{weekday}</div>
              <div className={styles.dateTabNum}>{dayNum}</div>
            </button>
          );
        })}
      </div>

      {/* Slots Grid */}
      <div className={styles.slotsContainer}>
        {isLoadingSlots && (
          <div className={styles.loadingState}>
            <Spinner size="lg" />
            <p>Loading available slots...</p>
          </div>
        )}

        {!isLoadingSlots && slotsError && (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>⚠️</div>
            <p>{slotsError}</p>
          </div>
        )}

        {!isLoadingSlots && !slotsError && slotsForSelectedDate.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <p>No available slots for this date</p>
          </div>
        )}

        {!isLoadingSlots && !slotsError && slotsForSelectedDate.length > 0 && (
          <div className={styles.slotsGrid}>
            {slotsForSelectedDate.map((slot, idx) => (
              <button
                key={slot.virtual_id || idx}
                className={styles.slotButton}
                onClick={() => onSlotSelect(slot)}
                disabled={parentLoading}
                aria-label={`Book slot at ${formatTime(slot.starts_at)}`}
              >
                {formatTime(slot.starts_at)}
              </button>
            ))}
          </div>
        )}

        {parentError && (
          <div className={styles.errorMessage} role="alert">
            {parentError}
          </div>
        )}
      </div>

      <button className={styles.backButton} onClick={onBack} type="button">
        ← Back to services
      </button>
    </div>
  );
};
