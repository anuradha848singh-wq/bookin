/**
 * migrate.ts
 * Runs all SQL migration files in packages/db/migrations/ against the database.
 * Usage: pnpm db:migrate
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { validateEnv } from "@book-in/config";

async function runMigrations() {
  const env = validateEnv();
  const client = new PrismaClient({
    datasources: { db: { url: env.DATABASE_URL } },
  });

  const migrationsDir = path.resolve(__dirname, "../migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort(); // ensures 001_, 002_, ... order

  console.log(`🚀 Running ${files.length} migration(s) from ${migrationsDir}\n`);

  try {
    await client.$connect();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      // Strip rollback comments and run only the "Up" section
      const upSection = sql.split("-- rollback:")[0] || "";

      console.log(`⚡ Applying: ${file}`);

      // Prisma's $executeRawUnsafe only accepts ONE statement at a time.
      // Split on ";" and run each non-empty statement individually.
      const statements = upSection
        .split(";")
        .map((s) =>
          // Strip leading comment lines (-- ...) so the filter below works correctly
          s
            .split("\n")
            .filter((line) => !line.trim().startsWith("--"))
            .join("\n")
            .trim()
        )
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        await client.$executeRawUnsafe(statement + ";");
      }

      console.log(`✅ Done: ${file}`);
    }

    console.log("\n🎉 All migrations applied successfully!");
  } catch (err) {
    console.error("\n❌ Migration failed:", err);
    process.exit(1);
  } finally {
    await client.$disconnect();
  }
}

runMigrations();
