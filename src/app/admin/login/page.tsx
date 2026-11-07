import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string; next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error, next } = await searchParams;
  const safeNext = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

  return (
    <main className="login">
      <div className="login__card">
        <h1>Admin sign in</h1>
        <p className="muted">Only people listed in the admins table can enter.</p>

        {error === "not-configured" && (
          <p className="alert">
            Supabase is not connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local, then
            restart the dev server.
          </p>
        )}
        {error === "not-admin" && (
          <div className="alert">
            <p>You are signed in, but this account is not an admin. Run supabase/04_make_admin.sql with this email, then sign in again.</p>
            <SignOutButton />
          </div>
        )}

        {error !== "not-configured" && <LoginForm next={safeNext} />}
      </div>
    </main>
  );
}
