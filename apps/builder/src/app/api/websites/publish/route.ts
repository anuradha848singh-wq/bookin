import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { generateHTML, generateSitemap, generateRobotsTxt, CompilerMeta } from "@book-in/lib/compiler";
import { getSupabaseServerClient } from "@book-in/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
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

    // 1. Fetch Website Config
    const websites = await tenantDb.$queryRaw`SELECT * FROM websites LIMIT 1;` as any[];
    const websiteConfig = websites.length > 0 ? websites[0] : {};
    
    const domain = websiteConfig.custom_domain || `${clinic.slug}.bookin.com`;

    // 2. Fetch All Active Pages
    const pages = await tenantDb.page.findMany({
      where: { deleted_at: null },
    });

    if (pages.length === 0) {
      return NextResponse.json({ success: false, error: "No pages found to publish." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const bucket = "published_sites";
    let totalBytes = 0;

    // 3. Compile and Upload Each Page
    for (const page of pages) {
      if (!page.content) continue;

      const jsonString = typeof page.content === 'string' 
        ? page.content 
        : JSON.stringify(page.content);

      const meta: CompilerMeta = {
        title: page.seo_meta?.title || page.title || clinic.name,
        description: page.seo_meta?.description,
        favicon_url: websiteConfig.favicon_url,
        og_image: page.seo_meta?.og_image
      };

      const html = generateHTML(jsonString, meta);
      const htmlBuffer = Buffer.from(html, 'utf8');
      
      const fileName = page.slug === 'home' || page.slug === '/' ? 'index.html' : `${page.slug}.html`;
      const filePath = `${clinic.slug}/${fileName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, htmlBuffer, {
          contentType: 'text/html; charset=utf-8',
          upsert: true
        });

      if (error) {
        throw new Error(`Failed to upload ${fileName}: ${error.message}`);
      }
      
      totalBytes += Buffer.byteLength(htmlBuffer);
    }

    // 4. Generate & Upload Sitemap
    const sitemapXml = generateSitemap(domain, pages.map((p: any) => ({
      slug: p.slug,
      updated_at: p.updated_at.toISOString()
    })));
    const sitemapBuffer = Buffer.from(sitemapXml, 'utf8');
    
    await supabase.storage
      .from(bucket)
      .upload(`${clinic.slug}/sitemap.xml`, sitemapBuffer, {
        contentType: 'application/xml',
        upsert: true
      });
    totalBytes += Buffer.byteLength(sitemapBuffer);

    // 5. Generate & Upload robots.txt
    const robotsTxt = generateRobotsTxt(domain);
    const robotsBuffer = Buffer.from(robotsTxt, 'utf8');

    await supabase.storage
      .from(bucket)
      .upload(`${clinic.slug}/robots.txt`, robotsBuffer, {
        contentType: 'text/plain',
        upsert: true
      });
    totalBytes += Buffer.byteLength(robotsBuffer);

    return NextResponse.json({
      success: true,
      message: "Website published successfully",
      stats: {
        pagesPublished: pages.length,
        totalBytes,
        domain
      }
    });

  } catch (err: any) {
    logError("[Builder Global Publish API] Failed to publish website", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
