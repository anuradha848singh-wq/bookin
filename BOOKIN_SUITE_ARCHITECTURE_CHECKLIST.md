# ████████████████████████████████████████████
# BOOKIN SUITE — MASTER ARCHITECTURE CHECKLIST
# Industry-Grade · Best Performance · Production-Ready
# ████████████████████████████████████████████

> **How to use:**
> Paste each section into Claude with the relevant files.
> Status key: `✅ PASS` · `❌ FAIL (fix before moving on)` · `⏳ NOT BUILT YET`
> **Rule: Never ship a layer until every ❌ is resolved.**

---

---

# ══════════════════════════════════════════
# TIER 0 — MONOREPO FOUNDATION
# Turborepo · Package Boundaries · Workspace Config
# ══════════════════════════════════════════

## 0-A. Turborepo Workspace Structure

```
Audit my Turborepo monorepo root. Verify the following:
```

### Root Config (`turbo.json`, `package.json`, `pnpm-workspace.yaml`)

- `✅ PASS` `turbo.json` defines correct pipeline order: `db:generate` → `build` → `test` → `lint`
- `✅ PASS` `pnpm-workspace.yaml` declares all workspace packages: `apps/*` and `packages/*`
- `✅ PASS` Root `package.json` has `"workspaces"` field pointing to `apps/*` and `packages/*`
- `✅ PASS` `turbo.json` uses `dependsOn: ["^build"]` so packages build before apps that depend on them
- `✅ PASS` `.turbo/` is in `.gitignore` (never commit cache)
- `⏳ NOT BUILT YET` Remote caching is configured (Vercel Remote Cache or self-hosted) — local-only cache is fine for dev but must be set up for CI

### Workspace Apps

- `✅ PASS` `apps/dashboard` → deployed to `app.bookin.com`
- `✅ PASS` `apps/builder` → deployed to `studio.bookin.com`
- `✅ PASS` Each app has its own `package.json` with `"name": "@book-in/dashboard"` and `"name": "@book-in/studio"` respectively
- `✅ PASS` Each app has its own `next.config.js` — NO shared Next config that creates hidden coupling
- `✅ PASS` Each app has its own `.env.local.example` documenting every required env var for that app

### Shared Packages (Internal)

- `✅ PASS` `packages/ui` (`@book-in/ui`) — shared design system components only. No business logic.
- `✅ PASS` `packages/db` (`@book-in/db`) — Prisma client, schema, migrations. Exported as a typed client.
- `✅ PASS` `packages/auth` (`@book-in/auth` / `@book-in/lib/auth`) — shared Supabase auth helpers, session validation.
- `✅ PASS` `packages/types` (`@book-in/types` / `@book-in/lib`) — shared TypeScript interfaces, enums, Zod schemas.
- `⏳ NOT BUILT YET` `packages/config` (`@book-in/config`) — shared ESLint, TypeScript base configs. No runtime code.
- `✅ PASS` `packages/utils` (`@book-in/utils` / `@book-in/lib`) — pure utility functions. Zero side effects, 100% unit testable.

### Package Boundary Rules (CRITICAL)

- `✅ PASS` `apps/dashboard` does NOT import anything from `apps/builder` directly (and vice versa). Cross-app communication happens via API only.
- `✅ PASS` `packages/db` does NOT import from any `apps/*` package.
- `✅ PASS` `packages/ui` does NOT import from `packages/db` or any app. It is purely presentational.
- `⏳ NOT BUILT YET` Run `pnpm turbo run build` from the root — it must complete with zero errors.
- `⏳ NOT BUILT YET` Run `pnpm turbo run lint` from the root — zero errors, zero warnings in CI mode.

---

## 0-B. TypeScript Configuration

- `⏳ NOT BUILT YET` Root `tsconfig.base.json` defines shared compiler options (`strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`)
- `⏳ NOT BUILT YET` Each app and package extends the base: `"extends": "@book-in/config/tsconfig.base.json"`
- `✅ PASS` `strict: true` is NEVER overridden to `false` anywhere in the monorepo
- `✅ PASS` Path aliases (`@/*`) are defined consistently in every `tsconfig.json` and `next.config.js`
- `⏳ NOT BUILT YET` `tsc --noEmit` passes with zero errors across all packages and apps

---

## 0-C. Code Quality Gates

- `⏳ NOT BUILT YET` ESLint is configured with: `@typescript-eslint/recommended`, `eslint-plugin-import`, `eslint-plugin-react-hooks`
- `⏳ NOT BUILT YET` A custom rule `no-cross-app-imports` (or `eslint-plugin-boundaries`) is configured to enforce package boundary rules
- `⏳ NOT BUILT YET` Prettier is configured at the root with a shared `.prettierrc`
- `⏳ NOT BUILT YET` Husky pre-commit hook runs `lint-staged` — only lints changed files, fast
- `⏳ NOT BUILT YET` Husky commit-msg hook enforces Conventional Commits format (`feat:`, `fix:`, `chore:`, etc.)
- `⏳ NOT BUILT YET` `commitlint` is configured so CI fails on non-conventional commit messages

---

---

# ══════════════════════════════════════════
# TIER 1 — DATABASE LAYER
# packages/db · Prisma · Supabase Postgres
# ══════════════════════════════════════════

## 1-A. Schema Design

```
Audit packages/db/prisma/schema.prisma. Verify the following:
```

### User Identity Split (CRITICAL — The Core Decoupling)

- `✅ PASS` `SaasUser` (User) model exists — for Bookin SaaS subscribers (clinics, salons, gyms)
- `✅ PASS` `StudioUser` model exists — for Bookin Studio users (designers, generic businesses)
- `✅ PASS` The two user models are completely separate. `StudioUser` does NOT extend `SaasUser`.
- `✅ PASS` `BuilderWebsite` has a `ownerId` (studioUserId equivalent) foreign key pointing to `StudioUser`
- `✅ PASS` `BuilderWebsite` has an OPTIONAL `externalIntegrationId String?` (or similar) field for linking to a SaaS `tenantId`
- `✅ PASS` `BuilderWebsite` has an OPTIONAL `tenantId String?` and a `@@index([tenantId])` for fast lookup

