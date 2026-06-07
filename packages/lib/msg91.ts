import { validateEnv } from "@book-in/config";

interface SendOtpInput {
  phone: string;
  otp: string;
}

export async function sendOtpViaMSG91(input: SendOtpInput): Promise<void> {
  const { phone, otp } = input;
  const env = validateEnv();

  // Print in console for local debugging (user verification pathway)
  console.log(`
┌────────────────────────────────────────────────────────┐
│  📲 [DEVELOPMENT OTP DELIVERY]                          │
│  To: ${phone}                                        │
│  OTP: ${otp}                                           │
│  (Use this OTP in Step 4 to complete your booking!)   │
└────────────────────────────────────────────────────────┘
  `);

  // In production, trigger the MSG91 API call
  if (env.NODE_ENV === "production") {
    const msg91AuthKey = process.env.MSG91_AUTH_KEY;
    const msg91TemplateId = process.env.MSG91_TEMPLATE_ID;

    if (!msg91AuthKey || !msg91TemplateId) {
      console.warn("[MSG91] Production missing MSG91_AUTH_KEY or MSG91_TEMPLATE_ID. OTP send skipped.");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch("https://control.msg91.com/api/v5/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authkey": msg91AuthKey,
        },
        body: JSON.stringify({
          template_id: msg91TemplateId,
          mobile: phone,
          otp: otp,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.error(`[MSG91] Remote request failed with status: ${res.status}`);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.error("[MSG91] Request timed out after 3 seconds");
      } else {
        console.error("[MSG91] Failed to dispatch OTP request:", err);
      }
    }
  }
}
