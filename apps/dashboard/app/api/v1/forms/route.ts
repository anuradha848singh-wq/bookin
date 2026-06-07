import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { generateSlug } from "@book-in/db";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }) => {
  try {
    const forms = await tenantDb.$queryRaw`
      SELECT * FROM forms WHERE deleted_at IS NULL ORDER BY created_at DESC;
    `;

    return NextResponse.json({ success: true, forms });
  } catch (error: any) {
    console.error("[GET_FORMS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch forms" }, { status: 500 });
  }
});

export const POST = withTenantAuth(async (request, { tenantDb }) => {
  const body = await request.json();
  const { name, description, type, schema, ui_schema, is_required } = body;

  if (!name || !type || !schema) {
    return NextResponse.json({ error: "Name, type, and schema are required" }, { status: 400 });
  }

  const slug = generateSlug(name);

  try {
    const newForm = await tenantDb.$queryRaw`
      INSERT INTO forms (name, slug, description, type, schema, ui_schema, is_required)
      VALUES (${name}, ${slug}, ${description || null}, ${type}, ${JSON.stringify(schema)}::jsonb, ${ui_schema ? JSON.stringify(ui_schema) : null}::jsonb, ${is_required || false})
      RETURNING *;
    `;

    return NextResponse.json({ success: true, form: (newForm as any)[0] });
  } catch (error: any) {
    console.error("[POST_FORM_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create form template" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER"]);
