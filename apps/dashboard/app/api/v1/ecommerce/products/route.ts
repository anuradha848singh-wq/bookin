import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { generateSlug } from "@book-in/db";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenantDb }) => {
  try {
    const products = await tenantDb.$queryRaw`
      SELECT p.*,
             (SELECT json_agg(v.*) FROM product_variants v WHERE v.product_id = p.id) as variants,
             c.name as category_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC;
    `;

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("[GET_PRODUCTS_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
});

export const POST = withTenantAuth(async (request, { tenantDb }) => {
  const body = await request.json();
  const { name, category_id, description, is_digital, is_track_inventory, variants } = body;

  if (!name || !variants || variants.length === 0) {
    return NextResponse.json({ error: "Product name and at least one variant are required" }, { status: 400 });
  }

  const slug = generateSlug(name);

  try {
    const newProduct = await tenantDb.$transaction(async (tx) => {
      // 1. Create Base Product
      const productResult = await tx.$queryRaw`
        INSERT INTO products (name, slug, description, category_id, is_digital, is_track_inventory)
        VALUES (${name}, ${slug}, ${description || null}, ${category_id ? Prisma.sql`${category_id}::uuid` : null}, ${is_digital || false}, ${is_track_inventory !== false})
        RETURNING *;
      ` as any[];
      
      const product = productResult[0];

      // 2. Insert Variants
      const insertedVariants = [];
      for (const variant of variants) {
        const variantResult = await tx.$queryRaw`
          INSERT INTO product_variants (product_id, name, sku, barcode, price, compare_price, cost_price, stock_count, weight_grams)
          VALUES (${product.id}::uuid, ${variant.name || 'Default'}, ${variant.sku || null}, ${variant.barcode || null}, ${variant.price || 0}, ${variant.compare_price || null}, ${variant.cost_price || null}, ${variant.stock_count || 0}, ${variant.weight_grams || 0})
          RETURNING *;
        ` as any[];
        insertedVariants.push(variantResult[0]);
        
        // 3. Write initial stock to ledger if tracking inventory
        if (product.is_track_inventory && variant.stock_count > 0) {
          await tx.$executeRaw`
            INSERT INTO inventory_transactions (variant_id, change_amount, reason, created_by)
            VALUES (${variantResult[0].id}::uuid, ${variant.stock_count}, 'MANUAL_ADJUSTMENT', 'SYSTEM_INITIALIZATION');
          `;
        }
      }

      return { ...product, variants: insertedVariants };
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("[POST_PRODUCT_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}, ["OWNER", "ADMIN", "MANAGER"]);
