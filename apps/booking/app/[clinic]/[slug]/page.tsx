import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPublicClient, getTenantClient } from "@book-in/db";
import { findClinicBySlug } from "@/lib/clinic";
import { getCachedClinicConfig } from "@book-in/lib";
import { BookingPageClient } from "../BookingPageClient";
import { JsonCompiler } from "../../../components/engine/JsonCompiler";
import type { Clinic, Service } from "../../../types/booking";
import lz from "lz-string";
import { FileText, ArrowLeft } from "lucide-react";

export const runtime = "nodejs";

async function getPageData(clinicSlug: string, pageSlug: string) {
  try {
    // 1. Fetch clinic configuration
    const publicDb = getPublicClient();
    const clinic = await findClinicBySlug(publicDb, clinicSlug);

    if (!clinic) {
      return null;
    }

    const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

    // 2. Fetch page matching current slug
    const page = await tenantDb.page.findFirst({
      where: { slug: pageSlug, deleted_at: null },
    });

    if (!page) {
      return { clinic, page: null, services: [], customLayout: null };
    }

    // 3. Fetch services to supply to the scheduler widget if embedded
    const services = await tenantDb.service.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: "asc" },
    });

    const contentObj = page.content as { layout?: string } | null;
    const customLayout = contentObj?.layout || null;

    return {
      clinic,
      page,
      services,
      customLayout,
    };
  } catch (error) {
    console.error("Error fetching clinic page data:", error);
    return null;
  }
}

export default async function ClinicCustomPage({
  params,
}: {
  params: { clinic: string; slug: string };
}) {
  const { clinic: clinicSlug, slug: pageSlug } = params;

  // Protect reserving 'home' route collision if users hit direct slug paths
  if (pageSlug === "home") {
    // If they hit /home, we can serve it or let it handle home route
  }

  const data = await getPageData(clinicSlug, pageSlug);

  if (!data || !data.clinic) {
    notFound();
  }

  const { clinic, page, services, customLayout } = data;

  // Page not found layout
  if (!page) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          fontFamily: "Inter, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <FileText size={24} style={{ color: "#ef4444" }} />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
            Page Not Found
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px", lineHeight: "1.5" }}>
            The page you are looking for does not exist or has been removed by the administrator.
          </p>
          <a
            href={`/`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#E8334A",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(232, 51, 74, 0.2)",
              transition: "transform 0.2s ease",
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    );
  }

  const bookingWidget = (
    <BookingPageClient
      clinic={clinic as unknown as Clinic}
      services={services as unknown as Service[]}
    />
  );

  // Decompress layout strictly on the server
  let layoutTree = null;
  if (customLayout) {
    try {
      const decompressed = lz.decompressFromEncodedURIComponent(customLayout);
      if (decompressed) {
        layoutTree = JSON.parse(decompressed);
      }
    } catch (e) {
      console.error("[ClinicCustomPage Server] Failed to decompress layout tree:", e);
    }
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      {layoutTree ? (
        <JsonCompiler tree={layoutTree} bookingWidget={bookingWidget} />
      ) : (
        /* Fallback if page exists but layout is blank */
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            padding: "40px 24px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "12px" }}>
            {page.title}
          </h1>
          <p style={{ fontSize: "16px", color: "#6b7280", maxWidth: "600px", textAlign: "center", marginBottom: "32px", lineHeight: "1.6" }}>
            This page is successfully configured but has no custom layout blocks loaded yet. Create content using the Site Builder dashboard!
          </p>
          <div style={{ width: "100%", maxWidth: "800px" }}>{bookingWidget}</div>
        </div>
      )}
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
      }}
    >
      <div style={{ textAlign: "center", color: "#475569" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #e2e8f0",
            borderTopColor: "#E8334A",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ fontSize: "14px", fontWeight: 500 }}>Loading page content...</p>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}} />
    </div>
  );
}

// Generate SEO meta dynamically based on the Custom Page settings
export async function generateMetadata({
  params,
}: {
  params: { clinic: string; slug: string };
}) {
  const data = await getPageData(params.clinic, params.slug);

  if (!data || !data.clinic) {
    return {
      title: "Page Not Found",
    };
  }

  const { clinic, page } = data;

  if (!page) {
    return {
      title: `Not Found — ${clinic.name}`,
    };
  }

  return {
    title: `${page.title} — ${clinic.name}`,
    description: `Visit ${page.title} at ${clinic.name}`,
  };
}
