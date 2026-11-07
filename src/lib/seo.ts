import type { Metadata } from "next";
import { SITE_URL } from "@/lib/env";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMeta = {
  title?: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
};

export function pageMetadata({ title, description, path, image, type = "website", publishedTime, noIndex }: PageMeta): Metadata {
  const img = absoluteUrl(image || "/og-default.jpg");
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: title,
      description,
      url: absoluteUrl(path),
      type,
      publishedTime,
      images: [{ url: img, width: 1200, height: 630, alt: title || "Ayesha Umera" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img],
    },
  };
}

export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
