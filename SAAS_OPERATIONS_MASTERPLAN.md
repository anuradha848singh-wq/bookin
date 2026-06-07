# 🚀 Bookin — SaaS Operations Platform Master Plan

> **Document Status**: ✅ APPROVED ARCHITECTURAL BLUEPRINT  
> **Version**: 2.0 — Restructured & Upgraded  
> **Unified Stack**: Next.js 14 (App Router) · PostgreSQL (Multi-Tenant) · Prisma · Supabase · Stripe · Resend · Zustand · Tailwind CSS  
> **Timeline**: 18 Weeks (4.5 Months)  
> **Target**: Phase 14 Complete — *A full-featured, enterprise-grade SaaS operations engine that powers every clinic, salon, gym, and service business.*

---

## 📊 Phase Completion Tracker

| Phase | Module | Status | Completion |
|-------|--------|--------|-----------|
| Phase 0 | Foundation & Monorepo Setup | ✅ Complete | 100% |
| Phase 1 | Tenant Provisioning & Auth | ✅ Complete | 100% |
| Phase 2 | Services & Staff Catalogue | ✅ Complete | 100% |
| Phase 3 | Availability Slot Engine | ✅ Complete | 100% |
| Phase 4 | CRM & Client Profiles | ✅ Complete | 100% |
| Phase 5 | Booking Engine API | ✅ Complete | 100% |
| Phase 6 | Dashboard Scheduling UI | ✅ Complete | 100% |
| Phase 7 | Payments (Multi-Gateway) | ✅ Complete | 100% |
| Phase 8 | Dynamic Forms Engine | ✅ Complete | 100% |
| Phase 9 | Multi-Location Architecture | ✅ Complete | 100% |
| Phase 10 | E-Commerce & Inventory | ✅ Complete | 100% |
| Phase 11 | Event Bus Automations | ✅ Complete | 100% |
| Phase 12 | Website Builder Smart Blocks | ✅ Complete | 100% |
| Phase 13 | Consumer Booking Portal | ✅ Complete | 100% |
| Phase 14 | Analytics & Financial Reports | ⏳ Pending | — |
| Phase 15 | Marketing Site & Onboarding | ⏳ Pending | — |
| Phase 16 | Production Hardening & Launch | ⏳ Pending | — |

**Total Duration**: 18 Weeks  
**Current Status**: Phase 13 Complete → Proceeding to Phase 14

---

## 🎯 Executive Overview & Platform Flywheel

Bookin is a comprehensive **multi-tenant SaaS platform** engineered for service-based businesses — medical clinics, spas, salons, fitness studios, law firms, and consultancies. The platform is built on two powerfully integrated pillars:

1. **The Operations Engine** — A suite of backend tools (CRM, scheduling, payments, automations) that run the business from the inside.  
2. **The Website Builder** — A Craft.js visual drag-and-drop builder that renders the public website, powered by live data from the Operations Engine via "Smart Blocks".

Every tenant gets a **fully isolated PostgreSQL schema**, and a fully functioning booking website out of the box — no development required.

### The Competitive Advantage

| Feature | Calendly | Acuity | Wix Bookings | **Bookin** |
|---------|----------|--------|-------------|-----------|
| Appointment Scheduling | ✅ | ✅ | ✅ | ✅ |
| CRM & Patient Profiles | ❌ | 🟡 Basic | ❌ | ✅ **Full** |
| Dynamic Forms Builder | ❌ | 🟡 Basic | ❌ | ✅ **Advanced** |
| Multi-Gateway Payments | 🟡 | 🟡 | 🟡 | ✅ **Factory Pattern** |
| E-Commerce & Inventory | ❌ | ❌ | 🟡 | ✅ **Variants + Ledger** |
| Visual Website Builder | ❌ | ❌ | ✅ | ✅ **Smart Block Binding** |
| Event Bus Automations | ❌ | ❌ | ❌ | ✅ **Full** |
| Multi-Location | ❌ | ❌ | ❌ | ✅ **Full** |
| White-Label | ❌ | ❌ | ❌ | ✅ **Custom Domain + CNAME** |

### The Unified Product Ecosystem

