"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Called by the admin screens after every save or delete so the public site
 * shows the change immediately instead of waiting for the 60 second cache.
 * Only signed-in admins can trigger it.
 */
export async function revalidateSite(): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) return { ok: false };

  revalidatePath("/", "layout");
  return { ok: true };
}
