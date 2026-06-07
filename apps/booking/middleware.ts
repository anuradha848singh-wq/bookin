import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { extractClinicSlug } from "@book-in/lib/subdomain";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes (since those are public endpoints that shouldn't be rewritten)
     * 2. /_next (Next.js internals)
     * 3. /static, /favicon.ico, /robots.txt, /images, etc. (static files)
     */
    "/((?!api/|_next/|_static/|favicon.ico|robots.txt|images/).*)",
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  const clinicSlug = extractClinicSlug(host);

  // 3. Perform rewrite if a valid subdomain was identified
  if (clinicSlug) {
    // Rewrite path to /[clinicSlug]/...
    url.pathname = `/${clinicSlug}${url.pathname}`;
    console.log(`[Middleware] Rewriting ${host}${request.nextUrl.pathname} -> ${url.pathname}`);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
