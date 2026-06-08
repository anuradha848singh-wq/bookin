import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";

export async function GET(request: Request) {
  // Check authorization header for cron secret
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = getPublicClient();
    const result = await prisma.ssoToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Purged ${result.count} expired SSO tokens.`,
    });
  } catch (error) {
    console.error("Cron Error: Failed to purge tokens", error);
    return NextResponse.json(
      { success: false, error: "Failed to purge tokens" },
      { status: 500 }
    );
  }
}
