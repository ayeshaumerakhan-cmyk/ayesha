-- =============================================================================
-- 06_loader_settings.sql
-- Adds the intro loader controls (shape, animation, labels, length) to site_settings.
--
-- Fresh install:  you do NOT need this file, 01_schema.sql already includes it.
-- Existing install (you ran an older 01_schema.sql): run this once.
-- Safe to run more than once.
-- =============================================================================

alter table public.site_settings add column if not exists loader_enabled     text;  -- 'yes' or 'no'
alter table public.site_settings add column if not exists loader_shape       text;  -- arch, circle, square, triangle, diamond, hexagon, orbit, wave, lines, custom
alter table public.site_settings add column if not exists loader_style       text;  -- draw, fill, pulse, spin
alter table public.site_settings add column if not exists loader_custom_path text;  -- SVG path d attribute, used when shape = custom
alter table public.site_settings add column if not exists loader_label_left  text;
alter table public.site_settings add column if not exists loader_label_right text;
alter table public.site_settings add column if not exists loader_duration    text;  -- seconds, 0.8 to 6

-- Make sure the single settings row exists so the admin form can save.
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
