import { Img } from "@/components/Img";
import { TLink } from "@/components/PageTransition";
import { Reveal } from "@/components/Reveal";
import { formatDate } from "@/lib/utils";
import type { JournalPost } from "@/types";

export function JournalTeaser({ posts }: { posts: JournalPost[] }) {
  const shown = posts.slice(0, 4);
  if (shown.length === 0) return null;
  return (
    <section className="jteaser">
      <TLink href="/journal" className="jteaser__head" data-cursor="Journal">
        <span className="jteaser__small">Journal</span>
        <h2 className="jteaser__title">My latest notes</h2>
      </TLink>
      <div className="jteaser__grid">
        {shown.map((p, i) => (
          <Reveal key={p.id} variant="mask" delay={i * 110} className={`jteaser__item jteaser__item--${i + 1}`}>
            <TLink href={`/journal/${p.slug}`} data-cursor="Read">
              <span className="jteaser__img">
                <Img src={p.cover_url} alt={p.title} sizes="(max-width: 800px) 70vw, 24vw" />
              </span>
              <span className="jteaser__date">{formatDate(p.published_at)}</span>
              <span className="jteaser__name">{p.title}</span>
            </TLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
