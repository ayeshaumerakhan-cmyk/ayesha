import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AnimatedChars } from "@/components/AnimatedChars";
import { DiscoverBanner } from "@/components/DiscoverBanner";
import { ScrollButton } from "@/components/ScrollButton";
import { Reveal } from "@/components/Reveal";
import { RotatingBadge } from "@/components/RotatingBadge";
import { getCertifications, getEducation, getExperience, getProjects, getSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { splitLines } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "About Ayesha Umera: second-year B.Tech AI and ML student, campus ambassador, events team member and machine learning intern.",
  path: "/about",
});

const palette = ["#cdd6ff", "#d9d2c3", "#e7dcf0", "#d2e4d9"];

function Headline({ text, highlight }: { text: string; highlight: string }) {
  const i = highlight ? text.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (i < 0) return <AnimatedChars text={text} />;
  const before = text.slice(0, i);
  const hit = text.slice(i, i + highlight.length);
  const after = text.slice(i + highlight.length);
  return (
    <>
      <AnimatedChars text={before.trimEnd()} />{" "}
      <span className="hl" aria-label={hit}>
        <span className="hl__in" style={{ "--i": before.length } as CSSProperties}>
          {hit}
        </span>
      </span>
      {after && (
        <>
          {" "}
          <AnimatedChars text={after.trimStart()} offset={before.length + hit.length} />
        </>
      )}
    </>
  );
}

export default async function AboutPage() {
  const [settings, experience, education, certs, projects] = await Promise.all([
    getSettings(),
    getExperience(),
    getEducation(),
    getCertifications(),
    getProjects(),
  ]);

  return (
    <div className="page page--about">
      <section className="ahero">
        <h1 className="ahero__title">
          <Headline text={settings.about_headline} highlight={settings.about_highlight} />
        </h1>
        <ScrollButton target="#experience" className="ahero__badge" cursor="Scroll">
          <RotatingBadge text="Read my story" size={112} />
        </ScrollButton>
      </section>

      <section className="aintro">
        <p className="aintro__lead">{settings.about_intro}</p>
        <div className="aintro__body">
          {splitLines(settings.about_body).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {settings.resume_url && (
            <a className="ulink" href={settings.resume_url} target="_blank" rel="noopener noreferrer">
              Download resume
            </a>
          )}
        </div>
      </section>

      {experience.length > 0 && (
        <section id="experience" className="xp" aria-label="Experience">
          {experience.map((e, i) => (
            <article key={e.id} className="xp__block" style={{ background: palette[i % palette.length] }}>
              <Reveal className="xp__inner">
                <p className="xp__top">
                  <span>
                    {e.start_label}
                    {e.end_label ? ` to ${e.end_label}` : ""}
                  </span>
                  <span>{[e.kind, e.location].filter(Boolean).join(", ")}</span>
                </p>
                <h2 className="xp__role">{e.role}</h2>
                <p className="xp__org">{e.organization}</p>
                <ul className="xp__list">
                  {splitLines(e.description).map((line, li) => (
                    <li key={li}>{line}</li>
                  ))}
                </ul>
              </Reveal>
            </article>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="rows" aria-label="Education">
          <h2 className="rows__title">Education</h2>
          <ul>
            {education.map((ed) => (
              <Reveal as="li" key={ed.id} className="rows__item">
                <span className="rows__main">{ed.institution}</span>
                <span className="rows__sub">{ed.degree}</span>
                <span className="rows__meta">{ed.period}</span>
                <span className="rows__meta">{ed.grade}</span>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {certs.length > 0 && (
        <section className="rows" aria-label="Licenses and certifications">
          <h2 className="rows__title">Certifications</h2>
          <ul>
            {certs.map((c) => (
              <Reveal as="li" key={c.id} className="rows__item">
                <span className="rows__main">{c.title}</span>
                <span className="rows__sub">{c.issuer}</span>
                <span className="rows__meta">{c.issued}</span>
                <span className="rows__meta">
                  {c.credential_url ? (
                    <a className="ulink" href={c.credential_url} target="_blank" rel="noopener noreferrer">
                      View credential
                    </a>
                  ) : null}
                </span>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      <DiscoverBanner images={projects.map((p) => p.cover_url)} />
    </div>
  );
}
