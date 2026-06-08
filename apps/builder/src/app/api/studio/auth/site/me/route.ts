import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
const prisma = getPublicClient();
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-local-dev";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const websiteId = url.searchParams.get("websiteId");

    const cookieStore = await cookies();
    const token = cookieStore.get("bookin_site_session")?.value;

    if (!token) return NextResponse.json({ member: null });

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      
      if (websiteId && decoded.websiteId !== websiteId) {
        return NextResponse.json({ member: null }); // Token is for a different website
      }

      const member = await prisma.siteMember.findUnique({
        where: { id: decoded.sub }
      });

      if (!member) return NextResponse.json({ member: null });

      return NextResponse.json({ member: { id: member.id, email: member.email, name: member.name } });
    } catch (e) {
      return NextResponse.json({ member: null });
    }
  } catch (err: any) {
    console.error("Site Me failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
