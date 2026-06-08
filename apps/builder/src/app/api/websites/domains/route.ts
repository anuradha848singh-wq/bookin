import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { domain, subdomain } = body;

    if (!domain && !subdomain) {
      return NextResponse.json({ success: false, error: "Missing domain or subdomain" }, { status: 400 });
    }

    let finalDomain = "";

    if (domain) {
      if (typeof domain !== 'string') {
        return NextResponse.json({ success: false, error: "Invalid domain format" }, { status: 400 });
      }
      // Basic domain validation
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(domain)) {
        return NextResponse.json({ success: false, error: "Please enter a valid domain (e.g. www.myclinic.com)" }, { status: 400 });
      }
      finalDomain = domain;
    } else if (subdomain) {
      if (typeof subdomain !== 'string') {
        return NextResponse.json({ success: false, error: "Invalid subdomain format" }, { status: 400 });
      }
      const subRegex = /^[a-zA-Z0-9-]+$/;
      if (!subRegex.test(subdomain)) {
        return NextResponse.json({ success: false, error: "Subdomain can only contain letters, numbers, and hyphens" }, { status: 400 });
      }
      finalDomain = `${subdomain}.bookin.com`;
    }

    const publicDb = getPublicClient() as any;
    const clinic = await publicDb.tenant.findFirst({
      where: { owner_id: user.id },
    });

    if (!clinic) {
      return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 404 });
    }

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    // Update the tenant's website config
    await tenantDb.$executeRaw`
      INSERT INTO websites (id, custom_domain, updated_at) 
      VALUES (gen_random_uuid(), ${finalDomain}, NOW())
      ON CONFLICT (id) DO UPDATE SET custom_domain = ${finalDomain}, updated_at = NOW();
    `;

    return NextResponse.json({
      success: true,
      message: domain ? "Domain connected successfully. SSL certificate is being provisioned." : "Subdomain saved successfully.",
      domain: finalDomain
    });

  } catch (err: any) {
    logError("[Builder Domain API] Failed to connect domain", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
