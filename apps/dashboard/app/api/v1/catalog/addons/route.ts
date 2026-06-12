import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }) => {
  const url = new URL(request.url);
  const service_id = url.searchParams.get("service_id");

  const whereClause: any = { is_active: true };
  if (service_id) {
    whereClause.service_id = service_id;
  }

  try {
    const addons = await tenantDb.serviceAddon.findMany({
      where: whereClause,
      orderBy: { display_order: 'asc' }
    });
    return NextResponse.json({ success: true, addons });
  } catch (error: any) {
    console.error("[GET_ADDONS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch addons" }, { status: 500 });
  }
});

export const POST = withTenantAuth(async (request, { tenantDb }) => {
  const body = await request.json();
  const { service_id, name, description, price, duration_extra_minutes, is_required, display_order, is_active } = body;

  if (!service_id || !name) {
    return NextResponse.json({ error: "Service ID and name are required" }, { status: 400 });
  }

  try {
    const newAddon = await tenantDb.serviceAddon.create({
      data: {
        service_id,
        name,
        description: description || null,
        price: price || 0,
        duration_extra_minutes: duration_extra_minutes || 0,
        is_required: is_required || false,
        display_order: display_order || 0,
        is_active: is_active !== false
      }
    });

    return NextResponse.json({ success: true, addon: newAddon });
  } catch (error: any) {
    console.error("[POST_ADDON_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create addon" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER"]);
