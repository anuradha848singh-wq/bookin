import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) {
      return unauthorizedResponse();
    }

    const publicDb = getPublicClient() as any;
    
    const { searchParams } = new URL(request.url);
    const websiteSlug = searchParams.get("slug");
    const pageSlug = searchParams.get("page") || "home";

    if (!websiteSlug) {
      return NextResponse.json({ success: false, error: "Missing website slug" }, { status: 400 });
    }

    const website = await publicDb.builderWebsite.findUnique({
      where: { slug: websiteSlug }
    });

    if (!website || website.ownerId !== user.id) {
      return NextResponse.json({
        success: true,
        content: null,
      });
    }

    const page = await publicDb.builderPage.findUnique({
      where: {
        websiteId_slug: {
          websiteId: website.id,
          slug: pageSlug
        }
      },
    });

    if (!page) {
      return NextResponse.json({
        success: true,
        content: null,
      });
    }

    // Extract layout from the JSON design wrapper
    const designObj = page.design as { layout?: string } | null;
    const layout = designObj?.layout || null;

    return NextResponse.json({
      success: true,
      content: layout,
      title: page.name,
    });
  } catch (err: any) {
    logError("[Builder Load API] Failed to load layout", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
