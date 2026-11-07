# Ayesha Umera, portfolio

A Next.js 15 (App Router) portfolio with a Supabase backend and a built-in admin panel.
The look and motion are modelled on award-winning architecture studio sites: huge thin serif type,
a quiet grey canvas, hover-driven image reveals, curtain page transitions and a loader.

## What is inside

| Area | What you get |
| --- | --- |
| Pages | Home, Projects, Project detail, About, Journal, Journal post, Contact, Privacy, 404 |
| Motion | Intro loader, Lenis smooth scroll, curtain page transitions, custom cursor with labels, custom draggable scrollbar, character reveals, parallax, hover image trail, marquee, rotating badges |
| Backend | Supabase Postgres, Row Level Security, Storage bucket, Auth |
| Admin | `/admin` with a page for every piece of public content, image uploads, inbox for contact messages |
| SEO | Per-page metadata, Open Graph and Twitter cards, canonical URLs, JSON-LD, `sitemap.xml`, `robots.txt`, web manifest, icon |
| Safety | Middleware guard on `/admin`, RLS on every table, honeypot and rate limit on the contact form, security headers |
| Hosting | `vercel.json` and `netlify.toml` included |

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. The site works immediately with built-in sample content, no Supabase needed.

## Connect Supabase

1. Follow `supabase/README.md` (about 10 minutes). It covers the SQL files, the publishable key, the storage bucket and creating the first admin.
2. Put the values in `.env.local`:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxx
NEXT_PUBLIC_USE_MOCK_DATA=true
```

3. Restart `npm run dev` and visit `/admin/login`.

## How sample content disappears

Every section (projects, journal, experience, education, certifications, stats, gallery images) is checked on its own.

* If the Supabase table has at least one **published** row, only real rows are shown.
* If the table is empty, the sample content for that section is shown.
* Project and journal items without a cover image get an abstract placeholder until you upload one.
* Set `NEXT_PUBLIC_USE_MOCK_DATA=false` to turn sample content off completely.

Sample experience, education and certifications are copied from the LinkedIn profile, so they are already correct. Sample projects and journal posts are placeholders.

## Admin panel

| Screen | Controls |
| --- | --- |
| Dashboard | Counts per section and whether sample content is still showing |
| Site settings | Name, hero text, tagline, about text, contact details, social links, footer, SEO defaults, share image |
| Projects | Create, edit, delete, publish toggle, cover and gallery uploads, tags, links, sort order |
| Journal | Markdown editor, categories, publish date, cover upload |
| Experience, Education, Certifications | Rows shown on the About page |
| Stats | The three big numbers on the home page |
| Gallery | Hero chips and the contact page marquee |
| Messages | Inbox for the contact form |
| Admins | Who can sign in, and how to add someone |

Saving in the admin panel clears the page cache, so changes show on the site right away.

## Intro loader (customisable)

In **Admin, Site settings, Intro loader** you can change:

* the shape: arch, circles, nested squares, triangles, diamond, hexagon, orbit, wave, lines, or **custom** (paste any SVG path drawn in a 100 by 100 box)
* the animation: draw, fill, pulse or spin
* the two corner labels and how many seconds it runs
* turn it off entirely

A live preview with a replay button sits right under the custom path field. Existing databases need `supabase/06_loader_settings.sql` once.

## Dependency security

* `next` is pinned to `^15.5.9` and `react` and `react-dom` to `^19.2.3`, which include the patches for the React Server Components advisories.
* `overrides` forces the PostCSS copy that Next lists to a current release, which clears the common `npm audit` warning.
* Run `npm run audit` to check production dependencies only.
* Never run `npm audit fix --force`. It tries to downgrade Next to an ancient version and will break the project.
* If `npm audit` still lists something, send me the output and I will target it.

## Deploy

### Vercel
1. Push this folder to GitHub and import it in Vercel. The framework is detected automatically.
2. Add the four environment variables from `.env.example` under Project Settings, Environment Variables.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain, then redeploy.

### Netlify
1. Import the repository. `netlify.toml` already sets the build command and the Next.js runtime plugin.
2. Add the same four environment variables under Site configuration, Environment variables.
3. Deploy.

After deploying, in Supabase go to Authentication, URL Configuration and set the Site URL to your domain.

## Project structure

```
src/
  app/
    (site)/          public pages and their shared layout
    admin/           login screen and the protected panel
    api/contact/     contact form endpoint
    sitemap.ts robots.ts manifest.ts icon.svg
  components/        public UI, motion and admin components
  lib/               Supabase clients, data layer with mock fallback, SEO helpers, admin field config
  middleware.ts      protects /admin
supabase/            SQL files and setup guide
public/mock/         generated abstract placeholder images
```

## Customising

* Colours and spacing: the variables at the top of `src/app/globals.css`.
* Fonts: `src/app/layout.tsx` (Bodoni Moda for display, Hanken Grotesk for text).
* Nav items: `src/components/Header.tsx`.
* Fields in the admin forms: `src/lib/admin-config.ts`.
* Sample content: `src/lib/mock-data.ts` and `src/lib/defaults.ts`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript check |
