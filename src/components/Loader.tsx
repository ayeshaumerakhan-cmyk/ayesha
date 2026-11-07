"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useLenis } from "@/components/SmoothScroll";

const DURATION = 2000;
const FONT_TIMEOUT = 3500;

/**
 * Intro loader. Shows once per browser session:
 * logo draws itself, a counter runs to 100, then the panel lifts away with a curved edge
 * and the hero text rises in. Returning visitors in the same session skip it entirely
 * (the inline script in layout.tsx sets the html classes before first paint).
 */
export function Loader() {
  const lenis = useLenis();
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("loader-done")) {
      setDone(true);
      return;
    }
    root.classList.add("is-loading");

    const start = performance.now();
    let fontsReady = false;
    let raf = 0;
    let finished = false;
    const timers: number[] = [];

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        fontsReady = true;
      });
    } else {
      fontsReady = true;
    }

    const finish = () => {
      if (finished) return;
      finished = true;
      setLeaving(true);
      timers.push(window.setTimeout(() => root.classList.add("is-ready"), 380));
      timers.push(
        window.setTimeout(() => {
          root.classList.remove("is-loading");
          root.classList.add("loader-done");
          try {
            sessionStorage.setItem("loaded", "1");
          } catch {
            /* storage may be blocked, that is fine */
          }
          setDone(true);
        }, 1150),
      );
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed > FONT_TIMEOUT) fontsReady = true;
      const t = Math.min(1, elapsed / DURATION);
      let value = Math.round((1 - Math.pow(1 - t, 3)) * 100);
      if (!fontsReady && value > 99) value = 99;
      setCount(value);
      if (value >= 100) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Freeze smooth scrolling while the loader is up.
  useEffect(() => {
    if (!lenis) return;
    if (done) {
      lenis.start();
    } else {
      lenis.stop();
    }
  }, [lenis, done]);

  if (done) return null;

  return (
    <div className="loader" data-leaving={leaving} role="status" aria-label="Loading">
      <div className="loader__top">
        <span>Ayesha Umera</span>
        <span>Portfolio 2026</span>
      </div>
      <div className="loader__center">
        <Logo draw showWord={false} className="loader__logo" />
      </div>
      <div className="loader__bottom">
        <span className="loader__count">{String(count).padStart(3, "0")}</span>
        <span className="loader__bar">
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </span>
      </div>
    </div>
  );
}
