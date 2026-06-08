import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdatePageSchema = z.object({
  slug: z.string(),
  name: z.string().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    canonicalUrl: z.string().optional(),
    ogImage: z.string().optional(),
    twitterCard: z.string().optional(),
    jsonLd: z.string().optional(),
  }).optional()
});

export async function GET(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) return unauthorizedResponse();

    const publicDb = getPublicClient() as any;
    const clinic = await publicDb.tenant.findFirst({
      where: { users: { some: { userId: user.id } } },
    });
    if (!clinic) return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 404 });

    const website = await publicDb.builderWebsite.findUnique({
      where: { slug: clinic.slug },
      include: { pages: true }
    });

    if (!website) {
      return NextResponse.json({ success: true, pages: [] });
    }

    const formattedPages = website.pages.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.name,
      is_home: p.isHome,
      seo_meta: p.seo || {},
      updated_at: p.updatedAt,
      published: website.isPublished
    }));

    return NextResponse.json({ success: true, pages: formattedPages });
  } catch (err: any) {
    logError("[Builder Pages GET] Error", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) return unauthorizedResponse();

    const publicDb = getPublicClient() as any;
    const clinic = await publicDb.tenant.findFirst({
      where: { users: { some: { userId: user.id } } },
    });
    if (!clinic) return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 404 });

    const website = await publicDb.builderWebsite.findUnique({
      where: { slug: clinic.slug }
    });
    if (!website) return NextResponse.json({ success: false, error: "Website not found" }, { status: 404 });

    const body = await request.json();
    const parsed = UpdatePageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Validation failed" }, { status: 400 });
    }

    const { slug, name, seo } = parsed.data;

    const page = await publicDb.builderPage.update({
      where: {
        websiteId_slug: { websiteId: website.id, slug }
      },
      data: {
        name: name || undefined,
        seo: seo || undefined,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, message: "Page updated", page });
  } catch (err: any) {
    logError("[Builder Pages PATCH] Error", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
