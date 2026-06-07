import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

// Dynamically import the Supabase client only when needed
async function getStorageClient() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// Cache the HTML fetch using Next.js cache with a per-site revalidation tag
const fetchPageHtml = async (slug: string, pagePath: string): Promise<string | null> => {
  const fetcher = unstable_cache(
    async () => {
      const supabase = await getStorageClient();
      const filePath = `${slug}/${pagePath}.html`;

      const { data, error } = await supabase.storage
        .from("published_sites")
        .download(filePath);

      if (error || !data) return null;
      return await data.text();
    },
    [`site-page-${slug}-${pagePath}`],
    {
      // Tags enable per-site cache invalidation on publish
      tags: [`site-${slug}`],
      revalidate: 86400, // 24h max cache; busted instantly by revalidateTag on publish
    }
  );
  return fetcher();
};

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found | Bookin</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0a0a0a; color: #fff; }
    .container { text-align: center; }
    h1 { font-size: 6rem; font-weight: 800; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
    p { color: #999; font-size: 1.1rem; margin: 1rem 0 2rem; }
    a { color: #6366f1; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <p>This page doesn't exist or hasn't been published yet.</p>
    <a href="https://bookin.com">Build your website with Bookin →</a>
  </div>
</body>
</html>`;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; path?: string[] } }
) {
  const { slug } = params;
  const pagePath = params.path?.join("/") || "index";
  const originalDomain = request.headers.get("x-bookin-domain") || slug;

  try {
    const html = await fetchPageHtml(slug, pagePath);

    if (!html) {
      return new NextResponse(NOT_FOUND_HTML, {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Aggressive caching: serve from CDN for 24h, allow stale for 7 days while revalidating
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        // Security headers for live public sites
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        // Tell search engines this is the canonical host
        "Link": `<https://${originalDomain}/>; rel="canonical"`,
      },
    });
  } catch (error: any) {
    console.error(`[sites] Failed to serve ${slug}/${pagePath}:`, error);
    return new NextResponse(NOT_FOUND_HTML, {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
