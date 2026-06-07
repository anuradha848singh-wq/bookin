import { NextResponse } from "next/server";

// Force Node.js runtime
export const runtime = "nodejs";

/**
 * BYPASSED: Guest init now returns pre-existing demo credentials from .env
 * instead of dynamically creating a new Supabase user via admin API.
 * 
 * See: KNOWN_ISSUES.md for details on the original 500 error.
 * 
 * TODO: Restore dynamic guest user creation once the Supabase admin API
 * issue is resolved. Original code is preserved in KNOWN_ISSUES.md.
 */
export async function POST() {
  const guestEmail = process.env.GUEST_DEMO_EMAIL;
  const guestPassword = process.env.GUEST_DEMO_PASSWORD;

  console.log("[Guest Init] BYPASS MODE — using pre-existing demo credentials");

  if (!guestEmail || !guestPassword) {
    console.error("[Guest Init] Missing GUEST_DEMO_EMAIL or GUEST_DEMO_PASSWORD in .env");
    return NextResponse.json(
      { success: false, error: "Guest demo credentials not configured. Set GUEST_DEMO_EMAIL and GUEST_DEMO_PASSWORD in .env" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    email: guestEmail,
    password: guestPassword,
  });
}
