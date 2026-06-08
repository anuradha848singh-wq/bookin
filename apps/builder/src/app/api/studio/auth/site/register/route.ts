import { NextResponse } from "next/server";
import { getPublicClient } from "@book-in/db";
const prisma = getPublicClient();
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-local-dev";

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export async function POST(req: Request) {
  try {
    const { websiteId, email, password, name } = await req.json();

    if (!websiteId || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.siteMember.findUnique({
      where: { websiteId_email: { websiteId, email } }
    });

    if (existing) {
      return NextResponse.json({ error: "Email already registered for this site." }, { status: 400 });
    }

    const passwordHash = hashPassword(password);

    const member = await prisma.siteMember.create({
      data: {
        websiteId,
        email,
        passwordHash,
        name
      }
    });

    const token = jwt.sign({ sub: member.id, websiteId: member.websiteId }, JWT_SECRET, { expiresIn: "7d" });

    const res = NextResponse.json({ success: true, member: { id: member.id, email: member.email, name: member.name } });
    res.cookies.set("bookin_site_session", token, { httpOnly: true, path: "/", maxAge: 7 * 24 * 60 * 60 });
    return res;

  } catch (err: any) {
    console.error("Site Register failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
