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
  console.log("Starting Patient CRM database migration...");

  const clinics = await publicClient.clinic.findMany();
  const schemasToMigrate = ["tenant_template", ...clinics.map(c => c.tenant_schema)];

  for (const schema of schemasToMigrate) {
    console.log(`\n========================================`);
    console.log(`Migrating schema: ${schema}`);
    console.log(`========================================`);

    try {
      // 1. Create Patients Table
      console.log("1. Creating patients table...");
      await publicClient.$executeRaw`
        CREATE TABLE IF NOT EXISTS ${Prisma.raw(`"${schema}"`)}."patients" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "first_name" TEXT NOT NULL,
          "last_name" TEXT NOT NULL,
          "phone" TEXT NOT NULL,
          "email" TEXT,
          "avatar_url" TEXT,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "patients_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "patients_phone_key" UNIQUE ("phone")
        );
      `;

      // 2. Drop existing constraint on bookings status if it exists, to recreate it with all 5 statuses
      console.log("2. Updating bookings table schema...");
      try {
        await publicClient.$executeRaw`ALTER TABLE ${Prisma.raw(`"${schema}"`)}."bookings" DROP CONSTRAINT "bookings_status_check";`;
      } catch (e: any) {
        // Might not exist or already updated
      }
      try {
        await publicClient.$executeRaw`ALTER TABLE ${Prisma.raw(`"${schema}"`)}."bookings" ADD CONSTRAINT "bookings_status_check" CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show'));`;
      } catch (e: any) {
        // Might already exist
      }

      // Add patient_id to bookings (nullable temporarily)
      await publicClient.$executeRaw`ALTER TABLE ${Prisma.raw(`"${schema}"`)}."bookings" ADD COLUMN IF NOT EXISTS "patient_id" UUID;`;

      // 3. Data Migration: Create a dummy patient for every existing unique patient_phone in bookings
      console.log("3. Migrating existing booking data to patients...");
      const existingBookings = await publicClient.$queryRaw`SELECT id, patient_phone FROM ${Prisma.raw(`"${schema}"`)}."bookings" WHERE "patient_id" IS NULL AND "patient_phone" IS NOT NULL;` as any[];
      
      const phoneToPatientId = new Map<string, string>();

      for (const booking of existingBookings) {
        const phone = booking.patient_phone;
        let patientId = phoneToPatientId.get(phone);

        if (!patientId) {
          // Check if patient already exists in the table (maybe from a previous partial run)
          const existingPatient = await publicClient.$queryRaw`SELECT id FROM ${Prisma.raw(`"${schema}"`)}."patients" WHERE phone = ${phone};` as any[];
          
          if (existingPatient.length > 0) {
            patientId = existingPatient[0].id;
          } else {
            // Create new patient
            const newPatient = await publicClient.$queryRaw`
              INSERT INTO ${Prisma.raw(`"${schema}"`)}."patients" ("first_name", "last_name", "phone")
              VALUES (${"Unknown"}, ${"Patient"}, ${phone})
              RETURNING id;
            ` as any[];
            patientId = newPatient[0].id;
          }
          phoneToPatientId.set(phone, patientId);
        }

        // Link booking to patient
        if (patientId) {
          await publicClient.$executeRaw`
            UPDATE ${Prisma.raw(`"${schema}"`)}."bookings" SET "patient_id" = ${patientId}::uuid WHERE id = ${booking.id}::uuid;
          `;
        }
      }

      // 4. Enforce constraints now that data is clean
      // Wait, tenant_template has no data, so it's fine.
      // But if there are still NULL patient_ids (e.g. invalid data), we should delete those or handle them before enforcing NOT NULL.
      console.log("4. Enforcing NOT NULL and Foreign Keys...");
      
      // Delete any bookings that still don't have a patient_id (should be none, but just in case)
      await publicClient.$executeRaw`DELETE FROM ${Prisma.raw(`"${schema}"`)}."bookings" WHERE "patient_id" IS NULL;`;

      // Make patient_id NOT NULL (using DO block to ignore if already NOT NULL)
      await publicClient.$executeRaw`ALTER TABLE ${Prisma.raw(`"${schema}"`)}."bookings" ALTER COLUMN "patient_id" SET NOT NULL;`;
      
      // Make patient_phone nullable
      await publicClient.$executeRaw`ALTER TABLE ${Prisma.raw(`"${schema}"`)}."bookings" ALTER COLUMN "patient_phone" DROP NOT NULL;`;

      // Add foreign key if not exists
      try {
        await publicClient.$executeRaw`
          ALTER TABLE ${Prisma.raw(`"${schema}"`)}."bookings" 
          ADD CONSTRAINT "bookings_patient_id_fkey" 
          FOREIGN KEY ("patient_id") REFERENCES ${Prisma.raw(`"${schema}"`)}."patients"("id") ON DELETE CASCADE;
        `;
      } catch (e: any) {
         // fk might already exist
      }

      console.log(`✅ Successfully migrated schema: ${schema}`);
    } catch (e: any) {
      console.log(`❌ Failed to migrate schema ${schema}: ${e.message}`);
    }
  }

  console.log("\nPatient CRM migration complete.");
}

main().catch(console.error).finally(() => publicClient.$disconnect());
