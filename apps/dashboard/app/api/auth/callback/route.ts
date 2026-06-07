import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient } from "@book-in/db";
import { cookieOptions } from "../../../../utils/supabase/cookie-options";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const callbackError = searchParams.get("error_description") || searchParams.get("error");

  if (callbackError || !code) {
    const loginUrl = new URL("/login", origin);
    if (callbackError) {
      loginUrl.searchParams.set("error", callbackError);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Buffer cookies instead of writing them directly to a response,
  // because we don't know the final redirect destination yet.
  const cookiesToSet: Array<{ name: string; value: string; options?: any }> = [];

  console.log("[Auth callback] Incoming cookies:", request.cookies.getAll());

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            cookiesToSet.push({ name, value, options });
          });
        },
      },
    }
  );

  // Exchange the authorization code for a session.
  // This calls our set() callback to buffer the session cookies.
  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[Auth callback] Failed to exchange OAuth code:", error.message);
    const errorUrl = new URL("/login", origin);
    errorUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(errorUrl);
  }

  // Determine where to send the user
  let redirectPath = "/onboarding";

  const nextParam = searchParams.get("next");
  if (nextParam && nextParam.startsWith("/")) {
    redirectPath = nextParam;
  } else if (user) {
    try {
      const publicDb = getPublicClient() as any;
      const tenantUser = await publicDb.tenantUser.findFirst({
        where: { userId: user.id, isOwner: true, deletedAt: null },
      });
      if (tenantUser) {
        redirectPath = "/";
      }
    } catch (dbError) {
      console.error("[Auth callback] DB lookup failed:", dbError);
      // Default to /onboarding — the layout gate will re-check
    }
  }

  // Create the redirect response and attach ALL buffered session cookies to it.
  const response = NextResponse.redirect(new URL(redirectPath, origin));
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}

