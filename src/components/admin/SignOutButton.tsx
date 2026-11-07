"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ className = "btn btn--ghost" }: { className?: string }) {
  const router = useRouter();
  const out = async () => {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };
  return (
    <button type="button" className={className} onClick={out}>
      Sign out
    </button>
  );
}
