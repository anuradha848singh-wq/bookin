import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { TenantService } from "@/services/tenant.service";

export const dynamic = "force-dynamic";

export const GET = withTenantAuth(async (request, { tenant, publicDb }) => {
  const tenantService = new TenantService(publicDb, tenant.id);
  const data = await tenantService.getTenant();

  return NextResponse.json({ success: true, data });
}, "view");

export const PUT = withTenantAuth(async (request, { tenant, publicDb }) => {
  const body = await request.json();
  
  const tenantService = new TenantService(publicDb, tenant.id);
  const updatedTenant = await tenantService.updateTenant(body);

  return NextResponse.json({ success: true, data: updatedTenant });
}, "manage_settings"); // Note: RBAC checks 'manage_settings' action
