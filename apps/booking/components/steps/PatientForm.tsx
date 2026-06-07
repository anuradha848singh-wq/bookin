import React, { useState } from 'react';
import { Input, Button } from '@book-in/ui';
import styles from './PatientForm.module.css';

export interface PatientFormProps {
  name: string;
  phone: string;
  isLoading: boolean;
  error: string | null;
  onSubmit: (name: string, phone: string) => void;
  onBack: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  name: initialName,
  phone: initialPhone,
  isLoading,
  error,
  onSubmit,
  onBack,
}) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-()]{10,}$/.test(phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(name.trim(), phone.trim());
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Details</h2>
      <p className={styles.subtitle}>
        We'll send you a verification code to confirm your booking
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (validationErrors.name) {
              setValidationErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          error={validationErrors.name}
          placeholder="e.g. John Doe"
          required
          disabled={isLoading}
          leftIcon={<span>👤</span>}
        />

        <Input
          label="Mobile Phone"
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (validationErrors.phone) {
              setValidationErrors((prev) => ({ ...prev, phone: undefined }));
            }
          }}
          error={validationErrors.phone}
          placeholder="e.g. +919876543210"
          required
          disabled={isLoading}
          leftIcon={<span>📱</span>}
          helperText="We'll send a verification code to this number"
        />

        {error && (
          <div className={styles.errorMessage} role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Send Verification Code
        </Button>

        <button
          type="button"
          className={styles.backButton}
          onClick={onBack}
          disabled={isLoading}
        >
          ← Back to timeslot
        </button>
      </form>
    </div>
  );
};