```
  ┌───────────────────────────────────────────────────────────┐
  │                      BOOKIN PLATFORM                      │
  │                                                           │
  │  ┌─────────────┐      ┌────────────────────────────────┐  │
  │  │apps/marketing│─────▶│     Public Platform DB (PG)    │  │
  │  └─────────────┘      │  tenants · users · memberships │  │
  │                       └──────────────┬─────────────────┘  │
  │                                      │ Provisions Schema   │
  │                                      ▼                     │
  │                       ┌─────────────────────────────────┐  │
  │  ┌─────────────┐      │   Tenant Isolated Schema (PG)   │  │
  │  │apps/dashboard│────▶│  services · staff · bookings    │  │
  │  └─────────────┘      │  clients · forms · orders       │  │
  │                       │  automations · automation_logs  │  │
  │  ┌─────────────┐      └──────────────┬─────────────────┘  │
  │  │ apps/booking │◀────────────────────┘                    │
  │  └─────────────┘      Reads live data for public portal    │
  │                                                           │
  │  ┌─────────────┐      Smart Blocks bind live ops data      │
  │  │ apps/builder │────▶ CraftJS renders pages from DB JSON  │
  │  └─────────────┘                                           │
  └───────────────────────────────────────────────────────────┘
```

---

## Phase 0: Foundation & Monorepo Setup ✅ COMPLETE

**Status**: ✅ Done  
**Duration**: Completed before sprint began

### Achievements
- ✅ Turborepo monorepo structure with `apps/` and `packages/`
- ✅ `packages/db` — Prisma + Raw SQL client for multi-tenant access
- ✅ `packages/ui` — Shared component library (Spinner, Card, etc.)
- ✅ `packages/lib` — Shared utilities (`getCachedClinicConfig`, etc.)
- ✅ Supabase Auth integration (JWT-based session resolution)
- ✅ `withTenantAuth` middleware for all protected API routes
- ✅ Turborepo dev server pipeline operational

---

## Phase 1: Tenant Provisioning & Auth ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ Public Prisma schema: `User`, `Tenant`, `Membership`, `ProvisioningLog`
- ✅ `/api/platform/signup` — Creates tenant, provisions isolated schema
- ✅ Session-to-schema resolution (never trusting URL params)
- ✅ Role system: `OWNER`, `ADMIN`, `MANAGER`, `STAFF`
- ✅ Guest demo bypass for quick development testing

### Public Platform Schema (Prisma)

```prisma
model User {
  id          String       @id @default(cuid())
  email       String       @unique
  role        UserRole     @default(OWNER)
  tenants     Tenant[]     @relation("TenantOwner")
  memberships Membership[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  @@map("users")
}

model Tenant {
  id           String       @id @default(cuid())
  name         String
  slug         String       @unique
  schemaName   String       @unique
  plan         PlanType     @default(FREE)
  ownerId      String
  owner        User         @relation("TenantOwner", fields: [ownerId], references: [id])
  customDomain String?      @unique
  stripeCustId String?
  isActive     Boolean      @default(true)
  memberships  Membership[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  @@map("tenants")
}
```

---

## Phase 2: Services & Staff Catalogue ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ `service_categories`, `services`, `service_addons` tables
- ✅ `staff`, `staff_services` bridge table (many-to-many)
- ✅ CRUD API for services (`/api/v1/catalog/services`)
- ✅ CRUD API for staff (`/api/v1/catalog/staff`)
- ✅ Dashboard UI: Service management page with category grouping
- ✅ Dashboard UI: Staff management page with service assignments

---

## Phase 3: Availability Slot Engine ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ `staff_hours` (weekly recurring schedule) — Day-of-week → Start/End time
- ✅ `schedule_exceptions` — Vacation days, sick leave, holidays
- ✅ `/api/v1/availability/slots` — Real-time slot calculator
- ✅ Slot calculation logic:
  1. Fetch weekly schedule rules for staff + day-of-week
  2. Subtract all `schedule_exceptions` on that specific date
  3. Subtract all existing `bookings` overlapping that window
  4. Compute free chunks incremented by `service.duration_minutes + buffer`
