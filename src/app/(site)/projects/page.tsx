import type { Metadata } from "next";
import { ProjectIndex } from "@/components/ProjectIndex";
import { getProjects } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: "Selected projects by Ayesha Umera: AI prototypes, web apps, community work and cloud experiments.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="page page--projects">
      <h1 className="sr-only">Projects</h1>
      {projects.length === 0 ? (
        <p className="jempty">Projects will appear here soon.</p>
      ) : (
        <ProjectIndex projects={projects} variant="page" />
      )}
    </div>
  );
}
