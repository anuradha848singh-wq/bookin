export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { getBuilderUrl } from "@book-in/lib/env";

export const GET = withTenantAuth(async (request, { tenant, user }) => {
  const STUDIO_API_URL = getBuilderUrl();
  const STUDIO_API_SECRET = process.env.STUDIO_API_SECRET;

  if (!STUDIO_API_SECRET) {
    return NextResponse.json({ success: false, error: "Studio integration is not configured" }, { status: 500 });
  }

  if (!user.email) {
    return NextResponse.json({ success: false, error: "Email is required for SSO" }, { status: 400 });
  }

  try {
    const response = await fetch(`${STUDIO_API_URL}/api/v1/integrations/sso-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${STUDIO_API_SECRET}`,
      },
      body: JSON.stringify({
        tenantId: tenant.id,
        userEmail: user.email,
        redirectPath: `/editor/${tenant.slug}`, // Default redirect to their builder
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Studio SSO Error:", result);
      return NextResponse.json({ success: false, error: result.error || "Failed to generate SSO token" }, { status: response.status });
    }

    const ssoUrl = `${STUDIO_API_URL}/auth/sso?token=${result.token}`;

    return NextResponse.json({ success: true, url: ssoUrl });
  } catch (error: any) {
    console.error("Studio SSO Exception:", error);
    return NextResponse.json({ success: false, error: "Studio service is unreachable" }, { status: 503 });
  }
}, "manage_settings");