- ✅ Buffer time support between appointments (configurable per staff)
- ✅ All timestamps stored in UTC; frontend handles timezone offset display

---

## Phase 4: CRM & Client Profiles ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ `clients` table (first_name, last_name, email, phone, tags, metadata)
- ✅ `client_notes` — Pinnable internal staff notes per client
- ✅ `client_activities` — Immutable event timeline (bookings, payments, forms, notes)
- ✅ Auto-create or upsert client on booking portal submission (by email)
- ✅ CRM Dashboard: Full patient dossier page with activity timeline
- ✅ Dynamic tagging with `TEXT[]` column for CRM segmentation

---

## Phase 5: Booking Engine API ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ `bookings` table with `reference_number` (human-friendly), status history
- ✅ `booking_status_history` — Full audit trail of every status change
- ✅ `booking_addons` — Selected add-ons captured at booking time (price snapshot)
- ✅ POST `/api/v1/bookings` — Creates booking + auto-creates client + fires event bus
- ✅ PATCH `/api/v1/bookings/:id/status` — Status transitions with reason logging
- ✅ GET `/api/v1/bookings` — Paginated, filterable booking list

### Booking Validation Pipeline

```
  Incoming POST /api/v1/bookings
         │
         ▼
  1. Auth & Tenant Resolution (withTenantAuth)
         │
         ▼
  2. Validate Body (Zod Schema)
         │
         ▼
  3. Check Slot Availability (anti-overlap query)
         │
         ▼
  4. Upsert Client Profile (by email)
         │
         ▼
  5. Insert Booking Record (Postgres Transaction)
         │
         ▼
  6. Write Activity Log Entry
         │
         ▼
  7. Fire Event Bus → triggers automations
         │
         ▼
  8. Return Confirmation Payload
```

---

## Phase 6: Dashboard Scheduling UI ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ Interactive daily/weekly appointment calendar grid
- ✅ Booking list with status filters, date range picker, staff filters
- ✅ Quick-add booking slide-over (search CRM or create new client on-the-fly)
- ✅ Drag-to-reschedule with backend PATCH update
- ✅ Color-coded status system (Confirmed: green, Pending: amber, Cancelled: red)
- ✅ Staff hours management UI (per-staff weekly schedule editor)

---

## Phase 7: Payments (Multi-Gateway Factory) ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ `tenant_payment_configs` table (per-tenant gateway configuration)
- ✅ `PaymentStrategy` interface and `PaymentFactory` pattern (`lib/payments/factory.ts`)
- ✅ `StripeProvider` — Full Stripe Checkout Session + Webhook integration
- ✅ `payments` table with polymorphic `type` (BOOKING, DEPOSIT, REFUND, ORDER)
- ✅ Stripe webhook handler — verifies signature, updates booking/order status
- ✅ Supports multiple providers dynamically (adding Razorpay/PayPal requires one new `Provider` class)

### Multi-Gateway Architecture

```typescript
// Factory resolves the correct provider at runtime — zero code changes for new gateways
const provider = await PaymentFactory.resolve(tenantSlug);
const session = await provider.createCheckoutSession({ amount, currency, metadata });
```

---

## Phase 8: Dynamic Forms Engine ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ `forms` table — JSON Schema-based form definitions with versioning
- ✅ `form_submissions` table — Responses stored as queryable JSONB
- ✅ POST `/api/v1/forms` — Create/update forms
- ✅ POST `/api/v1/forms/submissions` — Accept public form submissions, link to client + booking
- ✅ Forms Dashboard UI — Full CRUD management, field type previews
- ✅ Activity Timeline integration — Form submission logged as `FORM_SUBMITTED` event

### Supported Field Types
`text` · `textarea` · `email` · `phone` · `select` · `checkbox` · `date` · `file_upload`

---

## Phase 9: Multi-Location Architecture ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ `locations` table (name, address, timezone, is_primary, metadata)
- ✅ `staff.location_id` FK — Staff assigned to locations
- ✅ `bookings.location_id` FK — Bookings tracked per location
- ✅ CRUD API `/api/v1/locations`
- ✅ Locations Management Dashboard — Add / Edit / Set Primary Location
- ✅ Availability engine respects location-level timezone configuration

