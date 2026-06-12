import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getPublicClient, getTenantClient } from '@book-in/db';
import { findClinicBySlug } from "@/lib/clinic";
import {
  getStashedOTP,
  clearOTP,
  incrementOtpAttempt,
  releaseSlotLock,
  checkIpRateLimit,
  getRedisClient,
  invalidateSlotsCache,
} from '@book-in/lib';

// Helper to hash OTP
function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex');
}

// POST /api/auth/verify-otp - Verify OTP and create booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp, startsAt, endsAt, staffId, serviceId, clinicSlug, sessionId } = body;

    if (!phone || !otp || !startsAt || !endsAt || !serviceId || !clinicSlug || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // IP Rate Limit check (60 requests per IP per minute as per Phase 2 rules)
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const ipRl = await checkIpRateLimit(ip, "otp-verify", 60, 60);
    if (!ipRl.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again after 1 minute.' },
        { status: 429 }
      );
    }

    // Get clinic
    const publicDb = getPublicClient();
    const clinic = await findClinicBySlug(publicDb, clinicSlug);

    if (!clinic) {
      return NextResponse.json(
        { success: false, error: 'Clinic not found' },
        { status: 404 }
      );
    }

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    // Check OTP attempts (max 3)
    const attempts = await incrementOtpAttempt(phone);
    if (attempts > 3) {
      await clearOTP(phone);
      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Verify OTP
    const savedHash = await getStashedOTP(phone);
    const providedHash = hashOtp(otp);

    if (!savedHash || savedHash !== providedHash) {
      return NextResponse.json(
        { success: false, error: `Incorrect OTP. ${3 - attempts} attempts remaining.` },
        { status: 400 }
      );
    }

    // Verify slot lock session matches
    const lockId = `${staffId || 'no-staff'}:${startsAt}:${endsAt}`;
    const lockKey = `slot:lock:${lockId}`;
    const redis = getRedisClient();
    const activeSessionId = await redis.get(lockKey);
    
    if (!activeSessionId || activeSessionId !== sessionId) {
      return NextResponse.json(
        { success: false, error: 'Your session lock has expired or is invalid. Please try again.' },
        { status: 409 }
      );
    }

    // Clear OTP (single use)
    await clearOTP(phone);

    try {
      // Create or find patient by phone using ORM
      let client = await tenantDb.client.findFirst({
        where: { phone, deleted_at: null },
        select: { id: true }
      });

      let clientId;
      if (client) {
        clientId = client.id;
      } else {
        const newClient = await tenantDb.client.create({
          data: {
            first_name: 'Anonymous',
            last_name: 'Client',
            phone
          },
          select: { id: true }
        });
        clientId = newClient.id;
      }

      // Generate a reference number (e.g. BK-2024-XXXXX)
      const year = new Date().getFullYear();
      const randomPart = Math.floor(10000 + Math.random() * 90000);
      const referenceNumber = `BK-${year}-${randomPart}`;

      // Insert booking and check for overlap in a single statement
      const { Prisma } = await import('@prisma/client');
      const result: any[] = await tenantDb.$queryRaw(Prisma.sql`
        WITH overlapping AS (
          SELECT 1 FROM bookings
          WHERE staff_id = ${staffId ? staffId : null}::uuid
            AND status NOT IN ('CANCELLED', 'NO_SHOW')
            AND starts_at < ${endsAt}::timestamptz
            AND ends_at > ${startsAt}::timestamptz
        )
        INSERT INTO bookings (
          reference_number, client_id, service_id, staff_id,
          starts_at, ends_at, duration_minutes, status, created_by, source
        )
        SELECT ${referenceNumber}, ${clientId}::uuid, ${serviceId}::uuid, ${staffId ? staffId : null}::uuid, ${startsAt}::timestamptz, ${endsAt}::timestamptz,
               EXTRACT(EPOCH FROM (${endsAt}::timestamptz - ${startsAt}::timestamptz)) / 60,
               'CONFIRMED', 'CLIENT', 'BOOKING_PORTAL'
        WHERE NOT EXISTS (SELECT 1 FROM overlapping)
        RETURNING id, reference_number, starts_at, ends_at, status
      `);

      if (result.length === 0) {
        throw new Error('SLOT_TAKEN');
      }

      const booking = result[0];

      // Release Redis lock
      await releaseSlotLock(lockId, sessionId);

      return NextResponse.json({
        success: true,
        booking,
      });
    } catch (txError: any) {
      console.error('Transaction failed inside verify-otp:', txError);
      
      if (txError.message === 'SLOT_TAKEN' || txError.code === '23P01' || txError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'This slot was already booked by another transaction. Please pick another slot.' },
          { status: 409 }
        );
      }
      throw txError;
    }
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
