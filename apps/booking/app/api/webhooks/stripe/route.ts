import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTenantClient } from "@book-in/db";
import { Prisma } from "@prisma/client";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const sig = request.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

    const bodyText = await request.text();
    const rawEvent = JSON.parse(bodyText);
    const tenant_slug = rawEvent?.data?.object?.metadata?.tenant_slug;
    
    if (!tenant_slug) {
      // Missing tenant info, just ack so stripe stops retrying
      return NextResponse.json({ received: true });
    }

    const tenantDb = getTenantClient(`tenant_${tenant_slug}`) as any;
    const configs = await tenantDb.$queryRaw`SELECT * FROM tenant_payment_configs LIMIT 1;` as any[];
    if (configs.length === 0) return NextResponse.json({ error: "Tenant config not found" }, { status: 400 });
    
    const config = configs[0];
    const stripeKey = config.is_test_mode ? config.stripe_test_key : config.stripe_live_key;
    const webhookSecret = config.stripe_webhook_secret;

    if (!stripeKey || !webhookSecret) return NextResponse.json({ error: "Stripe not fully configured" }, { status: 400 });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" });
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(bodyText, sig, webhookSecret);
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata.booking_id;
      
      if (bookingId) {
        // Update booking status
        await tenantDb.$executeRaw`
          UPDATE bookings 
          SET payment_status = 'PAID', updated_at = NOW(), deposit_paid = ${paymentIntent.amount / 100}
          WHERE id = ${bookingId}::uuid AND stripe_payment_intent_id = ${paymentIntent.id};
        `;
        
        // Log transaction idempotently
        await tenantDb.$executeRaw`
          INSERT INTO payments (booking_id, stripe_payment_id, type, status, amount, currency)
          VALUES (${bookingId}::uuid, ${paymentIntent.id}, 'BOOKING_PAYMENT', 'SUCCEEDED', ${paymentIntent.amount / 100}, ${paymentIntent.currency})
          ON CONFLICT (stripe_payment_id) DO NOTHING;
        `;
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata.booking_id;
      
      if (bookingId) {
        await tenantDb.$executeRaw`
          UPDATE bookings 
          SET payment_status = 'FAILED', updated_at = NOW()
          WHERE id = ${bookingId}::uuid AND stripe_payment_intent_id = ${paymentIntent.id};
        `;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
