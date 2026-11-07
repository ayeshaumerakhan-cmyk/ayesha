"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    setBusy(true);
    setError("");

    const supabase = createClient();
    const { data: auth, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !auth.user) {
      setBusy(false);
      setError("Wrong email or password.");
      return;
    }

    const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
    if (!admin) {
      await supabase.auth.signOut();
      setBusy(false);
      setError("This account is not an admin. Run supabase/04_make_admin.sql for this email.");
      return;
    }

    router.replace(next);
    router.refresh();
  };

  return (
    <form className="login__form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="email" className="field__label">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="password" className="field__label">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      {error && <p className="alert">{error}</p>}
      <button type="submit" className="btn" disabled={busy}>
        {busy ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
