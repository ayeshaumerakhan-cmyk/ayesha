-- =============================================================================
-- 07_contact_method.sql
-- Adds the "contact form delivery" controls to site_settings.
-- Run once in Supabase: SQL Editor > New query > paste > Run.
-- Safe to run more than once.
-- =============================================================================

alter table public.site_settings add column if not exists contact_method  text;  -- 'email' or 'whatsapp'
alter table public.site_settings add column if not exists whatsapp_number text;  -- digits only, with country code

insert into public.site_settings (id) values (1) on conflict (id) do nothing;
