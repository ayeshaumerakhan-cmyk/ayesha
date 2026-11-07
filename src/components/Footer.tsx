import { Logo } from "@/components/Logo";
import { TLink } from "@/components/PageTransition";
import { RotatingBadge } from "@/components/RotatingBadge";
import type { SiteSettings } from "@/types";

function splitHighlight(text: string, word: string) {
  if (!word) return [text, "", ""] as const;
  const i = text.toLowerCase().indexOf(word.toLowerCase());
  if (i < 0) return [text, "", ""] as const;
  return [text.slice(0, i), text.slice(i, i + word.length), text.slice(i + word.length)] as const;
}

export function Footer({ settings }: { settings: SiteSettings }) {
  const [before, hit, after] = splitHighlight(settings.footer_cta, settings.footer_highlight);
  const socials = [
    { label: "LinkedIn", href: settings.linkedin_url },
    { label: "GitHub", href: settings.github_url },
    { label: "Instagram", href: settings.instagram_url },
    { label: "Twitter", href: settings.twitter_url },
  ].filter((s) => s.href);

  const half = Math.ceil(socials.length / 2);
  const left = socials.slice(0, half);
  const right = socials.slice(half);

  return (
    <footer className="footer">
      <div className="footer__cta">
        <a
          href={`mailto:${settings.email}`}
          className="footer__badge"
          data-cursor="Email"
          aria-label={`Email ${settings.email}`}
        >
          <RotatingBadge text="Get in touch" size={132} />
        </a>
        <p className="footer__line">
          {before}
          {hit && <span className="footer__hit">{hit}</span>}
          {after}
        </p>
      </div>

      <div className="footer__links">
        <ul>
          {left.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="ulink">
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${settings.email}`} className="ulink">
              Email
            </a>
          </li>
        </ul>
        <TLink href="/" aria-label="Back to home" className="footer__logo">
          <Logo showWord={false} />
        </TLink>
        <ul>
          {right.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="ulink">
                {s.label}
              </a>
            </li>
          ))}
          {settings.resume_url && (
            <li>
              <a href={settings.resume_url} target="_blank" rel="noopener noreferrer" className="ulink">
                Resume
              </a>
            </li>
          )}
          <li>
            <TLink href="/privacy" className="ulink">
              Privacy
            </TLink>
          </li>
        </ul>
      </div>

      <p className="footer__small">
        &copy; {new Date().getFullYear()} {settings.site_name}. All rights reserved.
      </p>
    </footer>
  );
}
