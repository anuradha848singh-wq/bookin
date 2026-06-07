import { NextResponse } from "next/server";
import { getPublicClient, cancelStalePendingBookings } from "@book-in/db";
import { findActiveClinics } from "@/lib/clinic";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Enforced CRON_SECRET auth check
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;
    
    if (!expectedSecret) {
      console.error("[CRON] CRON_SECRET env var is not set — refusing to run");
      return NextResponse.json({ success: false, error: "Cron not configured" }, { status: 500 });
    }
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Cron] Running unpaid booking cleanup...");

    const publicDb = getPublicClient();
    const clinics = await findActiveClinics(publicDb);

    const results: { [clinicSlug: string]: { cancelled: number } } = {};
    let totalCancelledCount = 0;

    for (const clinic of clinics) {
      try {
        console.log(`[Cron] Executing cleanups for clinic ${clinic.name} (${clinic.tenant_schema})...`);
        const cancelledCount = await cancelStalePendingBookings(clinic.tenant_schema);
        
        results[clinic.slug] = { cancelled: cancelledCount };
        totalCancelledCount += cancelledCount;
      } catch (err: any) {
        console.error(`[Cron] Failed to clean up clinic ${clinic.slug}:`, err);
        results[clinic.slug] = { cancelled: -1 }; // -1 denotes failure
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully checked bookings across ${clinics.length} clinics.`,
      totalCancelled: totalCancelledCount,
      details: results
    });
  } catch (err: any) {
    console.error("[Cron] Unhandled error during cleanups:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
