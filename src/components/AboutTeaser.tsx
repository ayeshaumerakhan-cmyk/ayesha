import { TLink } from "@/components/PageTransition";
import { RotatingBadge } from "@/components/RotatingBadge";

export function AboutTeaser({ intro }: { intro: string }) {
  return (
    <section className="teaser">
      <p className="teaser__text">{intro}</p>
      <TLink href="/about" className="teaser__link" data-cursor="About">
        <span className="teaser__label">Learn more about me</span>
        <RotatingBadge text="Read my story" size={112} />
      </TLink>
    </section>
  );
}
