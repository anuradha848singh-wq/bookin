import { PrismaClient } from "@prisma/client";
import { BASELINE_SQL } from "./packages/db/src/baseline-sql.js";

async function main() {
  const pc = new PrismaClient();
  try {
    await pc.$transaction(async (tx) => {
      const tenantSchema = "tenant_test_" + Date.now();
      await tx.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;`);
      await tx.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${tenantSchema}" AUTHORIZATION CURRENT_USER;`);
      await tx.$executeRawUnsafe(`SET LOCAL search_path TO "${tenantSchema}", public;`);
      
      const cleanSql = BASELINE_SQL
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n');

      const statements = cleanSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const stmt of statements) {
        await tx.$executeRawUnsafe(stmt);
      }
    }, { timeout: 30000 });
    console.log("SUCCESS");
  } catch(e) {
    console.error("ERROR", e);
  } finally {
    await pc.$disconnect();
  }
}
main();
