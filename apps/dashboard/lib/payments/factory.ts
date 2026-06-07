import { IPaymentGateway } from "./types";
import { StripeGateway } from "./providers/stripe";
import { getTenantClient } from "@book-in/db";

export async function getPaymentGateway(
  tenantSlug: string, 
  gatewayName: 'STRIPE' | 'PAYPAL' | 'RAZORPAY' | 'SQUARE'
): Promise<IPaymentGateway> {
  const tenantDb = getTenantClient(`tenant_${tenantSlug}`) as any;
  
  const configs = await tenantDb.$queryRawUnsafe(`
    SELECT credentials, is_active FROM tenant_payment_configs 
    WHERE gateway_name = $1 AND is_active = true LIMIT 1;
  `, gatewayName) as any[];

  if (configs.length === 0) {
    throw new Error(`Payment Gateway ${gatewayName} is not configured or is inactive for this tenant.`);
  }

  const { credentials } = configs[0];

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

