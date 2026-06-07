import { createClient } from "@supabase/supabase-js";
import { validateEnv } from "@book-in/config";

// Singleton clients
let supabaseClientInstance: ReturnType<typeof createClient> | null = null;
let supabaseAdminInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClientInstance) {
    const env = validateEnv();
    supabaseClientInstance = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  }
  return supabaseClientInstance;
}

export function getSupabaseAdmin() {
  if (!supabaseAdminInstance) {
    const env = validateEnv();
    supabaseAdminInstance = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdminInstance;
}

export function getSupabaseServerClient() {
  return getSupabaseAdmin();
}

export async function validateOwnerSession(request: { headers: { get(name: string): string | null } }): Promise<{ userId: string } | null> {
  // 1. Try Authorization header
  const authHeader = request.headers.get("authorization");
  let token: string | null = null;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.substring(7);
  }

  // 2. Try Cookies header
  if (!token) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split(";").map(c => {
          const parts = c.trim().split("=");
          return [parts[0], decodeURIComponent(parts.slice(1).join("="))];
        })
      );
      if (cookies["sb-access-token"]) {
        token = cookies["sb-access-token"];
      } else {
        // Support chunked cookies (e.g., sb-knaoqfkhxbckrvsworby-auth-token.0, sb-knaoqfkhxbckrvsworby-auth-token.1, etc.)
        const baseKey = Object.keys(cookies).find(k => k.startsWith("sb-") && k.includes("-auth-token"));
        if (baseKey) {
          const realBaseKey = baseKey.split(".")[0];
          const chunkKeys = Object.keys(cookies)
            .filter(k => k === realBaseKey || k.startsWith(realBaseKey + "."))
            .sort((a, b) => {
              const aIndex = a.includes(".") ? parseInt(a.split(".").pop() || "0", 10) : -1;
              const bIndex = b.includes(".") ? parseInt(b.split(".").pop() || "0", 10) : -1;
              return aIndex - bIndex;
            });

          const rawValue = chunkKeys.map(k => cookies[k]).join("");
          if (rawValue) {
            try {
              const parsed = JSON.parse(rawValue);
              if (parsed && typeof parsed === "object") {
                token = parsed.access_token || null;
              }
            } catch (e) {
              token = rawValue;
            }
          }
        }
      }
    }
  }

  if (!token) return null;

  try {
    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return { userId: user.id };
  } catch (error) {
    return null;
  }
}