---

## Phase 10: E-Commerce & Inventory Ledger ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ `product_categories`, `products` (Physical + Digital), `product_variants` (SKU/barcode/price matrix)
- ✅ `inventory_transactions` — Immutable ledger preventing race conditions on stock
- ✅ `orders`, `order_items` — Full order lifecycle with Kanban fulfillment board
- ✅ POST `/api/v1/ecommerce/products` — Atomic product + variants + ledger creation (single transaction)
- ✅ Products List UI — Low stock warnings (`≤5`), aggregated variant counts
- ✅ Multi-Tab Product Builder UI — Details, Variants, Inventory Ledger tabs
- ✅ Kanban Orders Board — PENDING → PROCESSING → SHIPPED visual pipeline

### Inventory Safety Architecture
```sql
-- Stock is NEVER directly updated; it is derived from the ledger
SELECT COALESCE(SUM(change_amount), 0) AS stock_count
FROM inventory_transactions
WHERE variant_id = $1;
```

---

## Phase 11: Event Bus Automations Engine ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ `automations` table — Trigger event + conditions (JSONB array) + actions (JSONB array)
- ✅ `automation_logs` table — Immutable audit of every automation run
- ✅ POST `/api/v1/internal/event-bus` — Central event processor
- ✅ Condition evaluator — `eq`, `neq`, `gt`, `lt`, `contains` operators
- ✅ Action executor — `email.send` (mocked), `tag.add`, extensible
- ✅ Automations Dashboard — Run count, fail count, status indicators
- ✅ Visual Workflow Builder — Zapier-style Trigger → Action UI

### Supported Trigger Events
`booking.created` · `booking.cancelled` · `form.submitted` · `order.placed` · `payment.received`

### Event Bus Flow
```
  Any API endpoint fires:
  POST /api/v1/internal/event-bus
  { tenant_slug, event: "booking.created", payload: {...} }
          │
          ▼
  Query automations WHERE trigger_event = $event AND is_active = true
          │
          ▼
  Evaluate each condition against payload (JSONB field matching)
          │
          ▼
  Execute matching actions (email, tag, webhook, etc.)
          │
          ▼
  Write result to automation_logs (SUCCESS / FAILED)
```

---

## Phase 12: Website Builder Smart Blocks ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ `BookingWidgetBlock` — CraftJS drag-and-drop builder component with Settings Panel
- ✅ `ServiceCatalogBlock` — Dynamically fetches active services from DB
- ✅ `StaffShowcaseBlock` — Dynamically renders staff profiles from DB
- ✅ `FormEmbedBlock` — Embeds any dynamic form by ID from the Forms Engine
- ✅ All blocks registered in `Editor.tsx` and `LeftPanel.tsx` toolbox
- ✅ `SettingsPanel` — Color, category, and layout properties per block
- ✅ All blocks produce a JSON node in the CraftJS tree saved to `pages.layout` (lz-string compressed)

### Smart Block Architecture
```
  Builder Canvas (apps/dashboard)
  ──────────────────────────────
  User drags <BookingWidgetBlock> → Renders visual placeholder
  User saves → CraftJS JSON serialized → lz-string compressed → stored in `pages.layout`

  Public Portal (apps/booking)
  ──────────────────────────────
  Server decompresses layout → passes tree to <JsonCompiler>
  JsonCompiler hits resolvedName === "BookingWidgetBlock"
  → Injects <LiveBookingWidget /> at that node position
  → Widget fetches live services/slots from tenant DB APIs
```

---

## Phase 13: Consumer Booking Portal ✅ COMPLETE

**Status**: ✅ Done

### Achievements
- ✅ `useBookingStore` (Zustand) — Client-side state for the multi-step funnel
- ✅ `<LiveBookingWidget />` — 5-step interactive booking engine (Service → Date → Details → Confirm → Success)
- ✅ GET `/api/services` (booking app) — Returns active services for the tenant
- ✅ GET `/api/slots` (booking app) — Calculates available slots by date + service duration
- ✅ `BookingPageClient.tsx` hydrates the widget into the public portal
- ✅ Sub-second LCP via server-side page decompression (no JS decompression in browser)
- ✅ SEO metadata generated per-clinic via `generateMetadata()`

