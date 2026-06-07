import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { Prisma } from "@prisma/client";
import { getDashboardAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";
import { z } from "zod";

export const dynamic = "force-dynamic";

const StripeConfigSchema = z.object({
  stripe_account_id: z.string().optional(),
  stripe_live_key: z.string().optional(),
  stripe_test_key: z.string().optional(),
  stripe_webhook_secret: z.string().optional(),
  is_test_mode: z.boolean().optional(),
  deposit_required: z.boolean().optional(),
  deposit_percent: z.number().min(0).max(100).optional(),
  currency: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { user } = await getDashboardAuth();
    if (!user) return unauthorizedResponse();

    const publicDb = getPublicClient() as any;
    const clinic = await publicDb.tenant.findFirst({ where: { users: { some: { userId: user.id } } } });
    if (!clinic) return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 404 });

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    const configs = await tenantDb.$queryRaw`SELECT * FROM tenant_payment_configs LIMIT 1;` as any[];
    return NextResponse.json({ success: true, config: configs[0] || null });
  } catch (err: any) {
    logError("[Stripe Config GET] Failed", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user } = await getDashboardAuth();
    if (!user) return unauthorizedResponse();

    const publicDb = getPublicClient() as any;
    const clinic = await publicDb.tenant.findFirst({ where: { users: { some: { userId: user.id } } } });
    if (!clinic) return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 404 });

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    const body = await request.json();
    const parsed = StripeConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    const configs = await tenantDb.$queryRaw`SELECT id FROM tenant_payment_configs LIMIT 1;` as any[];
    
    if (configs.length === 0) {
      const inserted = await tenantDb.$queryRaw`
        INSERT INTO tenant_payment_configs 
        (stripe_account_id, stripe_live_key, stripe_test_key, stripe_webhook_secret, is_test_mode, deposit_required, deposit_percent, currency)
        VALUES (
          ${data.stripe_account_id || null}, 
          ${data.stripe_live_key || null}, 
          ${data.stripe_test_key || null}, 
          ${data.stripe_webhook_secret || null}, 
          ${data.is_test_mode ?? true}, 
          ${data.deposit_required ?? false}, 
          ${data.deposit_percent || 20}, 
          ${data.currency || 'USD'}
        )
        RETURNING *;
      ` as any[];
      return NextResponse.json({ success: true, config: inserted[0] });
    }

    const configId = configs[0].id;
    const updates = [];
    if (data.stripe_account_id !== undefined) updates.push(Prisma.sql`stripe_account_id = ${data.stripe_account_id}`);
    if (data.stripe_live_key !== undefined) updates.push(Prisma.sql`stripe_live_key = ${data.stripe_live_key}`);
    if (data.stripe_test_key !== undefined) updates.push(Prisma.sql`stripe_test_key = ${data.stripe_test_key}`);
    if (data.stripe_webhook_secret !== undefined) updates.push(Prisma.sql`stripe_webhook_secret = ${data.stripe_webhook_secret}`);
    if (data.is_test_mode !== undefined) updates.push(Prisma.sql`is_test_mode = ${data.is_test_mode}`);
    if (data.deposit_required !== undefined) updates.push(Prisma.sql`deposit_required = ${data.deposit_required}`);
    if (data.deposit_percent !== undefined) updates.push(Prisma.sql`deposit_percent = ${data.deposit_percent}`);
    if (data.currency !== undefined) updates.push(Prisma.sql`currency = ${data.currency}`);
    
    if (updates.length > 0) {
      updates.push(Prisma.sql`updated_at = NOW()`);
      const updated = await tenantDb.$queryRaw`
        UPDATE tenant_payment_configs SET ${Prisma.join(updates, ', ')} WHERE id = ${configId}::uuid RETURNING *;
      ` as any[];
      return NextResponse.json({ success: true, config: updated[0] });
    }
    return NextResponse.json({ success: true, message: "No updates" });
  } catch (err: any) {
    logError("[Stripe Config PUT] Failed", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
