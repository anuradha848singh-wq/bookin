import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }) => {
  try {
    const locations = await tenantDb.location.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'asc' },
      select: {
        id: true,
        name: true,
        address_line1: true,
        address_line2: true,
        city: true,
        state: true,
        postal_code: true,
        country: true,
        lat: true,
        lng: true,
        phone: true,
        email: true,
        timezone: true,
        is_primary: true,
        is_active: true,
        created_at: true,
        updated_at: true
      }
    });

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
    const newLocation = await tenantDb.$transaction(async (tx: any) => {
      // If this is set as primary, unset other primaries safely in the transaction
      if (is_primary) {
        await tx.location.updateMany({
          where: { is_primary: true },
          data: { is_primary: false }
        });
      }

      return await tx.location.create({
        data: {
          name,
          address_line1: address_line1 || null,
          city: city || null,
          state: state || null,
          postal_code: postal_code || null,
          phone: phone || null,
          email: email || null,
          timezone,
          is_primary: is_primary || false
        }
      });
    });

    return NextResponse.json({ success: true, location: newLocation });
  } catch (error: any) {
    console.error("[POST_LOCATION_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create location" }, { status: 500 });
  }
}, ["OWNER", "ADMIN"]);
