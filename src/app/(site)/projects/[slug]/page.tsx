import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimatedChars } from "@/components/AnimatedChars";
import { Img } from "@/components/Img";
import { TLink } from "@/components/PageTransition";
import { Reveal } from "@/components/Reveal";
import { getProject, getProjects } from "@/lib/data";
import { absoluteUrl, jsonLd, pageMetadata } from "@/lib/seo";
import { splitLines, truncate } from "@/lib/utils";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };
  return pageMetadata({
    title: project.title,
    description: truncate(project.summary || splitLines(project.description)[0] || project.title, 160),
    path: `/projects/${project.slug}`,
    image: project.cover_url,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();

  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;
  const meta = [
    { label: "Category", value: project.category },
    { label: "Location", value: project.location },
    { label: "Year", value: project.year },
    { label: "Role", value: project.role },
  ].filter((m) => m.value);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    image: project.cover_url ? absoluteUrl(project.cover_url) : undefined,
    keywords: project.tags.join(", "),
    dateCreated: project.year || undefined,
  };

  return (
    <article className="pdetail">
      <header className="pdetail__head">
        <h1 className="pdetail__title">
          <AnimatedChars text={project.title} />
        </h1>
        {project.summary && <p className="pdetail__summary">{project.summary}</p>}
      </header>

      {meta.length > 0 && (
        <dl className="pmeta">
          {meta.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {project.cover_url && (
        <Reveal variant="mask" className="pdetail__cover">
          <Img src={project.cover_url} alt={project.title} sizes="100vw" priority />
        </Reveal>
      )}

      <div className="pdetail__body">
        <div className="pdetail__text">
          {splitLines(project.description).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <aside className="pdetail__aside">
          {project.tags.length > 0 && (
            <ul className="tags">
              {project.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          <div className="pdetail__links">
            {project.link_url && (
              <a className="ulink" href={project.link_url} target="_blank" rel="noopener noreferrer">
                Visit project
              </a>
            )}
            {project.repo_url && (
              <a className="ulink" href={project.repo_url} target="_blank" rel="noopener noreferrer">
                View code
              </a>
            )}
          </div>
        </aside>
      </div>

      {project.images.length > 0 && (
        <div className="pdetail__gallery">
          {project.images.map((src, i) => (
            <Reveal key={`${src}-${i}`} variant="mask" className={`pdetail__shot pdetail__shot--${i % 3}`}>
              <Img src={src} alt={`${project.title}, image ${i + 1}`} sizes="(max-width: 800px) 100vw, 60vw" />
            </Reveal>
          ))}
        </div>
      )}

      {next && (
        <TLink href={`/projects/${next.slug}`} className="nextlink" data-cursor="Next">
          <span className="nextlink__small">Next project</span>
          <span className="nextlink__title">{next.title}</span>
        </TLink>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    </article>
  );
}
