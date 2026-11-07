-- =============================================================================
-- 01_schema.sql
-- Tables for the Ayesha Umera portfolio.
-- Run this first in: Supabase Dashboard > SQL Editor > New query.
-- Safe to re-run: every statement uses IF NOT EXISTS where possible.
-- =============================================================================

create extension if not exists "pgcrypto";

-- Keeps updated_at current on every update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Site settings (always exactly one row, id = 1)
-- Every column is optional. Empty values fall back to the built-in defaults.
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id               int primary key default 1 check (id = 1),
  site_name        text,
  role_line        text,
  hero_title       text,
  hero_hint        text,
  tagline          text,
  about_headline   text,
  about_highlight  text,
  about_intro      text,
  about_body       text,
  contact_headline text,
  contact_intro    text,
  email            text,
  phone            text,
  location         text,
  address          text,
  linkedin_url     text,
  github_url       text,
  instagram_url    text,
  twitter_url      text,
  resume_url       text,
  footer_cta       text,
  footer_highlight text,
  seo_title        text,
  seo_description  text,
  og_image_url     text,
  updated_at       timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Projects
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  category    text,
  location    text,
  year        text,
  role        text,
  summary     text,
  description text,
  cover_url   text,
  images      text[] not null default '{}',
  tags        text[] not null default '{}',
  link_url    text,
  repo_url    text,
  featured    boolean not null default false,
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists projects_order_idx on public.projects (published, sort_order);

-- -----------------------------------------------------------------------------
-- Journal posts (markdown content)
-- -----------------------------------------------------------------------------
create table if not exists public.journal_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text,
  content      text,
  category     text,
  cover_url    text,
  published_at date not null default current_date,
  published    boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists journal_date_idx on public.journal_posts (published, published_at desc);

-- -----------------------------------------------------------------------------
-- Experience
-- -----------------------------------------------------------------------------
create table if not exists public.experiences (
  id           uuid primary key default gen_random_uuid(),
  role         text not null,
  organization text not null,
  kind         text,
  start_label  text,
  end_label    text,
  location     text,
  description  text,
  sort_order   int not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Education
-- -----------------------------------------------------------------------------
create table if not exists public.education (
  id          uuid primary key default gen_random_uuid(),
  institution text not null,
  degree      text not null,
  period      text,
  grade       text,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Certifications
-- -----------------------------------------------------------------------------
create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  issuer         text,
  issued         text,
  credential_url text,
  sort_order     int not null default 0,
  published      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Stats (the three counters on the home page)
-- -----------------------------------------------------------------------------
create table if not exists public.stats (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  value      text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Gallery images
-- placement 'hero'    = small chips inside the home tagline
-- placement 'marquee' = scrolling strip on the contact page
-- -----------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  alt        text,
  placement  text not null default 'marquee' check (placement in ('hero', 'marquee')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Contact form submissions
-- -----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 200),
  message    text not null check (char_length(message) between 1 and 4000),
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- -----------------------------------------------------------------------------
-- Admins (managed manually, see 04_make_admin.sql)
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- updated_at triggers
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
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t);
  end loop;
end $$;
