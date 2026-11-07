"use client";

import type { ReactNode } from "react";
import { CookieBar } from "@/components/CookieBar";
import { Cursor } from "@/components/Cursor";
import { Loader } from "@/components/Loader";
import { TransitionProvider } from "@/components/PageTransition";
import { ScrollBar } from "@/components/ScrollBar";
import { SmoothScroll } from "@/components/SmoothScroll";

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <TransitionProvider>
        {children}
        <Cursor />
        <ScrollBar />
        <Loader />
        <CookieBar />
      </TransitionProvider>
    </SmoothScroll>
  );
}
