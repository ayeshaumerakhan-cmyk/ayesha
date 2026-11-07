-- =============================================================================
-- 05_optional_seed.sql  (OPTIONAL)
-- Creates the single empty settings row so the Settings page in the admin
-- panel can save immediately. Real content is entered from the admin panel.
--
-- Mock content on the website disappears automatically per section as soon as
-- that section has at least one published row. You do NOT need to delete
-- anything. Nothing in this file adds sample content.
-- =============================================================================

insert into public.site_settings (id) values (1) on conflict (id) do nothing;
