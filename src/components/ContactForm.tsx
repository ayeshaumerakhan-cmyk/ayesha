"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Network error. Check your connection and try again.");
    }
  };

  if (status === "sent") {
    return (
      <div className="cform cform--sent" role="status">
        <p>Thank you. Your message is on its way, and I will reply soon.</p>
        <button type="button" className="ulink" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="cform" onSubmit={onSubmit} noValidate={false}>
      <label>
        <span>Your name</span>
        <input name="name" type="text" required maxLength={120} autoComplete="name" />
      </label>
      <label>
        <span>Your email</span>
        <input name="email" type="email" required maxLength={200} autoComplete="email" />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" required maxLength={4000} rows={4} />
      </label>
      {/* Honeypot. Real visitors never see or fill this. */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" className="cform__trap" aria-hidden="true" />
      <div className="cform__foot">
        <button type="submit" className="cform__send" disabled={status === "sending"} data-cursor="Send">
          {status === "sending" ? "Sending" : "Send message"}
        </button>
        {status === "error" && (
          <p className="cform__error" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
