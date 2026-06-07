/**
 * Modern Template
 * 
 * Bold, vibrant, and contemporary design with smooth animations.
 * Perfect for salons, spas, and lifestyle services.
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
import styles from './modern.module.css';

export interface ModernTemplateProps {
  clinic: Clinic;
  services: Service[];
  bookingFlow: UseBookingFlowReturn;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({
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
        '--primary': clinic.theme.primary_color || '#EC4899',
        '--primary-light': clinic.theme.primary_color
          ? `${clinic.theme.primary_color}20`
          : '#FCE7F3',
        '--primary-dark': clinic.theme.accent_color || '#DB2777',
        '--accent': clinic.theme.accent_color || '#F59E0B',
      }
    : {};

  const confirmedBooking: ConfirmedBooking | null =
    currentStep === 5 && bookingId && selectedSlot
      ? {
          id: bookingId,
          slot_id: selectedSlot.id,
          patient_phone: patientPhone,
          patient_name: patientName,
          status: 'confirmed',
          created_at: new Date().toISOString(),
          slot: selectedSlot,
          service: selectedService || undefined,
        }
      : null;

  return (
    <div className={styles.template} style={themeStyles as React.CSSProperties}>
      {/* Decorative Background */}
      <div className={styles.backgroundDecor}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.blob3}></div>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {clinic.logo_url && (
            <div className={styles.logoWrapper}>
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
          <h1 className={styles.clinicName}>{clinic.name}</h1>
          {clinic.tagline && <p className={styles.tagline}>{clinic.tagline}</p>}
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.cardWrapper}>
          <Card className={styles.card} padding="lg" elevated>
            {currentStep < 5 && (
              <div className={styles.progressSection}>
                <StepIndicator currentStep={currentStep} />
              </div>
            )}

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

          {/* Floating Info Card */}
          {currentStep < 5 && (
            <Card className={styles.floatingInfo} padding="md" elevated>
              <div className={styles.infoIcon}>✨</div>
              <h3 className={styles.infoTitle}>Quick & Easy</h3>
              <p className={styles.infoText}>
                Book your appointment in less than 2 minutes
              </p>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      {clinic.show_powered_by !== false && (
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.poweredBy}>
              Powered by <span className={styles.brandName}>BookIn</span>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};
