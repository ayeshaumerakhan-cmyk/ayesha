"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor, modelled on the reference site.
 *  - default: small dot that follows with easing
 *  - links and buttons: dot grows into a ring
 *  - elements with data-cursor="Label": a rotating ring of text with an arrow, like "READ THE ARTICLE"
 * Disabled on touch devices and for reduced-motion users.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextPathElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const badge = badgeRef.current;
    const textPath = textRef.current;
    if (!dot || !badge || !textPath) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let bx = x;
    let by = y;
    let tx = x;
    let ty = y;
    let raf = 0;
    let shown = false;
    let current = "";

    const ringText = (label: string) => {
      const upper = label.toUpperCase();
      const repeat = Math.max(1, Math.round(26 / (upper.length + 1)));
      return Array.from({ length: repeat }, () => upper).join(" ") + " ";
    };

    const setState = (state: string, label = "") => {
      dot.dataset.state = state;
      const showBadge = state === "label";
      badge.dataset.visible = showBadge ? "true" : "false";
      if (showBadge && label !== current) {
        current = label;
        textPath.textContent = ringText(label);
      }
    };

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = bx = tx;
        y = by = ty;
        dot.dataset.visible = "true";
      }
    };

    const over = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t || !t.closest) return;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled && labelled.dataset.cursor) {
        setState("label", labelled.dataset.cursor);
        return;
      }
      if (t.closest("a, button, input, textarea, select, summary, label, [role='button']")) {
        setState("link");
        return;
      }
      setState("default");
    };

    const leave = () => {
      shown = false;
      dot.dataset.visible = "false";
      badge.dataset.visible = "false";
    };
    const down = () => {
      dot.dataset.pressed = "true";
      badge.dataset.pressed = "true";
    };
    const up = () => {
      dot.dataset.pressed = "false";
      badge.dataset.pressed = "false";
    };

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      bx += (tx - bx) * 0.14;
      by += (ty - by) * 0.14;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      badge.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor" data-state="default" data-visible="false" aria-hidden="true">
        <span className="cursor__dot" />
      </div>
      <div ref={badgeRef} className="cursor-badge" data-visible="false" aria-hidden="true">
        <div className="cursor-badge__body">
          <svg className="cursor-badge__ring" viewBox="0 0 100 100">
            <defs>
              <path id="cursor-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
            </defs>
            <text>
              <textPath ref={textRef} href="#cursor-circle" textLength="237" lengthAdjust="spacing" />
            </text>
          </svg>
          <svg className="cursor-badge__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </>
  );
}
