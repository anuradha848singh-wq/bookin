import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@book-in/ui';
import styles from './OTPVerify.module.css';

export interface OTPVerifyProps {
  phone: string;
  isLoading: boolean;
  error: string | null;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
}

export const OTPVerify: React.FC<OTPVerifyProps> = ({
  phone,
  isLoading,
  error,
  onVerify,
  onResend,
  onBack,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (newOtp.every((digit) => digit !== '') && !isLoading) {
      onVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
      
      // Auto-submit
      if (!isLoading) {
        onVerify(pastedData);
      }
    }
  };

  const handleResend = () => {
    setCanResend(false);
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    onResend();
  };

  const handleManualSubmit = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      onVerify(otpValue);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Verify Phone Number</h2>
      <p className={styles.subtitle}>
        We've sent a 6-digit verification code to <strong>{phone}</strong>
      </p>

      <div className={styles.otpContainer}>
        <div className={styles.otpInputs} onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={styles.otpInput}
              disabled={isLoading}
              aria-label={`Digit ${index + 1} of 6`}
            />
          ))}
        </div>

        {error && (
          <div className={styles.errorMessage} role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          onClick={handleManualSubmit}
          disabled={otp.some((digit) => digit === '')}
        >
          Confirm Appointment
        </Button>

        <div className={styles.resendContainer}>
          {canResend ? (
            <button
              type="button"
              className={styles.resendButton}
              onClick={handleResend}
              disabled={isLoading}
            >
              Resend Code
            </button>
          ) : (
            <span className={styles.resendTimer}>
              Resend code in {resendTimer}s
            </span>
          )}
        </div>

        <button
          type="button"
          className={styles.backButton}
          onClick={onBack}
          disabled={isLoading}
        >
          ← Go back & release lock
        </button>
      </div>
    </div>
  );
};
