import { createClient } from "@/utils/supabase/server";
import { getPublicClient } from "@book-in/db";
import { cache } from "react";
import { NextResponse } from "next/server";

const publicDb = getPublicClient() as any;

export async function getDashboardAuth() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  return {
    supabase,
    user,
    error,
    session: null as any, // Legacy/compatibility field (unvalidated session is unsafe)
    isAuthenticated: !!user && !error,
  };
}

export function unauthorizedResponse(message = "Unauthorized. Please sign in.") {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}

// Retrieves the active tenant context for the user via TenantUser join table
export const getCachedTenant = cache(async (userId: string, tenantId?: string) => {
  try {
    const db = getPublicClient() as any;

    if (tenantId) {
      const tenantUser = await db.tenantUser.findFirst({
        where: { userId, tenantId, deletedAt: null },
        include: { tenant: true },
      });
      return (tenantUser?.tenant?.deletedAt == null ? tenantUser?.tenant : null) ?? null;
    }

    // Fallback: return the first tenant the user owns
    const tenantUser = await db.tenantUser.findFirst({
      where: { userId, isOwner: true, deletedAt: null },
      include: { tenant: true },
      orderBy: { createdAt: "asc" },
    });
    return (tenantUser?.tenant?.deletedAt == null ? tenantUser?.tenant : null) ?? null;
  } catch (err) {
    console.error("[getCachedTenant] DB error:", err);
    return null;
  }
});