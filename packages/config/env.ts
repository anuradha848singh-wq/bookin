import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

function loadWorkspaceEnvFiles(): void {
  if (typeof (globalThis as any).window !== "undefined") return;

  const candidates = [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "../../../.env.local"),
    path.resolve(__dirname, "../../../.env"),
  ];

  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      require("dotenv").config({ path: envPath, override: false });
    }
  }
}

loadWorkspaceEnvFiles();

const databaseUrl = z.string().url().superRefine((value, ctx) => {
  try {
    const parsed = new URL(value);
    if (parsed.hostname.includes("supabase.co") && parsed.port === "6543") {
      if (parsed.searchParams.get("pgbouncer") !== "true") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Supabase pooler DATABASE_URL must include pgbouncer=true",
        });
      }
      if (!parsed.searchParams.has("connection_limit")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Supabase pooler DATABASE_URL must include connection_limit",
        });
      }
    }
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "DATABASE_URL must be a valid URL",
    });
  }
});

export const envSchema = z.object({
  DATABASE_URL: databaseUrl,
  DIRECT_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_BASE_DOMAIN: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  MSG91_AUTH_KEY: z.string().min(1).optional(),
  MSG91_TEMPLATE_ID: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).optional(),
  GUEST_DEMO_EMAIL: z.string().email().optional(),
  GUEST_DEMO_PASSWORD: z.string().min(8).optional(),
  SENTRY_DSN: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates all required runtime environment variables once at startup.
 * Throws a clear boot-time error when configuration is incomplete.
 */
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw Object.assign(new Error("Invalid environment variables"), {
      code: "ENV_VALIDATION_FAILED",
      issues: result.error.flatten().fieldErrors,
    });
  }
  return result.data;
}
