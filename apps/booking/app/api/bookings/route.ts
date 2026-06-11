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
    const services = (await tenantDb.$queryRawUnsafe(`
      SELECT id, name, duration_minutes, buffer_before_minutes, buffer_after_minutes, price, requires_deposit, deposit_amount
      FROM services
      WHERE id = $1::uuid AND is_public = true AND deleted_at IS NULL
      LIMIT 1;
    `, serviceId)) as any[];

    if (!services.length) {
      return NextResponse.json({ success: false, error: "Service not found or not available" }, { status: 404 });
    }

    const service = services[0];
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

      const availableStaff = (await tenantDb.$queryRawUnsafe(`
        SELECT s.id
        FROM staff s
        INNER JOIN staff_services ss ON ss.staff_id = s.id
        WHERE ss.service_id = $1::uuid
          AND s.is_accepting_bookings = true
          AND s.deleted_at IS NULL
          AND s.id NOT IN (
            SELECT b.staff_id FROM bookings b
            WHERE b.staff_id IS NOT NULL
              AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
              AND (b.starts_at - (b.buffer_before || ' minutes')::interval) < $3::timestamptz
              AND (b.ends_at + (b.buffer_after || ' minutes')::interval) > $2::timestamptz
          )
        ORDER BY RANDOM()
        LIMIT 1;
      `, serviceId, checkStart.toISOString(), checkEnd.toISOString())) as any[];

      if (availableStaff.length > 0) {
        assignedStaffId = availableStaff[0].id;
      }
    } else {
      // 4. Conflict check for specific staff
      const checkStart = new Date(startsAt.getTime() - bufBefore * 60 * 1000);
      const checkEnd = new Date(endsAt.getTime() + bufAfter * 60 * 1000);

      const conflicts = (await tenantDb.$queryRawUnsafe(`
        SELECT id FROM bookings
        WHERE staff_id = $1::uuid
          AND status NOT IN ('CANCELLED', 'NO_SHOW')
          AND (starts_at - (buffer_before || ' minutes')::interval) < $3::timestamptz
          AND (ends_at + (buffer_after || ' minutes')::interval) > $2::timestamptz
        LIMIT 1;
      `, assignedStaffId, checkStart.toISOString(), checkEnd.toISOString())) as any[];

      if (conflicts.length > 0) {
        return NextResponse.json(
          { success: false, error: "This time slot has just been booked. Please select another time." },
          { status: 409 }
        );
      }
    }

    // 5. Find or create the client record
    let clientId: string;
    const existingClients = (await tenantDb.$queryRawUnsafe(`
      SELECT id FROM clients
      WHERE email = $1 AND deleted_at IS NULL
      LIMIT 1;
    `, email.toLowerCase().trim())) as any[];

    if (existingClients.length > 0) {
      clientId = existingClients[0].id;
      // Update contact info & visit metrics
      await tenantDb.$executeRawUnsafe(`
        UPDATE clients
        SET first_name = COALESCE(NULLIF($2, ''), first_name),
            last_name = COALESCE(NULLIF($3, ''), last_name),
            phone = COALESCE(NULLIF($4, ''), phone),
            visit_count = visit_count + 1,
            lifetime_value = lifetime_value + $5,
            last_visit_at = NOW(),
            updated_at = NOW()
        WHERE id = $1::uuid;
      `, clientId, firstName, lastName, phone, service.price || 0);
    } else {
      // Create new client
      const newClients = (await tenantDb.$queryRawUnsafe(`
        INSERT INTO clients (first_name, last_name, email, phone, source, visit_count, lifetime_value, last_visit_at)
        VALUES ($1, $2, $3, $4, 'BOOKING_PORTAL', 1, $5, NOW())
        RETURNING id;
      `, firstName, lastName, email.toLowerCase().trim(), phone, service.price || 0)) as any[];

      clientId = newClients[0].id;
    }

    // 6. Generate booking reference number
    const year = new Date().getFullYear();
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    const referenceNumber = `BK-${year}-${randomPart}`;

    // 7. Create the booking atomically
    const checkStartForInsert = new Date(startsAt.getTime() - bufBefore * 60 * 1000);
    const checkEndForInsert = new Date(endsAt.getTime() + bufAfter * 60 * 1000);

    const newBooking = (await tenantDb.$queryRawUnsafe(`
      WITH overlapping AS (
        SELECT 1 FROM bookings
        WHERE staff_id = $4::uuid
          AND status NOT IN ('CANCELLED', 'NO_SHOW')
          AND (starts_at - (COALESCE(buffer_before, 0) || ' minutes')::interval) < $13::timestamptz
          AND (ends_at + (COALESCE(buffer_after, 0) || ' minutes')::interval) > $12::timestamptz
      )
      INSERT INTO bookings (
        reference_number, client_id, service_id, staff_id,
        starts_at, ends_at, duration_minutes, buffer_before, buffer_after,
        price, status, payment_status, notes, source, created_by
      ) 
      SELECT 
        $1, $2::uuid, $3::uuid, $4::uuid,
        $5::timestamptz, $6::timestamptz, $7, $8, $9,
        $10, 'PENDING', 'UNPAID', $11, 'BOOKING_PORTAL', 'CLIENT'
      WHERE NOT EXISTS (SELECT 1 FROM overlapping)
      RETURNING *;
    `,
      referenceNumber,
      clientId,
      serviceId,
      assignedStaffId || null,
      startsAt.toISOString(),
      endsAt.toISOString(),
      duration,
      bufBefore,
      bufAfter,
      service.price || 0,
      notes,
      checkStartForInsert.toISOString(),
      checkEndForInsert.toISOString()
    )) as any[];

    if (newBooking.length === 0) {
      return NextResponse.json(
        { success: false, error: "This time slot has just been booked. Please select another time." },
        { status: 409 }
      );
    }

    const booking = newBooking[0];

    // 8. Log client activity
    await tenantDb.$executeRawUnsafe(`
      INSERT INTO client_activities (client_id, type, title, description, link_id)
      VALUES ($1::uuid, 'BOOKING_CREATED', $2, $3, $4::uuid);
    `,
      clientId,
      `Booking for ${service.name}`,
      `Booked on ${date} at ${time}. Ref: ${referenceNumber}`,
      booking.id
    );

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
