"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useLenis } from "@/components/SmoothScroll";

type Phase = "idle" | "cover" | "reveal";

const TransitionContext = createContext<{ navigate: (href: string) => void }>({
  // Outside the provider (for example on the 404 page) fall back to a normal navigation.
  navigate: (href: string) => {
    window.location.href = href;
  },
});

export const useTransitionNav = () => useContext(TransitionContext);

// Path keyframes (viewBox 0 0 100 100). Same command structure so they interpolate smoothly.
const COVER_FROM = "M0 100 V100 Q50 100 100 100 V100 Z";
const COVER_MID = "M0 100 V42 Q50 -14 100 42 V100 Z";
const COVER_TO = "M0 100 V0 Q50 0 100 0 V100 Z";
const REVEAL_FROM = "M0 0 V100 Q50 100 100 100 V0 Z";
const REVEAL_MID = "M0 0 V58 Q50 114 100 58 V0 Z";
const REVEAL_TO = "M0 0 V0 Q50 0 100 0 V0 Z";

const COVER_MS = 800;
const REVEAL_MS = 900;

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const [phase, setPhase] = useState<Phase>("idle");
  const busy = useRef(false);
  const pending = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const reveal = useCallback(() => {
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
    timers.current.push(
      window.setTimeout(() => {
        setPhase("reveal");
        // New page text and images start animating now, as the curtain lifts.
        document.documentElement.classList.add("is-ready");
      }, 150),
      window.setTimeout(() => {
        setPhase("idle");
        busy.current = false;
      }, 150 + REVEAL_MS),
    );
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (busy.current) return;
      const target = new URL(href, window.location.href);
      if (target.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }
      const same = target.pathname === window.location.pathname && target.search === window.location.search;
      if (same && !target.hash) return;

      const path = target.pathname + target.search + target.hash;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(path);
        return;
      }

      busy.current = true;
      setPhase("cover");
      timers.current.push(
        window.setTimeout(() => {
          pending.current = true;
          // Curtain is fully closed here. Pause entrance animations until the next page is revealed.
          document.documentElement.classList.remove("is-ready");
          router.push(path);
          // Safety net: if the route never changes, open the curtain anyway.
          timers.current.push(
            window.setTimeout(() => {
              if (pending.current) {
                pending.current = false;
                reveal();
              }
            }, 4000),
          );
        }, COVER_MS),
      );
    },
    [router, reveal],
  );

  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    reveal();
  }, [pathname, reveal]);

  useEffect(() => clearTimers, []);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      {phase !== "idle" && (
        <div className="transition" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              key={phase}
              fill="var(--bg)"
              initial={{ d: phase === "cover" ? COVER_FROM : REVEAL_FROM }}
              animate={{
                d: phase === "cover" ? [COVER_FROM, COVER_MID, COVER_TO] : [REVEAL_FROM, REVEAL_MID, REVEAL_TO],
              }}
              transition={{
                duration: (phase === "cover" ? COVER_MS : REVEAL_MS) / 1000,
                times: [0, 0.5, 1],
                ease: ["easeIn", "easeOut"],
              }}
            />
          </svg>
        </div>
      )}
    </TransitionContext.Provider>
  );
}

type TLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/** Internal link that plays the curtain transition before navigating. */
export function TLink({ href, onClick, children, ...rest }: TLinkProps) {
  const { navigate } = useTransitionNav();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (rest.target === "_blank") return;
    if (!href.startsWith("/")) return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
