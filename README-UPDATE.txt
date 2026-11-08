1. Copy everything in this folder into your project root, replacing files of the same path.
2. Supabase > SQL Editor: run supabase/07_contact_method.sql once.
3. Netlify > Site configuration > Environment variables, add:
   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SITE_URL (optional: NEXT_PUBLIC_USE_MOCK_DATA)
   For real emails also: RESEND_API_KEY (and optionally CONTACT_FROM_EMAIL)
4. Delete ayesha-umera-portfolio.zip and vercel.json from the project (not needed), push, deploy.
5. Admin > Site settings > Contact: choose email or whatsapp, set the WhatsApp number, save.
