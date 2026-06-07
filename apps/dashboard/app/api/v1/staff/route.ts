import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }) => {
  try {
    const staff = await tenantDb.$queryRaw`
      SELECT * FROM staff WHERE deleted_at IS NULL ORDER BY display_order ASC, first_name ASC;
    `;

    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    console.error("[GET_STAFF_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch staff" }, { status: 500 });
  }
});

export const POST = withTenantAuth(async (request, { tenantDb }) => {
  const body = await request.json();
  const { 
    first_name, last_name, email, phone, title, bio, 
    specializations, color, is_accepting_bookings, 
    show_on_booking_portal, display_order 
  } = body;

  if (!first_name || !last_name) {
    return NextResponse.json({ error: "First name and last name are required" }, { status: 400 });
  }

  try {
    const newStaff = await tenantDb.$queryRaw`
      INSERT INTO staff (
        first_name, last_name, email, phone, title, bio, 
        specializations, color, is_accepting_bookings, 
        show_on_booking_portal, display_order
      ) VALUES (
        ${first_name}, ${last_name}, ${email || null}, ${phone || null}, ${title || null}, ${bio || null},
        ${specializations || []}, ${color || null}, ${is_accepting_bookings !== false},
        ${show_on_booking_portal !== false}, ${display_order || 0}
      ) RETURNING *;
    `;

    return NextResponse.json({ success: true, staff: (newStaff as any)[0] });
  } catch (error: any) {
    console.error("[POST_STAFF_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create staff member" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER"]); // Only management can add staff
