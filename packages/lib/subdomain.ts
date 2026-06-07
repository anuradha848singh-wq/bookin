/**
 * Extracts the clinic slug from a host header.
 * Supports localhost and production domains, while filtering out reserved subdomains.
 */
export function extractClinicSlug(host: string): string | null {
  if (!host) return null;

  const hostWithoutPort = host.split(":")[0];
  const parts = hostWithoutPort.split(".");

  let clinicSlug: string | null = null;

  // Handle localhost (e.g. testclinic.localhost:3003)
  if (hostWithoutPort.endsWith("localhost") || hostWithoutPort.endsWith("127.0.0.1")) {
    if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "127") {
      clinicSlug = parts[0];
    }
  } else {
    // Handle production subdomains (e.g. testclinic.bookin.com)
    // Avoid matching vercel preview domains (e.g., *-git-*.vercel.app)
    const isVercelPreview = hostWithoutPort.includes("vercel.app") && parts.length > 2 && parts[0].includes("git");
    if (parts.length > 2 && !isVercelPreview) {
      clinicSlug = parts[0];
    }
  }

  // Skip reserved subdomains/slugs
  const reservedSlugs = ["www", "app", "api", "admin", "status", "mail", "cdn"];
  if (clinicSlug && reservedSlugs.includes(clinicSlug.toLowerCase())) {
    clinicSlug = null;
  }

  return clinicSlug;
}
