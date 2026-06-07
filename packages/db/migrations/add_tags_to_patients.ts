import { PrismaClient, Prisma } from "@prisma/client";

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
  console.log("Starting Patient tags database migration...");

  const clinics = await publicClient.clinic.findMany();
  const schemasToMigrate = ["tenant_template", ...clinics.map(c => c.tenant_schema)];

  for (const schema of schemasToMigrate) {
    console.log(`\n========================================`);
    console.log(`Migrating schema: ${schema}`);
    console.log(`========================================`);

    try {
      console.log(`Adding 'tags' column to ${schema}.patients...`);
      
      // Add the tags column if it doesn't exist
      await publicClient.$executeRaw`
        ALTER TABLE ${Prisma.raw(`"${schema}"`)}."patients" 
        ADD COLUMN IF NOT EXISTS "tags" TEXT[] NOT NULL DEFAULT '{}';
      `;

      console.log(`✅ Successfully migrated schema: ${schema}`);
    } catch (e: any) {
      console.log(`❌ Failed to migrate schema ${schema}: ${e.message}`);
    }
  }

  console.log("\nPatient tags migration complete.");
}

main()
  .catch(console.error)
  .finally(() => publicClient.$disconnect());
