# BOOKIN — Agent Master Plan & Architecture Bible
> **Version:** 1.0 | **Stack:** Next.js 14 · Supabase · Prisma · Turborepo · Craft.js · Tailwind  
> **Purpose:** This document is the single source of truth for every AI agent or developer working on this codebase. Read this fully before writing a single line of code.

---

## TABLE OF CONTENTS
1. [Vision & North Star](#1-vision--north-star)
2. [Tech Stack & Non-Negotiable Rules](#2-tech-stack--non-negotiable-rules)
3. [Monorepo Folder Structure (Full)](#3-monorepo-folder-structure-full)
4. [Database Architecture](#4-database-architecture)
5. [Module Breakdown & Ownership](#5-module-breakdown--ownership)
6. [Phase-by-Phase Roadmap](#6-phase-by-phase-roadmap)
7. [Coding Rules & Conventions](#7-coding-rules--conventions)
8. [Performance Rules](#8-performance-rules)
9. [Security Rules](#9-security-rules)
10. [Component Library Plan (50+ blocks)](#10-component-library-plan-50-blocks)
11. [API Design Rules](#11-api-design-rules)
12. [State Management Rules](#12-state-management-rules)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment Architecture](#14-deployment-architecture)

---

## 1. Vision & North Star

**Bookin** is a multi-tenant SaaS platform that gives small businesses (clinics, salons, studios, coaches) a **complete online presence in minutes** — not just a booking widget, but a full website builder, CRM, e-commerce, forms, and automation engine. Think Wix + Calendly + HubSpot, purpose-built for service businesses.

### Core Tenets (never violate these)
- **Tenant Isolation is Sacred.** Every tenant gets a sandboxed Postgres schema. No data ever bleeds between tenants.
- **The Booking App is fast-first.** Visitor-facing pages must load under 1.5s on 4G. No heavy editor code ever ships to visitors.
- **The Builder is power-first.** Dashboard users get the full Craft.js editor with real-time saves, undo/redo, and multi-page support.
- **Mobile-first always.** Every block, every page, every component is responsive by default. No exceptions.
- **One feature at a time, done properly.** Never half-implement. A feature ships only when: it works, it's typed, it's protected by RLS, and it's tested.

---

## 2. Tech Stack & Non-Negotiable Rules

### Approved Stack
| Layer | Technology | Rules |
|---|---|---|
| Monorepo | Turborepo + pnpm workspaces | Never use npm or yarn. Always use `pnpm --filter <app>` |
| Frontend Framework | Next.js 14 App Router | No Pages Router. Use Server Components by default, Client only when needed |
| Styling | Tailwind CSS v3 | No inline `style={}` except for dynamic Craft.js values. Use `cn()` utility always |
| Component Primitives | shadcn/ui + Radix UI | Never build modals, dropdowns, tooltips from scratch |
| Page Builder | Craft.js | Only loaded in the dashboard builder route. Never imported in the booking app |
| Database ORM | Prisma (public schema) | All public/shared models go through Prisma |
| Tenant DB | Raw `pg` / Supabase SQL | Dynamic per-tenant schemas use raw SQL via Supabase service role client |
| Auth | Supabase Auth | Never roll your own auth. Use Supabase JWTs everywhere |
| File Storage | Supabase Storage | All media uploads go to tenant-scoped buckets |
| Email | Resend + React Email | All transactional emails use React Email templates |
| Payments | Stripe | Subscriptions (SaaS billing) + Connect (tenant e-commerce payouts) |
| Compression | lz-string | Page layouts must be compressed before saving to DB |
| Validation | Zod | Every API route input and every form is validated with Zod |
| Type Safety | TypeScript strict mode | `strict: true` in every tsconfig. No `any`. No `@ts-ignore` |

### Banned Patterns
- ❌ No `fetch()` inside React Server Components without `cache()` or `revalidate`
- ❌ No `useEffect` for data fetching — use React Query or server actions
- ❌ No Prisma calls from the booking app — use API routes or server actions only
- ❌ No hardcoded tenant IDs or schema names anywhere
- ❌ No `console.log` in production code — use a structured logger
- ❌ Never store secrets in `.env.local` committed to git

---

## 3. Monorepo Folder Structure (Full)

```
bookin/
├── apps/
│   ├── dashboard/                    # SaaS dashboard (tenants manage everything here)
│   │   ├── app/
│   │   │   ├── (auth)/               # Login, signup, forgot-password pages
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── signup/page.tsx
│   │   │   │   └── reset/page.tsx
│   │   │   ├── (app)/                # Protected: requires active session
│   │   │   │   ├── layout.tsx        # Root shell: sidebar + topbar
│   │   │   │   ├── page.tsx          # Dashboard home / overview
│   │   │   │   ├── builder/          # Site Builder (Craft.js editor)
│   │   │   │   │   ├── page.tsx      # Page list (home, about, etc.)
│   │   │   │   │   └── [slug]/       # Editor for a specific page
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── bookings/         # Booking management
│   │   │   │   │   ├── page.tsx      # Calendar + list view
│   │   │   │   │   └── [id]/page.tsx # Single booking detail
│   │   │   │   ├── services/         # Service catalog management
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── staff/            # Staff / provider management
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── crm/              # Customer profiles
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── forms/            # Form builder
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── shop/             # E-commerce module
│   │   │   │   │   ├── products/
│   │   │   │   │   ├── orders/
│   │   │   │   │   └── settings/
│   │   │   │   ├── automations/      # Workflow automation
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── media/            # Asset manager
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── analytics/        # Stats and reporting
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/         # Tenant settings
│   │   │   │       ├── general/
│   │   │   │       ├── billing/
│   │   │   │       ├── domains/
│   │   │   │       └── integrations/
│   │   │   └── api/
│   │   │       ├── builder/
│   │   │       │   ├── save/route.ts
│   │   │       │   ├── load/route.ts
│   │   │       │   └── pages/route.ts  # CRUD for page slugs
│   │   │       ├── bookings/route.ts
│   │   │       ├── services/route.ts
│   │   │       ├── staff/route.ts
│   │   │       ├── media/
│   │   │       │   ├── upload/route.ts
│   │   │       │   └── delete/route.ts
│   │   │       ├── crm/route.ts
│   │   │       ├── forms/route.ts
│   │   │       ├── shop/
│   │   │       │   ├── products/route.ts
│   │   │       │   └── orders/route.ts
│   │   │       ├── automations/route.ts
│   │   │       └── webhooks/
│   │   │           ├── stripe/route.ts
│   │   │           └── resend/route.ts
│   │   ├── components/
│   │   │   ├── builder/              # Craft.js editor components
│   │   │   │   ├── Editor.tsx
│   │   │   │   ├── Topbar.tsx
│   │   │   │   ├── Toolbox.tsx
│   │   │   │   ├── SettingsPanel.tsx
│   │   │   │   └── blocks/           # All draggable blocks (see section 10)
│   │   │   ├── dashboard/            # Dashboard-specific UI components
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── BookingCalendar.tsx
│   │   │   │   └── ActivityFeed.tsx
│   │   │   ├── shared/               # Components shared across dashboard pages
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   └── ConfirmDialog.tsx
│   │   │   └── ui/                   # shadcn/ui overrides & extensions
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── server.ts         # createServerClient (SSR)
│   │   │   │   └── client.ts         # createBrowserClient
│   │   │   ├── tenant.ts             # getTenantFromSession(), getTenantSchema()
│   │   │   ├── builder-utils.ts      # compress/decompress helpers
│   │   │   └── validations/          # Zod schemas per module
│   │   │       ├── booking.ts
│   │   │       ├── service.ts
│   │   │       └── builder.ts
│   │   └── hooks/
│   │       ├── use-tenant.ts
│   │       ├── use-builder-save.ts
│   │       └── use-media-upload.ts
│   │
│   └── booking/                      # Customer-facing public site
│       ├── app/
│       │   ├── [clinic]/             # Tenant subdomain or slug routing
│       │   │   ├── page.tsx          # Home page renderer
│       │   │   ├── [slug]/page.tsx   # Dynamic page renderer (about, contact, etc.)
│       │   │   └── book/page.tsx     # Standalone booking flow
│       │   └── layout.tsx
│       ├── components/
│       │   ├── renderer/
│       │   │   ├── CustomPageRenderer.tsx   # JSON → DOM, zero editor overhead
│       │   │   ├── BlockRenderer.tsx        # Recursive block resolver
│       │   │   └── blocks/                  # Read-only render versions of all blocks
│       │   └── booking/
│       │       ├── BookingWidget.tsx
│       │       ├── ServicePicker.tsx
│       │       ├── StaffPicker.tsx
│       │       ├── DateTimePicker.tsx
│       │       └── ConfirmationStep.tsx
│       └── lib/
│           ├── tenant-resolver.ts    # Resolves clinic slug → tenant schema
│           └── page-loader.ts        # Fetches + decompresses page layout
│
├── packages/
│   ├── db/                           # Shared database layer
│   │   ├── prisma/
│   │   │   └── schema.prisma         # Public schema models (Tenant, User, Plan, etc.)
│   │   └── src/
│   │       ├── index.ts              # Prisma client export
│   │       ├── provisioner.ts        # Dynamic schema creation for new tenants
│   │       └── migrations/           # Raw SQL migration files for tenant schemas
│   │           └── 001_tenant_base.sql
│   ├── ui/                           # Shared UI component library
│   │   └── src/
│   │       ├── components/           # Headless primitives used across apps
│   │       └── index.ts
│   ├── types/                        # Shared TypeScript types
│   │   └── src/
│   │       ├── tenant.ts
│   │       ├── builder.ts
│   │       ├── booking.ts
│   │       └── index.ts
│   ├── config/                       # Shared config (eslint, tailwind, tsconfig)
│   │   ├── eslint-config/
│   │   ├── tailwind-config/
│   │   └── typescript-config/
│   └── utils/                        # Pure utility functions (no DB, no HTTP)
│       └── src/
│           ├── compress.ts           # lz-string wrappers
│           ├── slugify.ts
│           ├── date.ts
│           └── index.ts
│
├── turbo.json
├── pnpm-workspace.yaml
└── .env.example
```

---

## 4. Database Architecture

### 4.1 Public Schema (Prisma-managed)
These are platform-level models — same for all tenants.

```prisma
model Tenant {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique         // used as subdomain: slug.bookin.app
  schemaName  String   @unique         // postgres schema: tenant_abc123
  plan        PlanType @default(FREE)
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  createdAt   DateTime @default(now())
  customDomain String?  @unique        // optional CNAME: mybusiness.com
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      UserRole @default(OWNER)
  tenants   Tenant[]
  createdAt DateTime @default(now())
}

model Plan {
  id          String  @id
  name        String  // FREE, STARTER, PRO, ENTERPRISE
  maxPages    Int
  maxServices Int
  maxStaff    Int
  maxBookings Int     // per month
  hasShop     Boolean
  hasCRM      Boolean
  hasAutomations Boolean
}
```

### 4.2 Per-Tenant Schema (raw SQL, auto-provisioned)
Every tenant gets their own Postgres schema `tenant_{cuid}` with these tables:

```sql
-- 001_tenant_base.sql (run on every new tenant signup)

CREATE TABLE {schema}.pages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT NOT NULL UNIQUE,          -- 'home', 'about', 'services'
  title      TEXT NOT NULL,
  layout     TEXT,                          -- lz-string compressed JSON
  published  BOOLEAN DEFAULT false,
  seo_title  TEXT,
  seo_desc   TEXT,
  og_image   TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE {schema}.services (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT,
  duration_min INT NOT NULL,
  price        NUMERIC(10,2),
  currency     TEXT DEFAULT 'INR',
  color        TEXT,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE {schema}.staff (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT,
  avatar_url TEXT,
  bio        TEXT,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE {schema}.staff_services (
  staff_id   UUID REFERENCES {schema}.staff(id) ON DELETE CASCADE,
  service_id UUID REFERENCES {schema}.services(id) ON DELETE CASCADE,
  PRIMARY KEY (staff_id, service_id)
);

CREATE TABLE {schema}.availability (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id   UUID REFERENCES {schema}.staff(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL,             -- 0=Sun, 6=Sat
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL
);

CREATE TABLE {schema}.bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id    UUID REFERENCES {schema}.services(id),
  staff_id      UUID REFERENCES {schema}.staff(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  starts_at     TIMESTAMPTZ NOT NULL,
  ends_at       TIMESTAMPTZ NOT NULL,
  status        TEXT DEFAULT 'confirmed',  -- confirmed, cancelled, no_show
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE {schema}.customers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT UNIQUE,
  phone      TEXT,
  notes      TEXT,
  tags       TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE {schema}.forms (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  fields     JSONB NOT NULL DEFAULT '[]',  -- form field definitions
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE {schema}.form_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id    UUID REFERENCES {schema}.forms(id),
  data       JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE {schema}.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2),
  stock       INT DEFAULT 0,
  images      TEXT[],
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE {schema}.orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  UUID REFERENCES {schema}.customers(id),
  items        JSONB NOT NULL,
  total        NUMERIC(10,2),
  status       TEXT DEFAULT 'pending',
  stripe_id    TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE {schema}.automations (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT NOT NULL,
  trigger   TEXT NOT NULL,             -- 'booking.created', 'form.submitted', etc.
  actions   JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed the home page
INSERT INTO {schema}.pages (slug, title, published)
VALUES ('home', 'Home', true);
```

### 4.3 Schema Provisioner Rules
- **Always** run `001_tenant_base.sql` on new tenant signup — never skip it
- **Never** run raw DDL from the client — always server-side with service role key
- Schema names must be `tenant_` + cuid, never guessable
- Always wrap provisioning in a transaction — if any table fails, roll back everything
- Log every provisioning event to a `public.provision_logs` table

---

## 5. Module Breakdown & Ownership

Each module is fully self-contained. When implementing a module, implement ALL layers: DB table, API route, dashboard UI, and any booking-app integration.

### Module 1: Site Builder
- **Status:** MVP done
- **Next steps:** Multi-page CRUD, BookingWidgetBlock, SEO fields per page
- **Files:** `apps/dashboard/app/(app)/builder/`, `components/builder/`
- **Rule:** Craft.js editor code must NEVER be imported in `apps/booking`

### Module 2: Booking Engine
- **Status:** Exists in some form, needs full integration with new schema
- **Components:** Service picker → Staff picker → Date/time picker → Confirmation
- **Rule:** Show only available slots (cross-check `availability` + existing `bookings`)
- **Rule:** All booking confirmations trigger an automation event `booking.created`

### Module 3: CRM
- **Status:** Not started
- **Function:** Auto-creates customer record on first booking; merge duplicates by email
- **Rule:** Never delete customers, only soft-delete with `deleted_at`

### Module 4: Form Builder
- **Status:** Not started
- **Function:** Drag fields (text, email, phone, select, checkbox, date) → generate form → embed in site builder as a `FormBlock`
- **Rule:** Form submissions must fire automation event `form.submitted`

### Module 5: E-Commerce (Shop)
- **Status:** Not started
- **Function:** Products, orders, Stripe Checkout integration
- **Rule:** Do NOT build a custom checkout UI — use Stripe Checkout Sessions
- **Rule:** Stripe webhooks update order status, never trust client-side success

### Module 6: Automations
- **Status:** Not started
- **Function:** Trigger → Condition → Action pipeline
- **Supported Triggers:** `booking.created`, `booking.cancelled`, `form.submitted`, `order.placed`
- **Supported Actions:** `email.send`, `webhook.post`
- **Rule:** Automations run server-side only, never on the client

### Module 7: Media Manager
- **Status:** Partially done (URL-only)
- **Next steps:** File upload to Supabase Storage bucket `tenant-{tenantId}`
- **Rule:** Enforce 10MB max per file, images only (jpg, png, webp, gif, svg)
- **Rule:** Return public CDN URL after upload, store in `pages` or block JSON

### Module 8: Analytics
- **Status:** Not started
- **Scope:** Bookings per week, revenue, top services, top staff, form conversions
- **Rule:** Aggregate queries only, never raw customer data in analytics views

---

## 6. Phase-by-Phase Roadmap

### Phase 1 — Foundation Hardening (Current → Done)
**Goal:** Make what exists bulletproof before adding more.

- [ ] Fix BookingWidgetBlock — make it draggable in Craft.js, renders actual booking flow
- [ ] Multi-page support — CRUD API for pages, list view in dashboard
- [ ] Per-page SEO fields (title, description, OG image) with preview
- [ ] Media Manager — upload to Supabase Storage, return URL, insert into builder
- [ ] Global error boundaries in both apps
- [ ] Add Zod validation to ALL existing API routes
- [ ] Add RLS policies to ALL tenant schema tables
- [ ] Automated provisioner test — sign up a test tenant, verify all tables exist

### Phase 2 — Booking Engine v2
**Goal:** Full booking flow, polished and production-ready.

- [ ] Services CRUD dashboard page
- [ ] Staff CRUD dashboard page with availability schedule editor
- [ ] Public booking flow: multi-step wizard in `apps/booking`
- [ ] Booking dashboard: calendar view + list + status management
- [ ] Email confirmations via Resend on `booking.created`
- [ ] Cancellation flow with confirmation email
- [ ] iCal export for bookings

### Phase 3 — CRM + Forms
**Goal:** Turn visitors into known customers.

- [ ] CRM customer list + profile detail page
- [ ] Auto-link bookings and form submissions to customer records
- [ ] Form builder: drag-and-drop field editor in dashboard
- [ ] Form embed as `FormBlock` in site builder
- [ ] Form submission list with export to CSV

### Phase 4 — E-Commerce
**Goal:** Let tenants sell products and services online.

- [ ] Products CRUD in dashboard
- [ ] Stripe Connect onboarding for tenants
- [ ] Product listing block in site builder
- [ ] Stripe Checkout Session creation endpoint
- [ ] Order management dashboard
- [ ] Stripe webhook handler for order status

### Phase 5 — Automations
**Goal:** Reduce manual work for tenants.

- [ ] Automation list + builder UI (trigger → action visual editor)
- [ ] Event bus implementation (internal pub/sub)
- [ ] Email action with React Email template editor
- [ ] Webhook action
- [ ] Automation logs / history

### Phase 6 — Growth & Polish
**Goal:** Make it launch-worthy and scale-ready.

- [ ] Custom domain support (CNAME verification)
- [ ] Analytics dashboard
- [ ] SaaS billing via Stripe Subscriptions (plan enforcement)
- [ ] Onboarding wizard for new tenants
- [ ] Mobile-responsive dashboard audit
- [ ] Lighthouse audit on booking app — achieve 90+ score
- [ ] Admin super-panel for Bookin team

---

## 7. Coding Rules & Conventions

### File Naming
- Pages: `page.tsx` (Next.js convention)
- Components: `PascalCase.tsx` (e.g., `BookingCalendar.tsx`)
- Utilities: `kebab-case.ts` (e.g., `tenant-resolver.ts`)
- API routes: `route.ts` (Next.js convention)
- Types: `PascalCase.ts` or group in `types/` package

### Component Rules
```tsx
// ✅ CORRECT: Server Component by default
export default async function BookingsPage() {
  const bookings = await getBookings(); // server-side fetch
  return <BookingTable data={bookings} />;
}

// ✅ CORRECT: Mark client components explicitly
"use client";
export function BookingCalendar({ bookings }) { ... }

// ❌ WRONG: useEffect for data fetching
"use client";
export function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { fetch('/api/bookings').then(...) }, []); // never do this
}
```

### API Route Rules
Every API route must follow this structure:
```typescript
// apps/dashboard/app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import { getTenantFromSession } from "@/lib/tenant";

const CreateBookingSchema = z.object({
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  startsAt: z.string().datetime(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Tenant resolution
    const tenant = await getTenantFromSession(user.id);
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    // 3. Input validation
    const body = await req.json();
    const parsed = CreateBookingSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    // 4. Business logic
    // ... insert booking into tenant schema

    // 5. Return
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[POST /api/bookings]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### Styling Rules
```tsx
// ✅ Use cn() for conditional classes
import { cn } from "@/lib/utils";
<div className={cn("base-class", isActive && "active-class", variant === "primary" && "primary-class")} />

// ✅ Use CSS variables for tenant-specific theme colors (in builder blocks)
<div style={{ backgroundColor: "var(--tenant-primary, #6366f1)" }} />

// ❌ Never hardcode colors outside of Tailwind config
<div style={{ backgroundColor: "#6366f1" }} />  // wrong: not themeable
```

### TypeScript Rules
```typescript
// ✅ Always type API responses
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

// ✅ Use types from packages/types — never redefine
import type { Tenant, Booking } from "@book-in/types";

// ❌ Never use 'any'
const data: any = await fetch(...); // banned

// ❌ Never ignore TypeScript errors
// @ts-ignore  ← this will be rejected in code review
```

---

## 8. Performance Rules

### Booking App (visitor-facing) — CRITICAL
- **Target:** LCP < 1.5s, FCP < 0.8s, CLS = 0
- All pages must use `generateStaticParams` where possible
- Page layouts are fetched server-side and decompressed on the server — never decompress on the client in the render path
- `CustomPageRenderer` must be a Server Component rendering pure HTML — no hydration overhead
- Craft.js must be in a completely separate JS bundle — use dynamic imports with `ssr: false`
- Images in blocks must use `next/image` with proper `width`, `height`, and `priority` on hero images
- No third-party scripts in the booking app head unless tenant has explicitly enabled them

### Dashboard App
- Use React Query (`@tanstack/react-query`) for all client-side data fetching with proper stale times
- Tables with more than 100 rows must use virtual scrolling (TanStack Virtual)
- The builder canvas must not re-render the entire tree on every style change — use Craft.js's node-level selectors
- Avoid barrel imports (`import * from "components"`) — they bloat bundles

### Database
- Every tenant table's primary foreign keys must have indexes
- The `bookings.starts_at` column must have a BTREE index
- Use `SELECT` with explicit columns — never `SELECT *` in hot paths
- Paginate all list queries — default page size is 25, max is 100

---

## 9. Security Rules

### Authentication
- All `(app)` routes in the dashboard must check session in `layout.tsx` using middleware
- The service role Supabase key must NEVER be exposed to the client — only used server-side
- All API routes must validate the user's session before any DB operation
- JWT tokens must be verified server-side — never trust client-provided tenant IDs

### Tenant Isolation
- The `schemaName` used in raw SQL must ALWAYS be validated against the authenticated user's tenant before use
- SQL schema names must be sanitized — only allow alphanumeric + underscore characters
- Never accept a schema name from the request body or query params — always derive from session

### Input Sanitization
- All user-generated content rendered as HTML (page titles, block text) must be sanitized with `DOMPurify` on the client render side
- Zod validation is mandatory — reject requests that don't match the schema
- File uploads: validate MIME type server-side (not just extension) and enforce size limits

### Supabase RLS
- Every tenant schema table must have RLS enabled — no exceptions
- The service role bypasses RLS (by design) — use it ONLY in provisioner and admin routes
- The anon key must NEVER have write access to any tenant data

---

## 10. Component Library Plan (50+ Blocks)

All blocks live in `apps/dashboard/components/builder/blocks/`. Each block must also have a matching read-only render version in `apps/booking/components/renderer/blocks/`.

### Layout Blocks (8)
| Block | Description |
|---|---|
| `Container` | Flex/Grid wrapper with gap, padding, direction controls |
| `Section` | Full-width section with background color/image and padding |
| `TwoColumn` | Two-column responsive layout |
| `ThreeColumn` | Three-column responsive layout |
| `HeroBlock` | Full-viewport hero with heading, subheading, CTA |
| `Divider` | Horizontal rule with style options |
| `Spacer` | Empty vertical space block |
| `Grid` | CSS Grid container with configurable columns |

### Content Blocks (12)
| Block | Description |
|---|---|
| `Text` | Rich typographic block (done) |
| `Heading` | H1–H6 with font/size/color controls |
| `Image` | Responsive image with alt text and link option |
| `Video` | YouTube/Vimeo embed via URL |
| `Button` | CTA button (done) |
| `IconButton` | Button with Lucide icon |
| `Badge` | Small label/tag |
| `Blockquote` | Styled pull quote |
| `List` | Bullet or numbered list |
| `Table` | Simple data table |
| `CodeBlock` | Syntax-highlighted code (for tech-focused tenants) |
| `HTML` | Raw HTML embed (power users) |

### Business Blocks (10)
| Block | Description |
|---|---|
| `BookingWidget` | Embeds the full booking flow at any position |
| `ServiceCard` | Displays a single service with name, price, duration |
| `ServiceList` | Auto-fetches and renders tenant's services |
| `StaffCard` | Staff member profile card |
| `StaffGrid` | Auto-fetches and renders all staff |
| `PricingTable` | Plans/packages comparison table |
| `ProductCard` | Single product display (shop module) |
| `ProductGrid` | Auto-fetches and renders products |
| `FormEmbed` | Embeds a tenant form (form builder module) |
| `ReviewCard` | Static testimonial/review display |

### Navigation Blocks (5)
| Block | Description |
|---|---|
| `Navbar` | Responsive navigation bar with logo and links |
| `Footer` | Site footer with columns and social links |
| `BreadCrumb` | Page breadcrumb trail |
| `StickyHeader` | Fixed-position header on scroll |
| `MobileMenu` | Hamburger menu for mobile |

### Social Proof Blocks (6)
| Block | Description |
|---|---|
| `TestimonialCard` | Single customer quote with avatar |
| `TestimonialSlider` | Carousel of testimonials |
| `LogoStrip` | Client/partner logo row |
| `StarRating` | Visual star rating display |
| `StatsBanner` | "500+ clients · 10k bookings · 4.9★" strip |
| `FAQAccordion` | Expandable Q&A accordion |

### Media Blocks (4)
| Block | Description |
|---|---|
| `Gallery` | Masonry or grid image gallery |
| `VideoBackground` | Section with background video |
| `MapEmbed` | Google Maps embed |
| `IframeEmbed` | Generic iframe for embeds |

### Utility Blocks (5)
| Block | Description |
|---|---|
| `SEOHead` | Per-page title, description meta (non-visual, config-only) |
| `SocialLinks` | Row of social media icon links |
| `CookieBanner` | GDPR cookie consent banner |
| `BackToTop` | Floating back-to-top button |
| `CountdownTimer` | Launch or offer countdown |

---

## 11. API Design Rules

- All endpoints are RESTful under `/api/[resource]`
- Use HTTP verbs correctly: `GET` (read), `POST` (create), `PUT` (full update), `PATCH` (partial update), `DELETE`
- Always return consistent response shapes:
  ```json
  // Success
  { "success": true, "data": { ... } }
  // Error
  { "success": false, "error": "Human readable message", "details": { ... } }
  ```
- Paginated responses include:
  ```json
  { "success": true, "data": [...], "pagination": { "page": 1, "pageSize": 25, "total": 143 } }
  ```
- Never expose internal Postgres errors to the client — catch and map them
- Add rate limiting to public-facing booking APIs (Upstash Ratelimit)

---

## 12. State Management Rules

| Scope | Solution |
|---|---|
| Server data (lists, details) | React Query with query keys like `["bookings", tenantId]` |
| Builder editor state | Craft.js internal state only — do NOT sync to React Query |
| Forms | React Hook Form + Zod resolver |
| Global UI state (modals, sidebar) | Zustand — one small store |
| URL state (filters, tabs) | `nuqs` (Next.js URL query state) |
| Auth session | Supabase Auth context |

---

## 13. Testing Strategy

### Priority Order
1. **Provisioner tests** — most critical, test every tenant table gets created
2. **API route tests** — test auth, validation, and DB logic for every route
3. **Booking flow E2E** — happy path: select service → staff → time → confirm
4. **Builder save/load** — compress, save, load, decompress, verify round-trip

### Tools
- Unit/integration: `vitest`
- E2E: `playwright`
- API testing: `supertest` or Playwright API routes

---

## 14. Deployment Architecture

```
                    ┌─────────────────────────────────┐
                    │         Vercel (Edge)            │
                    │                                  │
              ┌─────┴──────┐              ┌────────────┴─────┐
              │  dashboard │              │    booking app   │
              │ .bookin.app│              │  [slug].bookin.app│
              └─────┬──────┘              └────────────┬─────┘
                    │                                  │
                    └──────────────┬───────────────────┘
                                   │
                         ┌─────────▼──────────┐
                         │    Supabase         │
                         │  - Auth             │
                         │  - Postgres         │
                         │    ├ public schema  │
                         │    └ tenant_* schemas│
                         │  - Storage          │
                         │  - Realtime         │
                         └─────────────────────┘
```

### Environment Variables (never commit these)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never NEXT_PUBLIC_

# App URLs
NEXT_PUBLIC_DASHBOARD_URL=https://app.bookin.app
NEXT_PUBLIC_BOOKING_URL=https://bookin.app

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=

# Database (direct connection for Prisma migrations)
DATABASE_URL=
```

---

## AGENT QUICK REFERENCE — Before You Write Code

Ask yourself these questions before implementing anything:

1. **Does this code run on the visitor-facing booking app?** If yes, zero Craft.js, zero heavy imports, Server Component first.
2. **Does this touch the database?** Validate tenant ownership. Sanitize schema name. Use Zod on input.
3. **Does this create or modify a block?** Create it in both `/builder/blocks/` (editor version) AND `/renderer/blocks/` (read-only version).
4. **Does this create a new table or column?** Add it to `001_tenant_base.sql` AND update the Prisma schema if it's a public model.
5. **Does this add a new user action?** Wire it to the automations event bus (`booking.created`, `form.submitted`, etc.).
6. **Is this a new dashboard page?** Add it to the sidebar nav in `SidebarNav.tsx` with the correct Lucide icon.
7. **Does this involve file uploads?** Route through `/api/media/upload`. Validate MIME type server-side. Store in tenant-scoped bucket.

---

*End of Master Plan. This document should be updated whenever a phase is completed or major architectural decisions are made.*