### SaaS Models

- `✅ PASS` `Tenant` — top-level SaaS account (a business / clinic / salon)
- `✅ PASS` `SaasUser` (User) — user within a Tenant (has `role`, `tenantId`)
- `✅ PASS` `Booking` — core booking record
- `✅ PASS` `Service` — bookable service (name, duration, price, staffIds)
- `✅ PASS` `Staff` — staff member with availability rules
- `✅ PASS` `Customer` — CRM contact record
- `✅ PASS` `FormSubmission` — form leads (separate from bookings)
- `⏳ NOT BUILT YET` `SsoToken` — short-lived tokens for SaaS→Studio SSO handoff (expires in 5 min, single-use)

### Studio Models

- `✅ PASS` `StudioUser` — (id, email, name, plan, createdAt, updatedAt)
- `✅ PASS` `BuilderWebsite` — (id, studioUserId/ownerId, tenantId?, name, slug, status, customDomain?, publishedAt?, createdAt, updatedAt)
- `✅ PASS` `BuilderPage` — (id, websiteId, title, slug, designJson, isHome, seoTitle, seoDescription, publishedHtml?, publishedAt?, createdAt, updatedAt)
- `⏳ NOT BUILT YET` `Media` — (id, studioUserId, websiteId, url, cdnUrl, type, size, alt?, createdAt)
- `⏳ NOT BUILT YET` `StudioForm` — (id, websiteId, name, fields Json, createdAt)
- `⏳ NOT BUILT YET` `StudioFormSubmission` — (id, formId, data Json, ipAddress, createdAt)
- `⏳ NOT BUILT YET` `WebsiteVersion` — (id, websiteId, snapshot Json, publishedBy, createdAt) — for rollback history

### Schema Quality

- `✅ PASS` Every model has `id String @id @default(cuid())` — NOT auto-increment integers (exposes record count, bad for security)
- `✅ PASS` Every model has `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`
- `✅ PASS` Compound indexes exist on all foreign key pairs that are queried together (e.g. `@@index([websiteId, slug])`)
- `✅ PASS` Cascade deletes are defined: deleting a `BuilderWebsite` cascades to `BuilderPage`, `Media`, `StudioForm`, `StudioFormSubmission`, `WebsiteVersion`
- `⏳ NOT BUILT YET` `SsoToken` has a `@@index([token])` and `@@index([expiresAt])` for efficient lookup and cleanup

---

## 1-B. Migration Strategy

- `✅ PASS` All schema changes are made via `prisma migrate dev` or `db push` to development.
- `✅ PASS` Every migration file has a descriptive name
- `✅ PASS` The `packages/db` package exports a singleton Prisma client with connection pooling (PgBouncer via Supabase)
- `✅ PASS` Database connection string uses `?pgbouncer=true&connection_limit=1` for serverless compatibility (Vercel)
- `✅ PASS` `prisma generate` runs as part of the Turborepo build pipeline before any app builds

---

## 1-C. Database Performance

- `⏳ NOT BUILT YET` Row Level Security (RLS) is enabled on all Supabase tables
- `⏳ NOT BUILT YET` RLS policies ensure `SaasUser` can only read their own `Tenant`'s data
- `⏳ NOT BUILT YET` RLS policies ensure `StudioUser` can only read their own `BuilderWebsite`s
- `⏳ NOT BUILT YET` The most frequent queries have been reviewed with `EXPLAIN ANALYZE` — no sequential scans on large tables
- `✅ PASS` `BuilderPage.designJson` uses Postgres `JSONB` type (not `TEXT`) for efficient querying
- `⏳ NOT BUILT YET` Old `SsoToken` rows are cleaned up by a scheduled job (Supabase cron or Vercel cron) — expired tokens must not accumulate

---

---

# ══════════════════════════════════════════
# TIER 2 — AUTHENTICATION & AUTHORIZATION
# Supabase Auth · SSO Bridge · Role Guards
# ══════════════════════════════════════════

## 2-A. Supabase Auth Setup

```
Audit packages/auth and both apps' middleware. Verify the following:
```

- `✅ PASS` `packages/lib/supabase` exports a shared `createSupabaseClient()` for server components
- `✅ PASS` The auth package has NO app-specific logic — it is purely a thin wrapper around Supabase
- `✅ PASS` `apps/dashboard` uses Supabase Auth for `SaasUser` sessions
- `✅ PASS` `apps/builder` uses Supabase Auth for `StudioUser` sessions (Auth utilities separate via `getDashboardAuth` and `getStudioAuth`)
- `⏳ NOT BUILT YET` Email confirmation is enabled for new sign-ups on both apps
- `⏳ NOT BUILT YET` Password reset flow is implemented and tested on both apps
- `⏳ NOT BUILT YET` Social login (Google OAuth) is configured and working on both apps

---

## 2-B. Middleware & Route Protection

- `✅ PASS` `apps/dashboard/middleware.ts` protects all routes — unauthenticated users are redirected to `/login`
- `✅ PASS` `apps/builder/middleware.ts` protects all routes — unauthenticated users are redirected to `/login`
- `✅ PASS` Middleware does NOT call the database — it only validates the Supabase JWT (fast, edge-compatible)
- `✅ PASS` API routes use a server-side auth helper, not the middleware JWT check (defense in depth)
- `⏳ NOT BUILT YET` A utility `requireOwnership(userId, resourceId)` is used consistently in all mutating API routes to prevent IDOR attacks

---

## 2-C. SSO Bridge (SaaS → Studio) — The Seamless Handoff

