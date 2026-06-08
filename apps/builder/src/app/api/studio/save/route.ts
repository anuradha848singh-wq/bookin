import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { z } from "zod";

export const dynamic = "force-dynamic";

const SaveLayoutSchema = z.object({
  content: z.string().min(1, "Layout content is required"),
  websiteSlug: z.string().min(1, "Website slug is required"),
  pageSlug: z.string().default("home"),
});

export async function POST(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) {
      return unauthorizedResponse();
    }

    const publicDb = getPublicClient() as any;
    const body = await request.json();
    const parsed = SaveLayoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ 
        success: false, 
        error: "Validation failed", 
        details: parsed.error.flatten() 
      }, { status: 400 });
    }

    const { content, websiteSlug, pageSlug } = parsed.data;

    // Ensure Website exists and belongs to the user
    let website = await publicDb.builderWebsite.findUnique({
      where: { slug: websiteSlug }
    });

    if (!website) {
      // In standalone builder, if website doesn't exist, we create it.
      website = await publicDb.builderWebsite.create({
        data: {
          ownerId: user.id,
          name: websiteSlug,
          slug: websiteSlug,
          design: {},
        }
      });
    } else if (website.ownerId !== user.id) {
      return unauthorizedResponse("You do not have permission to edit this website.");
    }

    // Upsert the BuilderPage
    const page = await publicDb.builderPage.upsert({
      where: {
        websiteId_slug: {
          websiteId: website.id,
          slug: pageSlug
        }
      },
      create: {
        websiteId: website.id,
        name: pageSlug === "home" ? "Homepage" : pageSlug,
        slug: pageSlug,
        design: { layout: content },
        isHome: pageSlug === "home",
        seo: {},
      },
      update: {
        design: { layout: content },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Page saved successfully",
      pageId: page.id,
    });
  } catch (err: any) {
    logError("[Builder Save API] Failed to save layout", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
