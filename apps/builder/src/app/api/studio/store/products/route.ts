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

    const products = await prisma.storeProduct.findMany({
      where: { websiteId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (err: any) {
    console.error("Store Products GET failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { websiteId, name, price, inventory, description } = await req.json();

    if (!websiteId || !name || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.storeProduct.create({
      data: {
        websiteId,
        name,
        price,
        inventory: inventory || 0,
        description,
      }
    });

    return NextResponse.json({ product });
  } catch (err: any) {
    console.error("Store Product POST failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
