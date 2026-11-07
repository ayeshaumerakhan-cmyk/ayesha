"use client";

import type { ReactNode } from "react";
import { useLenis } from "@/components/SmoothScroll";

type Props = { target: string; children: ReactNode; className?: string; cursor?: string };

export function ScrollButton({ target, children, className = "", cursor }: Props) {
  const lenis = useLenis();

  const go = () => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.6 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button type="button" className={className} onClick={go} data-cursor={cursor}>
      {children}
    </button>
  );
}
