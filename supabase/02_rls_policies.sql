-- =============================================================================
-- 02_rls_policies.sql
-- Row Level Security. Run after 01_schema.sql.
--
-- Model:
--   * Visitors (anon key / publishable key) can READ published content only.
--   * Visitors can INSERT a contact message, nothing else.
--   * Admins (rows in public.admins) can do everything.
-- The publishable key is safe in the browser because of these policies.
-- =============================================================================

-- Helper: is the signed-in user an admin?
-- SECURITY DEFINER so it can read public.admins regardless of the caller's RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Enable RLS everywhere
alter table public.site_settings    enable row level security;
alter table public.projects         enable row level security;
alter table public.journal_posts    enable row level security;
alter table public.experiences      enable row level security;
alter table public.education        enable row level security;
alter table public.certifications   enable row level security;
alter table public.stats            enable row level security;
alter table public.gallery_images   enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admins           enable row level security;

-- -----------------------------------------------------------------------------
-- Public read policies
-- -----------------------------------------------------------------------------
drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects
  for select to anon, authenticated using (published = true);

drop policy if exists "public read journal" on public.journal_posts;
create policy "public read journal" on public.journal_posts
  for select to anon, authenticated using (published = true);

drop policy if exists "public read experiences" on public.experiences;
create policy "public read experiences" on public.experiences
  for select to anon, authenticated using (published = true);

drop policy if exists "public read education" on public.education;
create policy "public read education" on public.education
  for select to anon, authenticated using (published = true);

drop policy if exists "public read certifications" on public.certifications;
create policy "public read certifications" on public.certifications
  for select to anon, authenticated using (published = true);

drop policy if exists "public read stats" on public.stats;
create policy "public read stats" on public.stats
  for select to anon, authenticated using (true);

drop policy if exists "public read gallery" on public.gallery_images;
create policy "public read gallery" on public.gallery_images
  for select to anon, authenticated using (true);

-- -----------------------------------------------------------------------------
-- Contact form: anyone may submit, only admins may read or manage
-- -----------------------------------------------------------------------------
drop policy if exists "public insert contact" on public.contact_messages;
create policy "public insert contact" on public.contact_messages
  for insert to anon, authenticated
  with check (
    is_read = false
    and char_length(name) between 1 and 120
    and char_length(email) between 3 and 200
    and char_length(message) between 1 and 4000
  );

drop policy if exists "admin read contact" on public.contact_messages;
create policy "admin read contact" on public.contact_messages
  for select to authenticated using (public.is_admin());

drop policy if exists "admin update contact" on public.contact_messages;
create policy "admin update contact" on public.contact_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin delete contact" on public.contact_messages;
create policy "admin delete contact" on public.contact_messages
  for delete to authenticated using (public.is_admin());

-- -----------------------------------------------------------------------------
-- Admin full access on content tables
-- (Admins also see unpublished rows, because policies are OR-ed together.)
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'projects', 'journal_posts', 'experiences',
    'education', 'certifications', 'stats', 'gallery_images'
  ]
  loop
    execute format('drop policy if exists "admin all %1$s" on public.%1$I', t);
    execute format(
      'create policy "admin all %1$s" on public.%1$I
         for all to authenticated
         using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- Admins table: a user can see their own row (middleware uses this),
-- admins can see everyone. Nobody can write from the client. Add admins with SQL.
-- -----------------------------------------------------------------------------
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());
