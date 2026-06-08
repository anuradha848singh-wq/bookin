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

    const website = await prisma.builderWebsite.findUnique({
      where: { id: websiteId },
      select: { stripePublicKey: true, stripeSecretKey: true }
    });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    return NextResponse.json({ pub: website.stripePublicKey, sec: website.stripeSecretKey });
  } catch (err: any) {
    console.error("Store Settings GET failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { websiteId, pub, sec } = await req.json();

    if (!websiteId) {
      return NextResponse.json({ error: "Missing websiteId" }, { status: 400 });
    }

    await prisma.builderWebsite.update({
      where: { id: websiteId },
      data: {
        stripePublicKey: pub,
        stripeSecretKey: sec,
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Store Settings POST failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
