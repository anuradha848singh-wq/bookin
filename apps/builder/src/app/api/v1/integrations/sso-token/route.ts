import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
const prisma = getPublicClient();
import crypto from "crypto";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const STUDIO_API_SECRET = process.env.STUDIO_API_SECRET;

  if (!STUDIO_API_SECRET || authHeader !== `Bearer ${STUDIO_API_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userEmail, redirectPath } = await request.json();

    if (!userEmail) {
      return NextResponse.json({ success: false, error: "Missing email" }, { status: 400 });
    }

    const studioUser = await prisma.studioUser.findUnique({
      where: { email: userEmail },
    });

    if (!studioUser) {
      return NextResponse.json({ success: false, error: "Studio User not found" }, { status: 404 });
    }

    // Generate a secure, single-use token valid for 5 minutes
    const tokenStr = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const ssoToken = await prisma.ssoToken.create({
      data: {
        token: tokenStr,
        studioUserId: studioUser.id,
        expiresAt: expiresAt,
        redirectPath: redirectPath || "/editor",
      },
    });

    return NextResponse.json({ success: true, token: ssoToken.token });
  } catch (error: any) {
    console.error("Studio SSO Token Exception:", error);
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}
