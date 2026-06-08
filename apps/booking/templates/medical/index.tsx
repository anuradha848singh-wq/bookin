/**
 * Medical Template
 * 
 * Professional healthcare-focused design with trust signals.
 * Ideal for hospitals, clinics, and medical practices.
 */

import React from 'react';
import Image from 'next/image';
import type { UseBookingFlowReturn, Clinic, Service, ConfirmedBooking } from '../../types/booking';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { Card, Badge } from '@book-in/ui';
import {
  ServiceSelect,
  SlotPicker,
  PatientForm,
  OTPVerify,
  BookingConfirmed,
} from '../../components/steps';
import styles from './medical.module.css';

export interface MedicalTemplateProps {
  clinic: Clinic;
  services: Service[];
  bookingFlow: UseBookingFlowReturn;
}

export const MedicalTemplate: React.FC<MedicalTemplateProps> = ({
  clinic,
  services,
  bookingFlow,
}) => {
  const {
    currentStep,
    selectedService,
    selectedSlot,
    selectedDate,
    patientName,
    patientPhone,
    bookingId,
    isLoading,
    error,
    selectService,
    selectDate,
    selectSlot,
    goBack,
    submitPatientInfo,
    verifyOTP,
    retryOTP,
  } = bookingFlow;

  // Apply theme CSS variables
  const themeStyles = clinic.theme
    ? {
        '--primary': clinic.theme.primary_color || '#0EA5E9',
        '--primary-light': clinic.theme.primary_color
          ? `${clinic.theme.primary_color}15`
          : '#E0F2FE',
        '--primary-dark': clinic.theme.accent_color || '#0284C7',
      }
    : {};

  const confirmedBooking: ConfirmedBooking | null =
    currentStep === 5 && bookingId && selectedSlot
      ? {
          id: bookingId,
          slot_id: (selectedSlot as any).id || (selectedSlot as any).virtual_id,
          patient_phone: patientPhone,
          patient_name: patientName,
          status: 'confirmed',
          created_at: new Date().toISOString(),
          slot: selectedSlot,
          service: selectedService || undefined,
        } as any
      : null;

  return (
    <div className={styles.template} style={themeStyles as React.CSSProperties}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.trustBadges}>
          <Badge variant="success" size="sm">🔒 Secure</Badge>
          <Badge variant="primary" size="sm">✓ Verified</Badge>
        </div>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {clinic.logo_url && (
            <div className={styles.logoContainer}>
              <Image
                src={clinic.logo_url}
                alt={`${clinic.name} logo`}
                className={styles.logo}
                width={80}
                height={80}
                unoptimized
                priority
              />
            </div>
          )}
          <div className={styles.headerText}>
            <h1 className={styles.clinicName}>{clinic.name}</h1>
            {clinic.tagline && <p className={styles.tagline}>{clinic.tagline}</p>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <Card className={styles.infoCard} padding="lg">
              <h3 className={styles.infoTitle}>📋 Booking Process</h3>
              <ul className={styles.infoList}>
                <li className={currentStep >= 1 ? styles.completed : ''}>
                  Select Service
                </li>
                <li className={currentStep >= 2 ? styles.completed : ''}>
                  Choose Time Slot
                </li>
                <li className={currentStep >= 3 ? styles.completed : ''}>
                  Enter Details
                </li>
                <li className={currentStep >= 4 ? styles.completed : ''}>
                  Verify & Confirm
                </li>
              </ul>
            </Card>

            <Card className={styles.infoCard} padding="lg">
              <h3 className={styles.infoTitle}>ℹ️ Important</h3>
              <p className={styles.infoText}>
                Please arrive 10 minutes before your scheduled appointment time.
              </p>
            </Card>
          </div>

          <div className={styles.content}>
            <Card className={styles.card} padding="lg" elevated>
              {currentStep < 5 && <StepIndicator currentStep={currentStep} />}

              <div className={styles.stepContent}>
                {currentStep === 1 && (
                  <ServiceSelect
                    services={services}
                    selectedService={selectedService}
                    onSelect={selectService}
                  />
                )}

                {currentStep === 2 && selectedService && (
                  <SlotPicker
                    clinicSlug={clinic.slug}
                    serviceId={selectedService.id}
                    selectedSlot={selectedSlot}
                    selectedDate={selectedDate}
                    isLoading={isLoading}
                    error={error}
                    onSlotSelect={selectSlot}
                    onDateChange={selectDate}
                    onBack={goBack}
                  />
                )}

                {currentStep === 3 && (
                  <PatientForm
                    name={patientName}
                    phone={patientPhone}
                    isLoading={isLoading}
                    error={error}
                    onSubmit={submitPatientInfo}
                    onBack={goBack}
                  />
                )}

                {currentStep === 4 && (
                  <OTPVerify
                    phone={patientPhone}
                    isLoading={isLoading}
                    error={error}
                    onVerify={verifyOTP}
                    onResend={retryOTP}
                    onBack={goBack}
                  />
                )}

                {currentStep === 5 && confirmedBooking && (
                  <BookingConfirmed booking={confirmedBooking} clinic={clinic} />
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      {clinic.show_powered_by !== false && (
        <footer className={styles.footer}>
          <p className={styles.poweredBy}>
            Powered by <strong>BookIn</strong> — Healthcare Appointment System
          </p>
        </footer>
      )}
    </div>
  );
};
