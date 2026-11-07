# Supabase setup

Everything is run from the Supabase dashboard. You do not need the CLI.
This project uses the **publishable key** (`sb_publishable_...`), not the legacy anon key.
It never uses the secret key or the service role key.

## 1. Create the project

1. Go to https://supabase.com/dashboard and create a new project.
2. Wait until it finishes provisioning.

## 2. Run the SQL files in order

Open **SQL Editor, New query**, paste each file, press **Run**.

| Order | File | What it does |
| --- | --- | --- |
| 1 | `01_schema.sql` | Creates all tables and triggers |
| 2 | `02_rls_policies.sql` | Turns on Row Level Security and creates the `is_admin()` helper |
| 3 | `03_storage.sql` | Creates the public `media` bucket and its upload rules |
| 4 | `04_make_admin.sql` | Turns one Auth user into an admin (after step 3 below) |
| 5 | `05_optional_seed.sql` | Creates the empty settings row, optional |

Every file can be run again safely.

## 3. Create the first admin login (done by hand, on purpose)

1. **Authentication, Users, Add user, Create new user.**
2. Enter the admin email and a strong password. Tick **Auto Confirm User**.
3. Open `04_make_admin.sql`, put the same email in the `where lower(email) = ...` line, and run it.
4. The result table at the bottom should list that email.

To add another admin later, repeat these steps with their email.
To remove one, use the delete example at the bottom of `04_make_admin.sql`.

## 4. Copy the keys into `.env.local`

In **Project Settings, API Keys** (or the **Connect** dialog):

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, looks like `https://abcd1234.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The **Publishable key**, starts with `sb_publishable_` |

Restart the dev server after editing `.env.local`.

## 5. Sign in

Visit `/admin/login` on your site and use the email and password from step 3.

## 6. After you deploy

In **Authentication, URL Configuration** set **Site URL** to your production domain
and add `http://localhost:3000` as an extra redirect URL for local work.

## Tables

| Table | Public can read | Used for |
| --- | --- | --- |
| `site_settings` | yes | Text, links and SEO (single row, id 1) |
| `projects` | published rows | Home list, Projects page, project pages |
| `journal_posts` | published rows | Journal grid and posts |
| `experiences` | published rows | About page blocks |
| `education` | published rows | About page |
| `certifications` | published rows | About page |
| `stats` | yes | Home page numbers |
| `gallery_images` | yes | Hero chips and contact marquee |
| `contact_messages` | no (insert only) | Contact form inbox |
| `admins` | own row only | Who may use the admin panel |

## Security model

* Visitors can read published content and insert a contact message. Nothing else.
* Only users listed in `public.admins` can write content, upload files or read messages.
* The browser key is safe to expose because RLS enforces all of this inside the database.
* Nobody can make themselves an admin from the website. The `admins` table has no insert policy.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Login says the account is not an admin | Run `04_make_admin.sql` with the exact login email |
| Saving fails with "new row violates row-level security policy" | You are not an admin, or `02_rls_policies.sql` was not run |
| Image upload fails | Run `03_storage.sql`, then check the `media` bucket exists and is public |
| Site still shows sample content | The section has no **published** rows yet |
| Contact form says it is not connected | Add the two keys to `.env.local` and restart |
