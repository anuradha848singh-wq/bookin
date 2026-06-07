import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookieOptions } from './utils/supabase/cookie-options';

export async function middleware(request: NextRequest) {
  // ──────────────────────────────────────────────────────────
  // DEV BYPASS: Skip all auth checks when DEV_BYPASS_AUTH=true
  // Remove or set to false before production!
  // ──────────────────────────────────────────────────────────
  if (process.env.DEV_BYPASS_AUTH === 'true') {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  // This is the response object that Supabase will write refreshed cookies onto.
  // We MUST return this exact object (not a fresh NextResponse.next()).
  let supabaseResponse = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() validates the JWT and triggers token refresh if needed.
  // If a refresh happens, the set() callback above writes the new cookies
  // onto supabaseResponse. Do NOT skip or remove this call.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // If user is logged in, prevent them from accessing /login and redirect to root
  if (user && pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  const isPublicRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next');

  if (!user && !isPublicRoute) {
    // API routes get a 401 JSON response instead of a redirect
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // CRITICAL: return supabaseResponse — it carries the refreshed session cookies.
  // Returning a fresh NextResponse.next() here would discard the cookies and
  // cause an infinite redirect loop.
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|json|ico|ttf|woff|woff2|mp4|mp3)$).*)',
  ],
};
