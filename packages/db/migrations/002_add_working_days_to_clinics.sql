-- migration: 002_add_working_days_to_clinics.sql
-- Description: Add working_days jsonb column to public.clinics
-- Up:

ALTER TABLE public.clinics
ADD COLUMN IF NOT EXISTS working_days JSONB DEFAULT '{"start": "09:00", "end": "18:00", "days": [1,2,3,4,5,6], "breaks": [{"start": "13:00", "end": "14:00"}]}'::jsonb;

-- rollback:
-- ALTER TABLE public.clinics DROP COLUMN IF EXISTS working_days;
