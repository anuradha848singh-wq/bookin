import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { generateHTML, type CompilerMeta } from "@book-in/lib/compiler";
import { getSupabaseAdmin } from "@book-in/lib/supabase";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Note: We don't have an S3 uploader yet, so this will act as a mock publish step
// that fully exercises the compiler.ts on the backend.

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) return unauthorizedResponse();

    const publicDb = getPublicClient() as any;
    const body = await request.json();
    const { websiteSlug } = body;
    if (!websiteSlug) return NextResponse.json({ success: false, error: "Missing websiteSlug" }, { status: 400 });

    const website = await publicDb.builderWebsite.findUnique({
      where: { slug: websiteSlug },
      include: { pages: true }
    });
    if (!website || website.ownerId !== user.id) return NextResponse.json({ success: false, error: "Website not found or unauthorized" }, { status: 404 });

    // Mock Publishing Step
    const results = [];
    for (const page of website.pages) {
      if (page.design) {
        try {
          const designStr = typeof page.design === 'string' ? page.design : JSON.stringify(page.design);
          const designObj = JSON.parse(designStr);
          const layoutStr = typeof designObj.layout === 'string' ? designObj.layout : JSON.stringify(designObj.layout);
          const seo = (page.seo || {}) as {
            title?: string;
            description?: string;
            og_image?: string;
            ogImage?: string;
            canonicalUrl?: string;
            twitterCard?: string;
            jsonLd?: string;
          };
          const meta: CompilerMeta = {
            title: seo.title || page.name,
            description: seo.description,
            og_image: seo.og_image,
            ogImage: seo.ogImage,
            canonicalUrl: seo.canonicalUrl,
            twitterCard: seo.twitterCard,
            jsonLd: seo.jsonLd,
            gaId: website.gaId || undefined,
            gtmId: website.gtmId || undefined,
            fbPixelId: website.fbPixelId || undefined,
            customHead: website.customHead || undefined,
            customBody: website.customBody || undefined,
            websiteId: website.id,
          };

          const html = generateHTML(layoutStr, meta);

          // Upload to Supabase Storage
          const supabase = getSupabaseAdmin();
          const bucket = 'published_sites';
          
          // Ensure bucket exists (or at least attempt to create it if it doesn't)
          // In a production setup, the bucket would be pre-created and configured as public.
          
          
          const pathSlug = page.slug === 'home' ? 'index' : page.slug;
          const filePath = `${website.slug}/${pathSlug}.html`;

          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, html, {
              contentType: 'text/html',
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) {
            console.error(`Supabase upload failed for ${page.slug}:`, uploadError);
            throw uploadError;
          }

          results.push({ slug: page.slug, size: html.length, path: filePath });
        } catch(e) {
          console.error(`Failed to compile page ${page.slug}`, e);
        }
      }
    }

    await publicDb.builderWebsite.update({
      where: { id: website.id },
      data: { isPublished: true, publishedAt: new Date() }
    });

    // Create a Version Snapshot
    await publicDb.websiteVersion.create({
      data: {
        websiteId: website.id,
        snapshot: website.design || {},
        publishedBy: user.id
      }
    });

    // 1. Write domain to Redis
    const ROOT_DOMAIN = process.env.BOOKIN_ROOT_DOMAIN || "bookin.com";
    const subdomain = `${website.slug}.${ROOT_DOMAIN}`;
    await redis.set(`domain:${subdomain}`, {
      websiteId: website.id,
      slug: website.slug,
    });
    // In the future, if custom domains exist, we would loop over them and map them too.

    // 2. Call SITES_REVALIDATE_URL webhook
    if (process.env.SITES_REVALIDATE_URL) {
      try {
        await fetch(process.env.SITES_REVALIDATE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "REVALIDATE_SECRET": process.env.REVALIDATE_SECRET || "",
          },
          body: JSON.stringify({ websiteSlug: website.slug }),
        });
      } catch (webhookError) {
        console.error("Failed to call SITES_REVALIDATE_URL:", webhookError);
      }
    }

    return NextResponse.json({ success: true, message: "Site published successfully", results });
  } catch (err: any) {
    logError("[Builder Publish API] Error", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
