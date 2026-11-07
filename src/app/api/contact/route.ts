import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort limiter per server instance: 5 messages per IP per hour.
const hits = new Map<string, number[]>();
const WINDOW = 60 * 60 * 1000;
const LIMIT = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail("Invalid request.", 400);
  }

  // Honeypot: bots fill hidden fields. Pretend success and drop it.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 120) return fail("Please enter your name.", 400);
  if (!EMAIL_RE.test(email) || email.length > 200) return fail("Please enter a valid email address.", 400);
  if (!message || message.length > 4000) return fail("Please write a message (up to 4000 characters).", 400);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return fail("Too many messages. Please try again later.", 429);

  if (!isSupabaseConfigured) {
    return fail("The contact form is not connected to Supabase yet. Add your keys to .env.local.", 503);
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, message });
  if (error) return fail("Could not send your message. Please try again.", 500);

  return NextResponse.json({ ok: true });
}
