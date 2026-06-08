import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateSettingsSchema = z.object({
  gaId: z.string().optional(),
  gtmId: z.string().optional(),
  fbPixelId: z.string().optional(),
  customHead: z.string().optional(),
  customBody: z.string().optional(),
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
      where: { slug: clinic.slug }
    });

    if (!website) {
      return NextResponse.json({ success: true, settings: {} });
    }

    return NextResponse.json({ 
      success: true, 
      settings: {
        gaId: website.gaId || "",
        gtmId: website.gtmId || "",
        fbPixelId: website.fbPixelId || "",
        customHead: website.customHead || "",
        customBody: website.customBody || ""
      } 
    });
  } catch (err: any) {
    logError("[Builder Settings GET] Error", err);
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
    const parsed = UpdateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Validation failed" }, { status: 400 });
    }

    const data = parsed.data;

    await publicDb.builderWebsite.update({
      where: { id: website.id },
      data: {
        gaId: data.gaId,
        gtmId: data.gtmId,
        fbPixelId: data.fbPixelId,
        customHead: data.customHead,
        customBody: data.customBody,
      }
    });

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch (err: any) {
    logError("[Builder Settings PATCH] Error", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
