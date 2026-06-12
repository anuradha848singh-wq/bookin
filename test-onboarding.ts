import { registerTenant } from "./packages/db/src/index";

async function main() {
  try {
    const res = await registerTenant({
      name: "Test Clinic",
      slug: "test-clinic-" + Date.now(),
      email: "test-" + Date.now() + "@example.com",
      businessType: "MEDICAL_CLINIC",
      ownerUserId: "cm12345678901234567890123", 
      planId: "cm12345678901234567890123",
      stripeCustomerId: null,
      timezone: "UTC"
    });
    console.log("SUCCESS", res);
  } catch(e) {
    console.error("ERROR", e);
  }
}
main();
