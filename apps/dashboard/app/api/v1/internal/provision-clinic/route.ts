import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient, registerTenantAndCreateSchema } from "@book-in/db";
import { getDashboardAuth, unauthorizedResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { user } = await getDashboardAuth();
    if (!user) {
      return unauthorizedResponse();
    }

    const userId = user.id;

    // 2. Parse body
    const body = await request.json();
    const { clinicName } = body;

    if (!clinicName || typeof clinicName !== "string" || !clinicName.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid clinicName" },
        { status: 400 }
      );
    }

    const publicDb = getPublicClient() as any;
    const existingTenant = await publicDb.tenant.findFirst({
      where: { 
        users: { some: { userId } },
        deletedAt: null 
      },
    });

    if (existingTenant) {
      // Validate if the PostgreSQL schema actually exists in the database
      const tenantSchema = `tenant_${existingTenant.slug}`;
      const schemaCheck = await publicDb.$queryRaw<Array<{ exists: boolean }>>`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.schemata WHERE schema_name = ${tenantSchema}
        ) as exists;
      `;
      const schemaExists = schemaCheck[0]?.exists ?? false;

      if (!schemaExists) {
        console.warn(`[Dashboard API] Found tenant record ${existingTenant.id} but its schema ${tenantSchema} does not exist. Re-provisioning schema...`);
        // Schema missing - fall through to re-provision it
      } else {
        return NextResponse.json({
          success: true,
          message: "Tenant already provisioned.",
          tenant: existingTenant,
        });
      }
    }

    // 3. Provision tenant database schema using the correct function
    console.log(`[Dashboard API] Registering tenant "${clinicName}" for owner ${userId}...`);
    const tenant = await registerTenantAndCreateSchema({
      name: clinicName.trim(),
      email: user.email ?? "",
      businessType: "OTHER",
      planId: "free",
      ownerUserId: userId,
      ownerEmail: user.email ?? "",
      ownerName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Tenant registered and schema provisioned successfully!",
      tenant
    });
  } catch (err: any) {
    console.error("[Dashboard API] Clinic provisioning failed:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal registration error" },
      { status: 500 }
    );
  }
}

