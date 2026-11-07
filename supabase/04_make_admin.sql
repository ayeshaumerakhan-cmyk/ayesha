-- =============================================================================
-- 04_make_admin.sql
-- Turn a Supabase Auth user into an admin of this portfolio.
--
-- STEP 1  Create the login first, by hand:
--         Supabase Dashboard > Authentication > Users > Add user > Create new user
--         Enter the email and a strong password. Tick "Auto Confirm User".
--
-- STEP 2  Put that same email below and run this file in the SQL Editor.
--
-- To remove an admin later, see the bottom of this file.
-- =============================================================================

insert into public.admins (user_id, email)
select id, email
from auth.users
where lower(email) = lower('ayeshaumerakhan@gmail.com')   -- <== change to the admin's email
on conflict (user_id) do nothing;

-- Check the result. You should see one row per admin.
select a.user_id, a.email, a.created_at from public.admins a order by a.created_at;

-- -----------------------------------------------------------------------------
-- Remove an admin (keeps their Auth login, only removes panel access):
-- delete from public.admins where lower(email) = lower('someone@example.com');
-- -----------------------------------------------------------------------------
