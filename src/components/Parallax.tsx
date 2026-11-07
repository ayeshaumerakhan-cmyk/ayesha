"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "@/components/SmoothScroll";

type Props = {
  children: ReactNode;
  /** Positive moves slower than the page, negative faster. Typical range -0.3 to 0.3. */
  speed?: number;
  className?: string;
};

/** Vertical parallax driven by the shared Lenis scroll. Uses transforms only. */
export function Parallax({ children, speed = 0.12, className = "" }: Props) {
  const lenis = useLenis();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !lenis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let center = 0;
    let visible = false;

    const measure = () => {
      el.style.transform = "none";
      const rect = el.getBoundingClientRect();
      center = rect.top + window.scrollY + rect.height / 2;
    };
    const apply = () => {
      if (!visible) return;
      const offset = (lenis.scroll + window.innerHeight / 2 - center) * speed * -1;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    measure();
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) apply();
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(el);

    const onResize = () => {
      measure();
      apply();
    };
    lenis.on("scroll", apply);
    window.addEventListener("resize", onResize);
    const settle = window.setTimeout(onResize, 600); // re-measure after images and fonts settle

    return () => {
      window.clearTimeout(settle);
      io.disconnect();
      lenis.off("scroll", apply);
      window.removeEventListener("resize", onResize);
      el.style.transform = "";
    };
  }, [lenis, speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