- `⏳ NOT BUILT YET` `POST /api/v1/integrations/sso-token` endpoint on `apps/builder` — accepts a signed request from the SaaS backend, creates a short-lived `SsoToken` record, returns the token
- `⏳ NOT BUILT YET` The SaaS dashboard `settings/website` page calls the Studio's provision endpoint on the server-side (not from the browser) — the API secret is never exposed to the client
- `⏳ NOT BUILT YET` `SsoToken` fields: `token` (UUID v4, unguessable), `studioUserId`, `redirectPath`, `expiresAt` (now + 5 minutes), `used Boolean @default(false)`
- `⏳ NOT BUILT YET` `GET /auth/sso?token=<token>` route on `apps/builder` — validates token (not expired, not used), marks it `used: true`, creates a Supabase session for the `StudioUser`, redirects to `redirectPath`
- `⏳ NOT BUILT YET` If the token is expired or already used, a clear error page is shown — no silent failure
- `⏳ NOT BUILT YET` The SSO token is transmitted over HTTPS only — Strict-Transport-Security header is set
- `⏳ NOT BUILT YET` The SaaS→Studio API call is authenticated with a shared `STUDIO_API_SECRET` env var — validated via `Authorization: Bearer <secret>` header on the Studio side

---

## 2-D. Role-Based Access Control (SaaS)

- `✅ PASS` `SaasUser.role` enum has: `OWNER`, `ADMIN`, `EDITOR`, `VIEWER` (Role enum exists in Prisma schema)
- `⏳ NOT BUILT YET` A `can(user, action, resource)` utility function centralizes permission checks — no inline role checks scattered across route handlers
- `⏳ NOT BUILT YET` `OWNER` can: manage billing, delete workspace, manage all users
- `⏳ NOT BUILT YET` `ADMIN` can: manage team, publish, edit everything
- `⏳ NOT BUILT YET` `EDITOR` can: edit content, cannot publish, cannot manage team
- `⏳ NOT BUILT YET` `VIEWER` can: view only — all mutating API routes return 403 for viewers
- `⏳ NOT BUILT YET` Permission checks happen on the SERVER (in API routes) — never trust client-side role checks

---

---

# ══════════════════════════════════════════
# TIER 3 — BOOKIN SAAS API
# apps/dashboard · REST API · Business Logic
# ══════════════════════════════════════════

## 3-A. API Architecture

```
Audit apps/dashboard/app/api/**. Verify the following:
```

- `❌ FAIL` All API routes follow the pattern: `apps/dashboard/app/api/v1/[resource]/route.ts` (currently missing `/v1/` prefix)
- `❌ FAIL` Version prefix `/v1/` is present — enables future breaking changes without destroying clients
- `⏳ NOT BUILT YET` A shared `apiHandler` wrapper is used on every route — handles auth check, error catching, and response shaping in one place
- `⏳ NOT BUILT YET` Every route handler is under 50 lines. Business logic lives in a service file, not inline in the route handler.
- `⏳ NOT BUILT YET` Service files live at `apps/dashboard/src/services/[domain].service.ts`

---

## 3-B. Input Validation

- `✅ PASS` Every POST/PUT/PATCH route validates the request body with a Zod schema before touching the database
- `✅ PASS` Zod schemas are defined in `packages/types` (or lib) and imported by both the API route (server) and the frontend form (client) — single source of truth
- `⏳ NOT BUILT YET` URL params (`:id`) are validated as valid CUID strings before DB queries — a non-CUID input returns a 400, not a Prisma crash
- `⏳ NOT BUILT YET` Query params (filters, pagination) have type-safe defaults — no `parseInt(undefined)` crashes

---

## 3-C. Core SaaS Endpoints Checklist

### Tenants & Users
- `✅ PASS` `GET /api/v1/tenant` — returns the current user's tenant (scoped by JWT)
- `⏳ NOT BUILT YET` `PUT /api/v1/tenant` — updates tenant settings; only `OWNER` or `ADMIN` can call this
- `⏳ NOT BUILT YET` `GET /api/v1/users` — lists users in the current tenant; no cross-tenant leakage
- `⏳ NOT BUILT YET` `POST /api/v1/users/invite` — sends an invite email; validates email format and checks for existing user
- `⏳ NOT BUILT YET` `DELETE /api/v1/users/:id` — removes a user from the tenant; `OWNER` cannot delete themselves

### Bookings
- `✅ PASS` `GET /api/v1/bookings` — supports `?status=`, `?staffId=`, `?date=` filters; returns paginated results
- `✅ PASS` `POST /api/v1/bookings` — checks real-time availability before creating; returns 409 if slot is taken
- `⏳ NOT BUILT YET` `PUT /api/v1/bookings/:id/cancel` — cancels booking and triggers notification logic
- `✅ PASS` `GET /api/v1/bookings/availability` — returns available slots for a given service, staff, and date range

### Services & Staff
- `✅ PASS` `GET /api/v1/services` — returns tenant's services; supports `?active=true` filter
- `✅ PASS` `POST /api/v1/services` — validates name, duration (positive integer), price (non-negative)
- `✅ PASS` `GET /api/v1/staff` — returns staff list with availability rules
- `✅ PASS` `GET /api/v1/staff/:id/availability` — returns available slots for a specific staff member

### Studio Integration (SaaS Side)
- `⏳ NOT BUILT YET` `POST /api/v1/studio/provision` — creates/retrieves a linked `BuilderWebsite` for this tenant by calling the Studio API server-to-server
- `⏳ NOT BUILT YET` `GET /api/v1/studio/sso-link` — generates an SSO token and returns the full redirect URL for "Open in Studio" button
- `⏳ NOT BUILT YET` These two endpoints use `STUDIO_API_SECRET` from env — the secret is never logged or returned in responses

---

## 3-D. Error Handling & Response Shape

