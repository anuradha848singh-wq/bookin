import { NextResponse } from "next/server";
import { withTenantAuth } from "@/lib/api-middleware";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/v1/payments — Get tenant payment configuration
export const GET = withTenantAuth(async (request, { tenantDb }) => {
  try {
    const configs = await tenantDb.$queryRaw`
      SELECT id, stripe_account_id, is_test_mode, payment_methods, 
             deposit_required, deposit_percent, currency, tax_rate, invoice_prefix,
             -- Mask keys for security
             CASE WHEN stripe_live_key IS NOT NULL THEN 'configured' ELSE NULL END as stripe_live_key_status,
             CASE WHEN stripe_test_key IS NOT NULL THEN 'configured' ELSE NULL END as stripe_test_key_status,
             created_at, updated_at
      FROM tenant_payment_configs
      LIMIT 1;
    ` as any[];

    return NextResponse.json({
      success: true,
      config: configs[0] || null,
    });
  } catch (error: any) {
    console.error("[GET_PAYMENT_CONFIG_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch payment configuration" }, { status: 500 });
  }
});

// POST /api/v1/payments — Create initial payment configuration
export const POST = withTenantAuth(async (request, { tenantDb }) => {
  try {
    const body = await request.json();
    const {
      stripe_account_id,
      stripe_live_key,
      stripe_test_key,
      stripe_webhook_secret,
      is_test_mode = true,
      payment_methods = ["card"],
      deposit_required = false,
      deposit_percent = 20,
      currency = "USD",
      tax_rate = 0,
      invoice_prefix = "INV",
    } = body;

    // Check if config already exists
    const existing = await tenantDb.$queryRaw`SELECT id FROM tenant_payment_configs LIMIT 1;` as any[];

    let result;
    if (existing.length > 0) {
      // Update existing
      result = await tenantDb.$queryRaw`
        UPDATE tenant_payment_configs SET
          stripe_account_id = COALESCE(${stripe_account_id}, stripe_account_id),
          stripe_live_key = CASE WHEN ${stripe_live_key ? Prisma.sql`${stripe_live_key}::text` : null} IS NOT NULL THEN ${stripe_live_key} ELSE stripe_live_key END,
          stripe_test_key = CASE WHEN ${stripe_test_key ? Prisma.sql`${stripe_test_key}::text` : null} IS NOT NULL THEN ${stripe_test_key} ELSE stripe_test_key END,
          stripe_webhook_secret = CASE WHEN ${stripe_webhook_secret ? Prisma.sql`${stripe_webhook_secret}::text` : null} IS NOT NULL THEN ${stripe_webhook_secret} ELSE stripe_webhook_secret END,
          is_test_mode = ${is_test_mode},
          payment_methods = ${payment_methods}::text[],
          deposit_required = ${deposit_required},
          deposit_percent = ${deposit_percent},
          currency = ${currency},
          tax_rate = ${tax_rate},
          invoice_prefix = ${invoice_prefix},
          updated_at = NOW()
        WHERE id = ${existing[0].id}::uuid
        RETURNING id, stripe_account_id, is_test_mode, currency, tax_rate, updated_at;
      ` as any[];
    } else {
      // Create new
      result = await tenantDb.$queryRaw`
        INSERT INTO tenant_payment_configs (
          stripe_account_id, stripe_live_key, stripe_test_key, stripe_webhook_secret,
          is_test_mode, payment_methods, deposit_required, deposit_percent,
          currency, tax_rate, invoice_prefix
        ) VALUES (${stripe_account_id || null}, ${stripe_live_key || null}, ${stripe_test_key || null}, ${stripe_webhook_secret || null}, ${is_test_mode}, ${payment_methods}::text[], ${deposit_required}, ${deposit_percent}, ${currency}, ${tax_rate}, ${invoice_prefix})
        RETURNING id, stripe_account_id, is_test_mode, currency, tax_rate, created_at;
      ` as any[];
    }

    return NextResponse.json({
      success: true,
      message: "Payment configuration saved.",
      config: result[0],
    });
  } catch (error: any) {
    console.error("[POST_PAYMENT_CONFIG_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to save payment configuration" }, { status: 500 });
  }
}, ["OWNER", "ADMIN"]);
