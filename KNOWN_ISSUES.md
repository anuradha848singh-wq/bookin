 BookIn — Known Issues & Temporary Bypasses

> This file tracks issues that are temporarily bypassed to unblock development.
> Each issue should be revisited and properly fixed before production release.

---

## 1. Guest Init API — Supabase Admin `createUser` Returning 500

**Status:** 🟡 BYPASSED  
**File:** `apps/dashboard/app/api/auth/guest-init/route.ts`  
**Date Identified:** 2026-05-29  

### Symptom
- Clicking "Sign In with Guest" on the login page triggers a POST to `/api/auth/guest-init`
- The API returns **HTTP 500 (Internal Server Error)**
- Browser console shows: `Guest login flow error: Error: Fetch Failed` (repeated)
- The 500 originates from `supabaseAdmin.auth.admin.createUser()` failing

### Root Cause (Suspected)
The route was calling `supabaseAdmin.auth.admin.createUser()` using the service role key to dynamically create a unique guest user. This was failing — likely due to one of:
1. **Supabase project rate limiting** on user creation
2. **Service role key permissions** not configured for admin user management
3. **Supabase project paused/quota exceeded** (free tier limitation)
4. **Node.js `crypto` module import** (`import * as crypto from "crypto"`) potentially failing in Next.js bundling

### Current Bypass
The `/api/auth/guest-init` route now returns **pre-existing demo credentials** from environment variables instead of creating new users:
- `GUEST_DEMO_EMAIL` → `guest_new_02@bookin.com`
- `GUEST_DEMO_PASSWORD` → `GuestPassword123!`

> ⚠️ **Prerequisite:** The demo user (`guest_new_02@bookin.com`) must already exist and be confirmed in Supabase Auth. If it doesn't exist, create it manually via the Supabase Dashboard → Authentication → Users.

### Original Code (To Restore Later)
```typescript
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { success: false, error: "Missing Supabase URL or Service Role Key." },
      { status: 500 }
    );
  }

  const uniqueId = globalThis.crypto.randomUUID();
  const guestEmail = `guest_${uniqueId}@bookin.demo`;
  const guestPassword = `GuestPassword_${uniqueId.substring(0, 8)}!`;

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: guestEmail,
      password: guestPassword,
      email_confirm: true
    });

    if (createError) throw createError;

    return NextResponse.json({
      success: true,
      email: guestEmail,
      password: guestPassword
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to initialize guest user." },
      { status: 500 }
    );
  }
}
```

### Steps to Fix Properly
1. Check Supabase Dashboard → Settings → API to confirm the service role key is valid
2. Check Supabase Dashboard → Authentication → Settings to ensure user signups are enabled
3. Test the admin API call manually: `curl -X POST https://<project>.supabase.co/auth/v1/admin/users -H "Authorization: Bearer <service_role_key>" -H "apikey: <service_role_key>" -H "Content-Type: application/json" -d '{"email":"test@bookin.demo","password":"Test1234!","email_confirm":true}'`
4. If the service role key works, the issue is likely rate limiting — consider adding a cooldown or reusing a single guest account
5. Once confirmed working, restore the original code and remove the bypass

---

## 2. Full Auth Bypass for Development

**Status:** 🟡 ACTIVE (dev only)  
**Files Modified:**
- `apps/dashboard/middleware.ts` — skips auth redirect
- `apps/dashboard/lib/auth.ts` — returns mock user & clinic
- `.env.local` — `DEV_BYPASS_AUTH="true"`

### What It Does
When `DEV_BYPASS_AUTH=true` in `.env.local`:
- **Middleware** skips all Supabase session checks — every route is accessible
- **`getDashboardAuth()`** returns a mock `User` object (`dev@bookin.local`)
- **`getCachedClinic()`** tries the real DB first, falls back to a mock clinic (`Dev Clinic`)

### How to Disable
Set `DEV_BYPASS_AUTH="false"` or remove the line from `.env.local`, then restart the dev server.

### Before Production
- [ ] Set `DEV_BYPASS_AUTH="false"` or remove from `.env` / `.env.production`
- [ ] Fix Issue #1 (Guest Init API) so guest login works properly
- [ ] Verify real Supabase auth flow end-to-end

---

<!-- Add new issues below this line -->
