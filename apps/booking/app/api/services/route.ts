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
    const rawServices = await tenantDb.service.findMany({
      where: { is_public: true, deleted_at: null },
      select: {
        id: true, name: true, duration_minutes: true, price: true, short_description: true,
        requires_deposit: true, deposit_amount: true, color: true, image_url: true,
        category: {
          select: { name: true, color: true, display_order: true }
        }
      },
      orderBy: [
        { category: { display_order: 'asc' } },
        { created_at: 'asc' }
      ]
    });

    const services = rawServices.map((s: any) => ({
      ...s,
      category_name: s.category?.name,
      category_color: s.category?.color,
      category: undefined
    }));

    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    console.error("[GET_SERVICES_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 });
  }
}
