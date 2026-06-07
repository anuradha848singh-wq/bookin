import { getTenantClient } from "./packages/db/src/index.ts";

async function run() {
  const tenantDb = getTenantClient("tenant_76837f");
  const page = await tenantDb.page.findUnique({
    where: { slug: "home" }
  });
  console.log("FULL HOME LAYOUT FOR CLINIC AMAN:");
  console.log(JSON.stringify(page, null, 2));
}
run().catch(console.error);
