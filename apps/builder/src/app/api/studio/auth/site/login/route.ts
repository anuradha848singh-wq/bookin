import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-local-dev";

function verifyPassword(password: string, hash: string) {
  const [salt, key] = hash.split(":");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return key === derivedKey;
}

export async function POST(req: Request) {
  try {
    const { websiteId, email, password } = await req.json();

    if (!websiteId || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const prisma = getPublicClient();
    const member = await (prisma as any).siteMember.findUnique({
      where: { websiteId_email: { websiteId, email } }
    });

    if (!member || !verifyPassword(password, member.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = jwt.sign({ sub: member.id, websiteId: member.websiteId }, JWT_SECRET, { expiresIn: "7d" });

    const res = NextResponse.json({ success: true, member: { id: member.id, email: member.email, name: member.name } });
    res.cookies.set("bookin_site_session", token, { httpOnly: true, path: "/", maxAge: 7 * 24 * 60 * 60 });
    return res;

  } catch (err: any) {
    console.error("Site Login failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
