import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dns from "dns/promises";
import { getStudioAuth, unauthorizedResponse } from "@/lib/auth";
import { logError } from "@book-in/lib";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { user } = await getStudioAuth();
    if (!user) {
      return unauthorizedResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json({ success: false, message: "Missing domain parameter" }, { status: 400 });
    }

    // Required values from Topbar.tsx DNS Configuration Helper
    const REQUIRED_A_RECORD = "76.76.21.21";
    const REQUIRED_CNAME = "cname.bookin.com";

    const isWww = domain.startsWith("www.");
    let success = false;
    let message = "";

    try {
      if (isWww) {
        // For www subdomains, we check CNAME
        const cnames = await dns.resolveCname(domain);
        if (cnames.includes(REQUIRED_CNAME)) {
          success = true;
          message = "CNAME record verified successfully!";
        } else {
          success = false;
          message = `CNAME found, but points to ${cnames[0]} instead of ${REQUIRED_CNAME}.`;
        }
      } else {
        // For root domains, we check A record
        const aRecords = await dns.resolve4(domain);
        if (aRecords.includes(REQUIRED_A_RECORD)) {
          success = true;
          message = "A record verified successfully!";
        } else {
          success = false;
          message = `A record found, but points to ${aRecords[0]} instead of ${REQUIRED_A_RECORD}.`;
        }
      }
    } catch (dnsError: any) {
      if (dnsError.code === "ENOTFOUND" || dnsError.code === "ENODATA") {
        success = false;
        message = `No DNS records found for ${domain}. It might take up to 24 hours to propagate.`;
      } else {
        success = false;
        message = `DNS lookup failed: ${dnsError.message}`;
      }
    }

    return NextResponse.json({
      success,
      message
    });

  } catch (err: any) {
    logError("[Builder Domain Verify API] Failed to verify domain", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
