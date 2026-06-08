import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
const prisma = getPublicClient();
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing SSO token" }, { status: 400 });
  }

  try {
    // 1. Validate the SSO Token
    const ssoToken = await prisma.ssoToken.findUnique({
      where: { token },
      include: { studioUser: true },
    });

    if (!ssoToken) {
      return NextResponse.json({ error: "Invalid SSO token" }, { status: 401 });
    }

    if (ssoToken.used) {
      return NextResponse.json({ error: "SSO token has already been used" }, { status: 401 });
    }

    if (ssoToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "SSO token has expired" }, { status: 401 });
    }

    // 2. Mark token as used
    await prisma.ssoToken.update({
      where: { id: ssoToken.id },
      data: { used: true },
    });

    // 3. Generate a Supabase Magic Link using the Service Role Key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // We pass redirectTo back to our builder editor route
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: ssoToken.studioUser.email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3001"}${ssoToken.redirectPath}`,
      },
    });

    if (error || !data.properties?.action_link) {
      console.error("Supabase Generate Link Error:", error);
      return NextResponse.json({ error: "Failed to generate session link" }, { status: 500 });
    }

    // 4. Redirect the user to the Supabase action link which logs them in instantly
    return NextResponse.redirect(data.properties.action_link);
  } catch (error) {
    console.error("SSO Exception:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
