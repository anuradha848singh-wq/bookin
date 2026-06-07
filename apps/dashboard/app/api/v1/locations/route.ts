import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }) => {
  try {
    const locations = await tenantDb.$queryRaw`
      SELECT * FROM locations WHERE deleted_at IS NULL ORDER BY created_at ASC;
    `;

    return NextResponse.json({ success: true, locations });
  } catch (error: any) {
    console.error("[GET_LOCATIONS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch locations" }, { status: 500 });
  }
});

export const POST = withTenantAuth(async (request, { tenantDb }) => {
  const body = await request.json();
  const { name, address_line1, city, state, postal_code, phone, email, timezone, is_primary } = body;

  if (!name || !timezone) {
    return NextResponse.json({ error: "Name and timezone are required" }, { status: 400 });
  }

  try {
    // If this is set as primary, unset other primaries
    if (is_primary) {
      await tenantDb.$executeRaw`UPDATE locations SET is_primary = false;`;
    }

    const newLocation = await tenantDb.$queryRaw`
      INSERT INTO locations (name, address_line1, city, state, postal_code, phone, email, timezone, is_primary)
      VALUES (${name}, ${address_line1 || null}, ${city || null}, ${state || null}, ${postal_code || null}, ${phone || null}, ${email || null}, ${timezone}, ${is_primary || false})
      RETURNING *;
    `;

    return NextResponse.json({ success: true, location: (newLocation as any)[0] });
  } catch (error: any) {
    console.error("[POST_LOCATION_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create location" }, { status: 500 });
  }
}, ["OWNER", "ADMIN"]);
