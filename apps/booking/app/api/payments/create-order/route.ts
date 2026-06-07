import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { Prisma } from "@prisma/client";
import Stripe from "stripe";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateOrderSchema = z.object({
  tenant_slug: z.string(),
  booking_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }
    const { tenant_slug, booking_id } = parsed.data;
    
    const tenantDb = getTenantClient(`tenant_${tenant_slug}`) as any;
    
    const configs = await tenantDb.$queryRaw`SELECT * FROM tenant_payment_configs LIMIT 1;` as any[];
    if (configs.length === 0) return NextResponse.json({ success: false, error: "Payment not configured" }, { status: 400 });
    
    const config = configs[0];
    const stripeKey = config.is_test_mode ? config.stripe_test_key : config.stripe_live_key;
    if (!stripeKey) return NextResponse.json({ success: false, error: "Stripe key missing" }, { status: 400 });
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" });

    // Fetch Booking
    const bookings = await tenantDb.$queryRaw`SELECT * FROM bookings WHERE id = ${booking_id}::uuid LIMIT 1;` as any[];
    if (bookings.length === 0) return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    const booking = bookings[0];

    const amount = config.deposit_required ? (Number(booking.price) * config.deposit_percent) / 100 : Number(booking.price);
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: config.currency.toLowerCase(),
      metadata: { tenant_slug, booking_id: booking.id },
    });

    await tenantDb.$executeRaw`
      UPDATE bookings 
      SET stripe_payment_intent_id = ${paymentIntent.id}, payment_status = 'PENDING'
      WHERE id = ${booking.id}::uuid;
    `;

    return NextResponse.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
