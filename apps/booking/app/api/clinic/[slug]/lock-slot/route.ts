import { NextRequest, NextResponse } from 'next/server';
import { getPublicClient, getTenantClient } from '@book-in/db';
import { findClinicBySlug } from "@/lib/clinic";
import { acquireSlotLock, releaseSlotLock, invalidateSlotsCache } from '@book-in/lib';

// POST /api/clinic/[slug]/lock-slot - Acquire slot lock
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { slotId, sessionId } = body;

    if (!slotId || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing slotId or sessionId' },
        { status: 400 }
      );
    }

    // Get clinic
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

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    // 1. Decode slot ID
    const decoded = decodeURIComponent(slotId).split('|');
    const [startsAt, endsAt, staffId, serviceId] = decoded;
    const lockId = `${staffId}:${startsAt}:${endsAt}`;

    // 2. DB check before Redis lock to ensure slot is truly available and not booked
    const overlapping: any[] = await tenantDb.$queryRawUnsafe(`
      SELECT 1 FROM bookings
      WHERE staff_id = $3
        AND status NOT IN ('CANCELLED', 'NO_SHOW')
        AND starts_at < $2::timestamptz
        AND ends_at > $1::timestamptz
      LIMIT 1
    `, startsAt, endsAt, staffId === 'no-staff' ? null : staffId);

    if (overlapping.length > 0) {
      return NextResponse.json(
        { success: false, error: 'This slot is no longer available' },
        { status: 409 }
      );
    }

    // 3. NOW attempt Redis lock (5 minute TTL)
    const lockAcquired = await acquireSlotLock(lockId, sessionId, 300);

    if (!lockAcquired) {
      return NextResponse.json(
        { success: false, error: 'This slot is currently being booked by another patient' },
        { status: 409 }
      );
    }

    // 4. Invalidate the slots availability cache
    await invalidateSlotsCache(slug, serviceId || '');

    return NextResponse.json({
      success: true,
      message: 'Slot locked successfully',
    });
  } catch (error) {
    console.error('Error locking slot:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/clinic/[slug]/lock-slot - Release slot lock
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { slotId, sessionId } = body;

    if (!slotId || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing slotId or sessionId' },
        { status: 400 }
      );
    }

    const decoded = decodeURIComponent(slotId).split('|');
    const [startsAt, endsAt, staffId, serviceId] = decoded;
    const lockId = `${staffId}:${startsAt}:${endsAt}`;

    // 1. Release Redis lock
    await releaseSlotLock(lockId, sessionId);

    // 2. Invalidate the slots availability cache
    await invalidateSlotsCache(slug, serviceId || '');

    return NextResponse.json({
      success: true,
      message: 'Slot lock released',
    });
  } catch (error) {
    console.error('Error releasing slot lock:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
