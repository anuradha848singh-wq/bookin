import { NextResponse } from "next/server";
import { getDashboardAuth, getCachedTenant } from "./auth";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { PrismaClient, Tenant } from "@prisma/client";
import { can, Action } from "@book-in/lib/src/auth/rbac";
import { rateLimit } from "@book-in/lib/src/security/rate-limit";

export interface TenantRouteContext {
  user: { id: string; email?: string | null; name?: string | null; role: string };
  tenant: Tenant;
  tenantDb: PrismaClient;
  publicDb: PrismaClient;
}

export function withTenantAuth(
  handler: (request: Request, ctx: TenantRouteContext, params?: any) => Promise<NextResponse>,
  requiredAction?: Action // Strict RBAC checking
) {
  return async (request: Request, context: { params?: any } = {}) => {
    try {
      // 1. Apply rate limit by IP
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      const { success: rateLimitSuccess } = await rateLimit.limit(`api_${ip}`);
      if (!rateLimitSuccess) {
        return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
      }

      const { user, session } = await getDashboardAuth();
      if (!user || !user.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }

      // NextAuth session token can store active tenantId
      const activeTenantId = (session as any)?.tenantId as string | undefined;
      const tenantWithUsers = await getCachedTenant(user.id, activeTenantId);
      
      if (!tenantWithUsers || !tenantWithUsers.users || tenantWithUsers.users.length === 0) {
        return NextResponse.json({ success: false, error: "Tenant not found or access denied" }, { status: 404 });
      }

      const tenantUserRole = tenantWithUsers.users[0].role;
      
      // RBAC Check via action capability
      if (requiredAction && !can(tenantUserRole, requiredAction)) {
        return NextResponse.json({ success: false, error: "Forbidden: insufficient permissions" }, { status: 403 });
      }

      // Strip users from tenant object for clean context
      const { users, ...tenant } = tenantWithUsers;

      const publicDb = getPublicClient() as any;
      const tenantSchema = `tenant_${tenant.slug}`;
      const tenantDb = getTenantClient(tenantSchema) as any;

      const ctxUser = {
        ...user,
        role: tenantUserRole
      };

      return await handler(request, { user: ctxUser as any, tenant: tenant as Tenant, tenantDb, publicDb }, context.params);
    } catch (error: any) {
      console.error("[API_ERROR]", error);
      return NextResponse.json(
        { success: false, error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}

