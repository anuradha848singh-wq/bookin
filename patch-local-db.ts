import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching all clinics to patch tenant schemas...");
  const clinics = await prisma.clinic.findMany();
  
  for (const clinic of clinics) {
    const tenantSchema = clinic.tenant_schema;
    console.log(`\nPatching schema: ${tenantSchema}`);
    
    try {
      // Create Staff
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${tenantSchema}"."staff" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "first_name" TEXT NOT NULL,
          "last_name" TEXT NOT NULL,
          "email" TEXT,
          "phone" TEXT,
          "avatar_url" TEXT,
          "role" TEXT NOT NULL DEFAULT 'provider',
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "deleted_at" TIMESTAMPTZ,
          CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
        );
      `);
      console.log(` - Created staff table`);

      // Create StaffSchedule
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${tenantSchema}"."staff_schedules" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "staff_id" UUID NOT NULL,
          "day_of_week" INTEGER NOT NULL,
          "start_time" TEXT NOT NULL,
          "end_time" TEXT NOT NULL,
          "is_active" BOOLEAN NOT NULL DEFAULT true,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "staff_schedules_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "staff_schedules_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "${tenantSchema}"."staff"("id") ON DELETE CASCADE
        );
      `);
      console.log(` - Created staff_schedules table`);

      // Add provider_id to Slots
      try {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "${tenantSchema}"."slots" ADD COLUMN "provider_id" UUID;
        `);
        console.log(` - Added provider_id to slots`);
        
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "${tenantSchema}"."slots" ADD CONSTRAINT "slots_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "${tenantSchema}"."staff"("id") ON DELETE SET NULL;
        `);
        console.log(` - Added foreign key constraint to slots`);
      } catch (e: any) {
        if (e.message.includes("already exists")) {
          console.log(` - provider_id already exists on slots (skipping)`);
        } else {
          console.error(` - Error altering slots: ${e.message}`);
        }
      }

    } catch (e: any) {
      console.error(`Error patching schema ${tenantSchema}:`, e.message);
    }
  }

  console.log("\nDone!");
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
