"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Img } from "@/components/Img";
import { Parallax } from "@/components/Parallax";
import { TLink } from "@/components/PageTransition";
import type { Project } from "@/types";

type Props = {
  projects: Project[];
  /** "home" shows category and location beside each title. "page" scatters small images around the list. */
  variant: "home" | "page";
};

/**
 * The big centred list of project titles.
 * Hover: the other titles fade back, the hovered title fills with a gradient and a preview
 * image trails the pointer. On the projects page, small images drift beside the titles.
 */
export function ProjectIndex({ projects, variant }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0, vx: 0, shown: false });

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const p = pointer.current;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      p.tx = e.clientX;
      p.ty = e.clientY;
      if (!p.shown) {
        p.shown = true;
        p.x = p.tx;
        p.y = p.ty;
      }
    };
    const loop = () => {
      const dx = p.tx - p.x;
      p.x += dx * 0.14;
      p.y += (p.ty - p.y) * 0.14;
      p.vx += (dx - p.vx) * 0.1;
      const tilt = Math.max(-9, Math.min(9, p.vx * 0.06));
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section className="pindex" data-variant={variant} data-hovering={active !== null} aria-label="Projects">
      <ul className="pindex__list">
        {projects.map((p, i) => {
          const side = i % 2 === 0 ? "l" : "r";
          const style = {
            "--sx": `${6 + ((i * 7) % 14)}vw`,
            "--sw": `${9 + ((i * 5) % 6)}vw`,
          } as CSSProperties;
          return (
            <li
              key={p.id}
              className="pindex__row"
              data-active={active === i}
              style={style}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              {variant === "home" && <span className="pindex__meta pindex__meta--l">{p.category}</span>}

              <TLink href={`/projects/${p.slug}`} className="pindex__title" data-cursor="View">
                <span className="pindex__text">{p.title}</span>
              </TLink>

              {variant === "home" && <span className="pindex__meta pindex__meta--r">{p.location}</span>}

              {variant === "page" && p.cover_url && (
                <Parallax className={`scatter scatter--${side}`} speed={0.08 + (i % 3) * 0.05}>
                  <span className="scatter__img">
                    <Img src={p.cover_url} alt="" sizes="16vw" />
                  </span>
                </Parallax>
              )}

              {/* Mobile: image sits under the title */}
              {p.cover_url && (
                <span className="pindex__thumb">
                  <Img src={p.cover_url} alt="" sizes="60vw" />
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div ref={previewRef} className="fpreview" data-show={active !== null} aria-hidden="true">
        {projects.map((p, i) => (
          <span key={p.id} className="fpreview__img" data-on={active === i}>
            {p.cover_url && <Img src={p.cover_url} alt="" sizes="320px" />}
          </span>
        ))}
      </div>
    </section>
  );
}
