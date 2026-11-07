import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Privacy and cookies",
  description: "How this website uses cookies and handles messages sent through the contact form.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <article className="jpost">
      <header className="jpost__head">
        <h1 className="jpost__title">Privacy and cookies</h1>
      </header>
      <div className="prose">
        <p>
          This website keeps things simple. It uses a small amount of browser storage to remember that you have seen the intro
          animation and that you have closed the cookie notice. Nothing in that storage identifies you.
        </p>
        <h2>Contact form</h2>
        <p>
          If you send a message, your name, email address and message are stored securely so that {s.site_name} can reply. They are
          not sold or shared.
        </p>
        <h2>Questions</h2>
        <p>
          Email <a href={`mailto:${s.email}`}>{s.email}</a> to ask for your message to be deleted.
        </p>
      </div>
    </article>
  );
}
