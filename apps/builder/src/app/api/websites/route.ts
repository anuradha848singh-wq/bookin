import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { Prisma } from "@prisma/client";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateWebsiteSchema = z.object({
  custom_domain: z.string().nullable().optional(),
  theme_config: z.any().optional(),
  navigation: z.any().optional(),
  analytics_id: z.string().nullable().optional(),
  favicon_url: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  is_published: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) {
      return unauthorizedResponse();
    }

    const publicDb = getPublicClient() as any;
    const clinic = await publicDb.tenant.findFirst({
      where: { owner_id: user.id },
    });

    if (!clinic) {
      return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 404 });
    }

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    const websites = await tenantDb.$queryRaw`
      SELECT * FROM websites LIMIT 1;
    ` as any[];

    if (websites.length === 0) {
      // Seed if not exists (should be handled by migration but just in case)
      const newWebsite = await tenantDb.$queryRaw`
        INSERT INTO websites (theme_config) VALUES ('{}') RETURNING *;
      ` as any[];
      return NextResponse.json({ success: true, website: newWebsite[0] });
    }

    return NextResponse.json({ success: true, website: websites[0] });
  } catch (err: any) {
    logError("[Builder Websites GET API] Failed to fetch website config", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) {
      return unauthorizedResponse();
    }

    const publicDb = getPublicClient() as any;
    const clinic = await publicDb.tenant.findFirst({
      where: { owner_id: user.id },
    });

    if (!clinic) {
      return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 404 });
    }

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    const body = await request.json();
    const parsed = UpdateWebsiteSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: "Validation failed",
        details: parsed.error.flatten(),
      }, { status: 400 });
    }

    const data = parsed.data;

    // Get current website id
    const websites = await tenantDb.$queryRaw`SELECT id FROM websites LIMIT 1;` as any[];
    if (websites.length === 0) {
      return NextResponse.json({ success: false, error: "Website config not found" }, { status: 404 });
    }

    const websiteId = websites[0].id;

    // Construct update query dynamically
    const updates = [];
    if (data.custom_domain !== undefined) updates.push(Prisma.sql`custom_domain = ${data.custom_domain}`);
    if (data.theme_config !== undefined) updates.push(Prisma.sql`theme_config = ${JSON.stringify(data.theme_config)}::jsonb`);
    if (data.navigation !== undefined) updates.push(Prisma.sql`navigation = ${JSON.stringify(data.navigation)}::jsonb`);
    if (data.analytics_id !== undefined) updates.push(Prisma.sql`analytics_id = ${data.analytics_id}`);
    if (data.favicon_url !== undefined) updates.push(Prisma.sql`favicon_url = ${data.favicon_url}`);
    if (data.logo_url !== undefined) updates.push(Prisma.sql`logo_url = ${data.logo_url}`);
    if (data.is_published !== undefined) updates.push(Prisma.sql`is_published = ${data.is_published}`);

    if (updates.length > 0) {
      updates.push(Prisma.sql`updated_at = NOW()`);
      
      const updated = await tenantDb.$queryRaw`
        UPDATE websites
        SET ${Prisma.join(updates, ', ')}
        WHERE id = ${websiteId}::uuid
        RETURNING *;
      ` as any[];

      return NextResponse.json({ success: true, website: updated[0] });
    }

    return NextResponse.json({ success: true, message: "No updates provided" });
  } catch (err: any) {
    logError("[Builder Websites PUT API] Failed to update website config", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
