import { PrismaClient } from "@prisma/client";

function getConnectionStringForSchema(schema: string): string {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);
  url.searchParams.set("connection_limit", "2");
  if (url.port === "6543") {
    url.searchParams.set("pgbouncer", "true");
  }
  return url.toString();
}

const publicClient = new PrismaClient({
  datasources: {
    db: { url: getConnectionStringForSchema("public") },
  },
});

async function main() {
  console.log("Starting migration to add locked_until to existing tenants...");
  const clinics = await publicClient.clinic.findMany();
  
  for (const clinic of clinics) {
    const schema = clinic.tenant_schema;
    console.log(`Processing schema: ${schema}`);
    try {
      await publicClient.$executeRawUnsafe(`
        ALTER TABLE "${schema}"."slots" ADD COLUMN IF NOT EXISTS "locked_until" TIMESTAMPTZ;
      `);
      console.log(`✅ Successfully added locked_until to ${schema}.slots`);
    } catch (e: any) {
      console.log(`❌ Failed to update ${schema}.slots: ${e.message}`);
    }
  }

  // Also update tenant_template
  try {
    await publicClient.$executeRawUnsafe(`
      ALTER TABLE "tenant_template"."slots" ADD COLUMN IF NOT EXISTS "locked_until" TIMESTAMPTZ;
    `);
    console.log(`✅ Successfully added locked_until to tenant_template.slots`);
  } catch (e: any) {
    console.log(`❌ Failed to update tenant_template.slots: ${e.message}`);
  }

  console.log("Migration complete.");
}

main().catch(console.error).finally(() => publicClient.$disconnect());
