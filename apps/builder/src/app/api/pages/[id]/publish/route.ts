import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { generateHTML, generateCSS } from "@book-in/lib/compiler";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    // const id = params.id;

    // Verify page exists
    const existingPage = await tenantDb.page.findUnique({
      where: { id },
    });

    if (!existingPage || !existingPage.content) {
      return NextResponse.json({ success: false, error: "Page or content not found" }, { status: 404 });
    }

    // Convert CraftJS JSON to String
    const jsonString = typeof existingPage.content === 'string' 
      ? existingPage.content 
      : JSON.stringify(existingPage.content);

    // Compile!
    const html = generateHTML(jsonString);
    const css = generateCSS(jsonString);

    // In a real scenario, this would be pushed to S3/Cloudflare R2.
    // For now, we return the generated source code.
    return NextResponse.json({
      success: true,
      message: "Page published successfully",
      build: {
        html,
        css,
        stats: {
          htmlBytes: Buffer.byteLength(html, 'utf8'),
          cssBytes: Buffer.byteLength(css, 'utf8')
        }
      }
    });
  } catch (err: any) {
    logError("[Builder Page Publish API] Failed to compile page", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
