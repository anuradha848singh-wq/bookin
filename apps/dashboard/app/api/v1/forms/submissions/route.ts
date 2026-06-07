import { NextResponse } from "next/server";
import { getTenantClient } from "@book-in/db";
import { getDashboardAuth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const tenantSlug = url.searchParams.get("tenant");
    
    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant slug is required" }, { status: 400 });
    }

    const tenantDb = getTenantClient(`tenant_${tenantSlug}`) as any;
    
    const body = await request.json();
    const { form_id, client_id, booking_id, responses } = body;

    if (!form_id || !responses) {
      return NextResponse.json({ error: "form_id and responses are required" }, { status: 400 });
    }

    // 1. Verify Form Exists
    const forms = await tenantDb.$queryRaw`
      SELECT id FROM forms WHERE id = ${form_id}::uuid AND is_active = true LIMIT 1;
    ` as any[];

    if (forms.length === 0) {
      return NextResponse.json({ error: "Form not found or inactive" }, { status: 404 });
    }

    // 2. Insert Submission
    // We capture IP address loosely via headers if available
    const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null;

    const newSubmission = await tenantDb.$queryRaw`
      INSERT INTO form_submissions (form_id, client_id, booking_id, responses, ip_address)
      VALUES (${form_id}::uuid, ${client_id ? Prisma.sql`${client_id}::uuid` : null}, ${booking_id ? Prisma.sql`${booking_id}::uuid` : null}, ${JSON.stringify(responses)}::jsonb, ${ip_address})
      RETURNING *;
    `;

    // 3. Optional: Add to Client Activity Timeline if client_id exists
    if (client_id) {
      await tenantDb.$executeRaw`
        INSERT INTO client_activities (client_id, type, title, description, link_id)
        VALUES (${client_id}::uuid, 'FORM_SUBMITTED', 'Submitted Form', 'Client completed an online form', ${(newSubmission as any)[0].id}::uuid);
      `;
    }

    return NextResponse.json({ success: true, submission: (newSubmission as any)[0] });
  } catch (error: any) {
    console.error("[POST_FORM_SUBMISSION_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to submit form" }, { status: 500 });
  }
}

