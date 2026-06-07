import { PrismaClient } from "@prisma/client";
import { addMinutes, subMinutes } from "date-fns";

export class BookingService {
  constructor(private tenantDb: PrismaClient) {}

  async getBookings(params: { page: number; limit: number; status?: string; staffId?: string }) {
    const { page, limit, status, staffId } = params;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (status) {
      whereClause += ` AND b.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (staffId) {
      whereClause += ` AND b.staff_id = $${paramIndex}::uuid`;
      queryParams.push(staffId);
      paramIndex++;
    }

    const bookings = await this.tenantDb.$queryRawUnsafe(
      `
      SELECT b.*, 
             c.first_name as client_first_name, c.last_name as client_last_name,
             s.name as service_name, s.price as service_price,
             st.first_name as staff_first_name, st.last_name as staff_last_name
      FROM bookings b
      LEFT JOIN clients c ON b.client_id = c.id
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN staff st ON b.staff_id = st.id
      ${whereClause}
      ORDER BY b.starts_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
      `,
      ...queryParams,
      limit,
      offset
    );

    const countResult = (await this.tenantDb.$queryRawUnsafe(
      `SELECT COUNT(*) as total FROM bookings b ${whereClause};`,
      ...queryParams
    )) as any[];

    const total = Number(countResult[0]?.total || 0);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createBooking(data: {
    client_id: string;
    service_id: string;
    staff_id: string;
    location_id?: string;
    starts_at: string;
    internal_notes?: string;
  }) {
    const { client_id, service_id, staff_id, location_id, starts_at, internal_notes } = data;

    const services = (await this.tenantDb.$queryRawUnsafe(
      `SELECT duration_minutes, buffer_before_minutes, buffer_after_minutes, price FROM services WHERE id = $1::uuid LIMIT 1;`,
      service_id
    )) as any[];

    if (services.length === 0) throw new Error("Service not found");
    const service = services[0];

    const startDateTime = new Date(starts_at);
    const endDateTime = addMinutes(startDateTime, service.duration_minutes);

    const checkStart = subMinutes(startDateTime, service.buffer_before_minutes || 0);
    const checkEnd = addMinutes(endDateTime, service.buffer_after_minutes || 0);

    const year = new Date().getFullYear();
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    const referenceNumber = `BK-${year}-${randomPart}`;

    const newBooking: any[] = await this.tenantDb.$queryRawUnsafe(
      `
      WITH overlapping AS (
        SELECT 1 FROM bookings 
        WHERE staff_id = $3::uuid 
        AND status NOT IN ('CANCELLED', 'NO_SHOW')
        AND (
          (starts_at - (COALESCE(buffer_before, 0) || ' minutes')::interval) < $12::timestamp 
          AND 
          (ends_at + (COALESCE(buffer_after, 0) || ' minutes')::interval) > $11::timestamp
        )
      )
      INSERT INTO bookings (
        reference_number, client_id, service_id, staff_id, location_id, 
        starts_at, ends_at, duration_minutes, buffer_before, buffer_after,
        status, payment_status, price, total_paid, internal_notes, created_by, source
      )
      SELECT 
        $13, $1, $2, $3, $4, 
        $5::timestamp, $6::timestamp, $14, $7, $8, 
        'PENDING', 'UNPAID', $9, 0, $10, 'STAFF', 'DASHBOARD'
      WHERE NOT EXISTS (SELECT 1 FROM overlapping)
      RETURNING *;
      `,
      client_id,
      service_id,
      staff_id,
      location_id || null,
      startDateTime.toISOString(),
      endDateTime.toISOString(),
      service.buffer_before_minutes || 0,
      service.buffer_after_minutes || 0,
      service.price || 0,
      internal_notes || null,
      checkStart.toISOString(),
      checkEnd.toISOString(),
      referenceNumber,
      service.duration_minutes
    );

    if (newBooking.length === 0) {
      throw new Error("This time slot has just been booked by someone else.");
    }

    await this.tenantDb.$executeRawUnsafe(
      `
      UPDATE clients 
      SET visit_count = visit_count + 1,
          lifetime_value = lifetime_value + $2
      WHERE id = $1::uuid;
      `,
      client_id,
      service.price
    );

    return newBooking[0];
  }

  async cancelBooking(bookingId: string, reason?: string) {
    // 1. Mark as cancelled
    // 2. Free up the slot
    // 3. Return booking
    const result = await this.tenantDb.$executeRawUnsafe(
      `
      UPDATE bookings 
      SET status = 'CANCELLED', cancel_reason = $2, cancelled_at = NOW()
      WHERE id = $1::uuid;
      `,
      bookingId,
      reason || null
    );

    if (result === 0) throw new Error("Booking not found");
    return { success: true };
  }
}
