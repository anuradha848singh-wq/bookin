import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { generateSlug } from "@book-in/db";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }) => {
  const url = new URL(request.url);
  const category_id = url.searchParams.get("category_id");
  
  let sql = `
    SELECT s.*, c.name as category_name 
    FROM services s
    LEFT JOIN service_categories c ON s.category_id = c.id
    WHERE s.deleted_at IS NULL
  `;
  const params: any[] = [];
  
  if (category_id) {
    sql += ` AND s.category_id = $1::uuid`;
    params.push(category_id);
  }
  
  sql += ` ORDER BY c.display_order ASC, s.name ASC;`;

  try {
    const services = await tenantDb.$queryRawUnsafe(sql, ...params);
    return NextResponse.json({ success: true, services });
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
    const newService = await tenantDb.$queryRawUnsafe(`
      INSERT INTO services (
        category_id, name, slug, description, short_description, duration_minutes,
        buffer_before_minutes, buffer_after_minutes, price, pricing_type,
        min_price, max_price, currency, max_advance_days, min_advance_hours,
        max_capacity, is_group_session, requires_deposit, deposit_amount, deposit_type,
        is_online, is_public, color, image_url
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24
      ) RETURNING *;
    `, 
      category_id || null, name, slug, description || null, short_description || null, duration_minutes,
      buffer_before_minutes || 0, buffer_after_minutes || 0, price || 0, pricing_type || 'FIXED',
      min_price || null, max_price || null, currency || 'USD', max_advance_days || 90, min_advance_hours || 1,
      max_capacity || 1, is_group_session || false, requires_deposit || false, deposit_amount || null, deposit_type || 'FIXED',
      is_online || false, is_public !== false, color || null, image_url || null
    );

    return NextResponse.json({ success: true, service: (newService as any)[0] });
  } catch (error: any) {
    console.error("[POST_SERVICE_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create service" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER"]); 
