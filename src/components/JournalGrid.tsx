"use client";

import { useMemo, useState } from "react";
import { Img } from "@/components/Img";
import { TLink } from "@/components/PageTransition";
import { formatDate } from "@/lib/utils";
import type { JournalPost } from "@/types";

/** Bordered journal grid with category filters. Card sizes repeat in a loose editorial rhythm. */
export function JournalGrid({ posts }: { posts: JournalPost[] }) {
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [posts]);

  const visible = filter === "All" ? posts : posts.filter((p) => p.category === filter);
  const spans = ["big", "mid", "small", "small", "small", "mid", "big", "small"];

  return (
    <>
      <div className="jfilter" role="tablist" aria-label="Filter journal by category">
        {categories.map((c, i) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={filter === c}
            data-on={filter === c}
            onClick={() => setFilter(c)}
          >
            {c}
            {i < categories.length - 1 ? "," : ""}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="jempty">No posts in this category yet.</p>
      ) : (
        <div className="jgrid" key={filter}>
          {visible.map((p, i) => (
            <TLink
              key={p.id}
              href={`/journal/${p.slug}`}
              className={`jcard jcard--${spans[i % spans.length]}`}
              data-cursor="Read"
              style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
            >
              <span className="jcard__meta">
                <span>{p.category}</span>
                <span>{formatDate(p.published_at)}</span>
              </span>
              {p.cover_url && (
                <span className="jcard__img">
                  <Img src={p.cover_url} alt="" sizes="(max-width: 800px) 90vw, 40vw" />
                </span>
              )}
              <span className="jcard__title">{p.title}</span>
              {p.excerpt && <span className="jcard__excerpt">{p.excerpt}</span>}
            </TLink>
          ))}
        </div>
      )}
    </>
  );
}
