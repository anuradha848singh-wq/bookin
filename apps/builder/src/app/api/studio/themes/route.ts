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

    const themes = await prisma.builderTheme.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({ themes });
  } catch (err: any) {
    console.error("Failed to fetch themes:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
