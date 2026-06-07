import { IPaymentGateway } from "../types";
import Stripe from "stripe";

export class StripeGateway implements IPaymentGateway {
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: null as any,
      typescript: true,
    });
  }

  async createCheckoutSession(params: {
    bookingId: string;
    amount: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    metadata?: Record<string, string>;
  }): Promise<{ url: string; sessionId: string }> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: params.customerEmail,
      client_reference_id: params.bookingId,
      metadata: {
        bookingId: params.bookingId,
        ...params.metadata,
      },
      line_items: [
        {
          price_data: {
            currency: params.currency.toLowerCase(),
            product_data: {
              name: `Booking #${params.bookingId.substring(0, 8)}`,
            },
            unit_amount: Math.round(params.amount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    });

    if (!session.url) {
      throw new Error("Failed to generate Stripe checkout URL");
    }

    return {
      url: session.url,
      sessionId: session.id,
    };
  }

  async verifyWebhook(payload: any, signature: string, secret: string): Promise<any> {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, secret);
      return event;
    } catch (err: any) {
      throw new Error(`Webhook Error: ${err.message}`);
    }
  }

  async processRefund(transactionId: string, amount?: number): Promise<{ success: boolean; refundId?: string; error?: string }> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: transactionId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return { success: true, refundId: refund.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
