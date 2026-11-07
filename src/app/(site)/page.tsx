import { AboutTeaser } from "@/components/AboutTeaser";
import { Hero } from "@/components/Hero";
import { JournalTeaser } from "@/components/JournalTeaser";
import { ProjectIndex } from "@/components/ProjectIndex";
import { Stats } from "@/components/Stats";
import { getHeroChips, getJournal, getProjects, getSettings, getStats } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, projects, stats, journal, chips] = await Promise.all([
    getSettings(),
    getProjects(),
    getStats(),
    getJournal(),
    getHeroChips(),
  ]);

  return (
    <>
      <Hero settings={settings} chips={chips} />
      {projects.length > 0 && <ProjectIndex projects={projects} variant="home" />}
      <Stats stats={stats} />
      <AboutTeaser intro={settings.about_intro} />
      <JournalTeaser posts={journal} />
    </>
  );
}
