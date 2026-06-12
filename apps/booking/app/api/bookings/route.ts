import { NextRequest, NextResponse } from "next/server";
import { getDashboardUrl } from "@book-in/lib/env";
import { headers } from "next/headers";
import { getTenantClient, getPublicClient } from "@book-in/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/bookings
 * Public booking submission endpoint for the booking portal.
 * Creates or finds the guest client, then creates the booking with full conflict detection.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clinicSlug,
      serviceId,
      staffId,         // optional — if null, auto-assigns available staff
      date,            // YYYY-MM-DD
      time,            // HH:mm
      customer: {
        firstName,
        lastName,
        email,
        phone = "",
      },
      notes = "",
    } = body;

    // Validate required fields
    if (!clinicSlug || !serviceId || !date || !time || !firstName || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: clinicSlug, serviceId, date, time, customer.firstName, customer.email" },
        { status: 400 }
      );
    }

    // Resolve tenant
    const publicDb = getPublicClient();
    const clinic = await publicDb.tenant.findUnique({ where: { slug: clinicSlug } });
    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    // 1. Fetch service details
    const service = await tenantDb.service.findFirst({
      where: { id: serviceId, is_public: true, deleted_at: null },
      select: { id: true, name: true, duration_minutes: true, buffer_before_minutes: true, buffer_after_minutes: true, price: true, requires_deposit: true, deposit_amount: true }
    });

    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found or not available" }, { status: 404 });
    }
    const duration = parseInt(service.duration_minutes) || 30;
    const bufBefore = parseInt(service.buffer_before_minutes) || 0;
    const bufAfter = parseInt(service.buffer_after_minutes) || 0;

    // 2. Compute start/end timestamps in UTC
    const startsAt = new Date(`${date}T${time}:00Z`);
    const endsAt = new Date(startsAt.getTime() + duration * 60 * 1000);

    // 3. Determine assigned staff (use provided staffId or auto-assign)
    let assignedStaffId = staffId;

    if (!assignedStaffId) {
      // Find the first available staff member for this service at this time
      const checkStart = new Date(startsAt.getTime() - bufBefore * 60 * 1000);
      const checkEnd = new Date(endsAt.getTime() + bufAfter * 60 * 1000);

      const { Prisma } = await import('@prisma/client');
      const availableStaff = (await tenantDb.$queryRaw(Prisma.sql`
        SELECT s.id
        FROM staff s
        INNER JOIN staff_services ss ON ss.staff_id = s.id
        WHERE ss.service_id = ${serviceId}::uuid
          AND s.is_accepting_bookings = true
          AND s.deleted_at IS NULL
          AND s.id NOT IN (
            SELECT b.staff_id FROM bookings b
            WHERE b.staff_id IS NOT NULL
              AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
              AND (b.starts_at - (b.buffer_before || ' minutes')::interval) < ${checkEnd.toISOString()}::timestamptz
              AND (b.ends_at + (b.buffer_after || ' minutes')::interval) > ${checkStart.toISOString()}::timestamptz
          )
        ORDER BY RANDOM()
        LIMIT 1;
      `)) as any[];

      if (availableStaff.length > 0) {
        assignedStaffId = availableStaff[0].id;
      }
    } else {
      // 4. Conflict check for specific staff
      const checkStart = new Date(startsAt.getTime() - bufBefore * 60 * 1000);
      const checkEnd = new Date(endsAt.getTime() + bufAfter * 60 * 1000);

      const { Prisma } = await import('@prisma/client');
      const conflicts = (await tenantDb.$queryRaw(Prisma.sql`
        SELECT id FROM bookings
        WHERE staff_id = ${assignedStaffId}::uuid
          AND status NOT IN ('CANCELLED', 'NO_SHOW')
          AND (starts_at - (buffer_before || ' minutes')::interval) < ${checkEnd.toISOString()}::timestamptz
          AND (ends_at + (buffer_after || ' minutes')::interval) > ${checkStart.toISOString()}::timestamptz
        LIMIT 1;
      `)) as any[];

      if (conflicts.length > 0) {
        return NextResponse.json(
          { success: false, error: "This time slot has just been booked. Please select another time." },
          { status: 409 }
        );
      }
    }

    // 5. Find or create the client record
    let clientId: string;
    const existingClient = await tenantDb.client.findFirst({
      where: { email: email.toLowerCase().trim(), deleted_at: null },
      select: { id: true, first_name: true, last_name: true, phone: true }
    });

    if (existingClient) {
      clientId = existingClient.id;
      // Update contact info & visit metrics
      await tenantDb.client.update({
        where: { id: clientId },
        data: {
          first_name: firstName || existingClient.first_name,
          last_name: lastName || existingClient.last_name,
          phone: phone || existingClient.phone,
          visit_count: { increment: 1 },
          lifetime_value: { increment: service.price || 0 },
          last_visit_at: new Date()
        }
      });
    } else {
      // Create new client
      const newClient = await tenantDb.client.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase().trim(),
          phone,
          source: 'BOOKING_PORTAL',
          visit_count: 1,
          lifetime_value: service.price || 0,
          last_visit_at: new Date()
        },
        select: { id: true }
      });

      clientId = newClient.id;
    }

    // 6. Generate booking reference number
    const year = new Date().getFullYear();
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    const referenceNumber = `BK-${year}-${randomPart}`;

    // 7. Create the booking atomically
    const checkStartForInsert = new Date(startsAt.getTime() - bufBefore * 60 * 1000);
    const checkEndForInsert = new Date(endsAt.getTime() + bufAfter * 60 * 1000);

    const { Prisma } = await import('@prisma/client');
    const newBooking = (await tenantDb.$queryRaw(Prisma.sql`
      WITH overlapping AS (
        SELECT 1 FROM bookings
        WHERE staff_id = ${assignedStaffId ? assignedStaffId : null}::uuid
          AND status NOT IN ('CANCELLED', 'NO_SHOW')
          AND (starts_at - (COALESCE(buffer_before, 0) || ' minutes')::interval) < ${checkEndForInsert.toISOString()}::timestamptz
          AND (ends_at + (COALESCE(buffer_after, 0) || ' minutes')::interval) > ${checkStartForInsert.toISOString()}::timestamptz
      )
      INSERT INTO bookings (
        reference_number, client_id, service_id, staff_id,
        starts_at, ends_at, duration_minutes, buffer_before, buffer_after,
        price, status, payment_status, notes, source, created_by
      ) 
      SELECT 
        ${referenceNumber}, ${clientId}::uuid, ${serviceId}::uuid, ${assignedStaffId ? assignedStaffId : null}::uuid,
        ${startsAt.toISOString()}::timestamptz, ${endsAt.toISOString()}::timestamptz, ${duration}, ${bufBefore}, ${bufAfter},
        ${service.price || 0}, 'PENDING', 'UNPAID', ${notes}, 'BOOKING_PORTAL', 'CLIENT'
      WHERE NOT EXISTS (SELECT 1 FROM overlapping)
      RETURNING *;
    `)) as any[];

    if (newBooking.length === 0) {
      return NextResponse.json(
        { success: false, error: "This time slot has just been booked. Please select another time." },
        { status: 409 }
      );
    }

    const booking = newBooking[0];

    // 8. Log client activity
    await tenantDb.clientActivity.create({
      data: {
        client_id: clientId,
        type: 'BOOKING_CREATED',
        title: `Booking for ${service.name}`,
        description: `Booked on ${date} at ${time}. Ref: ${referenceNumber}`,
        link_id: booking.id
      }
    });

    // 9. Fire event bus for automations (booking.created)
    try {
      const baseUrl = getDashboardUrl() || "http://localhost:3002";
      await fetch(`${baseUrl}/api/v1/internal/event-bus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_slug: clinicSlug,
          event: "booking.created",
          payload: {
            booking_id: booking.id,
            reference_number: referenceNumber,
            client_id: clientId,
            client_name: `${firstName} ${lastName}`,
            client_email: email,
            service_id: serviceId,
            service_name: service.name,
            starts_at: startsAt.toISOString(),
            date,
            time,
          },
        }),
      });
    } catch (eventError) {
      // Non-critical: don't fail the booking if automation dispatch fails
      console.warn("[BOOKING_API] Event bus dispatch failed (non-critical):", eventError);
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        reference_number: referenceNumber,
        service_name: service.name,
        date,
        time,
        client_name: `${firstName} ${lastName}`,
        client_email: email,
        status: "PENDING",
      },
      message: "Booking confirmed successfully!",
    });

  } catch (error: any) {
    console.error("[POST_BOOKING_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create booking. Please try again." }, { status: 500 });
  }
}
