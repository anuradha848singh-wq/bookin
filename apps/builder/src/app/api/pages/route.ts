import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { Prisma } from "@prisma/client";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreatePageSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug must be 50 characters or less")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
});

export async function GET(request: NextRequest) {
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

    const pages = await tenantDb.page.findMany({
      where: { deleted_at: null },
      orderBy: [
        { is_home: "desc" },
        { created_at: "asc" },
      ],
      select: {
        id: true,
        slug: true,
        title: true,
        is_home: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json({
      success: true,
      pages,
    });
  } catch (err: any) {
    logError("[Builder Pages GET API] Failed to list pages", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

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

    const body = await request.json();
    const parsed = CreatePageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: "Validation failed",
        details: parsed.error.flatten(),
      }, { status: 400 });
    }

    const { slug, title } = parsed.data;

    // Check if page slug already exists
    const existingPage = await tenantDb.page.findFirst({
      where: { slug, deleted_at: null },
    });

    if (existingPage) {
      return NextResponse.json({
        success: false,
        error: `A page with slug '${slug}' already exists`,
      }, { status: 400 });
    }

    const page = await tenantDb.page.create({
      data: {
        slug,
        title,
        is_home: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Page created successfully",
      page: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        is_home: page.is_home,
      },
    });
  } catch (err: any) {
    logError("[Builder Pages POST API] Failed to create page", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
