-- migration: 003_add_theme_to_clinics.sql
-- Description: Add theme jsonb column to public.clinics
-- Up:

ALTER TABLE public.clinics
ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{"template": "minimal", "primary_color": "#E8334A", "accent_color": "#C53030", "logo_url": "", "tagline": "", "whatsapp_number": "", "show_powered_by": true}'::jsonb;

-- rollback:
-- ALTER TABLE public.clinics DROP COLUMN IF EXISTS theme;
