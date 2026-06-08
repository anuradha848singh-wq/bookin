import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPublicClient, getTenantClient } from '@book-in/db';
import { findClinicBySlug } from "@/lib/clinic";
import {  } from "@/lib/clinic";
import { getCachedClinicConfig } from '@book-in/lib';
import { BookingPageClient } from './BookingPageClient';
import { JsonCompiler } from '../../components/engine/JsonCompiler';
import type { Clinic, Service } from '../../types/booking';
import lz from 'lz-string';

// Force Node.js runtime to ensure isomorphic server-side decompression works perfectly (Deviation 8)
export const runtime = 'nodejs';

// Revalidate public pages every hour
export const revalidate = 3600;

// Extract subdomain from headers
function getClinicSlug(host: string | null): string | null {
  if (!host) return null;
  
  const hostWithoutPort = host.split(':')[0] || '';
  const parts = hostWithoutPort.split('.');
  
  // Handle localhost: clinic.localhost
  if (hostWithoutPort.endsWith('localhost') || hostWithoutPort.endsWith('127.0.0.1')) {
    if (parts.length > 1) {
      return parts[0] || null;
    }
    return null;
  }
  
  // Handle production: clinic.bookin.com
  if (parts.length > 2) {
    return parts[0] || null;
  }
  
  return null;
}

async function getClinicData(slug: string) {
  try {
    // Try cache first
    const cached = await getCachedClinicConfig(slug);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const publicDb = getPublicClient();
    const clinic = await publicDb.tenant.findUnique({
      where: { slug },
    });

    if (!clinic) {
      return null;
    }

    // Get services from tenant schema
    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;
    const services = await tenantDb.service.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'asc' },
    });

    // Get staff from tenant schema
    const staff = await tenantDb.staff.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'asc' },
    });

    // Check for custom home page layout and SEO
    let customLayout = null;
    let seoMeta = null;
    try {
      const page = await tenantDb.page.findUnique({
        where: { slug: 'home' },
      });
      const contentObj = page?.content as { layout?: string } | null;
      customLayout = contentObj?.layout || null;
      seoMeta = page?.seo_meta || null;
    } catch (e) {
      console.warn("Could not load custom page layout (table may not exist yet):", e);
    }

    return {
      clinic,
      services,
      staff,
      customLayout,
      seoMeta,
    };
  } catch (error) {
    console.error('Error fetching clinic data:', error);
    return null;
  }
}

export default async function ClinicBookingPage({
  params,
}: {
  params: Promise<{ clinic: string }>;
}) {
  // In Next.js 13+ with subdomain routing, we need to get the host from headers
  // For now, use the params as fallback
  const clinicSlug = (await params).clinic;

  const data = await getClinicData(clinicSlug);

  if (!data) {
    notFound();
  }

  const { clinic, services, staff, customLayout } = data;

  const bookingWidget = (
    <BookingPageClient
      clinic={clinic as unknown as Clinic}
      services={services as unknown as Service[]}
    />
  );

  // Decompress layout strictly on the server (Deviation 8 MUST FIX)
  let layoutTree = null;
  if (customLayout) {
    try {
      const decompressed = lz.decompressFromEncodedURIComponent(customLayout);
      if (decompressed) {
        layoutTree = JSON.parse(decompressed);
      }
    } catch (e) {
      console.error("[ClinicPage Server] Failed to decompress layout tree:", e);
    }
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      {layoutTree ? (
        <JsonCompiler tree={layoutTree} bookingWidget={bookingWidget} tenantData={{ services, staff }} />
      ) : (
        bookingWidget
      )}
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>Loading booking page...</p>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}} />
    </div>
  );
}

// Generate Static Params for SSG
export async function generateStaticParams() {
  try {
    const publicDb = getPublicClient();
    const tenants = await publicDb.tenant.findMany({
      select: { slug: true },
    });
    return tenants.map((tenant: any) => ({
      clinic: tenant.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ clinic: string }>;
}) {
  const data = await getClinicData((await params).clinic);

  if (!data) {
    return {
      title: 'Clinic Not Found',
    };
  }

  const seoTitle = (data.seoMeta as any)?.title;
  const seoDesc = (data.seoMeta as any)?.description;
  const seoKeywords = (data.seoMeta as any)?.keywords;

  return {
    title: seoTitle || `Book Appointment — ${data.clinic.name}`,
    description: seoDesc || data.clinic.tagline || `Book your appointment at ${data.clinic.name}`,
    keywords: seoKeywords || undefined,
  };
}
