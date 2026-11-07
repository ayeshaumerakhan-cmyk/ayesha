import { Reveal } from "@/components/Reveal";
import type { Stat } from "@/types";

export function Stats({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <section className="stats" aria-label="At a glance">
      {stats.map((s, i) => (
        <Reveal key={s.id} className="stats__item" delay={i * 90}>
          <span className="stats__value">{s.value}</span>
          <span className="stats__label">{s.label}</span>
        </Reveal>
      ))}
    </section>
  );
}
