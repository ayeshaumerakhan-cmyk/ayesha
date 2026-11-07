import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Block = { table: string; label: string; href: string; published: boolean };

const blocks: Block[] = [
  { table: "projects", label: "Projects", href: "/admin/projects", published: true },
  { table: "journal_posts", label: "Journal posts", href: "/admin/journal", published: true },
  { table: "experiences", label: "Experience", href: "/admin/experience", published: true },
  { table: "education", label: "Education", href: "/admin/education", published: true },
  { table: "certifications", label: "Certifications", href: "/admin/certifications", published: true },
  { table: "stats", label: "Stats", href: "/admin/stats", published: false },
  { table: "gallery_images", label: "Gallery images", href: "/admin/gallery", published: false },
];

export default async function Dashboard() {
  const supabase = await createClient();

  const counts = await Promise.all(
    blocks.map(async (b) => {
      let q = supabase.from(b.table).select("*", { count: "exact", head: true });
      if (b.published) q = q.eq("published", true);
      const { count } = await q;
      return count ?? 0;
    }),
  );

  const { count: unread } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">
            Anything you add here appears on the website straight away. Sections with no published rows still show sample content.
          </p>
        </div>
      </div>

      <div className="grid">
        {blocks.map((b, i) => (
          <Link key={b.table} href={b.href} className="card stat">
            <span className="stat__value">{counts[i]}</span>
            <span className="stat__label">{b.label}</span>
            <span className={`pill ${counts[i] > 0 ? "pill--on" : ""}`}>{counts[i] > 0 ? "Live content" : "Showing sample content"}</span>
          </Link>
        ))}
        <Link href="/admin/messages" className="card stat">
          <span className="stat__value">{unread ?? 0}</span>
          <span className="stat__label">Unread messages</span>
          <span className="pill">Open inbox</span>
        </Link>
      </div>

      <div className="card pad">
        <h2>Getting started</h2>
        <ol className="steps">
          <li>
            Open <Link href="/admin/settings">Site settings</Link> and check your name, email and links.
          </li>
          <li>
            Add your first <Link href="/admin/projects">project</Link>. The sample projects vanish on their own.
          </li>
          <li>
            Add small images under <Link href="/admin/gallery">Gallery</Link> for the home tagline and the contact strip.
          </li>
        </ol>
      </div>
    </div>
  );
}
