import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
const prisma = getPublicClient();
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const websiteId = url.searchParams.get("websiteId");
    
    if (!websiteId) {
      return NextResponse.json({ error: "Missing websiteId" }, { status: 400 });
    }

    const members = await prisma.siteMember.findMany({
      where: { websiteId },
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, createdAt: true }
    });

    const pages = await prisma.builderPage.findMany({
      where: { websiteId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, isMemberOnly: true }
    });

    return NextResponse.json({ members, pages });
  } catch (err: any) {
    console.error("Site Members GET failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
