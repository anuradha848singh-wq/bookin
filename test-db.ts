import { getTenantClient } from "./packages/db/src/index.ts";

async function run() {
  // Get tenant client for tenant_76837f
  const tenantDb = getTenantClient("tenant_76837f");
  
  try {
    const bookings = await tenantDb.booking.findMany({
      where: { deleted_at: null },
      include: { 
        slot: { 
          include: { 
            service: true 
          } 
        } 
      },
      orderBy: { 
        slot: { 
          starts_at: "asc" 
        } 
      }
    });
    console.log("Query completed successfully! Fetched bookings count:", bookings.length);
    if (bookings.length > 0) {
      console.log("First booking details:", JSON.stringify(bookings[0], null, 2));
    }
  } catch (error) {
    console.error("Query failed with error:", error);
  } finally {
    await tenantDb.$disconnect();
  }
}
run().catch(console.error);
