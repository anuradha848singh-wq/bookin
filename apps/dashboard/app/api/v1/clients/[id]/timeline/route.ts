import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }, params) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  try {
    // 1. Fetch Notes
    const notes = await tenantDb.$queryRaw`
      SELECT n.*, s.first_name as staff_first_name, s.last_name as staff_last_name 
      FROM client_notes n
      LEFT JOIN staff s ON n.staff_id = s.id
      WHERE n.client_id = ${id}::uuid
      ORDER BY n.created_at DESC
      LIMIT 50;
    `;

    // 2. Fetch Activities
    const activities = await tenantDb.$queryRaw`
      SELECT * FROM client_activities
      WHERE client_id = ${id}::uuid
      ORDER BY created_at DESC
      LIMIT 50;
    `;

    // 3. Fetch Bookings (acting as events)
    const bookings = await tenantDb.$queryRaw`
      SELECT b.id, b.status, b.starts_at, b.created_at, b.price, s.name as service_name
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.client_id = ${id}::uuid
      ORDER BY b.created_at DESC
      LIMIT 50;
    `;

    // We send these down directly and let the frontend merge and sort them into a unified timeline
    return NextResponse.json({ 
      success: true, 
      timeline: {
        notes,
        activities,
        bookings
      }
    });
  } catch (error: any) {
    console.error("[GET_CLIENT_TIMELINE_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch timeline" }, { status: 500 });
  }
});
