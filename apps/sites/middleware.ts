import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Edge-compatible Redis client (HTTP-based, works at Vercel Edge)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const BOOKIN_ROOT_DOMAIN = process.env.BOOKIN_ROOT_DOMAIN || "bookin.com";

export const config = {
  matcher: [
    // Match everything EXCEPT: internal Next.js paths, API routes, static files
    "/((?!api/|_next/|_static/|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Strip port for local dev (e.g., localhost:3004 → localhost)
  const domain = hostname.replace(/:.*/, "");

  // ── 1. Ignore root domain and known system routes ─────────────────────────
  if (
    domain === BOOKIN_ROOT_DOMAIN ||
    domain === `www.${BOOKIN_ROOT_DOMAIN}` ||
    domain === "localhost"
  ) {
    return NextResponse.next();
  }

  // ── 2. Determine the website identifier ──────────────────────────────────
  let websiteIdentifier: string | null = null;

  // 2a. Try Redis first (<1ms, edge-compatible)
  const redisKey = `domain:${domain}`;
  const cached = await redis.get<{ websiteId: string; slug: string }>(redisKey);

  if (cached) {
    websiteIdentifier = cached.slug;
  } else {
    // Redis miss: fallback to Node.js route that queries Prisma and hydrates Redis
    try {
      const protocol = request.headers.get("x-forwarded-proto") || "http";
      const host = request.headers.get("host") || "localhost:3004";
      const lookupUrl = `${protocol}://${host}/api/lookup?domain=${domain}`;
      
      const lookupRes = await fetch(lookupUrl, {
        // Don't cache this fetch so we actually hit Prisma
        cache: 'no-store'
      });
      
      if (lookupRes.ok) {
        const data = await lookupRes.json();
        websiteIdentifier = data.slug;
      }
    } catch (error) {
      console.error("[middleware] Lookup API failed:", error);
    }
  }

  // ── 3. No website found: show a 404 ────────────────────────────────────
  if (!websiteIdentifier) {
    url.pathname = "/404";
    return NextResponse.rewrite(url);
  }

  // ── 4. Determine the page path (default to "index") ───────────────────
  const pagePath = url.pathname === "/" ? "index" : url.pathname.replace(/^\//, "");

  // ── 5. Rewrite internally to the clean serving route ──────────────────
  url.pathname = `/s/${websiteIdentifier}/${pagePath}`;

  const response = NextResponse.rewrite(url);

  // Pass the original host to the route handler for SEO canonical tags
  response.headers.set("x-bookin-domain", domain);
  response.headers.set("x-bookin-slug", websiteIdentifier);

  return response;
}
