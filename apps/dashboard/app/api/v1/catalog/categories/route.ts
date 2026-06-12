import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { generateSlug } from "@book-in/db"; // we exported this from index.ts earlier

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }) => {
  try {
    const categories = await tenantDb.serviceCategory.findMany({
      orderBy: { display_order: 'asc' }
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("[GET_CATEGORIES_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
});

export const POST = withTenantAuth(async (request, { tenantDb }) => {
  const body = await request.json();
  const { name, description, color, icon, display_order, is_active } = body;

  if (!name) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }

  const slug = generateSlug(name);

  try {
    const newCat = await tenantDb.serviceCategory.create({
      data: {
        name,
        slug,
        description: description || null,
        color: color || null,
        icon: icon || null,
        display_order: display_order || 0,
        is_active: is_active !== false
      }
    });

    return NextResponse.json({ success: true, category: newCat });
  } catch (error: any) {
    console.error("[POST_CATEGORY_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER"]); // Only management can create categories
