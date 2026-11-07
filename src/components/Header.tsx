"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { TLink } from "@/components/PageTransition";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    return () => document.documentElement.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="header">
        <TLink href="/" className="header__logo" aria-label="Ayesha Umera, home">
          <Logo />
        </TLink>
        <nav className="header__nav" aria-label="Main">
          {links.map((l) => (
            <TLink
              key={l.href}
              href={l.href}
              className="navlink"
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
            >
              {l.label}
            </TLink>
          ))}
        </nav>
        <button
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div id="mobile-menu" className="menu" data-open={open} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {links.map((l) => (
            <TLink key={l.href} href={l.href} tabIndex={open ? 0 : -1}>
              {l.label}
            </TLink>
          ))}
        </nav>
      </div>
    </>
  );
}
