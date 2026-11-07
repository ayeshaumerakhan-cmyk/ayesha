import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal"],
  axes: ["opsz"],
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.seo_title, template: `%s | ${s.site_name}` },
    description: s.seo_description,
    applicationName: s.site_name,
    authors: [{ name: s.site_name, url: s.linkedin_url || SITE_URL }],
    creator: s.site_name,
    keywords: [
      "Ayesha Umera",
      "AI and ML student",
      "B.Tech Artificial Intelligence",
      "campus ambassador",
      "Google Cloud skill badge",
      "portfolio",
      "Telangana",
    ],
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: "website",
      siteName: s.site_name,
      title: s.seo_title,
      description: s.seo_description,
      url: SITE_URL,
      locale: "en_IN",
      images: [{ url: s.og_image_url || `${SITE_URL}/og-default.jpg`, width: 1200, height: 630, alt: s.site_name }],
    },
    twitter: {
      card: "summary_large_image",
      title: s.seo_title,
      description: s.seo_description,
      images: [s.og_image_url || `${SITE_URL}/og-default.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ececec",
};

// Runs before first paint. Returning visitors skip the loader with no flash.
const earlyScript = `try{if(sessionStorage.getItem('loaded')){document.documentElement.classList.add('loader-done','is-ready')}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: earlyScript }} />
        <noscript>
          <style>{`.loader{display:none!important}.chars .char{transform:none!important;animation:none!important}.reveal{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
