import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { generateSlug } from "@book-in/db";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }) => {
  const url = new URL(request.url);
  const category_id = url.searchParams.get("category_id");

  try {
    const whereClause: any = { deleted_at: null };
    if (category_id) {
      whereClause.category_id = category_id;
    }

    const services = await tenantDb.service.findMany({
      where: whereClause,
      include: {
        category: {
          select: { name: true, display_order: true }
        }
      },
      orderBy: [
        { category: { display_order: 'asc' } },
        { name: 'asc' }
      ]
    });

    const mappedServices = services.map((s: any) => ({
      ...s,
      category_name: s.category?.name || null
    }));

    return NextResponse.json({ success: true, services: mappedServices });
  } catch (error: any) {
    console.error("[GET_SERVICES_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 });
  }
});

export const POST = withTenantAuth(async (request, { tenantDb }) => {
  const body = await request.json();
  const { 
    category_id, name, description, short_description, duration_minutes,
    buffer_before_minutes, buffer_after_minutes, price, pricing_type,
    min_price, max_price, currency, max_advance_days, min_advance_hours,
    max_capacity, is_group_session, requires_deposit, deposit_amount, deposit_type,
    is_online, is_public, color, image_url
  } = body;

  if (!name || !duration_minutes) {
    return NextResponse.json({ error: "Name and duration are required" }, { status: 400 });
  }

  const slug = generateSlug(name);

  try {
    const newService = await tenantDb.service.create({
      data: {
        category_id: category_id || null,
        name,
        slug,
        description: description || null,
        short_description: short_description || null,
        duration_minutes: Number(duration_minutes),
        buffer_before_minutes: buffer_before_minutes ? Number(buffer_before_minutes) : 0,
        buffer_after_minutes: buffer_after_minutes ? Number(buffer_after_minutes) : 0,
        price: price ? Number(price) : 0,
        pricing_type: pricing_type || 'FIXED',
        min_price: min_price ? Number(min_price) : null,
        max_price: max_price ? Number(max_price) : null,
        currency: currency || 'USD',
        max_advance_days: max_advance_days ? Number(max_advance_days) : 90,
        min_advance_hours: min_advance_hours ? Number(min_advance_hours) : 1,
        max_capacity: max_capacity ? Number(max_capacity) : 1,
        is_group_session: is_group_session || false,
        requires_deposit: requires_deposit || false,
        deposit_amount: deposit_amount ? Number(deposit_amount) : null,
        deposit_type: deposit_type || 'FIXED',
        is_online: is_online || false,
        is_public: is_public !== false,
        color: color || null,
        image_url: image_url || null
      }
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error: any) {
    console.error("[POST_SERVICE_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create service" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER"]); 
