export const BASELINE_SQL = `-- USAGE: Execute with schema_name = 'tenant_' || slug
-- All tables live inside the tenant's own schema

-- ─────────────────────────────────────────────
-- CLIENTS (Patients / Customers / Members)
-- ─────────────────────────────────────────────
CREATE TABLE clients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  global_user_id  TEXT UNIQUE,             -- Link to GlobalUser if they have an account
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  date_of_birth   DATE,
  gender          TEXT,
  avatar_url      TEXT,
  notes           TEXT,                    -- Internal staff notes
  tags            TEXT[] DEFAULT '{}',     -- e.g., ['VIP', 'Allergy: Penicillin']
  custom_fields   JSONB DEFAULT '{}',      -- Tenant-defined extra fields
  gdpr_consent    BOOLEAN DEFAULT FALSE,
  gdpr_consent_at TIMESTAMPTZ,
  marketing_opt_in BOOLEAN DEFAULT FALSE,
  source          TEXT,                    -- 'walk-in', 'referral', 'online-booking', etc.
  referrer_client_id UUID REFERENCES clients(id),
  lifetime_value  DECIMAL(12,2) DEFAULT 0,
  visit_count     INT DEFAULT 0,
  last_visit_at   TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ,            -- Soft delete
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_clients_email ON clients(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_clients_phone ON clients(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_clients_global_user_id ON clients(global_user_id);
CREATE INDEX idx_clients_name_trgm ON clients USING gin((first_name || ' ' || last_name) gin_trgm_ops);
-- ^ Requires pg_trgm extension: CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ─────────────────────────────────────────────
-- LOCATIONS (Multi-location support)
-- ─────────────────────────────────────────────
CREATE TABLE locations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  address_line1 TEXT,
  address_line2 TEXT,
  city          TEXT,
  state         TEXT,
  postal_code   TEXT,
  country       TEXT DEFAULT 'US',
  lat           DECIMAL(9,6),
  lng           DECIMAL(9,6),
  phone         TEXT,
  email         TEXT,
  timezone      TEXT NOT NULL DEFAULT 'UTC',
  is_primary    BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SERVICE CATEGORIES
-- ─────────────────────────────────────────────
CREATE TABLE service_categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  color        TEXT,             -- Hex color for UI
  icon         TEXT,             -- Icon name/url
  display_order INT DEFAULT 0,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SERVICES
-- ─────────────────────────────────────────────
CREATE TABLE services (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id          UUID REFERENCES service_categories(id),
  name                 TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  description          TEXT,
  short_description    TEXT,
  duration_minutes     INT NOT NULL,       -- Total duration
  buffer_before_minutes INT DEFAULT 0,     -- Gap before appointment
  buffer_after_minutes  INT DEFAULT 0,     -- Gap after appointment (cleanup)
  price                DECIMAL(10,2),
  pricing_type         TEXT NOT NULL DEFAULT 'FIXED',  -- FIXED, VARIABLE, FREE, CONSULTATION
  min_price            DECIMAL(10,2),      -- For VARIABLE pricing
  max_price            DECIMAL(10,2),      -- For VARIABLE pricing
  currency             TEXT DEFAULT 'USD',
  max_advance_days     INT DEFAULT 90,     -- How far in advance clients can book
  min_advance_hours    INT DEFAULT 1,      -- Minimum notice required
  max_capacity         INT DEFAULT 1,      -- For group sessions
  is_group_session     BOOLEAN DEFAULT FALSE,
  requires_deposit     BOOLEAN DEFAULT FALSE,
  deposit_amount       DECIMAL(10,2),
  deposit_type         TEXT DEFAULT 'FIXED',  -- FIXED or PERCENTAGE
  is_online            BOOLEAN DEFAULT FALSE,  -- Virtual / video call service
  is_public            BOOLEAN DEFAULT TRUE,   -- Visible on booking portal
  color                TEXT,                   -- Hex color for calendar
  image_url            TEXT,
  form_id              UUID,               -- Linked intake form (Phase 7)
  deleted_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_public ON services(is_public) WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────
-- SERVICE ADD-ONS
-- ─────────────────────────────────────────────
CREATE TABLE service_addons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id    UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  price         DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_extra_minutes INT DEFAULT 0,
  is_required   BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- STAFF MEMBERS
-- ─────────────────────────────────────────────
CREATE TABLE staff (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  global_user_id  TEXT UNIQUE,           -- Link to GlobalUser (TenantUser)
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  avatar_url      TEXT,
  title           TEXT,                  -- "Dr.", "Senior Therapist", etc.
  bio             TEXT,
  specializations TEXT[] DEFAULT '{}',
  color           TEXT,                  -- Calendar color for this staff member
  is_accepting_bookings BOOLEAN DEFAULT TRUE,
  show_on_booking_portal BOOLEAN DEFAULT TRUE,
  display_order   INT DEFAULT 0,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- STAFF–SERVICE MAPPING (Which staff can perform which services)
-- ─────────────────────────────────────────────
CREATE TABLE staff_services (
  staff_id   UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (staff_id, service_id)
);

-- ─────────────────────────────────────────────
-- STAFF WORKING HOURS (Weekly template)
-- ─────────────────────────────────────────────
CREATE TABLE staff_working_hours (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id     UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  location_id  UUID REFERENCES locations(id),
  day_of_week  INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Sunday, 6=Saturday
  is_day_off   BOOLEAN DEFAULT FALSE,
  start_time   TIME,                     -- e.g., '09:00:00' (in location's timezone)
  end_time     TIME,                     -- e.g., '17:00:00'
  break_start  TIME,                     -- Optional break period
  break_end    TIME,
  UNIQUE(staff_id, location_id, day_of_week)
);

-- ─────────────────────────────────────────────
-- STAFF DATE OVERRIDES (Time off, special hours)
-- ─────────────────────────────────────────────
CREATE TABLE staff_date_overrides (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id    UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  type        TEXT NOT NULL,  -- 'DAY_OFF', 'CUSTOM_HOURS', 'HOLIDAY'
  is_day_off  BOOLEAN DEFAULT TRUE,
  start_time  TIME,
  end_time    TIME,
  reason      TEXT,           -- Internal note
  UNIQUE(staff_id, date)
);
CREATE INDEX idx_staff_overrides_date ON staff_date_overrides(date);

-- ─────────────────────────────────────────────
-- BOOKINGS (Core)
-- ─────────────────────────────────────────────
CREATE TABLE bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number    TEXT UNIQUE NOT NULL,  -- Human-readable: BK-2024-00001
  client_id           UUID NOT NULL REFERENCES clients(id),
  service_id          UUID NOT NULL REFERENCES services(id),
  staff_id            UUID REFERENCES staff(id),
  location_id         UUID REFERENCES locations(id),
  status              TEXT NOT NULL DEFAULT 'PENDING',
  -- Statuses: PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW, RESCHEDULED, WAITLIST
  starts_at           TIMESTAMPTZ NOT NULL,  -- UTC
  ends_at             TIMESTAMPTZ NOT NULL,  -- UTC
  duration_minutes    INT NOT NULL,
  buffer_before       INT DEFAULT 0,
  buffer_after        INT DEFAULT 0,
  price               DECIMAL(10,2) NOT NULL DEFAULT 0,
  deposit_paid        DECIMAL(10,2) DEFAULT 0,
  discount_amount     DECIMAL(10,2) DEFAULT 0,
  discount_code       TEXT,
  total_paid          DECIMAL(10,2) DEFAULT 0,
  currency            TEXT DEFAULT 'USD',
  payment_status      TEXT DEFAULT 'UNPAID',  -- UNPAID, DEPOSIT_PAID, PAID, REFUNDED, PARTIAL
  stripe_payment_intent_id TEXT UNIQUE,
  notes               TEXT,                   -- Client-provided notes at booking
  internal_notes      TEXT,                   -- Staff-only notes
  cancel_reason       TEXT,
  cancelled_by        TEXT,                   -- 'CLIENT', 'STAFF', 'SYSTEM'
  cancelled_at        TIMESTAMPTZ,
  reminder_sent_24h   BOOLEAN DEFAULT FALSE,
  reminder_sent_1h    BOOLEAN DEFAULT FALSE,
  follow_up_sent      BOOLEAN DEFAULT FALSE,
  metadata            JSONB DEFAULT '{}',
  created_by          TEXT,                   -- 'CLIENT', 'STAFF', 'API', 'IMPORT'
  source              TEXT DEFAULT 'BOOKING_PORTAL',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_staff ON bookings(staff_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_starts_at ON bookings(starts_at);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date_range ON bookings(starts_at, ends_at);
CREATE INDEX idx_bookings_reference ON bookings(reference_number);

-- ─────────────────────────────────────────────
-- CONSTRAINTS
-- ─────────────────────────────────────────────
-- Prevent overlapping bookings for the same staff
-- Requires: CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE bookings ADD CONSTRAINT exclude_overlapping_bookings 
  EXCLUDE USING gist ( 
    staff_id WITH =, 
    tstzrange(starts_at, ends_at) WITH && 
  ) WHERE (status NOT IN ('CANCELLED', 'NO_SHOW'));

-- ─────────────────────────────────────────────
-- BOOKING ADD-ONS (Selected add-ons per booking)
-- ─────────────────────────────────────────────
CREATE TABLE booking_addons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  addon_id    UUID NOT NULL REFERENCES service_addons(id),
  name        TEXT NOT NULL,   -- Snapshot of addon name at booking time
  price       DECIMAL(10,2) NOT NULL,
  quantity    INT DEFAULT 1
);

-- ─────────────────────────────────────────────
-- BOOKING STATUS HISTORY (Audit trail)
-- ─────────────────────────────────────────────
CREATE TABLE booking_status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status   TEXT NOT NULL,
  changed_by  TEXT,
  reason      TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- FORMS (Phase 7)
-- ─────────────────────────────────────────────
CREATE TABLE forms (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  type          TEXT NOT NULL,  -- 'INTAKE', 'CONSENT', 'FEEDBACK', 'QUESTIONNAIRE'
  schema        JSONB NOT NULL,  -- JSON Schema definition
  ui_schema     JSONB,           -- UI rendering hints
  is_required   BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  version       INT DEFAULT 1,
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE form_submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id      UUID NOT NULL REFERENCES forms(id),
  client_id    UUID REFERENCES clients(id),
  booking_id   UUID REFERENCES bookings(id),
  responses    JSONB NOT NULL,   -- The actual submitted data
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_form_submissions_booking ON form_submissions(booking_id);
CREATE INDEX idx_form_submissions_client ON form_submissions(client_id);

-- ─────────────────────────────────────────────
-- INVOICES & TRANSACTIONS (Phase 11 - Payments)
-- ─────────────────────────────────────────────
CREATE TABLE invoices (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id          UUID REFERENCES bookings(id),
  client_id           UUID NOT NULL REFERENCES clients(id),
  invoice_number      TEXT UNIQUE NOT NULL,
  status              TEXT NOT NULL DEFAULT 'DRAFT',  -- DRAFT, OPEN, PAID, UNCOLLECTIBLE, VOID
  subtotal            DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount          DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount        DECIMAL(10,2) NOT NULL,
  amount_paid         DECIMAL(10,2) DEFAULT 0,
  amount_due          DECIMAL(10,2) NOT NULL,
  currency            TEXT DEFAULT 'usd',
  due_date            TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  stripe_invoice_id   TEXT UNIQUE,
  hosted_invoice_url  TEXT,
  invoice_pdf         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- PAYMENTS & TRANSACTIONS
-- ─────────────────────────────────────────────
CREATE TABLE payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id          UUID REFERENCES bookings(id),
  stripe_payment_id   TEXT UNIQUE,
  type                TEXT NOT NULL,  -- 'BOOKING_PAYMENT', 'DEPOSIT', 'REFUND', 'SUBSCRIPTION'
  status              TEXT NOT NULL,  -- 'PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED'
  amount              DECIMAL(10,2) NOT NULL,
  refunded_amount     DECIMAL(10,2) DEFAULT 0,
  currency            TEXT DEFAULT 'usd',
  payment_method      TEXT,          -- 'card', 'bank_transfer', 'cash', 'voucher'
  failure_reason      TEXT,
  metadata            JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- NOTIFICATIONS LOG
-- ─────────────────────────────────────────────
CREATE TABLE notifications_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   TEXT,
  recipient   TEXT NOT NULL,
  channel     TEXT NOT NULL,  -- 'EMAIL', 'SMS', 'PUSH'
  template_id TEXT,
  status      TEXT NOT NULL,  -- 'SENT', 'FAILED', 'DELIVERED'
  error       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- CLIENT NOTES (CRM Module)
-- ─────────────────────────────────────────────
CREATE TABLE client_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  staff_id    UUID REFERENCES staff(id) ON DELETE SET NULL, -- Who wrote the note
  content     TEXT NOT NULL,
  is_pinned   BOOLEAN DEFAULT FALSE,
  metadata    JSONB DEFAULT '{}', -- e.g., mentions
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_client_notes_client ON client_notes(client_id);
CREATE INDEX idx_client_notes_staff ON client_notes(staff_id);

-- ─────────────────────────────────────────────
-- CLIENT ACTIVITIES TIMELINE (CRM Module)
-- ─────────────────────────────────────────────
CREATE TABLE client_activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,  -- 'BOOKING_CREATED', 'EMAIL_SENT', 'FORM_SUBMITTED', 'NOTE_ADDED', 'PAYMENT_RECEIVED'
  title       TEXT NOT NULL,
  description TEXT,
  link_id     UUID,           -- Link to the booking_id, form_submission_id, etc.
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_client_activities_client ON client_activities(client_id);
CREATE INDEX idx_client_activities_type ON client_activities(type);

-- ---------------------------------------------
-- E-COMMERCE: CATEGORIES
-- ---------------------------------------------
CREATE TABLE product_categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  display_order INT DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------
-- E-COMMERCE: PRODUCTS
-- ---------------------------------------------
CREATE TABLE products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id         UUID REFERENCES product_categories(id),
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  description         TEXT,
  is_digital          BOOLEAN DEFAULT FALSE,
  is_track_inventory  BOOLEAN DEFAULT TRUE,
  status              TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, DRAFT, ARCHIVED
  images              TEXT[] DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------
-- E-COMMERCE: PRODUCT VARIANTS
-- ---------------------------------------------
CREATE TABLE product_variants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name          TEXT NOT NULL, -- e.g. "Small / Red" or "Default"
  sku           TEXT UNIQUE,
  barcode       TEXT,
  price         DECIMAL(10,2) NOT NULL DEFAULT 0,
  compare_price DECIMAL(10,2),
  cost_price    DECIMAL(10,2),
  stock_count   INT NOT NULL DEFAULT 0,
  weight_grams  INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_variants_product ON product_variants(product_id);

-- ---------------------------------------------
-- E-COMMERCE: INVENTORY LEDGER
-- ---------------------------------------------
CREATE TABLE inventory_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id      UUID NOT NULL REFERENCES product_variants(id),
  change_amount   INT NOT NULL,
  reason          TEXT NOT NULL, -- 'MANUAL_ADJUSTMENT', 'ORDER_PLACED', 'RESTOCK', 'REFUND'
  reference_id    UUID, -- e.g. order_id
  created_by      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------
-- E-COMMERCE: ORDERS
-- ---------------------------------------------
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID REFERENCES clients(id),
  booking_id      UUID REFERENCES bookings(id), -- If bought during booking
  order_number    TEXT UNIQUE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  payment_status  TEXT NOT NULL DEFAULT 'UNPAID',
  total_amount    DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------
-- E-COMMERCE: ORDER ITEMS
-- ---------------------------------------------
CREATE TABLE order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id    UUID NOT NULL REFERENCES product_variants(id),
  product_name  TEXT NOT NULL,
  variant_name  TEXT NOT NULL,
  price         DECIMAL(10,2) NOT NULL,
  quantity      INT NOT NULL DEFAULT 1,
  total         DECIMAL(10,2) NOT NULL
);


-- ─────────────────────────────────────────────
-- AUTOMATIONS (Phase 10 - Workflow Engine)
-- ─────────────────────────────────────────────
CREATE TABLE automations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  trigger_event   TEXT NOT NULL,  -- 'booking.created', 'booking.cancelled', 'booking.reminder_24h', etc.
  conditions      JSONB DEFAULT '[]',   -- [{field, operator, value}]
  actions         JSONB NOT NULL,       -- [{type: 'email.send', template_id, to}, {type: 'tag.add', tag_name}]
  is_active       BOOLEAN DEFAULT TRUE,
  run_count       INT DEFAULT 0,
  last_run_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_automations_trigger ON automations(trigger_event) WHERE is_active = TRUE;

-- ─────────────────────────────────────────────
-- AUTOMATION LOGS (Audit trail per run)
-- ─────────────────────────────────────────────
CREATE TABLE automation_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id   UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  triggering_event JSONB,          -- The event + payload that triggered this run
  status          TEXT NOT NULL,   -- 'SUCCESS', 'FAILED', 'SKIPPED_CONDITIONS'
  error_message   TEXT,
  executed_actions JSONB,          -- What was actually done
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_automation_logs_automation ON automation_logs(automation_id);
CREATE INDEX idx_automation_logs_status ON automation_logs(status);
CREATE INDEX idx_automation_logs_created ON automation_logs(created_at DESC);

-- ─────────────────────────────────────────────
-- TENANT PAYMENT CONFIGS (Phase 11 - Payments)
-- ─────────────────────────────────────────────
CREATE TABLE tenant_payment_configs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_account_id   TEXT,                    -- Stripe Connect account ID
  stripe_live_key     TEXT,                    -- Encrypted live pk
  stripe_test_key     TEXT,                    -- Encrypted test pk
  stripe_webhook_secret TEXT,                  -- Encrypted webhook signing secret
  is_test_mode        BOOLEAN DEFAULT TRUE,    -- toggle test vs live
  payment_methods     TEXT[] DEFAULT ARRAY['card'],
  deposit_required    BOOLEAN DEFAULT FALSE,
  deposit_percent     INT DEFAULT 20,          -- e.g. 20 = 20% deposit
  currency            TEXT NOT NULL DEFAULT 'USD',
  tax_rate            DECIMAL(5,2) DEFAULT 0,  -- VAT/tax in percent
  invoice_prefix      TEXT DEFAULT 'INV',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- WEBSITES (Phase 13 - Website Builder Config)
-- ─────────────────────────────────────────────
CREATE TABLE websites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_domain TEXT UNIQUE,
  theme_config  JSONB DEFAULT '{}',
  navigation    JSONB DEFAULT '[]',
  analytics_id  TEXT,
  favicon_url   TEXT,
  logo_url      TEXT,
  is_published  BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default website config
INSERT INTO websites (theme_config) VALUES ('{}');

-- ─────────────────────────────────────────────
-- MEDIA (Phase 13 - Asset Library)
-- ─────────────────────────────────────────────
CREATE TABLE media (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename      TEXT NOT NULL,
  url           TEXT NOT NULL,
  mime_type     TEXT NOT NULL,
  size_bytes    INT NOT NULL,
  width         INT,
  height        INT,
  folder        TEXT DEFAULT 'root',
  alt_text      TEXT,
  uploaded_by   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- PAGES (Phase 13 - Website Builder)
-- ─────────────────────────────────────────────
CREATE TABLE pages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT,
  content     JSONB,            -- Craft.js serialized JSON (compressed or raw)
  is_home     BOOLEAN NOT NULL DEFAULT FALSE,
  seo_meta    JSONB DEFAULT '{}',   -- {title, description, og_image, keywords}
  published   BOOLEAN DEFAULT FALSE,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_pages_slug ON pages(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_pages_published ON pages(published) WHERE deleted_at IS NULL;

-- Seed default homepage for every new tenant
INSERT INTO pages (slug, title, is_home, published)
VALUES ('home', 'Homepage', TRUE, TRUE);
`;
