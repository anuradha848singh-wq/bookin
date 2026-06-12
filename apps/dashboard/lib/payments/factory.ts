import { IPaymentGateway } from "./types";
import { StripeGateway } from "./providers/stripe";
import { getTenantClient } from "@book-in/db";

export async function getPaymentGateway(
  tenantSlug: string, 
  gatewayName: 'STRIPE' | 'PAYPAL' | 'RAZORPAY' | 'SQUARE'
): Promise<IPaymentGateway> {
  const tenantDb = getTenantClient(`tenant_${tenantSlug}`) as any;
  
  const config = await tenantDb.tenantPaymentConfig.findFirst({
    where: { gateway_name: gatewayName, is_active: true },
    select: { credentials: true }
  });

  if (!config) {
    throw new Error(`Payment Gateway ${gatewayName} is not configured or is inactive for this tenant.`);
  }

  const { credentials } = config as any;

  switch (gatewayName) {
    case 'STRIPE':
      if (!credentials.secretKey) {
        throw new Error("Stripe secretKey is missing in tenant configuration");
      }
      return new StripeGateway(credentials.secretKey);
      
    case 'PAYPAL':
      // return new PayPalGateway(credentials.clientId, credentials.clientSecret);
      throw new Error("PayPal integration is pending implementation");
      
    case 'RAZORPAY':
      // return new RazorpayGateway(credentials.keyId, credentials.keySecret);
      throw new Error("Razorpay integration is pending implementation");
      
    case 'SQUARE':
      throw new Error("Square integration is pending implementation");
      
    default:
      throw new Error(`Unsupported payment gateway: ${gatewayName}`);
  }
}

