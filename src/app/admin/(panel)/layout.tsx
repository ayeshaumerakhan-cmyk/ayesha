import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured) redirect("/admin/login?error=not-configured");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin/login?error=not-admin");

  return (
    <div className="shell">
      <aside className="sidebar">
        <p className="sidebar__brand">Portfolio admin</p>
        <AdminNav />
        <div className="sidebar__foot">
          <Link href="/" target="_blank" className="muted">
            View site
          </Link>
          <p className="muted small">{user.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
