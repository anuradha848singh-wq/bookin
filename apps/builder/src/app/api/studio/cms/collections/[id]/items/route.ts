import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
const prisma = getPublicClient();
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const collectionId = (await params).id;

    const items = await prisma.builderCollectionItem.findMany({
      where: { collectionId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("CMS Items GET failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const collectionId = (await params).id;
    const { data, isPublished } = await req.json();

    if (!data) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const item = await prisma.builderCollectionItem.create({
      data: {
        collectionId,
        data,
        isPublished: isPublished ?? true,
      }
    });

    return NextResponse.json({ item });
  } catch (err: any) {
    console.error("CMS Item POST failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
