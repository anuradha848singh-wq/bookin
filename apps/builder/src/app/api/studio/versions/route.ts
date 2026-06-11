import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get("websiteId");
    const pageSlug = searchParams.get("pageSlug");

    if (!websiteId || !pageSlug) {
      return NextResponse.json({ success: false, error: "Missing websiteId or pageSlug" }, { status: 400 });
    }

    const publicDb = getPublicClient() as any;

    const page = await publicDb.builderPage.findUnique({
      where: {
        websiteId_slug: { websiteId, slug: pageSlug }
      }
    });

    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    const versions = await publicDb.pageVersion.findMany({
      where: { pageId: page.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ success: true, versions });
  } catch (err: any) {
    logError("[Versions API] Error fetching versions", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { websiteId, pageSlug, name, data } = body;

    if (!websiteId || !pageSlug || !name || !data) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const publicDb = getPublicClient() as any;

    const page = await publicDb.builderPage.findUnique({
      where: {
        websiteId_slug: { websiteId, slug: pageSlug }
      }
    });

    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    const version = await publicDb.pageVersion.create({
      data: {
        pageId: page.id,
        name,
        data
      }
    });

    return NextResponse.json({ success: true, version });
  } catch (err: any) {
    logError("[Versions API] Error saving version", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