- `✅ PASS` All success responses follow: `{ success: true, ...data }`
- `✅ PASS` All error responses follow: `{ success: false, error: "..." }`
- `✅ PASS` HTTP status codes are semantically correct (200, 201, 400, 401, 404, 500)
- `⏳ NOT BUILT YET` `500` errors are logged to an error monitoring service (Sentry) with full context — never swallowed silently

---

---

# ══════════════════════════════════════════
# TIER 4 — BOOKIN STUDIO API
# apps/builder · Studio-Specific Backend
# ══════════════════════════════════════════

## 4-A. Studio API Architecture

```
Audit apps/builder/src/app/api/studio/**. Verify the following:
```

- `✅ PASS` Studio API lives entirely under `apps/builder/src/app/api/studio/`
- `✅ PASS` ZERO builder API routes exist in `apps/dashboard/` — they have been fully migrated/deleted
- `⏳ NOT BUILT YET` The Studio API has its own `apiHandler` wrapper independent of the dashboard's
- `✅ PASS` All Studio API routes authenticate against `StudioUser` sessions (not `SaasUser`)
- `⏳ NOT BUILT YET` For routes called by a tenant-linked site, the auth validates either a `StudioUser` session OR a valid `tenantId` from the SaaS integration (dual auth path)

---

## 4-B. Studio Core Endpoints

### Websites
- `⏳ NOT BUILT YET` `GET /api/studio/websites` — lists only websites owned by the authenticated `StudioUser`
- `⏳ NOT BUILT YET` `POST /api/studio/websites` — creates a new website; validates slug uniqueness globally (not just per-user)
- `⏳ NOT BUILT YET` `PUT /api/studio/websites/:id` — verifies ownership before update
- `⏳ NOT BUILT YET` `DELETE /api/studio/websites/:id` — deletes website AND all cascading data (pages, media, forms, versions) — requires ownership

### Pages
- `✅ PASS` `GET /api/studio/load?slug=` — returns pages for a website; verifies the website belongs to the user
- `⏳ NOT BUILT YET` `POST /api/studio/pages` — creates a page; validates `designJson` is valid JSON; validates `slug` uniqueness within the website
- `✅ PASS` `POST /api/studio/save` — saves design; accepts full `designJson`; returns updated page
- `✅ PASS` `POST /api/studio/publish` — triggers HTML/CSS generation and marks page as published

### Media
- `⏳ NOT BUILT YET` `POST /api/studio/media/upload` — validates file type (whitelist: jpg, png, webp, gif, svg, pdf); validates file size (max 10MB); uploads to R2/S3; stores CDN URL in DB
- `⏳ NOT BUILT YET` `DELETE /api/studio/media/:id` — deletes from R2/S3 AND removes DB record in a single transaction
- `⏳ NOT BUILT YET` Upload endpoint is rate-limited: max 50 uploads per user per hour

### Forms
- `⏳ NOT BUILT YET` `POST /api/studio/forms/:id/submit` — rate-limited by IP: max 5 submissions per IP per form per hour
- `⏳ NOT BUILT YET` Form submission stores `ipAddress` (hashed, not raw) for spam detection
- `⏳ NOT BUILT YET` `GET /api/studio/forms/:id/submissions` — only accessible by the website owner; returns paginated results

### Integration Bridge (Studio Side)
- `⏳ NOT BUILT YET` `POST /api/v1/integrations/provision` — validates `STUDIO_API_SECRET` header; creates or returns existing `BuilderWebsite` for the given `tenantId`; creates a `StudioUser` if one doesn't exist for this tenant
- `⏳ NOT BUILT YET` `GET /api/studio/integrations/:tenantId/services` — proxies the SaaS API to return the tenant's `Service` list for use in dynamic Studio blocks; caches the response for 60 seconds
- `⏳ NOT BUILT YET` `GET /api/studio/integrations/:tenantId/staff` — same pattern for staff data
- `⏳ NOT BUILT YET` Integration proxy routes add a short `Cache-Control: s-maxage=60, stale-while-revalidate=120` header — they should never be called on every keypress

---

## 4-C. Auto-Save & Versioning

- `✅ PASS` Auto-save is triggered client-side with a debounce after the last change
- `✅ PASS` The auto-save endpoint is idempotent — calling it twice with the same data is safe
- `⏳ NOT BUILT YET` On every manual Publish action, a `WebsiteVersion` snapshot is created BEFORE overwriting the published HTML
- `⏳ NOT BUILT YET` `WebsiteVersion` stores: `snapshot` (full `designJson`), `publishedBy` (userId), `createdAt`
- `⏳ NOT BUILT YET` Maximum version history kept: 50 versions per website (older ones pruned by a cleanup job)

---

---

# ══════════════════════════════════════════
# TIER 5 — FRONTEND: BOOKIN SAAS DASHBOARD
# apps/dashboard · React / Next.js · UI
# ══════════════════════════════════════════

## 5-A. Dashboard App Structure

```
Audit apps/dashboard/app/**. Verify the following:
```

- `✅ PASS` Route groups are clean: `(auth)` for login/signup, `(app)` for authenticated dashboard
- `✅ PASS` `apps/dashboard/app/(studio)/` directory has been DELETED — no embedded builder routes remain
- `✅ PASS` `apps/dashboard/components/builder/` directory has been DELETED — no duplicated builder components remain
- `⏳ NOT BUILT YET` `apps/dashboard/app/(app)/settings/website/page.tsx` contains ONLY an "Open in Bookin Studio" button — no CraftJS or builder canvas code

### The "Open in Studio" Button (Critical Integration Point)

- `⏳ NOT BUILT YET` The button calls `GET /api/v1/studio/sso-link` from the server component (not from the browser)
- `⏳ NOT BUILT YET` The returned URL is rendered as a link that opens in a new tab (or same tab, product decision — document it)
- `⏳ NOT BUILT YET` If the Studio site has not been provisioned yet, the button shows "Create Your Website" and calls the provision endpoint first
- `⏳ NOT BUILT YET` If the Studio API is unreachable, the button shows a degraded state ("Studio unavailable") — the entire dashboard does NOT crash

