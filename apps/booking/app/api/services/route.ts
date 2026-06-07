import { NextRequest, NextResponse } from "next/server";
import { getTenantClient, getPublicClient } from "@book-in/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicSlug = searchParams.get("clinicSlug");

    if (!clinicSlug) {
      return NextResponse.json({ error: "Missing clinicSlug parameter" }, { status: 400 });
    }

    // Resolve tenant schema from public DB
    const publicDb = getPublicClient();
    const clinic = await publicDb.tenant.findUnique({ where: { slug: clinicSlug } });

    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;
    const services = await tenantDb.$queryRawUnsafe(`
      SELECT s.id, s.name, s.duration_minutes, s.price, s.short_description,
             s.requires_deposit, s.deposit_amount, s.color, s.image_url,
             c.name as category_name, c.color as category_color
      FROM services s
      LEFT JOIN service_categories c ON s.category_id = c.id
      WHERE s.is_public = true AND s.deleted_at IS NULL
      ORDER BY c.display_order ASC, s.created_at ASC;
    `);

    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    console.error("[GET_SERVICES_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 });
  }
}
