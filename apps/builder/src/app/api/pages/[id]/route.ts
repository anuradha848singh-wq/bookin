import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { z } from "zod";

const UpdatePageSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  content: z.any().optional(), // CraftJS JSON state
  seo_meta: z.any().optional(),
  published: z.boolean().optional(),
});

export async function PUT(
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

    const body = await request.json();
    const parsed = UpdatePageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: "Validation failed",
        details: parsed.error.flatten(),
      }, { status: 400 });
    }

    const data = parsed.data;

    // Verify page exists
    const existingPage = await tenantDb.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    // Update page
    const updatedPage = await tenantDb.page.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.seo_meta !== undefined && { seo_meta: data.seo_meta }),
        ...(data.published !== undefined && { published: data.published }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Page updated successfully",
      page: updatedPage,
    });
  } catch (err: any) {
    logError("[Builder Page PUT API] Failed to update page", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
