import type { Metadata } from "next";
import { AnimatedChars } from "@/components/AnimatedChars";
import { DiscoverBanner } from "@/components/DiscoverBanner";
import { JournalGrid } from "@/components/JournalGrid";
import { getJournal, getProjects } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Journal",
  description: "Notes on learning AI and machine learning, campus communities, events and building in public by Ayesha Umera.",
  path: "/journal",
});

export default async function JournalPage() {
  const [posts, projects] = await Promise.all([getJournal(), getProjects()]);
  return (
    <div className="page page--journal">
      <header className="jhead">
        <h1 className="jhead__title">
          <AnimatedChars text="Journal" />
        </h1>
      </header>
      <JournalGrid posts={posts} />
      <DiscoverBanner images={projects.map((p) => p.cover_url)} />
    </div>
  );
}
