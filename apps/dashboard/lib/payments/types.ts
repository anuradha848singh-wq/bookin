export interface IPaymentGateway {
  /**
   * Initializes a checkout session for a booking and returns the Hosted Checkout URL.
   */
  createCheckoutSession(params: {
    bookingId: string;
    amount: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    metadata?: Record<string, string>;
  }): Promise<{ url: string; sessionId: string }>;

  /**
   * Verifies an incoming webhook payload.
   */
  verifyWebhook(payload: any, signature: string, secret: string): Promise<any>;

  /**
   * Processes a refund for a previously successful transaction.
   */
  processRefund(transactionId: string, amount?: number): Promise<{ success: boolean; refundId?: string; error?: string }>;
}
