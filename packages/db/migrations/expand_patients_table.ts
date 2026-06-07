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
  console.log("Starting Patient expansion database migration...");

  const clinics = await publicClient.clinic.findMany();
  const schemasToMigrate = ["tenant_template", ...clinics.map(c => c.tenant_schema)];

  for (const schema of schemasToMigrate) {
    console.log(`\n========================================`);
    console.log(`Migrating schema: ${schema}`);
    console.log(`========================================`);

    try {
      console.log(`Adding columns to ${schema}.patients...`);
      
      await publicClient.$executeRaw`
        ALTER TABLE ${Prisma.raw(`"${schema}"`)}."patients" 
        ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'active',
        ADD COLUMN IF NOT EXISTS "dob" DATE,
        ADD COLUMN IF NOT EXISTS "gender" TEXT,
        ADD COLUMN IF NOT EXISTS "address" TEXT;
      `;

      console.log(`Creating ${schema}.patient_notes table...`);

      await publicClient.$executeRaw`
        CREATE TABLE IF NOT EXISTS ${Prisma.raw(`"${schema}"`)}."patient_notes" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "patient_id" UUID NOT NULL,
          "staff_id" UUID,
          "content" TEXT NOT NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "patient_notes_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "patient_notes_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES ${Prisma.raw(`"${schema}"`)}."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "patient_notes_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES ${Prisma.raw(`"${schema}"`)}."staff"("id") ON DELETE SET NULL ON UPDATE CASCADE
        );
      `;

      await publicClient.$executeRaw`
        CREATE INDEX IF NOT EXISTS "patient_notes_patient_id_idx" ON ${Prisma.raw(`"${schema}"`)}."patient_notes"("patient_id");
      `;

      console.log(`✅ Successfully migrated schema: ${schema}`);
    } catch (e: any) {
      console.log(`❌ Failed to migrate schema ${schema}: ${e.message}`);
    }
  }

  console.log("\nPatient expansion migration complete.");
}

main()
  .catch(console.error)
  .finally(() => publicClient.$disconnect());
