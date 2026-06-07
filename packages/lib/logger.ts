export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  route?: string;
  method?: string;
  userId?: string | null;
  durationMs?: number;
  statusCode?: number;
  code?: string;
  [key: string]: unknown;
}

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    const errorWithMeta = error as Error & Record<string, unknown>;
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
      code: errorWithMeta.code,
      ...Object.fromEntries(
        Object.entries(errorWithMeta).filter(([key]) => !["name", "message", "stack"].includes(key))
      ),
    };
  }

  return { message: String(error) };
}

/**
 * Emits structured JSON logs that can be consumed by Vercel log drains.
 */
export function logEvent(level: LogLevel, message: string, context: LogContext = {}): void {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}

/**
 * Emits a structured JSON error log with searchable error metadata.
 */
export function logError(message: string, error: unknown, context: LogContext = {}): void {
  logEvent("error", message, {
    ...context,
    error: serializeError(error),
  });
}

/**
 * Creates an Error instance carrying structured metadata for logs and tracing.
 */
export function createError(message: string, metadata: LogContext): Error {
  return Object.assign(new Error(message), metadata);
}
