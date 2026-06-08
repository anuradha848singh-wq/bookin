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

    const collections = await prisma.builderCollection.findMany({
      where: { websiteId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { items: true }
        }
      }
    });

    return NextResponse.json({ collections });
  } catch (err: any) {
    console.error("CMS Collections GET failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { websiteId, name, slug, fields } = await req.json();

    if (!websiteId || !name || !slug || !fields) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const collection = await prisma.builderCollection.create({
      data: {
        websiteId,
        name,
        slug,
        fields,
      }
    });

    return NextResponse.json({ collection });
  } catch (err: any) {
    console.error("CMS Collection POST failed:", err);
    if (err.code === 'P2002') {
      return NextResponse.json({ error: "A collection with this slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
