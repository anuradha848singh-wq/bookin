import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { generateHTML, CompilerMeta } from "@book-in/lib/compiler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) {
      return unauthorizedResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const pageId = searchParams.get("pageId");

    if (!pageId) {
      return new NextResponse("Missing pageId parameter", { status: 400 });
    }

    const publicDb = getPublicClient() as any;
    const clinic = await publicDb.tenant.findFirst({
      where: { owner_id: user.id },
    });

    if (!clinic) {
      return new NextResponse("Clinic not found", { status: 404 });
    }

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    // Fetch Website Config
    const websites = await tenantDb.$queryRaw`SELECT * FROM websites LIMIT 1;` as any[];
    const websiteConfig = websites.length > 0 ? websites[0] : {};

    // Fetch Page
    const page = await tenantDb.page.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      return new NextResponse("Page not found", { status: 404 });
    }

    if (!page.content) {
      return new NextResponse("<h1>Page is empty</h1>", { status: 200, headers: { "Content-Type": "text/html" } });
    }

    const jsonString = typeof page.content === 'string' 
      ? page.content 
      : JSON.stringify(page.content);

    const meta: CompilerMeta = {
      title: `[Preview] ${page.seo_meta?.title || page.title || clinic.name}`,
      description: page.seo_meta?.description,
      favicon_url: websiteConfig.favicon_url,
      og_image: page.seo_meta?.og_image
    };

    const html = generateHTML(jsonString, meta);
    
    // Add a preview banner injected at the top of the body
    const previewBanner = `
      <div style="background-color: #0066FF; color: white; text-align: center; padding: 8px; font-size: 14px; font-weight: 500; font-family: system-ui, sans-serif; position: sticky; top: 0; z-index: 9999;">
        You are viewing a live preview of unpublished changes.
      </div>
    `;
    const finalHtml = html.replace('<body>', `<body>\n    ${previewBanner}`);

    return new NextResponse(finalHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Do not cache preview
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

  } catch (err: any) {
    logError("[Builder Preview API] Failed to generate preview", err);
    return new NextResponse(`Error generating preview: ${err.message}`, { status: 500 });
  }
}
