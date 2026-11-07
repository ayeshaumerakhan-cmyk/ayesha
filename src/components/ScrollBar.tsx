"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useLenis } from "@/components/SmoothScroll";

/** Slim custom scrollbar. Draggable thumb, click the track to jump. Native bar is hidden via CSS. */
export function ScrollBar() {
  const lenis = useLenis();
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; startScroll: number } | null>(null);

  useEffect(() => {
    if (!lenis) return;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const update = () => {
      const doc = document.documentElement;
      const viewport = window.innerHeight;
      const total = doc.scrollHeight;
      const scrollable = total > viewport + 4;
      track.dataset.hidden = scrollable ? "false" : "true";
      if (!scrollable) return;
      const thumbH = Math.max(56, (viewport * viewport) / total);
      const limit = Math.max(1, total - viewport);
      const progress = Math.min(1, Math.max(0, lenis.scroll / limit));
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translate3d(0, ${progress * (viewport - thumbH)}px, 0)`;
    };

    update();
    lenis.on("scroll", update);
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(document.body);

    return () => {
      lenis.off("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [lenis]);

  const onThumbDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!lenis) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startY: e.clientY, startScroll: lenis.scroll };
    trackRef.current?.setAttribute("data-dragging", "true");
  };

  const onThumbMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!lenis || !drag.current || !thumbRef.current) return;
    const viewport = window.innerHeight;
    const thumbH = thumbRef.current.offsetHeight;
    const limit = Math.max(1, document.documentElement.scrollHeight - viewport);
    const ratio = limit / Math.max(1, viewport - thumbH);
    const next = drag.current.startScroll + (e.clientY - drag.current.startY) * ratio;
    lenis.scrollTo(Math.min(limit, Math.max(0, next)), { immediate: true });
  };

  const onThumbUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = null;
    trackRef.current?.setAttribute("data-dragging", "false");
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onTrackDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!lenis || e.target !== e.currentTarget) return;
    const viewport = window.innerHeight;
    const limit = Math.max(1, document.documentElement.scrollHeight - viewport);
    lenis.scrollTo((e.clientY / viewport) * limit, { duration: 1.1 });
  };

  return (
    <div ref={trackRef} className="scrollbar" data-hidden="true" data-dragging="false" onPointerDown={onTrackDown}>
      <div
        ref={thumbRef}
        className="scrollbar__thumb"
        onPointerDown={onThumbDown}
        onPointerMove={onThumbMove}
        onPointerUp={onThumbUp}
        onPointerCancel={onThumbUp}
      />
    </div>
  );
}