### Booking Funnel Steps
```
  Step 1: Service Selection   → Fetches /api/services, displays service cards
  Step 2: Date & Time Picker  → Fetches /api/slots?date=&serviceId=, renders slot buttons
  Step 3: Patient Details     → Collects First Name, Last Name, Email
  Step 4: Confirm & Submit    → POSTs to booking creation API
  Step 5: Success Screen      → Confirms appointment with summary card
```

---

## Phase 14: Analytics & Financial Reporting Dashboard ⏳ NEXT

**Status**: ⏳ Pending  
**Duration**: 1.5 Weeks  
**Priority**: HIGH

### Goals
Surface actionable business intelligence from all the data we are now generating across bookings, payments, forms, inventory, and automations.

### Features to Build

#### 14.1 Operations Overview Dashboard
- [ ] Total Bookings (Today / This Week / This Month) — with trend indicators
- [ ] Revenue (MTD, YTD) — with % change vs prior period
- [ ] Average booking value calculation
- [ ] Cancellation rate and no-show rate
- [ ] New clients added (this week, month)

#### 14.2 Booking Analytics Charts
- [ ] Line chart — Booking volume over time (daily/weekly/monthly toggle)
- [ ] Bar chart — Bookings by service category
- [ ] Bar chart — Bookings by staff member
- [ ] Heatmap — Busiest time slots by day of week (7×24 grid)

#### 14.3 Financial Reports
- [ ] Revenue by service breakdown (table + pie chart)
- [ ] Revenue by location (multi-location tenants)
- [ ] Outstanding unpaid bookings list
- [ ] Refunds issued summary
- [ ] Stripe payment success/failure ratio

#### 14.4 E-Commerce Analytics
- [ ] Orders total and revenue
- [ ] Best-selling product variants
- [ ] Inventory alerts (all variants below threshold)
- [ ] Digital vs Physical product split

#### 14.5 Automation & Form Metrics
- [ ] Automation run rates and failure rates per workflow
- [ ] Form submission totals per form
- [ ] Most submitted form answers (most common intake responses)

### Success Criteria
- ✅ Dashboard renders all charts server-side with zero client-side data fetching
- ✅ Date range picker works (custom, last 7d, 30d, 90d, YTD)
- ✅ All charts are performant even with 10,000+ rows

---

## Phase 15: Marketing Site & Self-Service Onboarding ⏳ PENDING

**Status**: ⏳ Pending  
**Duration**: 2 Weeks  
**Priority**: CRITICAL

### Goals
Build the public-facing Bookin.com marketing site and a polished multi-step onboarding wizard that provisions a full tenant in under 60 seconds.

### Features to Build

#### 15.1 Marketing Site Pages (`apps/marketing`)
- [ ] `/` (Home) — Hero, Platform overview, Features comparison, Social proof, Pricing CTA
- [ ] `/features` — Deep breakdown of CRM, Slot Engine, Builder, Forms, Automations
- [ ] `/pricing` — Transparent plan matrix with feature toggles
- [ ] `/templates` — Gallery of pre-built website templates by industry
- [ ] `/blog` — MDX-powered blog with SEO optimization
- [ ] `/changelog` — Public feature release history

#### 15.2 Pricing Plans
| Feature | Starter ($29/mo) | Pro ($79/mo) | Enterprise (Custom) |
|---------|-----------------|-------------|---------------------|
| Website Pages | 5 | Unlimited | Unlimited |
| Bookings/mo | 200 | Unlimited | Unlimited |
| Staff Members | 3 | Unlimited | Unlimited |
| Locations | 1 | 5 | Unlimited |
| Custom Forms | 3 | Unlimited | Unlimited |
| Automation Workflows | 5 | Unlimited | Unlimited |
| E-Commerce | ❌ | ✅ | ✅ |
| Custom Domain | ✅ | ✅ | ✅ |
| White Label | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |

