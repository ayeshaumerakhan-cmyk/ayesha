import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteProviders } from "@/components/SiteProviders";
import { getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { toLoaderConfig } from "@/lib/loader-shapes";
import { jsonLd } from "@/lib/seo";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const s = await getSettings();

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: s.site_name,
    url: SITE_URL,
    email: s.email ? `mailto:${s.email}` : undefined,
    jobTitle: "B.Tech student, Artificial Intelligence and Machine Learning",
    description: s.seo_description,
    address: { "@type": "PostalAddress", addressRegion: "Telangana", addressCountry: "IN" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Kakatiya Institute of Technology and Science for Women" },
    sameAs: [s.linkedin_url, s.github_url, s.instagram_url, s.twitter_url].filter(Boolean),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: s.site_name,
    url: SITE_URL,
  };

  return (
    <SiteProviders loader={toLoaderConfig(s)}>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer settings={s} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(website) }} />
    </SiteProviders>
  );
}
