"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor.
 *  - default: small dot that follows with easing
 *  - links and buttons: dot grows into a ring
 *  - elements with data-cursor="Label": dot becomes a filled disc showing the label
 * Disabled on touch devices and for reduced-motion users.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const label = labelRef.current;
    if (!el || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let shown = false;

    const setState = (state: string, text = "") => {
      el.dataset.state = state;
      label.textContent = text;
    };

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        el.dataset.visible = "true";
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
      el.dataset.visible = "false";
    };
    const down = () => (el.dataset.pressed = "true");
    const up = () => (el.dataset.pressed = "false");

    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
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
    <div ref={ref} className="cursor" data-state="default" data-visible="false" aria-hidden="true">
      <div className="cursor__disc">
        <span ref={labelRef} className="cursor__label" />
      </div>
    </div>
  );
}
