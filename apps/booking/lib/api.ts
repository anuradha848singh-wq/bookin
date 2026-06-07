import { NextResponse, type NextRequest } from "next/server";
import { z, type ZodSchema } from "zod";
import { checkIpRateLimit } from "@book-in/lib";

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

interface ApiHandlerOptions {
  route: string;
  publicCors?: boolean;
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
    this.details = details;
    this.headers = headers;
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

export function sanitizeString(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

export const sanitizedString = (min = 1, max = 500) =>
  z.string().transform(sanitizeString).pipe(z.string().min(min).max(max));

export function apiError(code: string, message: string, status: number, details?: unknown, headers?: HeadersInit) {
  return NextResponse.json<ApiErrorBody>(
    { success: false, error: { code, message, details } },
    { status, headers }
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

export async function enforceRateLimit(request: NextRequest, routeKey: string, limit: number, windowSeconds: number): Promise<void> {
  const result = await checkIpRateLimit(getClientIp(request), routeKey, limit, windowSeconds);
  if (!result.allowed) {
    throw new ExpectedApiError("RATE_LIMITED", "Too many requests. Please try again later.", 429, undefined, {
      "Retry-After": String(windowSeconds),
    });
  }
}

export async function withApiHandler(
  request: NextRequest,
  options: ApiHandlerOptions,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const startedAt = Date.now();
  let response: NextResponse;

  try {
    if (options.rateLimit) {
      await enforceRateLimit(
        request,
        options.rateLimit.key,
        options.rateLimit.limit,
        options.rateLimit.windowSeconds
      );
    }

    response = await handler();
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
        error: error instanceof Error ? { name: error.name, message: error.message } : String(error),
      });
    } else {
      response = apiError("INTERNAL_SERVER_ERROR", "Internal server error", 500);
      logEvent("error", "api.unhandled_error", {
        route: options.route,
        method: request.method,
        error: error instanceof Error ? { name: error.name, message: error.message } : String(error),
      });
    }
  }

  if (options.publicCors) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Vary", "Origin");
  }

  logEvent(response.status >= 500 ? "error" : "info", "api.request", {
    route: options.route,
    method: request.method,
    durationMs: Date.now() - startedAt,
    statusCode: response.status,
  });

  return response;
}

export function expectedApiError(code: string, message: string, status: number, details?: unknown): Error {
  return new ExpectedApiError(code, message, status, details);
}
