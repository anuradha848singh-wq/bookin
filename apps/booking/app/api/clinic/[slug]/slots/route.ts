import { NextRequest, NextResponse } from 'next/server';
import { getPublicClient, getTenantClient, generateSlots } from '@book-in/db';
import { checkIpRateLimit, getRedisClient } from '@book-in/lib';

// GET /api/clinic/[slug]/slots?serviceId=xxx - Get available slots for next 7 days
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Apply IP rate limit check (60 req/min)
    const rateLimit = await checkIpRateLimit(ip, 'slots_get', 60, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: 'Service ID is required' },
        { status: 400 }
      );
    }

    const dateParam = searchParams.get('date');
    const startDate = dateParam ? new Date(dateParam) : new Date();
    startDate.setHours(0, 0, 0, 0);

    // Check Redis Cache first
    const cacheKey = `slots:availability:${slug}:${serviceId}:${startDate.toISOString().split('T')[0]}`;
    const redis = getRedisClient();
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return NextResponse.json({
          success: true,
          data: JSON.parse(cachedData),
          cached: true
        });
      }
    } catch (cacheErr) {
      console.warn('[Redis] Available slots cache read failed:', cacheErr);
    }

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

    // Get service from tenant schema
    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;
    const service = await tenantDb.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    // Generate slots for next 7 days from requested date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    // Get or generate slots
    const slots = await generateSlots({
      serviceId: service.id,
      startDate: startDate,
      endDate: endDate,
      tenantDb,
    });

    // Group slots by date
    const slotsByDate: Record<string, any[]> = {};
    
    slots.forEach((slot: any) => {
      const dateKey = new Date(slot.starts_at).toISOString().split('T')[0];
      if (!slotsByDate[dateKey]) {
        slotsByDate[dateKey] = [];
      }
      slotsByDate[dateKey].push(slot);
    });

    // Write results to Redis Cache (10-second TTL)
    try {
      await redis.set(cacheKey, JSON.stringify(slotsByDate), 'EX', 10);
    } catch (cacheErr) {
      console.warn('[Redis] Available slots cache write failed:', cacheErr);
    }

    return NextResponse.json({
      success: true,
      data: slotsByDate,
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
