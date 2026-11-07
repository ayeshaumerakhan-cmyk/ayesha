"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** "mask" wipes an image open, "fade" is a gentle rise. */
  variant?: "mask" | "fade";
  delay?: number;
};

/** Adds the .in class once the element is 12% visible. One-shot, no re-triggering. */
export function Reveal({ children, as: Tag = "div", className = "", variant = "fade", delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const cleanups: Array<() => void> = [];

    // Wait for the page to be ready (loader gone, curtain lifting) before revealing.
    const show = () => {
      if (root.classList.contains("is-ready")) {
        el.classList.add("in");
        return;
      }
      const mo = new MutationObserver(() => {
        if (root.classList.contains("is-ready")) {
          mo.disconnect();
          window.setTimeout(() => el.classList.add("in"), 120);
        }
      });
      mo.observe(root, { attributes: true, attributeFilter: ["class"] });
      cleanups.push(() => mo.disconnect());
    };

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            io.unobserve(entry.target);
            show();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    cleanups.push(() => io.disconnect());
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const style = { "--delay": `${delay}ms` } as CSSProperties;
  return (
    <Tag ref={ref} className={`reveal reveal--${variant} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
