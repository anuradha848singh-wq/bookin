import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";

export const POST = withTenantAuth(async (request, { tenant, user }) => {
  const STUDIO_API_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3001";
  const STUDIO_API_SECRET = process.env.STUDIO_API_SECRET;

  if (!STUDIO_API_SECRET) {
    console.error("Missing STUDIO_API_SECRET");
    return NextResponse.json({ success: false, error: "Studio integration is not configured" }, { status: 500 });
  }

  try {
    // Call the Studio API server-to-server to provision
    const response = await fetch(`${STUDIO_API_URL}/api/v1/integrations/provision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${STUDIO_API_SECRET}`,
      },
      body: JSON.stringify({
        tenantId: tenant.id,
        tenantName: tenant.name,
        tenantSlug: tenant.slug,
        userEmail: user.email,
        userName: user.name || user.email?.split("@")[0],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Studio Provisioning Error:", result);
      return NextResponse.json({ success: false, error: result.error || "Failed to provision Studio" }, { status: response.status });
    }

    return NextResponse.json({ success: true, website: result.website });
  } catch (error: any) {
    console.error("Studio Provisioning Exception:", error);
    return NextResponse.json({ success: false, error: "Studio service is unreachable" }, { status: 503 });
  }
}, "manage_settings"); // Only owners/admins can provision a studio website
