import { NextResponse } from "next/server";
import { getPaymentGateway } from "@/lib/payments/factory";
import { getTenantClient } from "@book-in/db";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { booking_id, gateway_name, tenant_slug, success_url, cancel_url } = body;

    if (!booking_id || !gateway_name || !tenant_slug || !success_url || !cancel_url) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const tenantDb = getTenantClient(`tenant_${tenant_slug}`) as any;

    // 1. Fetch the booking to determine the amount to charge
    const bookings = await tenantDb.$queryRaw`
      SELECT b.id, b.price, b.payment_status, c.email as client_email
      FROM bookings b
      LEFT JOIN clients c ON b.client_id = c.id
      WHERE b.id = ${booking_id}::uuid LIMIT 1;
    ` as any[];

    if (bookings.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookings[0];

    if (booking.payment_status === 'PAID') {
      return NextResponse.json({ error: "Booking is already paid" }, { status: 400 });
    }

    if (Number(booking.price) <= 0) {
      return NextResponse.json({ error: "Booking price is zero, no payment required" }, { status: 400 });
    }

    // 2. Initialize the correct gateway using our Abstraction Factory
    const gateway = await getPaymentGateway(tenant_slug, gateway_name);

    // 3. Create the Hosted Checkout Session
    const session = await gateway.createCheckoutSession({
      bookingId: booking.id,
      amount: Number(booking.price),
      currency: "usd", // Could be dynamic from tenant settings
      successUrl: success_url,
      cancelUrl: cancel_url,
      customerEmail: booking.client_email,
    });

    // 4. (Optional) Log the intent ID if you want to track it
    if (gateway_name === 'STRIPE') {
      await tenantDb.$executeRaw`
        UPDATE bookings SET stripe_payment_intent_id = ${session.sessionId} WHERE id = ${booking.id}::uuid;
      `;
    }

    return NextResponse.json({ 
      success: true, 
      checkout_url: session.url,
      session_id: session.sessionId
    });

  } catch (error: any) {
    console.error("[POST_CHECKOUT_ERROR]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

