import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
const prisma = getPublicClient();
import { createClient } from "@/utils/supabase/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { isMemberOnly } = await req.json();

    const page = await prisma.builderPage.update({
      where: { id: (await params).id },
      data: { isMemberOnly }
    });

    return NextResponse.json({ success: true, page });
  } catch (err: any) {
    console.error("Page Update failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
