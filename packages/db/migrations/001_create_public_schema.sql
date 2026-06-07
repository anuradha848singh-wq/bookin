-- migration: 001_create_public_schema.sql
-- Description: Create public schema tables 'clinics' and 'commissions'
-- Up:

CREATE TABLE IF NOT EXISTS public.clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  custom_domain TEXT UNIQUE,
  owner_id UUID NOT NULL,
  tenant_schema TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index on clinics.custom_domain as per performance/indexing rules
CREATE INDEX IF NOT EXISTS idx_clinics_custom_domain ON public.clinics(custom_domain);

-- Index on clinics.owner_id since we check clinic.owner_id = session.user.id
CREATE INDEX IF NOT EXISTS idx_clinics_owner_id ON public.clinics(owner_id);

-- Index on commissions foreign key as per indexing rules
CREATE INDEX IF NOT EXISTS idx_commissions_clinic_id ON public.commissions(clinic_id);

-- rollback:
-- DROP INDEX IF EXISTS idx_commissions_clinic_id;
-- DROP INDEX IF EXISTS idx_clinics_owner_id;
-- DROP INDEX IF EXISTS idx_clinics_custom_domain;
-- DROP TABLE IF EXISTS public.commissions;
-- DROP TABLE IF EXISTS public.clinics;
