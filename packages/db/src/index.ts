import { PrismaClient, Prisma } from "@prisma/client";
import { validateEnv } from "@book-in/config";
import * as crypto from "crypto";

import * as fs from "fs";
import * as path from "path";
import { BASELINE_SQL } from "./baseline-sql";


const globalForPrisma = globalThis as unknown as {
  publicClient: PrismaClient | undefined;
  tenantClients: Map<string, { client: PrismaClient; lastUsed: number }> | undefined;
};

// Singleton public client
let publicClient: PrismaClient | null = globalForPrisma.publicClient || null;

// Tenant clients LRU cache
const tenantClients = globalForPrisma.tenantClients || new Map<string, { client: PrismaClient; lastUsed: number }>();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.tenantClients = tenantClients;
}
const MAX_TENANT_CLIENTS = 20;

process.on("beforeExit", async () => {
  if (publicClient) {
    await publicClient.$disconnect().catch(console.error);
  }
  for (const [, entry] of tenantClients) {
    await entry.client.$disconnect().catch(console.error);
  }
  tenantClients.clear();
});

// Helper to construct connection URL with specific schema and connection limit
function getConnectionStringForSchema(schema: string): string {
  const env = validateEnv();
  const url = new URL(env.DATABASE_URL);
  
  // Set our specific schema and limits
  url.searchParams.set("schema", schema);
  url.searchParams.set("connection_limit", "2");
  url.searchParams.set("connect_timeout", "5");
  
  if (url.port === "6543") {
    url.searchParams.set("pgbouncer", "true");
  }

  return url.toString();
}

export function getPublicClient(): PrismaClient {
  if (!publicClient) {
    const url = getConnectionStringForSchema("global"); // UPDATED to "global"
    publicClient = new PrismaClient({
      datasources: {
        db: { url },
      },
    });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.publicClient = publicClient;
    }
  }
  return publicClient;
}

export function getTenantClient(schemaName: string): PrismaClient {
  const now = Date.now();
  const cached = tenantClients.get(schemaName);
  
  if (cached) {
    cached.lastUsed = now;
    return cached.client;
  }

  // Evict LRU client if max limit reached
  if (tenantClients.size >= MAX_TENANT_CLIENTS) {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, val] of tenantClients.entries()) {
      if (val.lastUsed < oldestTime) {
        oldestTime = val.lastUsed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const toDisconnect = tenantClients.get(oldestKey);
      if (toDisconnect) {
        tenantClients.delete(oldestKey);
        toDisconnect.client.$disconnect().catch(console.error);
      }
    }
  }

  const url = getConnectionStringForSchema(schemaName);
  const client = new PrismaClient({
    datasources: {
      db: { url },
    },
  });

  tenantClients.set(schemaName, { client, lastUsed: now });
  return client;
}

// Generate 6 character random nanoid
function generateNanoid6(): string {
  return crypto.randomBytes(3).toString("hex");
}

export function generateSlug(name: string): string {
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  slug = slug.replace(/^-+|-+$/g, "");
  
  if (!slug) {
    slug = "tenant";
  }
  
  const suffix = generateNanoid6();
  return `${slug}-${suffix}`;
}

export async function registerTenantAndCreateSchema(data: {
  name: string;
  email: string;
  phone?: string;
  businessType: any;
  planId: string;
  ownerUserId: string;   // Supabase auth user UUID
  ownerEmail: string;   // Required to upsert GlobalUser row
  ownerName?: string;
}) {
  const pc = getPublicClient();
  const slug = generateSlug(data.name);
  const tenantSchema = `tenant_${slug}`;

  if (!/^[a-z0-9_-]+$/.test(tenantSchema)) {
    throw new Error("Invalid schema name");
  }

  console.log("Starting new tenant registration", { slug, email: data.email });

  // Ensure pg_trgm extension exists in public schema so all tenants can resolve gin_trgm_ops
  try {
    await pc.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA public;`);
  } catch (extError) {
    console.warn("Could not ensure pg_trgm extension exists in public schema", { error: extError });
  }

  try {
    const result = await pc.$transaction(async (tx: any) => {
      // 0. Ensure the free plan exists (idempotent upsert — no seeding step required)
      await tx.plan.upsert({
        where: { id: "free" },
        update: {},
        create: {
          id: "free",
          name: "Free",
          slug: "free",
          priceMonthly: 0,
          priceYearly: 0,
          maxStaff: 3,
          maxLocations: 1,
          maxBookingsPerMonth: 100,
          maxClients: 200,
          maxStorageGb: 1,
          features: {},
          isActive: true,
          displayOrder: 0,
        },
      });

      // 1. Upsert GlobalUser so TenantUser FK is satisfied.
      //    Supabase auth.users and global.GlobalUser are separate tables;
      //    we mirror the identity here on first provisioning.
      await tx.globalUser.upsert({
        where: { id: data.ownerUserId },
        update: { lastLoginAt: new Date() },
        create: {
          id: data.ownerUserId,
          email: data.ownerEmail,
          fullName: data.ownerName ?? null,
          emailVerified: true,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(),
        },
      });

      // 2. Create Tenant (status PROVISIONING)
      const tenant = await tx.tenant.create({
        data: {
          name: data.name,
          slug,
          email: data.email,
          phone: data.phone || null,
          businessType: data.businessType,
          schemaStatus: "PROVISIONING",
          planId: data.planId,
          users: {
            create: {
              userId: data.ownerUserId,
              role: "OWNER",
              isOwner: true,
              inviteStatus: "ACCEPTED",
              joinedAt: new Date()
            }
          }
        }
      });

      // 1.5. Ensure necessary Postgres extensions are active in the public schema
      await tx.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;`);
      await tx.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;`);

      // 2. Create actual database schema using raw SQL
      await tx.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${tenantSchema}" AUTHORIZATION CURRENT_USER;`);
      
      // 3. Ensure the current database user has USAGE on the schema.
      await tx.$executeRawUnsafe(`GRANT USAGE ON SCHEMA "${tenantSchema}" TO CURRENT_USER;`);

      // 4. Load and apply baseline.sql
      const baselineSql = BASELINE_SQL;

      // The baseline.sql is written generically without schema prefixes.
      // We set search_path so the script applies to this specific schema, with fallback to public for extensions.
      await tx.$executeRawUnsafe(`SET LOCAL search_path TO "${tenantSchema}", public;`);

      // Filter out standalone comment lines to prevent incorrect splitting and statement skipping
      const cleanSql = baselineSql
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n');

      // Split clean SQL into individual statements by semicolon
      const statements = cleanSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const stmt of statements) {
        await tx.$executeRawUnsafe(stmt);
      }

      // 5. Update tenant status to READY
      const updatedTenant = await tx.tenant.update({
        where: { id: tenant.id },
        data: { schemaStatus: "READY", status: "ACTIVE" }
      });

      return updatedTenant;
    }, {
      maxWait: 5000,
      timeout: 30000, // 30s timeout for massive DDL
    });

    console.log("Tenant schema provisioned successfully", { tenantId: result.id, tenantSchema });
    return result;

  } catch (error: any) {
    console.error("Failed to register tenant", error);
    throw error;
  }
}

export * from "./slots";
