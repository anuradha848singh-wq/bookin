import { NextRequest, NextResponse } from 'next/server';
import { getPublicClient, getTenantClient } from '@book-in/db';
import { findClinicBySlug } from "@/lib/clinic";
import {  } from "@/lib/clinic";
import { getCachedClinicConfig, cacheClinicConfig } from '@book-in/lib';

// GET /api/clinic/[slug] - Get clinic config
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Try cache first
    let clinic = await getCachedClinicConfig(slug);

    if (!clinic) {
      const publicDb = getPublicClient();
      const clinicData = await publicDb.tenant.findUnique({
        where: { slug },
      });

      if (!clinicData) {
        return NextResponse.json(
          { success: false, error: 'Clinic not found' },
          { status: 404 }
        );
      }

      clinic = clinicData;
      await cacheClinicConfig(slug, clinic);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: clinic.id,
        name: clinic.name,
        slug: clinic.slug,
        tenant_schema: clinic.tenant_schema,
        template_id: (clinic.theme as any)?.template || 'minimal',
        theme: clinic.theme || null,
        logo_url: (clinic.theme as any)?.logo_url || null,
        tagline: (clinic.theme as any)?.tagline || null,
        whatsapp_number: (clinic.theme as any)?.whatsapp_number || null,
        show_powered_by: (clinic.theme as any)?.show_powered_by !== undefined ? (clinic.theme as any).show_powered_by : true,
      },
    });
  } catch (error) {
    console.error('Error fetching clinic:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