#### 15.3 Self-Service Onboarding Wizard
- [ ] **Step 1**: Account creation (email + password via Supabase Auth)
- [ ] **Step 2**: Clinic profile (Business name, Industry selector, Currency, Phone)
- [ ] **Step 3**: Subdomain selection (debounced availability check against `tenants` table)
- [ ] **Step 4**: Schema provisioning (background job: create schema, run baseline.sql, seed defaults)
- [ ] **Step 5**: Welcome redirect to dashboard with guided first-run checklist
- [ ] First-run checklist: Add a Service → Add a Staff → Set Hours → Publish Page

#### 15.4 Industry-Specific Starter Kits
When a tenant selects an industry, seed their schema with sensible defaults:
- **Medical Clinic**: Services (Checkup, Consultation, ECG), Staff (Doctor), Intake Form (Medical History)
- **Salon/Spa**: Services (Haircut, Facial, Massage), Add-ons (Conditioning Treatment), Consent Form
- **Fitness Studio**: Services (Personal Training, Group Class), Staff (Trainer), Liability Waiver
- **Dental Practice**: Services (Cleaning, Filling, Consultation), Staff (Dentist), Dental Form

### Success Criteria
- ✅ Onboarding wizard completes in under 60 seconds
- ✅ Tenant schema fully provisioned and ready on first dashboard load
- ✅ Marketing site achieves Lighthouse score 95+
- ✅ Marketing site is fully responsive

---

## Phase 16: Production Hardening & Launch ⏳ PENDING

**Status**: ⏳ Pending  
**Duration**: 2 Weeks  
**Priority**: CRITICAL

### Goals
Harden the platform for real-world traffic, fix all known issues, and prepare a stable production launch.

### Features to Build

#### 16.1 Known Issues Resolution (from KNOWN_ISSUES.md)
- [ ] Fix Supabase `createUser` 500 in Guest Init — implement proper admin user creation
- [ ] Implement Resend email API properly for automation actions (replace `console.log` mocks)
- [ ] Add idempotency keys to Stripe Checkout session creation

#### 16.2 Security Hardening
- [ ] Rate limiting on all public API endpoints (Upstash Redis)
- [ ] HMAC signature verification on internal Event Bus endpoint
- [ ] Content Security Policy headers via `next.config.js`
- [ ] SQL injection prevention review on all `$queryRawUnsafe` calls
- [ ] Supabase RLS policies verified for all public tables

#### 16.3 Performance Optimization
- [ ] `.next/` cache invalidation strategy documented and automated
- [ ] Database query analysis — add missing indexes for all slow paths
- [ ] Implement `React.Suspense` boundaries on all dashboard pages
- [ ] Image optimization pipeline (WebP conversion, lazy loading)

#### 16.4 Testing Suite
- [ ] Unit tests for slot calculation engine
- [ ] Unit tests for Payment Factory (mock providers)
- [ ] Integration tests for booking creation API (with DB)
- [ ] E2E tests for the public booking funnel (Playwright)
- [ ] Load test simulating 500 concurrent booking portal users

#### 16.5 Infrastructure & Monitoring
- [ ] Vercel production deployments for all apps
- [ ] Cloudflare CNAME routing for custom tenant domains
- [ ] Sentry error tracking integrated in all apps
- [ ] Axiom / Betterstack log aggregation for API routes
- [ ] Automated nightly database backups (per tenant schema)
- [ ] Uptime monitoring (BetterStack)

#### 16.6 White Label & Enterprise Readiness
- [ ] Custom domain binding (tenant configures own `CNAME`)
- [ ] Email sender domain configuration (custom `From:` in Resend)
- [ ] Remove Bookin branding toggle (for Enterprise plan)
- [ ] SSO / SAML integration groundwork (for Enterprise clients)
- [ ] Audit log viewer in dashboard (`audit_logs` table)

### Success Criteria
- ✅ Zero critical security vulnerabilities
- ✅ All KNOWN_ISSUES resolved
- ✅ 99.9% uptime SLA achievable
- ✅ All apps deploy without build errors
- ✅ E2E booking flow tested and passing

---

## 🏗️ Complete Per-Tenant Database Schema

The following is the complete, canonical schema applied to every new tenant on signup. It is maintained in `packages/db/tenant/baseline.sql`.

