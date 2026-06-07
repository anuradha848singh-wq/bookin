import { useState, useCallback } from 'react';

export interface UseOTPProps {
  phone: string;
}

export function useOTP({ phone }: UseOTPProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  const sendOTP = useCallback(async (customPhone?: string) => {
    const activePhone = customPhone || phone;
    if (!activePhone) return false;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: activePhone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setAttemptsRemaining(3); // Reset attempts on successful send
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [phone]);

  const verifyOTP = useCallback(async (otp: string, slotId: string, clinicSlug: string, sessionId: string) => {
    if (!phone || !slotId) return null;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          otp,
          slotId,
          clinicSlug,
          sessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Decrement attempts remaining if OTP is incorrect
        setAttemptsRemaining((prev) => Math.max(0, prev - 1));
        throw new Error(data.error || 'Invalid OTP code');
      }

      return data.booking || null;
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [phone]);

  const resendOTP = useCallback(async () => {
    return await sendOTP();
  }, [sendOTP]);

  return {
    sendOTP,
    verifyOTP,
    resendOTP,
    attemptsRemaining,
    isLoading,
    error,
  };
}
