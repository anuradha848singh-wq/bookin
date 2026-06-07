import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { sendOtpViaMSG91 } from "@book-in/lib"; // SMS trigger

// POST /api/webhooks/razorpay - Handles checkout payments from Razorpay
export async function POST(request: NextRequest) {
  const publicDb = getPublicClient();

  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is not configured.");
      return NextResponse.json({ success: false, error: "Configuration error" }, { status: 500 });
    }

    if (!signature) {
      console.warn("[Razorpay Webhook] Signature header is missing.");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 1. Verify Razorpay HMAC-SHA256 Signature BEFORE doing any database/payload processing
    const expectedSignature = createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("[Razorpay Webhook] HMAC Signature mismatch detected.");
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`[Razorpay Webhook] Signature verified. Event received: ${event}`);

    // Phase 3 Rules: only process 'payment.captured' events
    if (event !== "payment.captured") {
      return NextResponse.json({ success: true, message: "Ignored event" });
    }

    const payment = payload.payload.payment.entity;
    const paymentId = payment.id;
    const amount = parseFloat(payment.amount) / 100; // Razorpay sends amount in paise

    // Retrieve custom fields (we pass booking_id and clinic_id inside custom_fields on Razorpay setup)
    const customFields = payment.notes || {};
    const bookingId = customFields.booking_id;
    const clinicId = customFields.clinic_id; // Maps to tenantId

    if (!bookingId || !clinicId) {
      console.warn("[Razorpay Webhook] Missing booking_id or clinic_id notes inside payload:", customFields);
      return NextResponse.json({ success: false, error: "Missing metadata" }, { status: 400 });
    }

    // 2. Fetch clinic info dynamically from the public schema registry
    const clinic = await publicDb.tenant.findUnique({ where: { id: clinicId } });

    if (!clinic) {
      console.error(`[Razorpay Webhook] Clinic not found for ID: ${clinicId}`);
      return NextResponse.json({ success: false, error: "Clinic registry missing" }, { status: 404 });
    }

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    // 3. Idempotency Check: check if the payment is already recorded to prevent double updates
    const existingConfirmed = await tenantDb.booking.findFirst({
      where: { id: bookingId, status: "CONFIRMED" },
    });

    if (existingConfirmed) {
      console.log(`[Razorpay Webhook] Booking ${bookingId} already confirmed. Responding 200 OK.`);
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    const booking = await tenantDb.booking.findFirst({
      where: { id: bookingId, deleted_at: null },
      include: { client: true },
    });

    if (!booking) {
      console.error(`[Razorpay Webhook] Booking not found for ID: ${bookingId}`);
      return NextResponse.json({ success: false, error: "Booking record missing" }, { status: 404 });
    }

    if (booking.status !== "PENDING") {
      console.warn(`[Razorpay Webhook] Booking is not pending (status: ${booking.status}).`);
      return NextResponse.json({ success: true, message: "Booking is not in pending state" });
    }

    // 4. Update booking in tenant DB
    console.log(`[Razorpay Webhook] Executing transaction to confirm Booking ${bookingId}...`);
    
    await tenantDb.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED", payment_status: "PAID" },
    });
    
    // Also record the payment
    await tenantDb.payment.create({
      data: {
        booking_id: bookingId,
        client_id: booking.client_id,
        amount: amount,
        currency: "INR",
        provider: "RAZORPAY",
        provider_transaction_id: paymentId,
        status: "COMPLETED"
      }
    });

    console.log(`[Razorpay Webhook] Booking ${bookingId} confirmed successfully!`);

    // 5. Non-Blocking Async Notification Dispatches
    // Using setTimeout to run outside the thread lifecycle and instantly release Razorpay response
    setTimeout(async () => {
      try {
        console.log(`[Notification Alert] Triggering confirmation notifications to patient/owner async...`);

        // Send SMS to Patient
        if (booking.client?.phone) {
          sendOtpViaMSG91({
            phone: booking.client.phone,
            otp: `Your appointment at ${clinic.name} is confirmed for ${new Date(booking.starts_at).toLocaleDateString()} at ${new Date(booking.starts_at).toLocaleTimeString()}.`,
          });
        }

        console.log("[Notification Alert] Async SMS alerts dispatched successfully.");
      } catch (logErr) {
        console.error("[Notification Alert] Failed to log notifications to log table:", logErr);
      }
    }, 10);

    // Instantly return 200 OK within the 5-second deadline
    return NextResponse.json({
      success: true,
      message: "Booking confirmed successfully",
    });
  } catch (err: any) {
    console.error("[Razorpay Webhook] Fatal webhook error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