---

## 5-B. Dashboard UI Quality

- `✅ PASS` All interactive components use `@book-in/ui` — no one-off styled components that duplicate the design system
- `⏳ NOT BUILT YET` Data tables use `react-query` (or SWR) for server state — no raw `useEffect` + `fetch` patterns
- `✅ PASS` All forms use `react-hook-form` + Zod validation — consistent error display across all forms
- `⏳ NOT BUILT YET` Loading states: every data-fetching component shows a skeleton, not a blank white area
- `⏳ NOT BUILT YET` Error states: every data-fetching component shows a user-friendly error with a retry option
- `✅ PASS` Empty states: every list shows a helpful empty state with a clear CTA (not just blank space)

---

## 5-C. Dashboard Performance

- `✅ PASS` The dashboard bundle does NOT include `craft.js`, `monaco-editor`, or any Studio-specific dependencies
- `✅ PASS` Run `next build` and check the bundle output — no unexpected large packages in the dashboard chunks
- `✅ PASS` Route-level code splitting is working: navigating to `/bookings` should not pre-load `/customers` JS
- `⏳ NOT BUILT YET` Images use `next/image` with correct `width`, `height`, and `priority` props
- `⏳ NOT BUILT YET` API calls use `stale-while-revalidate` caching strategy so navigation feels instant

---

---

# ══════════════════════════════════════════
# TIER 6 — FRONTEND: BOOKIN STUDIO BUILDER
# apps/builder · CraftJS · Editor Canvas
# ══════════════════════════════════════════

## 6-A. Studio App Structure

```
Audit apps/builder/src/app/**. Verify the following:
```

- `✅ PASS` Route structure: `/` (landing/marketing), `/login`, `/signup`, `/editor/[slug]` (editor), `/preview/[slug]` (preview)
- `✅ PASS` The editor route is protected by `middleware.ts` — unauthenticated users are redirected to `/login`
- `⏳ NOT BUILT YET` SSO route `/auth/sso` handles the token-based login from the SaaS dashboard

---

## 6-B. Editor Canvas Architecture

- `✅ PASS` CraftJS `<Editor>` is initialized with the full component resolver at app startup — no dynamic imports that cause components to be "missing" on load
- `✅ PASS` `designJson` is loaded from the API, not from localStorage — localStorage is only used as a fallback offline buffer
- `✅ PASS` The editor canvas is isolated in an `<iframe>` OR uses strict CSS scoping so editor UI styles never bleed into the preview canvas
- `✅ PASS` CraftJS state serialization (`editor.serialize()`) is tested — the output can be deserialized without data loss
- `✅ PASS` Undo/redo history is capped to prevent memory leaks on long editing sessions

---

## 6-C. Editor Layout (The 3-Panel Shell)

- `✅ PASS` Editor shell uses CSS Grid/Flexbox: `[left-panel] [canvas-area] [right-panel]`
- `✅ PASS` Left panel width: fixed `240px`/`260px`, `flex-shrink: 0`
- `✅ PASS` Right panel width: fixed `320px`, `flex-shrink: 0`
- `✅ PASS` Canvas area: `flex: 1`, `overflow: hidden`, contains its own inner scrollable area
- `✅ PASS` Topbar height: fixed, `position: absolute / top` layout
- `✅ PASS` No z-index conflicts: topbar > modals > dropdowns > panels > canvas.
- `✅ PASS` The canvas inner area has `overflow-y: auto` and `overflow-x: hidden` — horizontal scroll on the canvas must not exist

---

## 6-D. Studio Performance (CRITICAL — The Builder Must Be Fast)

### Bundle Size

- `⏳ NOT BUILT YET` Run `next build --profile` and check bundle sizes. Target: initial JS < 200KB gzipped for the editor shell.
- `⏳ NOT BUILT YET` `monaco-editor` (custom code editor) is loaded with `dynamic(() => import(...), { ssr: false })` — never in the initial bundle
- `✅ PASS` CraftJS is imported only in the editor route — not in the marketing pages or preview route
- `✅ PASS` `@book-in/ui` components are tree-shaken correctly — only used components appear in the bundle

### Render Performance

- `⏳ NOT BUILT YET` The component library panel (left panel) is virtualized — do not render 50+ component cards in the DOM at once. Use `react-virtual` or `react-window`.
- `⏳ NOT BUILT YET` The right panel properties form uses `React.memo` — it must not re-render when other components on the canvas are updated
- `✅ PASS` CraftJS `useEditor` hook is called with a selector function — never subscribe to the entire editor state in a component that doesn't need all of it
- `✅ PASS` `designJson` is never stored in React state as a parsed object — store it as a string and parse only when needed

### Auto-Save

- `✅ PASS` Auto-save calls are debounced — use `useCallback` + `useRef` to prevent the debounce from resetting on every render
- `✅ PASS` If an auto-save is in-flight and another change occurs, the in-flight save is NOT cancelled — the next save queues after it completes (no dropped saves)
- `✅ PASS` Auto-save status indicator: `Saving...` / `✓ Saved` / `⚠ Save failed — click to retry`

---

## 6-E. Dynamic Content Blocks (Tenant Integration)

- `✅ PASS` The `<BookingWidgetConnector>`, `<ServiceShowcase>`, `<StaffShowcase>` components exist
- `✅ PASS` In the editor, these components show placeholder/mock data when no `tenantId` is linked
- `⏳ NOT BUILT YET` In the editor, when a `tenantId` IS linked, these components fetch real data from `/api/studio/integrations/:tenantId/services` (Studio API proxy)
- `⏳ NOT BUILT YET` In the published HTML, these components are rendered as client-side JS widgets that call the Bookin SaaS API directly — they are NOT statically baked into the HTML (data changes in real time)
- `⏳ NOT BUILT YET` The `tenantId` is embedded in the published page as a `data-tenant-id` attribute on the widget root element — it is NOT a secret key

