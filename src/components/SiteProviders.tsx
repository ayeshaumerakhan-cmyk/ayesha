"use client";

import type { ReactNode } from "react";
import { CookieBar } from "@/components/CookieBar";
import { Cursor } from "@/components/Cursor";
import { Loader } from "@/components/Loader";
import { TransitionProvider } from "@/components/PageTransition";
import { ScrollBar } from "@/components/ScrollBar";
import { SmoothScroll } from "@/components/SmoothScroll";
import type { LoaderConfig } from "@/lib/loader-shapes";

export function SiteProviders({ children, loader }: { children: ReactNode; loader: LoaderConfig }) {
  return (
    <SmoothScroll>
      <TransitionProvider>
        {children}
        <Cursor />
        <ScrollBar />
        <Loader config={loader} />
        <CookieBar />
      </TransitionProvider>
    </SmoothScroll>
  );
}
