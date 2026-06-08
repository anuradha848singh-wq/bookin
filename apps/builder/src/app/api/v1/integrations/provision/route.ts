import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
const prisma = getPublicClient();

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const STUDIO_API_SECRET = process.env.STUDIO_API_SECRET;

  if (!STUDIO_API_SECRET || authHeader !== `Bearer ${STUDIO_API_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tenantId, tenantName, tenantSlug, userEmail, userName } = await request.json();

    if (!tenantId || !userEmail) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 1. Ensure the Studio User exists
    let studioUser = await prisma.studioUser.findUnique({
      where: { email: userEmail },
    });

    if (!studioUser) {
      studioUser = await prisma.studioUser.create({
        data: {
          email: userEmail,
          fullName: userName,
        },
      });
    }

    // 2. Ensure the Builder Website exists for this tenant
    let website = await prisma.builderWebsite.findFirst({
      where: { bookinTenantId: tenantId },
    });

    if (!website) {
      website = await prisma.builderWebsite.create({
        data: {
          name: `${tenantName} Website`,
          slug: tenantSlug,
          ownerId: studioUser.id,
          bookinTenantId: tenantId,
          design: {},
        },
      });
    }

    return NextResponse.json({ success: true, website });
  } catch (error: any) {
    console.error("Studio Provision Exception:", error);
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}
