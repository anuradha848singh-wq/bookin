import type { PrismaClient } from "@prisma/client";

export type LegacyClinic = {
  id: string;
  name: string;
  slug: string;
  tenant_schema: string;
  theme: Record<string, unknown> | null;
  logo_url: string | null;
  tagline: string | null;
  whatsapp_number: string | null;
  show_powered_by: boolean;
};

function toLegacyClinic(tenant: any): LegacyClinic {
  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    tenant_schema: `tenant_${tenant.slug}`,
    theme: {
      logo_url: tenant.logoUrl ?? null,
      cover_image_url: tenant.coverImageUrl ?? null,
      primaryColor: "#3b82f6",
    },
    logo_url: tenant.logoUrl ?? null,
    tagline: null,
    whatsapp_number: tenant.phone ?? null,
    show_powered_by: true,
  };
}

export async function findClinicBySlug(publicDb: PrismaClient, slug: string): Promise<LegacyClinic | null> {
  const tenant = await publicDb.tenant.findUnique({ where: { slug } });
  return tenant ? toLegacyClinic(tenant) : null;
}

export async function findClinicById(publicDb: PrismaClient, id: string): Promise<LegacyClinic | null> {
  const tenant = await publicDb.tenant.findUnique({ where: { id } });
  return tenant ? toLegacyClinic(tenant) : null;
}

export async function findActiveClinics(publicDb: PrismaClient): Promise<LegacyClinic[]> {
  const tenants = await publicDb.tenant.findMany({
    where: { status: "ACTIVE", schemaStatus: "READY" },
  });
  return tenants.map(toLegacyClinic);
}
