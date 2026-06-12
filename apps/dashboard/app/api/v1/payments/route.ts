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

    const dataPayload: any = {
      is_test_mode,
      payment_methods,
      deposit_required,
      deposit_percent: Number(deposit_percent),
      currency,
      tax_rate: Number(tax_rate),
      invoice_prefix,
    };

    if (stripe_account_id !== undefined) dataPayload.stripe_account_id = stripe_account_id;
    if (stripe_live_key !== undefined) dataPayload.stripe_live_key = stripe_live_key;
    if (stripe_test_key !== undefined) dataPayload.stripe_test_key = stripe_test_key;
    if (stripe_webhook_secret !== undefined) dataPayload.stripe_webhook_secret = stripe_webhook_secret;

    const result = await tenantDb.$transaction(async (tx: any) => {
      const existing = await tx.tenantPaymentConfig.findFirst();
      
      if (existing) {
        return await tx.tenantPaymentConfig.update({
          where: { id: existing.id },
          data: dataPayload,
          select: {
            id: true,
            stripe_account_id: true,
            is_test_mode: true,
            currency: true,
            tax_rate: true,
            updated_at: true
          }
        });
      } else {
        return await tx.tenantPaymentConfig.create({
          data: dataPayload,
          select: {
            id: true,
            stripe_account_id: true,
            is_test_mode: true,
            currency: true,
            tax_rate: true,
            created_at: true
          }
        });
      }
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    return NextResponse.json({
      success: true,
      message: "Payment configuration saved.",
      config: result,
    });
  } catch (error: any) {
    console.error("[POST_PAYMENT_CONFIG_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to save payment configuration" }, { status: 500 });
  }
}, ["OWNER", "ADMIN"]);
