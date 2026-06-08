import React from 'react';
import type { ConfirmedBooking, Clinic } from '../../types/booking';
import { Button, Card, Badge } from '@book-in/ui';
import styles from './BookingConfirmed.module.css';

export interface BookingConfirmedProps {
  booking: ConfirmedBooking;
  clinic: Clinic;
}

export const BookingConfirmed: React.FC<BookingConfirmedProps> = ({
  booking,
  clinic,
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const { date, time } = (booking as any).slot
    ? formatDateTime((booking as any).slot.starts_at)
    : { date: 'N/A', time: 'N/A' };

  const handleWhatsApp = () => {
    if (clinic.whatsapp_number) {
      const message = encodeURIComponent(
        `Hi, I just booked an appointment at ${clinic.name}. Booking ID: ${booking.id}`
      );
      window.open(
        `https://wa.me/${clinic.whatsapp_number}?text=${message}`,
        '_blank'
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.successIcon}>
        <svg viewBox="0 0 24 24" fill="none" className={styles.checkmark}>
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M8 12l2.5 2.5L16 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className={styles.title}>Booking Confirmed!</h2>
      <p className={styles.subtitle}>
        Your appointment has been successfully scheduled
      </p>

      <Badge variant="success" size="lg">
        ✓ Confirmed
      </Badge>

      <Card className={styles.detailsCard} padding="lg" elevated>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            <span aria-hidden="true">🏥</span>
            <span>Clinic</span>
          </span>
          <span className={styles.detailValue}>{clinic.name}</span>
        </div>

        {booking.service && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>
              <span aria-hidden="true">💼</span>
              <span>Service</span>
            </span>
            <span className={styles.detailValue}>{booking.service.name}</span>
          </div>
        )}

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            <span aria-hidden="true">📅</span>
            <span>Date</span>
          </span>
          <span className={styles.detailValue}>{date}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            <span aria-hidden="true">⏰</span>
            <span>Time</span>
          </span>
          <span className={styles.detailValue}>{time}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            <span aria-hidden="true">📱</span>
            <span>Phone</span>
          </span>
          <span className={styles.detailValue}>{booking.patient_phone}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            <span aria-hidden="true">🔖</span>
            <span>Booking ID</span>
          </span>
          <span className={styles.detailValue}>{booking.id.slice(0, 8)}</span>
        </div>
      </Card>

      <Card className={styles.infoBox} padding="md">
        <p className={styles.infoText}>
          📲 You will receive an SMS confirmation shortly with your appointment details.
        </p>
      </Card>

      {clinic.whatsapp_number && (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleWhatsApp}
          leftIcon={<span>💬</span>}
        >
          Contact on WhatsApp
        </Button>
      )}
    </div>
  );
};
