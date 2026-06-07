# ✅ Confirmed Bookin URL Routing Architecture

## Key Decisions (Confirmed)

| Stage | URL Pattern | Why |
|-------|-------------|-----|
| **Editing** (in Builder) | `studio.bookin.com/editor/[websiteId]` | Secure, session-protected, Sub-URL path |
| **Draft Preview** (in Builder) | `studio.bookin.com/preview/[websiteId]` | Same app, uses auth session, renders draft JSON |
| **Published — Free Tier** | `[slug].bookin.com` | Professional subdomain, wildcard DNS |
| **Published — Premium Tier** | `www.[custom-domain].com` | Fully branded, dynamic SSL via Cloudflare |

> **Core Principle:** The Builder App only runs in the Studio. Live sites only run in `apps/sites`. They NEVER share code or traffic.

---

## Full Request → Response Flow

### 1. During Editing
```
Browser                     → studio.bookin.com/editor/[websiteId]
Builder App (Next.js)       → Session validated via Supabase Auth
CraftJS Canvas              → Fetches draft designJson from DB
Auto-save                   → POST /api/studio/save (debounced, 2s)
```

### 2. During Preview (Draft)
```
Browser                     → studio.bookin.com/preview/[websiteId]
Builder App (Next.js SSR)   → Session validated (so drafts are protected)
Server Component            → Fetches designJson from DB
HTML Renderer               → Generates HTML server-side (same publish pipeline)
Returns                     → Full page preview (no editor chrome)
```

### 3. On Publish
```
User clicks "Publish"
→ POST /api/studio/publish (Studio App)
→ Generates static HTML + CSS from designJson
→ Uploads HTML to Supabase Storage (or R2)
→ Writes WebsiteVersion snapshot to DB
→ Calls POST apps/sites/api/revalidate (purges Edge cache)
→ Sets BuilderWebsite.status = "PUBLISHED"
→ Writes domainToWebsite mapping to Upstash Redis
```

### 4. Visitor Hits Live Site
```
Visitor                     → my-clinic.bookin.com OR www.myclinic.com
Vercel Edge Middleware       → Reads Host header
                            → Queries Upstash Redis (GET domain:my-clinic.bookin.com)
                            → Returns { websiteId: "clx..." }  ← <1ms
                            → Rewrites URL internally to /s/[websiteId]
apps/sites Route Handler    → Fetches HTML from Supabase Storage
                            → Streams response with aggressive cache headers
                            → Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800
                            → ISR: revalidateTag("site-[websiteId]") used for cache busting
```

---

## Why Upstash Redis at the Edge?

The `Host` header mapping (`my-clinic.bookin.com` → `websiteId`) cannot use Prisma.
Prisma requires a Node.js runtime. The Edge Middleware only allows a limited runtime.

**Upstash Redis** solves this perfectly because:
1. It runs over HTTP — works in both Edge and Node.js.
2. P99 latency is typically **1-5ms globally**.
3. A simple Redis GET is all we need — no complex queries.
4. When a user publishes or sets a custom domain, we just `SET domain:<host> <websiteId>`.

---

## Data Written to Redis on Each Publish

```
domain:my-clinic.bookin.com  →  { websiteId: "clx123", slug: "my-clinic" }
domain:www.myclinic.com      →  { websiteId: "clx123", slug: "my-clinic" }
```

---

## Error Handling & Fallbacks

| Error | Behaviour |
|-------|-----------|
| Redis miss (cold start) | Middleware falls back to a fast indexed Prisma query in Node.js runtime |
| Storage download fails | Returns a styled 404 page with the Bookin brand |
| Cache is stale | `stale-while-revalidate` serves the old page while fetching the new one in background |
| Custom domain not verified | Show a "Domain Pending" holding page |
| Builder App is down | `apps/sites` continues serving cached HTML independently |

---

## Apps Separation Summary

```
apps/
  dashboard/   → SaaS Management (Supabase Auth, SaasUser sessions)
  builder/     → Studio Editor (CraftJS, StudioUser sessions, Publish pipeline)
  sites/       → Live Website Serving (Edge Middleware + Redis + Storage)
  marketing/   → bookin.com landing page (static, no auth)
  booking/     → Public booking page widget (iframe-embeddable, no auth)
```

### Zero Coupling Rules:
- `apps/sites` has NO dependency on CraftJS, Tailwind classes from the Builder, or StudioUser auth.
- `apps/builder` has NO dependency on `apps/sites` routing logic.
- Cross-app communication happens ONLY via:
  - POST `/api/revalidate` (Builder → Sites)
  - Upstash Redis (Builder writes, Sites reads)
  - Supabase Storage (Builder uploads, Sites downloads)

---

## Implementation Phases for `apps/sites`

### Phase 4.1 — Edge Middleware + Redis Routing
- [ ] Install `@upstash/redis` in `apps/sites`
- [ ] Write `apps/sites/middleware.ts` (Edge, parses Host, queries Redis, rewrites)
- [ ] Fallback to indexed Prisma query on Redis miss

### Phase 4.2 — Static HTML Serving Route
- [ ] Clean up the existing `apps/sites/app/[domain]/[[...slug]]/route.ts`
- [ ] Rename to `apps/sites/app/s/[websiteId]/[[...path]]/route.ts`
- [ ] Add `next/cache` ISR tag invalidation support
- [ ] Add proper 404 branded error page

### Phase 4.3 — Cache Invalidation Webhook
- [ ] Create `apps/sites/app/api/revalidate/route.ts`
- [ ] Validate `REVALIDATE_SECRET` header from Builder
- [ ] Call `revalidateTag("site-[websiteId]")`

### Phase 4.4 — Publish Pipeline Update (Builder side)
- [ ] On Publish: Write domain→websiteId to Redis
- [ ] On Publish: POST revalidation to `apps/sites`
- [ ] On Custom Domain Set: Update Redis key

---

## Required Environment Variables

**`apps/sites`:**
```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
REVALIDATE_SECRET=        # shared with apps/builder
DATABASE_URL=             # fallback for Redis miss
BOOKIN_ROOT_DOMAIN=bookin.com
```

**`apps/builder`:**
```env
UPSTASH_REDIS_REST_URL=   # to write domain mappings on Publish
UPSTASH_REDIS_REST_TOKEN=
SITES_REVALIDATE_URL=     # URL to call sites/api/revalidate
REVALIDATE_SECRET=        # shared with apps/sites
```
