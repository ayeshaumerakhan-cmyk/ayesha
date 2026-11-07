"use client";

import { useEffect, useState } from "react";
import { TLink } from "@/components/PageTransition";

const KEY = "cookie-consent";

export function CookieBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let accepted = false;
    try {
      accepted = localStorage.getItem(KEY) === "yes";
    } catch {
      accepted = false;
    }
    if (accepted) return;
    const t = window.setTimeout(() => setOpen(true), 3400);
    return () => window.clearTimeout(t);
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(KEY, "yes");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <div className="cookie" data-open={open} role="region" aria-label="Cookie notice" aria-hidden={!open}>
      <p>
        We use cookies to improve this website. You can read more about it{" "}
        <TLink href="/privacy" tabIndex={open ? 0 : -1}>
          here
        </TLink>
        .
      </p>
      <button type="button" onClick={accept} tabIndex={open ? 0 : -1}>
        AGREE &amp; CLOSE
      </button>
    </div>
  );
}
