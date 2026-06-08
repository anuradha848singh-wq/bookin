/**
 * Salon Template
 * 
 * Elegant, warm, and lifestyle-focused aesthetic.
 * Perfect for salons, spas, wellness retreats, and boutique clinics.
 */

import React from 'react';
import Image from 'next/image';
import type { UseBookingFlowReturn, Clinic, Service, ConfirmedBooking } from '../../types/booking';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { Card } from '@book-in/ui';
import {
  ServiceSelect,
  SlotPicker,
  PatientForm,
  OTPVerify,
  BookingConfirmed,
} from '../../components/steps';
import styles from './salon.module.css';

export interface SalonTemplateProps {
  clinic: Clinic;
  services: Service[];
  bookingFlow: UseBookingFlowReturn;
}

export const SalonTemplate: React.FC<SalonTemplateProps> = ({
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

  // Apply theme CSS variables with premium warm pastel fallbacks
  const themeStyles = clinic.theme
    ? {
        '--primary': clinic.theme.primary_color || '#D946EF',
        '--primary-light': clinic.theme.primary_color
          ? `${clinic.theme.primary_color}15`
          : '#FDF2F8',
        '--primary-dark': clinic.theme.accent_color || '#C084FC',
      }
    : {};

  // Mock confirmed booking for step 5
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
      {/* Dynamic lifestyle decorative header grid */}
      <header className={styles.header}>
        <div className={styles.headerOverlay} />
        <div className={styles.headerContent}>
          {clinic.logo_url ? (
            <Image
              src={clinic.logo_url}
              alt={`${clinic.name} logo`}
              className={styles.logo}
              width={80}
              height={80}
              unoptimized
              priority
            />
          ) : (
            <div className={styles.defaultLogoIcon}>✨</div>
          )}
          <h1 className={styles.clinicName}>{clinic.name}</h1>
          {clinic.tagline && <p className={styles.tagline}>{clinic.tagline}</p>}
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <Card className={styles.card} padding="lg" elevated>
          {/* Step Indicator */}
          {currentStep < 5 && <StepIndicator currentStep={currentStep} />}

          {/* Step Content */}
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
      </main>

      {/* Footer */}
      {clinic.show_powered_by !== false && (
        <footer className={styles.footer}>
          <p className={styles.poweredBy}>
            Powered by <strong>BookIn</strong>
          </p>
        </footer>
      )}
    </div>
  );
};