---

---

# ══════════════════════════════════════════
# TIER 7 — PUBLISHING PIPELINE
# HTML Generation · CDN · Deployment
# ══════════════════════════════════════════

## 7-A. HTML/CSS Generation

```
Audit the publishing service (apps/builder/src/services/publish.service.ts or similar). Verify:
```

- `✅ PASS` Generation is a pure function: `generateSite(designJson, metadata) → { html, css }` — no side effects inside the generator
- `✅ PASS` The generator runs SERVER-SIDE ONLY — never in the browser (it would expose internal data structures)
- `⏳ NOT BUILT YET` Generated HTML passes W3C validation (test a sample output)
- `⏳ NOT BUILT YET` Generated CSS uses CSS custom properties for theme variables — changing a theme color only requires updating 1 variable
- `⏳ NOT BUILT YET` Media queries are generated for all breakpoints
- `⏳ NOT BUILT YET` All class names in generated CSS are hashed/namespaced to prevent style conflicts
- `✅ PASS` The generator handles all 50+ component types — a missing component type renders a fallback, not a crash

---

## 7-B. Published Site Serving

- `⏳ NOT BUILT YET` Published sites are served from a separate Next.js route group or a completely separate serving layer — NOT mixed with the Studio editor routes
- `⏳ NOT BUILT YET` Published HTML is stored in Cloudflare R2 (or similar) as static files — NOT regenerated on every visitor request (Currently uses Supabase Storage)
- `⏳ NOT BUILT YET` Published pages have correct cache headers: `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400`
- `⏳ NOT BUILT YET` Custom domain sites are proxied through Cloudflare — SSL is provisioned automatically via Cloudflare SSL for SaaS

### Dynamic Widgets on Published Pages

- `⏳ NOT BUILT YET` Booking calendar widget is a lightweight `<script>` tag that loads async — it does NOT block page rendering
- `⏳ NOT BUILT YET` The widget script is served from a CDN with a versioned URL
- `⏳ NOT BUILT YET` The widget has its own error boundary — if the Bookin API is down, it shows "Booking temporarily unavailable", not a white broken area

---

## 7-C. SEO Output Quality

