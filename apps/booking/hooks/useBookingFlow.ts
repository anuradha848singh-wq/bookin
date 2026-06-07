/**
 * useBookingFlow — The Core Booking Hook
 * 
 * Refactored to leverage useSlots and useOTP hooks internally,
 * preserving the exact public interface and state.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Service,
  Slot,
  BookingStep,
  UseBookingFlowReturn,
} from '../types/booking';
import { useSlots } from './useSlots';
import { useOTP } from './useOTP';

interface UseBookingFlowProps {
  clinicSlug: string;
}

export function useBookingFlow({ clinicSlug }: UseBookingFlowProps): UseBookingFlowReturn {
  // Generate session ID once on mount
  const sessionIdRef = useRef<string>(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2)
  );

  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Call useSlots hook internally
  const { refetch } = useSlots({
    clinicSlug,
    serviceId: selectedService?.id || null,
    date: selectedDate,
  });

  // 2. Call useOTP hook internally
  const {
    sendOTP: triggerSendOTP,
    verifyOTP: triggerVerifyOTP,
    resendOTP: triggerResendOTP,
    error: otpError,
    isLoading: otpLoading,
  } = useOTP({
    phone: patientPhone,
  });

  // Sync error states from sub-hooks
  useEffect(() => {
    if (otpError) {
      setError(otpError);
    }
  }, [otpError]);

  // Release slot lock on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (selectedSlot) {
        const payload = JSON.stringify({
          slotId: selectedSlot.id,
          sessionId: sessionIdRef.current,
        });
        navigator.sendBeacon(
          `/api/clinic/${clinicSlug}/lock-slot`,
          new Blob([payload], { type: 'application/json' })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [selectedSlot, clinicSlug]);

  // Step 1 → Step 2: Select Service
  const selectService = useCallback((service: Service) => {
    setSelectedService(service);
    setSelectedSlot(null);
    setError(null);
    setCurrentStep(2);
  }, []);

  // Step 2: Change Date
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setError(null);
  }, []);

  // Step 2 → Step 3: Select Slot (acquire lock)
  const selectSlot = useCallback(
    async (slot: Slot) => {
      setIsLoading(true);
      setError(null);

      try {
        const vId = slot.virtual_id || encodeURIComponent([slot.starts_at, slot.ends_at, slot.staff_id || 'no-staff', slot.service_id].join('|'));
        const response = await fetch(`/api/clinic/${clinicSlug}/lock-slot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotId: vId,
            sessionId: sessionIdRef.current,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || 'This slot was just taken. Please pick another.'
          );
        }

        setSelectedSlot(slot);
        setCurrentStep(3);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to lock slot');
      } finally {
        setIsLoading(false);
      }
    },
    [clinicSlug]
  );

  // Go Back to Previous Step
  const goBack = useCallback(async () => {
    setError(null);

    if ((currentStep === 3 || currentStep === 4) && selectedSlot) {
      try {
        const vId = selectedSlot.virtual_id || encodeURIComponent([selectedSlot.starts_at, selectedSlot.ends_at, selectedSlot.staff_id || 'no-staff', selectedSlot.service_id].join('|'));
        await fetch(`/api/clinic/${clinicSlug}/lock-slot`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotId: vId,
            sessionId: sessionIdRef.current,
          }),
        });
        setSelectedSlot(null);
      } catch (err) {
        console.error('Failed to release lock:', err);
      }
    }

    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as BookingStep);
    }
  }, [currentStep, selectedSlot, clinicSlug]);

  // Step 3 → Step 4: Submit Patient Info & Send OTP
  const submitPatientInfo = useCallback(
    async (name: string, phone: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const success = await triggerSendOTP(phone);
        if (!success) {
          throw new Error('Failed to send OTP');
        }

        setPatientName(name);
        setPatientPhone(phone);
        setCurrentStep(4);
      } catch (err: any) {
        setError(err.message || 'Failed to send OTP');
      } finally {
        setIsLoading(false);
      }
    },
    [triggerSendOTP]
  );

  // Step 4 → Step 5: Verify OTP & Create Booking
  const verifyOTP = useCallback(
    async (otp: string) => {
      if (!selectedSlot) {
        setError('No slot selected');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const vId = selectedSlot.virtual_id || encodeURIComponent([selectedSlot.starts_at, selectedSlot.ends_at, selectedSlot.staff_id || 'no-staff', selectedSlot.service_id].join('|'));
        const booking = await triggerVerifyOTP(otp, vId, clinicSlug, sessionIdRef.current);
        if (!booking) {
          throw new Error('OTP verification failed');
        }

        setBookingId(booking.id || null);
        setCurrentStep(5);
      } catch (err: any) {
        setError(err.message || 'OTP verification failed');
      } finally {
        setIsLoading(false);
      }
    },
    [selectedSlot, clinicSlug, triggerVerifyOTP]
  );

  // Retry OTP (resend)
  const retryOTP = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await triggerResendOTP();
      if (!success) {
        throw new Error('Failed to resend OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  }, [triggerResendOTP]);

  // Reset entire flow
  const reset = useCallback(async () => {
    if (selectedSlot) {
      try {
        const vId = selectedSlot.virtual_id || encodeURIComponent([selectedSlot.starts_at, selectedSlot.ends_at, selectedSlot.staff_id || 'no-staff', selectedSlot.service_id].join('|'));
        await fetch(`/api/clinic/${clinicSlug}/lock-slot`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotId: vId,
            sessionId: sessionIdRef.current,
          }),
        });
      } catch (err) {
        console.error('Failed to release lock on reset:', err);
      }
    }

    setCurrentStep(1);
    setSelectedService(null);
    setSelectedSlot(null);
    setSelectedDate(new Date());
    setPatientName('');
    setPatientPhone('');
    setBookingId(null);
    setError(null);
  }, [selectedSlot, clinicSlug]);

  return {
    currentStep,
    selectedService,
    selectedSlot,
    selectedDate,
    patientName,
    patientPhone,
    bookingId,
    sessionId: sessionIdRef.current,
    isLoading: isLoading || otpLoading,
    error,

    selectService,
    selectDate,
    selectSlot,
    goBack,
    submitPatientInfo,
    verifyOTP,
    retryOTP,
    reset,
  };
}
