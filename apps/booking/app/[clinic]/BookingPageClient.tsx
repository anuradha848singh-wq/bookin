'use client';

import React, { lazy, Suspense } from 'react';
import type { Clinic, Service } from '../../types/booking';
import { LiveBookingWidget } from '../../components/blocks/LiveBookingWidget';
import { Spinner } from '@book-in/ui';

interface BookingPageClientProps {
  clinic: Clinic;
  services: Service[];
}

export function BookingPageClient({ clinic, services }: BookingPageClientProps) {
  return (
    <LiveBookingWidget 
      clinicSlug={clinic.slug} 
      initialServices={services as any[]}
      themeColor={(clinic.theme as any)?.primaryColor || '#3b82f6'}
    />
  );
}

function TemplateLoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background)',
      }}
    >
      <Spinner size="lg" />
    </div>
  );
}
