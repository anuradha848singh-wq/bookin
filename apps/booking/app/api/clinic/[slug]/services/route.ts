import { NextRequest, NextResponse } from 'next/server';
import { getPublicClient, getTenantClient } from '@book-in/db';
import { findClinicBySlug } from "@/lib/clinic";
import {  } from "@/lib/clinic";
import { getRedisClient } from '@book-in/lib';

// GET /api/clinic/[slug]/services - Get all services for a clinic
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Get clinic from public schema
    const publicDb = getPublicClient();
    const clinic = await publicDb.tenant.findUnique({
      where: { slug },
    });

    if (!clinic) {
      return NextResponse.json(
        { success: false, error: 'Clinic not found' },
        { status: 404 }
      );
    }

    // Try Redis cache first
    const cacheKey = `clinic:services:${slug}`;
    const redis = getRedisClient();
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json({
          success: true,
          data: JSON.parse(cached),
        });
      }
    } catch (cacheErr) {
      console.warn('[Redis] Cache read failed in services endpoint:', cacheErr);
    }

    // Get services from tenant schema
    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;
    const services = await tenantDb.service.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'asc' },
    });

    // Cache the services for 5 minutes (300 seconds)
    try {
      await redis.set(cacheKey, JSON.stringify(services), 'EX', 300);
    } catch (cacheErr) {
      console.warn('[Redis] Cache write failed in services endpoint:', cacheErr);
    }

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