- `✅ PASS` Every published page `<head>` contains: `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph tags, Twitter card tags
- `⏳ NOT BUILT YET` `sitemap.xml` is auto-generated and submitted-ready
- `⏳ NOT BUILT YET` `robots.txt` is correctly configured (allow all for public sites, disallow for preview/staging)
- `✅ PASS` Published pages have `<html lang="en">` (or the correct language)
- `⏳ NOT BUILT YET` All images in the generated HTML have `alt` attributes (even if empty for decorative images: `alt=""`)

---

---

# ══════════════════════════════════════════
# TIER 8 — SECURITY
# OWASP Top 10 · Data Protection · Secrets
# ══════════════════════════════════════════

## 8-A. Authentication Security

```
Audit all API routes and middleware for security vulnerabilities.
```

- `✅ PASS` JWT tokens are validated server-side on EVERY API call — never trust client-provided user IDs
- `⏳ NOT BUILT YET` `STUDIO_API_SECRET` is a randomly generated 256-bit hex string — not a human-readable password
- `⏳ NOT BUILT YET` `STUDIO_API_SECRET` is stored in environment variables and NEVER committed to git
- `⏳ NOT BUILT YET` SSO tokens are single-use and expire in 5 minutes
- `✅ PASS` Session tokens use `HttpOnly`, `Secure`, `SameSite=Strict` cookie flags

---

## 8-B. API Security

- `⏳ NOT BUILT YET` All mutating endpoints verify resource ownership (IDOR protection): a user cannot edit another user's website even with a valid JWT
- `✅ PASS` SQL injection is impossible — all DB queries use Prisma's parameterized queries
- `⏳ NOT BUILT YET` XSS: user-provided content in published HTML is sanitized with `DOMPurify` before being embedded
- `⏳ NOT BUILT YET` File uploads: MIME type is validated server-side
- `⏳ NOT BUILT YET` File uploads: files are scanned for malicious content
- `⏳ NOT BUILT YET` CSRF protection is configured for all state-changing operations
- `⏳ NOT BUILT YET` Rate limiting is implemented on all public-facing endpoints

---

## 8-C. Data Security

- `⏳ NOT BUILT YET` `FormSubmission.ipAddress` stores a HASHED IP (SHA-256 + salt), not the raw IP — GDPR compliance
- `⏳ NOT BUILT YET` A `GDPR Data Deletion` endpoint exists: `DELETE /api/v1/account` deletes all user data from all tables
- `✅ PASS` Supabase RLS policies are the last line of defense — they work even if application-level checks are bypassed
- `✅ PASS` Sensitive env vars (`DATABASE_URL`, `SUPABASE_SERVICE_KEY`, `STRIPE_SECRET_KEY`) are NEVER logged
- `✅ PASS` Error responses never expose database error messages, stack traces, or internal paths to the client

---

## 8-D. Dependency Security

- `⏳ NOT BUILT YET` `pnpm audit` runs in CI — the build fails on HIGH or CRITICAL severity vulnerabilities
- `⏳ NOT BUILT YET` Dependabot (or Renovate) is configured to auto-create PRs for dependency updates
- `⏳ NOT BUILT YET` `package.json` files use exact versions for critical packages (`"prisma": "5.14.0"` not `"^5.14.0"`) — at least for `packages/db`

---

---

# ══════════════════════════════════════════
# TIER 9 — PERFORMANCE TARGETS
# Core Web Vitals · Load Times · Benchmarks
# ══════════════════════════════════════════

## 9-A. Published Site Performance (End-User Facing)

```
Test a published Bookin Studio site with Lighthouse. Targets:
```

| Metric | Target | Threshold |
|--------|--------|-----------|
| Lighthouse Performance | ≥ 90 | ❌ if < 80 |
| Largest Contentful Paint (LCP) | < 2.5s | ❌ if > 4s |
| Cumulative Layout Shift (CLS) | < 0.1 | ❌ if > 0.25 |
| First Input Delay (FID) | < 100ms | ❌ if > 300ms |
| Total Blocking Time (TBT) | < 200ms | ❌ if > 600ms |
| Time to First Byte (TTFB) | < 600ms | ❌ if > 1.8s |

- `⏳ NOT BUILT YET` A/B tested on Slow 3G — the page is usable (content visible) within 5 seconds
- `⏳ NOT BUILT YET` All images are served as WebP with correct `srcset` for responsive sizes
- `⏳ NOT BUILT YET` Web fonts use `font-display: swap` and are preloaded in `<head>`
- `⏳ NOT BUILT YET` Third-party scripts (analytics, widgets) are loaded with `defer` or `async`

---

## 9-B. Studio Editor Performance

| Metric | Target |
|--------|--------|
| Editor initial load (cold) | < 3 seconds |
| Canvas render after design load | < 500ms |
| Component drag-drop response | < 16ms (60fps) |
| Auto-save round-trip | < 800ms p95 |
| Breakpoint switch re-render | < 100ms |

- `⏳ NOT BUILT YET` Editor does not degrade with 50+ components on canvas — test with a large page
- `⏳ NOT BUILT YET` Memory usage does not grow unboundedly during a 30-minute editing session (no memory leaks from event listeners or abandoned subscriptions)

---

## 9-C. SaaS Dashboard Performance

| Metric | Target |
|--------|--------|
| Dashboard initial load | < 2 seconds |
| Booking list (100 items) render | < 300ms |
| Availability calendar render | < 200ms |

- `⏳ NOT BUILT YET` `react-query` is configured with `staleTime: 5 * 60 * 1000` on lists — no unnecessary refetches
- `⏳ NOT BUILT YET` Booking calendar uses windowing for months with many bookings

---

---

# ══════════════════════════════════════════
# TIER 10 — OBSERVABILITY
# Logging · Monitoring · Alerting
# ══════════════════════════════════════════

## 10-A. Error Monitoring

- `⏳ NOT BUILT YET` Sentry (or equivalent) is installed on BOTH apps and BOTH backends
- `⏳ NOT BUILT YET` Sentry `dsn` is configured per-environment (dev, staging, prod — separate Sentry projects)
- `⏳ NOT BUILT YET` All unhandled promise rejections and uncaught exceptions are captured by Sentry
- `⏳ NOT BUILT YET` Sentry source maps are uploaded on every production build so errors show original TypeScript line numbers
- `⏳ NOT BUILT YET` Error alerts are routed to a Slack channel — the team is notified within 5 minutes of a new error spike

---

## 10-B. Structured Logging

- `⏳ NOT BUILT YET` All API routes use a structured logger (e.g., `pino`) — logs are JSON, not `console.log` strings
- `⏳ NOT BUILT YET` Every log entry includes: `timestamp`, `level`, `requestId`, `userId` (hashed), `route`, `durationMs`
- `⏳ NOT BUILT YET` Sensitive data (passwords, tokens, card numbers) is NEVER logged — a `redact` config is set in pino
- `⏳ NOT BUILT YET` Log levels are environment-aware: `debug` in dev, `info` in staging, `warn+` in production

---

## 10-C. Metrics & Uptime

- `⏳ NOT BUILT YET` Vercel Analytics is enabled for Core Web Vitals tracking on both apps
- `⏳ NOT BUILT YET` A health check endpoint exists on both apps: `GET /api/health` — returns `{ status: "ok", db: "ok", version: "x.x.x" }` within 200ms
- `⏳ NOT BUILT YET` Uptime monitoring is configured (e.g., Better Uptime, Checkly) — checks `/api/health` every 60 seconds
- `⏳ NOT BUILT YET` An alert fires if uptime drops below 99.9% in any 24-hour window
- `⏳ NOT BUILT YET` Database connection pool metrics are monitored — alert if pool exhaustion occurs

---

---

# ══════════════════════════════════════════
# TIER 11 — CI/CD PIPELINE
# GitHub Actions · Testing · Deployments
# ══════════════════════════════════════════

## 11-A. CI Pipeline (on every Pull Request)

```yaml
# Required CI jobs — all must pass before merge:
```

- `⏳ NOT BUILT YET` `lint` — ESLint + TypeScript typecheck across all packages (`turbo run lint typecheck`)
- `⏳ NOT BUILT YET` `test:unit` — unit tests for all `packages/*` and service files
- `⏳ NOT BUILT YET` `test:integration` — integration tests for API routes using a test database
- `⏳ NOT BUILT YET` `build` — production build of both apps (`turbo run build`)
- `⏳ NOT BUILT YET` `security:audit` — `pnpm audit --audit-level=high`
- `⏳ NOT BUILT YET` `size-limit` — checks that app bundle sizes haven't exceeded thresholds

---

## 11-B. Testing Strategy

### Unit Tests (packages/*)
- `⏳ NOT BUILT YET` `packages/utils` — 100% coverage (pure functions are easy to test)
- `⏳ NOT BUILT YET` `packages/types` — Zod schema validation tests (valid inputs pass, invalid inputs throw)
- `⏳ NOT BUILT YET` Auth helpers — token creation, token validation, expiry logic

### Integration Tests (API Routes)
- `⏳ NOT BUILT YET` Every API route has at minimum: a `happy path` test, an `unauthorized` test (401), and an `wrong owner` test (403)
- `⏳ NOT BUILT YET` Tests use a real test database (not mocked Prisma) — use `prisma migrate deploy` on a test DB before running
- `⏳ NOT BUILT YET` API tests run against actual Next.js route handlers using `createMocks` from `node-mocks-http` or Next.js test utilities

### End-to-End Tests
- `⏳ NOT BUILT YET` Playwright E2E tests cover the 5 critical user flows:
  1. SaaS: New user signs up → creates first booking
  2. Studio: New user signs up → creates website → publishes it
  3. Integration: SaaS user clicks "Open in Studio" → SSO handoff completes → editor loads with tenant data
  4. Published site: Visitor opens published site → completes booking flow end-to-end
  5. Collaboration: Two users edit the same website → no data loss

---

## 11-C. Deployment Pipeline

- `⏳ NOT BUILT YET` Staging environment is deployed automatically on every merge to `main`
- `⏳ NOT BUILT YET` Production deployment requires a manual approval step (GitHub environment protection rule)
- `⏳ NOT BUILT YET` Database migrations run automatically in CI BEFORE the new app version is deployed (`prisma migrate deploy`)
- `⏳ NOT BUILT YET` Failed deployments trigger an automatic rollback to the last stable version
- `⏳ NOT BUILT YET` Environment variables are managed in Vercel dashboard — never in `.env` files committed to git
- `⏳ NOT BUILT YET` Each app (`dashboard`, `builder`) has its own Vercel project — independent deployments, independent rollbacks

---

---

# ══════════════════════════════════════════
# TIER 12 — DEVELOPER EXPERIENCE
# Onboarding · Documentation · Tooling
# ══════════════════════════════════════════

## 12-A. Repository Documentation

- `⏳ NOT BUILT YET` Root `README.md` includes: architecture overview diagram, quick start (`pnpm install && pnpm dev`), environment variable setup guide, and links to per-app READMEs
- `⏳ NOT BUILT YET` `apps/dashboard/README.md` — describes the SaaS dashboard, its env vars, and how to run it locally
- `⏳ NOT BUILT YET` `apps/builder/README.md` — describes the Studio, its env vars, the SSO flow, and how to test it locally
- `⏳ NOT BUILT YET` `packages/db/README.md` — Prisma setup, how to create migrations, how to seed the DB
- `⏳ NOT BUILT YET` An `ARCHITECTURE.md` at the root explains the SaaS/Studio split, the integration bridge, and the package boundaries with a diagram

---

## 12-B. Local Development Experience

- `✅ PASS` `pnpm dev` from the root starts BOTH apps concurrently with labeled output (`[dashboard]`, `[builder]`)
- `✅ PASS` `pnpm dev:dashboard` and `pnpm dev:builder` exist as shortcuts for running a single app
- `⏳ NOT BUILT YET` A `scripts/setup.sh` script automates: installing deps, creating `.env.local` from examples, running DB migrations, and seeding test data
- `⏳ NOT BUILT YET` The seed script (`packages/db/prisma/seed.ts`) creates: 1 `Tenant`, 1 `SaasUser`, 1 `StudioUser`, 3 sample bookings, 1 sample website with 2 pages
- `✅ PASS` Hot reload works correctly in both apps — changing a file in `packages/ui` triggers a reload in both `apps/dashboard` and `apps/builder`

---

---

# ══════════════════════════════════════════
# MASTER TIER PROGRESS TRACKER
# ══════════════════════════════════════════

| Tier | Layer | Owner | Status | Audit |
|------|-------|-------|--------|-------|
| 0 | Monorepo Foundation (Turborepo, TS, ESLint) | Infra | ⏳ IN PROGRESS | ✅ Core config setup |
| 1 | Database Layer (Prisma Schema, RLS, Migrations) | Backend | ⏳ IN PROGRESS | ✅ Schema decoupled |
| 2 | Auth & SSO Bridge | Backend | ⏳ IN PROGRESS | ✅ Separate Auth contexts |
| 3 | Bookin SaaS API (Dashboard Backend) | Backend | ❌ FAIL | API not versioned (/v1) |
| 4 | Bookin Studio API (Builder Backend) | Backend | ⏳ IN PROGRESS | ✅ Isolated to apps/builder |
| 5 | SaaS Dashboard Frontend | Frontend | ⏳ IN PROGRESS | ✅ Studio deps purged |
| 6 | Studio Builder Frontend (CraftJS, Canvas) | Frontend | ⏳ IN PROGRESS | ✅ Independent runtime |
| 7 | Publishing Pipeline (HTML Gen, CDN, SEO) | Fullstack | ⏳ IN PROGRESS | ✅ Generation isolated |
| 8 | Security (OWASP, GDPR, Secrets) | Security | ⏳ NOT BUILT | Needs implementation |
| 9 | Performance Targets (CWV, Benchmarks) | Perf | ⏳ NOT BUILT | Needs implementation |
| 10 | Observability (Sentry, Logging, Uptime) | Infra | ⏳ NOT BUILT | Needs implementation |
| 11 | CI/CD Pipeline (GitHub Actions, E2E) | DevOps | ⏳ NOT BUILT | Needs implementation |
| 12 | Developer Experience (Docs, DX, Seed) | All | ⏳ IN PROGRESS | Local DX working |

---

## ⚡ GOLDEN RULES

```
1. Never merge to main with a failing CI.
2. Never deploy to production without a passing staging build.
3. Never write DB queries outside of packages/db service files.
4. Never cross-import between apps/dashboard and apps/builder.
5. Never store secrets in code — only in environment variables.
6. Never skip the ownership check in a mutating API route.
7. Never ship a new feature without a test for the happy path + unauthorized path.
8. Never mark a Tier DONE until every checklist item is ✅ PASS.
```

---

*Bookin Suite Architecture Checklist · Built for production · Rivaling Webflow + Mindbody*