### Core Tables
```sql
-- Service Catalogue
services, service_categories, service_addons

-- Staff & Scheduling
staff, staff_services (bridge), staff_hours, schedule_exceptions

-- Clients & CRM
clients, client_notes, client_activities

-- Bookings
bookings, booking_addons, booking_status_history

-- Forms
forms, form_submissions

-- Payments
payments

-- E-Commerce
product_categories, products, product_variants,
inventory_transactions, orders, order_items

-- Automations
automations, automation_logs

-- Website Builder
pages

-- Operations
locations, notifications_log
```

---

## 🔐 Security Architecture

```
  Every API Request:
  ─────────────────────────────────────────────────────────────
  1. withTenantAuth middleware → Validates Supabase JWT
  2. Derives userId from verified session (server-side only)
  3. Queries Membership table → resolves tenantId + role
  4. Queries Tenant table → resolves schemaName
  5. Instantiates getTenantClient("tenant_{slug}")
  6. All DB queries run inside the isolated tenant schema
  ─────────────────────────────────────────────────────────────
  Schema names are NEVER accepted from URL params or request body.
  All schema resolution is server-side, session-derived only.
```

---

## 🚀 Deployment Architecture

```
  ┌─────────────────────────────────────────────────────────┐
  │                    CLOUDFLARE (DNS + CDN)               │
  │    bookin.com · {slug}.bookin.com · custom CNAMEs       │
  └────────────────────┬────────────────────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         ▼                            ▼
  ┌─────────────┐           ┌──────────────────┐
  │  apps/booking│           │  apps/dashboard   │
  │ + apps/market│           │  + apps/builder   │
  │ Vercel Edge  │           │  Vercel Serverless│
  └──────┬──────┘           └────────┬─────────┘
         │                           │
         └───────────────┬───────────┘
                         ▼
             ┌────────────────────┐
             │  Supabase (Auth)   │
             │  PostgreSQL (DB)   │
             │  Multi-Tenant PG   │
             └────────────────────┘
```

---

## 🧱 API Design Standards

All API routes follow the structure `/api/v1/{resource}` and enforce:

1. **Auth** — `withTenantAuth` on all dashboard routes
2. **Role Guards** — Minimum role required declared per endpoint
3. **Zod Validation** — All request bodies validated before DB access
4. **Transactional Safety** — Multi-step mutations use `$transaction()`
5. **Error Codes** — Standardized error shape `{ success, error, code }`
6. **Event Bus Integration** — All mutating endpoints fire `POST /api/v1/internal/event-bus`

---

## 📋 Risk Management

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Postgres schema naming conflicts | HIGH | Slugs sanitized and unique-constrained before provisioning |
| Stripe webhook replay attacks | HIGH | Idempotency keys + `stripe.webhooks.constructEvent()` signature check |
| Inventory over-selling | HIGH | Ledger-based stock; never direct `UPDATE stock_count` |
| `.next/` cache bloat | MEDIUM | Periodic `Remove-Item -Recurse .next` in dev; CDN invalidation in prod |
| Event Bus cascade failures | MEDIUM | Each automation runs in `Promise.allSettled()` — one failure doesn't block others |
| Tenant schema migration drift | MEDIUM | `baseline.sql` is the single source of truth; new tables added via append |
| Rate limit exhaustion on Supabase | LOW | Supabase Admin calls rate-limited; queued and retried with exponential backoff |

---

## ✅ Definition of "Done"

The Bookin SaaS Operations Platform is **complete** when:
- ✅ A business owner can sign up in under 60 seconds and immediately take bookings
- ✅ A patient can book, pay, and receive an email confirmation without any staff intervention
- ✅ A clinic manager can run their entire daily operations from the dashboard
- ✅ A marketing manager can build and publish a custom website without writing code
- ✅ The platform handles 500+ concurrent users without degradation
- ✅ All tenant data is fully isolated — no cross-contamination possible
- ✅ The system is profitable and ready for enterprise clients

---

*This document is the single source of truth for the Bookin SaaS Operations Platform. All architectural decisions, database schemas, and API specifications described here take precedence over any ad-hoc implementation choices.*

**Let's Build. 🚀**
