import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { BookingService } from "@/services/booking.service";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);
  const status = url.searchParams.get("status") || undefined;
  const staffId = url.searchParams.get("staff_id") || undefined;
  
  const bookingService = new BookingService(tenantDb);
  const result = await bookingService.getBookings({ page, limit, status, staffId });

  return NextResponse.json({ success: true, ...result });
}, "view");

export const POST = withTenantAuth(async (request, { tenantDb }) => {
  const body = await request.json();
  const { client_id, service_id, staff_id, location_id, starts_at, internal_notes } = body;

  if (!client_id || !service_id || !staff_id || !starts_at) {
    return NextResponse.json({ success: false, error: "Missing required booking fields" }, { status: 400 });
  }

  const bookingService = new BookingService(tenantDb);
  const booking = await bookingService.createBooking({
    client_id, service_id, staff_id, location_id, starts_at, internal_notes
  });

  return NextResponse.json({ success: true, booking }, { status: 201 });
}, "edit_content");
