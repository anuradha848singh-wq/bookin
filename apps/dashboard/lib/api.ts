import { NextResponse, type NextRequest } from "next/server";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { z, type ZodSchema } from "zod";
import { getPublicClient } from "@book-in/db";
import { checkIpRateLimit } from "@book-in/lib";
import { getDashboardAuth } from "@/lib/auth";

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiSuccessBody<T> {
  success: true;
  data: T;
}

export interface ApiSessionContext { supabase: SupabaseClient;
  session: Session;
  user: User;
  
}

interface ApiHandlerContext { supabase?: SupabaseClient;
  session?: Session;
  user?: User;
  
}

interface ApiHandlerOptions {
  route: string;
  requireAuth?: boolean;
  rateLimit?: {
    key: string;
    limit: number;
    windowSeconds: number;
  };
}

class ExpectedApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  headers?: HeadersInit;

  constructor(code: string, message: string, status: number, details?: unknown, headers?: HeadersInit) {
    super(message);
    this.name = "ExpectedApiError";
    this.code = code;
    this.status = status;
    if (details !== undefined) this.details = details;
    if (headers !== undefined) this.headers = headers;
  }
}

function logEvent(level: "info" | "warn" | "error", message: string, context: Record<string, unknown>): void {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  }));
}

function isPrismaConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const metadata = error as Error & { code?: string };
  return (
    metadata.code === "P1001" ||
    metadata.code === "P1002" ||
    metadata.code === "P1008" ||
    error.message.toLowerCase().includes("database") ||
    error.message.toLowerCase().includes("connection")
  );
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

function isCrossOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).host !== request.nextUrl.host;
  } catch {
    return true;
  }
}

export function sanitizeString(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

export const sanitizedString = (min = 1, max = 500) =>
  z.string().transform(sanitizeString).pipe(z.string().min(min).max(max));

export const optionalSanitizedString = (max = 500) =>
  z.string().transform(sanitizeString).pipe(z.string().max(max)).optional();

export function apiError(code: string, message: string, status: number, details?: unknown, headers?: HeadersInit) {
  return NextResponse.json<ApiErrorBody>(
    { success: false, error: { code, message, details } },
    { status, ...(headers !== undefined && { headers }) }
  );
}

export function apiOk<T extends Record<string, unknown>>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, ...data }, init);
}

export function methodNotAllowed(methods: string[]) {
  return apiError("METHOD_NOT_ALLOWED", "Method not allowed", 405, undefined, {
    Allow: methods.join(", "),
  });
}

export async function parseJsonBody<T>(request: NextRequest, schema: ZodSchema<T>): Promise<T> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new ExpectedApiError("UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json", 415);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch (error) {
    throw new ExpectedApiError("INVALID_JSON", "Request body must be valid JSON", 400, {
      parserError: error instanceof Error ? error.message : String(error),
    });
  }

  const parsed = schema.safeParse(rawBody);
  if (!parsed.success) {
    throw new ExpectedApiError("VALIDATION_ERROR", "Invalid request body", 400, parsed.error.flatten());
  }

  return parsed.data;
}

export async function requireSession(): Promise<ApiSessionContext> {
  const { session, supabase, user } = await getDashboardAuth();
  if (!user) {
    throw new ExpectedApiError("UNAUTHORIZED", "Unauthorized", 401);
  }

  return {
    session: session ?? ({ user } as Session), supabase,
    user,
    
  };
}

export async function getOwnerClinic(userId: string) {
  const publicDb = getPublicClient() as any;
  const clinic = await publicDb.tenant.findFirst({
    where: { users: { some: { userId } }, deletedAt: null },
  });

  if (!clinic) {
    throw new ExpectedApiError("CLINIC_NOT_FOUND", "Clinic not found", 404);
  }

  return clinic;
}

export async function enforceRateLimit(request: NextRequest, routeKey: string, limit: number, windowSeconds: number): Promise<void> {
  const ip = getClientIp(request);
  const result = await checkIpRateLimit(ip, routeKey, limit, windowSeconds);
  if (!result.allowed) {
    throw new ExpectedApiError("RATE_LIMITED", "Too many requests. Please try again later.", 429, undefined, {
      "Retry-After": String(windowSeconds),
    });
  }
}

export async function withApiHandler(
  request: NextRequest,
  options: ApiHandlerOptions,
  handler: (context: ApiHandlerContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const startedAt = Date.now();
  let response: NextResponse;
  let userId: string | null = null;

  try {
    if (options.requireAuth && isCrossOrigin(request)) {
      throw new ExpectedApiError("CROSS_ORIGIN_REJECTED", "Cross-origin requests are not allowed", 403);
    }

    if (options.rateLimit) {
      await enforceRateLimit(
        request,
        options.rateLimit.key,
        options.rateLimit.limit,
        options.rateLimit.windowSeconds
      );
    }

    const authContext: ApiHandlerContext = options.requireAuth ? await requireSession() : {};
    userId = authContext.user?.id ?? null;
    response = await handler(authContext);
  } catch (error) {
    if (error instanceof ExpectedApiError) {
      response = apiError(error.code, error.message, error.status, error.details, error.headers);
    } else if (isPrismaConnectionError(error)) {
      response = apiError("DATABASE_UNAVAILABLE", "Database temporarily unavailable", 503, undefined, {
        "Retry-After": "5",
      });
      logEvent("error", "api.database_error", {
        route: options.route,
        method: request.method,
        userId,
        error: error instanceof Error ? { name: error.name, message: error.message } : String(error),
      });
    } else {
      response = apiError("INTERNAL_SERVER_ERROR", "Internal server error", 500);
      logEvent("error", "api.unhandled_error", {
        route: options.route,
        method: request.method,
        userId,
        error: error instanceof Error ? { name: error.name, message: error.message } : String(error),
      });
    }
  }

  logEvent(response.status >= 500 ? "error" : "info", "api.request", {
    route: options.route,
    method: request.method,
    userId,
    durationMs: Date.now() - startedAt,
    statusCode: response.status,
  });

  return response;
}

