import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
const prisma = getPublicClient();
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    const templates = await prisma.builderTemplate.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: true,
        theme: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const categories = await prisma.builderCategory.findMany();

    return NextResponse.json({ templates, categories });
  } catch (err: any) {
    console.error("Failed to fetch templates:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
