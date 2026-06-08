import { NextResponse } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { findClinicBySlug } from "@/lib/clinic";
import lz from "lz-string";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/headless?clinic=apex&page=home
 * Exposes the pure, raw JSON layout AST for any external headless consumer
 * (e.g., Mobile Apps, AI Agents, alternative frontends).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicSlug = searchParams.get("clinic");
    const pageSlug = searchParams.get("page") || "home";

    if (!clinicSlug) {
      return NextResponse.json({ error: "Missing 'clinic' parameter" }, { status: 400 });
    }

    // 1. Get clinic config to find tenant schema
    const publicDb = getPublicClient();
    const clinic = await findClinicBySlug(publicDb, clinicSlug);

    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    // 2. Fetch page from isolated tenant schema
    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;
    const page = await tenantDb.page.findFirst({
      where: { slug: pageSlug, deleted_at: null },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const contentObj = page.content as { layout?: string } | null;
    const customLayoutCompressed = contentObj?.layout || null;

    if (!customLayoutCompressed) {
      return NextResponse.json({ 
        success: true, 
        clinic: clinic.slug,
        page: page.slug,
        ast: null 
      });
    }

    // 3. Decompress the layout string to pure JSON
    let layoutTree = null;
    try {
      const decompressed = lz.decompressFromEncodedURIComponent(customLayoutCompressed);
      if (decompressed) {
        layoutTree = JSON.parse(decompressed);
      }
    } catch (e) {
      console.error("[Headless API] Failed to decompress layout:", e);
      return NextResponse.json({ error: "Failed to parse layout JSON" }, { status: 500 });
    }

    // 4. Return the fully parsed, clean AST to the headless consumer
    return NextResponse.json({
      success: true,
      clinic: clinic.slug,
      page: page.slug,
      seo_meta: page.seo_meta,
      ast: layoutTree,
    });
  } catch (error: any) {
    console.error("[Headless API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
