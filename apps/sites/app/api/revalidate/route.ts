import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("REVALIDATE_SECRET") || request.headers.get("x-revalidate-secret");

    if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    const body = await request.json();
    const { websiteSlug } = body;

    if (!websiteSlug) {
      return NextResponse.json({ message: "Missing websiteSlug" }, { status: 400 });
    }

    // Bust the Next.js cache for this specific site
    revalidateTag(`site-${websiteSlug}`);

    return NextResponse.json({ revalidated: true, now: Date.now(), slug: websiteSlug });
  } catch (error: any) {
    console.error("[revalidate] error:", error);
    return NextResponse.json({ message: "Error revalidating", error: error.message }, { status: 500 });
  }
}
