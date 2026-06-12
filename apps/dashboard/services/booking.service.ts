import { PrismaClient, Prisma } from "@prisma/client";
import { addMinutes, subMinutes } from "date-fns";
import * as crypto from "crypto";

export class BookingService {
  constructor(private tenantDb: PrismaClient) {}

  async getBookings(params: { page: number; limit: number; status?: string; staffId?: string }) {
    const { page, limit, status, staffId } = params;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (staffId) where.staff_id = staffId;

    const [bookingsData, total] = await Promise.all([
      this.tenantDb.booking.findMany({
        where,
        include: {
          client: { select: { first_name: true, last_name: true } },
          service: { select: { name: true, price: true } },
          staff: { select: { first_name: true, last_name: true } },
        },
        orderBy: { starts_at: 'desc' },
        take: Number(limit),
        skip: Number(offset),
      }),
      this.tenantDb.booking.count({ where })
    ]);

    const bookings = bookingsData.map((b: any) => ({
      ...b,
      client_first_name: b.client?.first_name || null,
      client_last_name: b.client?.last_name || null,
      service_name: b.service?.name || null,
      service_price: b.service?.price || null,
      staff_first_name: b.staff?.first_name || null,
      staff_last_name: b.staff?.last_name || null,
    }));

    return {
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
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

    const service = await this.tenantDb.service.findUnique({
      where: { id: service_id },
      select: { duration_minutes: true, buffer_before_minutes: true, buffer_after_minutes: true, price: true }
    });

    if (!service) throw new Error("Service not found");

    const startDateTime = new Date(starts_at);
    const endDateTime = addMinutes(startDateTime, service.duration_minutes);

    const checkStart = subMinutes(startDateTime, service.buffer_before_minutes || 0);
    const checkEnd = addMinutes(endDateTime, service.buffer_after_minutes || 0);

    const year = new Date().getFullYear();
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
    const referenceNumber = `BK-${year}-${randomPart}`;

    const newBooking = await this.tenantDb.$queryRaw<any[]>`
      WITH overlapping AS (
        SELECT 1 FROM bookings 
        WHERE staff_id = ${staff_id}::uuid 
        AND status NOT IN ('CANCELLED', 'NO_SHOW')
        AND (
          (starts_at - (COALESCE(buffer_before, 0) || ' minutes')::interval) < ${checkEnd}::timestamp 
          AND 
          (ends_at + (COALESCE(buffer_after, 0) || ' minutes')::interval) > ${checkStart}::timestamp
        )
      )
      INSERT INTO bookings (
        reference_number, client_id, service_id, staff_id, location_id, 
        starts_at, ends_at, duration_minutes, buffer_before, buffer_after,
        status, payment_status, price, total_paid, internal_notes, created_by, source
      )
      SELECT 
        ${referenceNumber}, ${client_id}::uuid, ${service_id}::uuid, ${staff_id}::uuid, ${location_id ? Prisma.sql`${location_id}::uuid` : null}, 
        ${startDateTime}::timestamp, ${endDateTime}::timestamp, ${service.duration_minutes}, ${service.buffer_before_minutes || 0}, ${service.buffer_after_minutes || 0}, 
        'PENDING', 'UNPAID', ${service.price || 0}, 0, ${internal_notes || null}, 'STAFF', 'DASHBOARD'
      WHERE NOT EXISTS (SELECT 1 FROM overlapping)
      RETURNING *;
    `;

    if (newBooking.length === 0) {
      throw new Error("This time slot has just been booked by someone else.");
    }

    await this.tenantDb.$executeRaw`
      UPDATE clients 
      SET visit_count = visit_count + 1,
          lifetime_value = lifetime_value + ${service.price || 0}
      WHERE id = ${client_id}::uuid;
    `;

    return newBooking[0];
  }

  async cancelBooking(bookingId: string, reason?: string) {
    try {
      await this.tenantDb.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          cancel_reason: reason || null,
          cancelled_at: new Date()
        }
      });
      return { success: true };
    } catch (error) {
      throw new Error("Booking not found");
    }
  }
}
