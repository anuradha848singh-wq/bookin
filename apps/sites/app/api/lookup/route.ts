import { NextRequest, NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const BOOKIN_ROOT_DOMAIN = process.env.BOOKIN_ROOT_DOMAIN || "bookin.com";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });
  }

  try {
    const publicDb = getPublicClient() as any;
    let websiteSlug: string | null = null;

    const isBookinSubdomain = domain.endsWith(`.${BOOKIN_ROOT_DOMAIN}`) || domain.endsWith(".localhost");

    if (isBookinSubdomain) {
      websiteSlug = domain.split(".")[0];
    } else {
      // Temporary fallback for custom domains in simulation: assume domain = slug
      websiteSlug = domain;
    }

    if (websiteSlug) {
      // Query Prisma to confirm website exists
      const website = await publicDb.builderWebsite.findUnique({
        where: { slug: websiteSlug },
        select: { id: true, slug: true }
      });

      if (website) {
        // Hydrate Redis for next time
        await redis.set(`domain:${domain}`, {
          websiteId: website.id,
          slug: website.slug,
        });

        return NextResponse.json({ websiteId: website.id, slug: website.slug });
      }
    }

    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  } catch (error: any) {
    console.error("[lookup] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
