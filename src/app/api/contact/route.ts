import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import { getSettings } from "@/lib/data";

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

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Sends the message with Resend. Returns true on success, false if not configured or it failed. */
async function sendEmail(to: string, name: string, email: string, message: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

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

  const ip =
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (limited(ip)) return fail("Too many messages. Please try again later.", 429);

  const settings = await getSettings();
  const method = settings.contact_method === "whatsapp" ? "whatsapp" : "email";
  const waNumber = (settings.whatsapp_number || "").replace(/\D/g, "");
  const text = `Hi, I am ${name} (${email}).\n\n${message}`;

  if (method === "whatsapp" && !waNumber) {
    return fail("WhatsApp is selected but no WhatsApp number is set in the admin panel.", 503);
  }

  // Always keep a copy in the admin inbox when Supabase is connected. Never block delivery on it.
  let saved = false;
  if (isSupabaseConfigured) {
    try {
      const { error } = await createPublicClient().from("contact_messages").insert({ name, email, message });
      saved = !error;
    } catch {
      saved = false;
    }
  }

  if (method === "whatsapp") {
    return NextResponse.json({
      ok: true,
      method,
      url: `https://wa.me/${waNumber}?text=${encodeURIComponent(text.slice(0, 1500))}`,
    });
  }

  const emailed = await sendEmail(settings.email, name, email, message);
  if (emailed) return NextResponse.json({ ok: true, method });

  // No email service configured (or it failed). Fall back to the visitor's mail app.
  if (settings.email) {
    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(text.slice(0, 1500));
    return NextResponse.json({
      ok: true,
      method: "mailto",
      url: `mailto:${settings.email}?subject=${subject}&body=${body}`,
      saved,
    });
  }

  if (saved) return NextResponse.json({ ok: true, method });
  return fail("Could not send your message. Please try again.", 500);
}
