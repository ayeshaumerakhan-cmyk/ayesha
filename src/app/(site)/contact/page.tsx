import type { Metadata } from "next";
import { AnimatedChars } from "@/components/AnimatedChars";
import { ContactForm } from "@/components/ContactForm";
import { Marquee } from "@/components/Marquee";
import { RotatingBadge } from "@/components/RotatingBadge";
import { getMarqueeImages, getSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { splitLines } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Ayesha Umera for internships, collaborations, hackathons and community projects.",
  path: "/contact",
});

export default async function ContactPage() {
  const [s, images] = await Promise.all([getSettings(), getMarqueeImages()]);
  const words = s.contact_headline.split(" ");
  const first = words[0] ?? "";
  const rest = words.slice(1).join(" ");
  const socials = [
    { label: "LinkedIn", href: s.linkedin_url },
    { label: "GitHub", href: s.github_url },
    { label: "Instagram", href: s.instagram_url },
    { label: "Twitter", href: s.twitter_url },
  ].filter((x) => x.href);

  return (
    <div className="page page--contact">
      <section className="chero">
        <div className="chero__info">
          <p className="chero__intro">{s.contact_intro}</p>
          <p>
            {s.phone && (
              <>
                <a href={`tel:${s.phone.replace(/\s+/g, "")}`} className="ulink">
                  {s.phone}
                </a>
                <br />
              </>
            )}
            <a href={`mailto:${s.email}`} className="ulink">
              {s.email}
            </a>
          </p>
          <div className="chero__address">
            <p>
              {s.site_name}
              <br />
              {splitLines(s.address).map((l, i) => (
                <span key={i}>
                  {l}
                  <br />
                </span>
              ))}
            </p>
          </div>
          <ul className="chero__social">
            {socials.map((x) => (
              <li key={x.label}>
                <a href={x.href} target="_blank" rel="noopener noreferrer" className="ulink">
                  {x.label}
                </a>
              </li>
            ))}
          </ul>
          <ContactForm />
        </div>

        <h1 className="chero__title">
          <span className="chero__line">
            <AnimatedChars text={first} />
            <a href={`mailto:${s.email}`} className="chero__badge" data-cursor="Email" aria-label="Email me">
              <RotatingBadge text="Email me, write to me" size={150} />
            </a>
          </span>
          <span className="chero__line">
            <AnimatedChars text={rest} offset={first.length} />
          </span>
        </h1>
      </section>

      <Marquee images={images} />
    </div>
  );
}
