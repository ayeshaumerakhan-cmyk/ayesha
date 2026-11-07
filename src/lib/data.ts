import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured, USE_MOCK_DATA } from "@/lib/env";
import { defaultSettings } from "@/lib/defaults";
import {
  MOCK_PROJECT_IMAGES,
  mockCertifications,
  mockEducation,
  mockExperience,
  mockGallery,
  mockHeroChips,
  mockJournal,
  mockProjects,
  mockStats,
} from "@/lib/mock-data";
import type {
  Certification,
  Education,
  Experience,
  GalleryImage,
  JournalPost,
  Project,
  SiteSettings,
  Stat,
} from "@/types";

type Row = Record<string, unknown>;

const s = (v: unknown): string => (typeof v === "string" ? v : v == null ? "" : String(v));
const n = (v: unknown): number => (typeof v === "number" ? v : Number(v) || 0);
const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => s(x)).filter(Boolean) : []);

/**
 * Fetch rows from a table. Returns:
 *  - real rows when at least one exists
 *  - mock rows when the table is empty (or Supabase is unreachable) and mock mode is on
 *  - an empty list when mock mode is off
 */
async function load<T>(
  table: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  build: (q: any) => PromiseLike<{ data: unknown; error: unknown }>,
  map: (row: Row) => T,
  mock: T[],
): Promise<T[]> {
  const fallback = USE_MOCK_DATA ? mock : [];
  if (!isSupabaseConfigured) return fallback;
  try {
    const client = createPublicClient();
    const { data, error } = await build(client.from(table));
    if (error || !Array.isArray(data) || data.length === 0) return fallback;
    return (data as Row[]).map(map);
  } catch {
    return fallback;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return defaultSettings;
  try {
    const client = createPublicClient();
    const { data, error } = await client.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return defaultSettings;
    const merged: Record<string, string> = { ...defaultSettings };
    for (const key of Object.keys(defaultSettings)) {
      const v = (data as Row)[key];
      if (typeof v === "string" && v.trim() !== "") merged[key] = v;
    }
    return merged as SiteSettings;
  } catch {
    return defaultSettings;
  }
}

const mapProject = (r: Row): Project => ({
  id: s(r.id),
  slug: s(r.slug),
  title: s(r.title),
  category: s(r.category),
  location: s(r.location),
  year: s(r.year),
  role: s(r.role),
  summary: s(r.summary),
  description: s(r.description),
  cover_url: s(r.cover_url),
  images: arr(r.images),
  tags: arr(r.tags),
  link_url: s(r.link_url),
  repo_url: s(r.repo_url),
  featured: Boolean(r.featured),
  sort_order: n(r.sort_order),
});

export function getProjects(): Promise<Project[]> {
  return load(
    "projects",
    (q) => q.select("*").eq("published", true).order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
    mapProject,
    mockProjects,
  ).then((list) => list.map(withCoverFallback));
}

export async function getProject(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

/** Guarantees every project has a cover image, using abstract mock art when none is uploaded. */
function withCoverFallback(p: Project, index: number): Project {
  const cover = p.cover_url || (USE_MOCK_DATA ? MOCK_PROJECT_IMAGES[index % MOCK_PROJECT_IMAGES.length] : "");
  return { ...p, cover_url: cover };
}

const mapJournal = (r: Row): JournalPost => ({
  id: s(r.id),
  slug: s(r.slug),
  title: s(r.title),
  excerpt: s(r.excerpt),
  content: s(r.content),
  category: s(r.category),
  cover_url: s(r.cover_url),
  published_at: s(r.published_at),
  sort_order: n(r.sort_order),
});

export function getJournal(): Promise<JournalPost[]> {
  return load(
    "journal_posts",
    (q) => q.select("*").eq("published", true).order("published_at", { ascending: false }).order("sort_order", { ascending: true }),
    mapJournal,
    mockJournal,
  ).then((list) =>
    list.map((p, i) => ({
      ...p,
      cover_url: p.cover_url || (USE_MOCK_DATA ? MOCK_PROJECT_IMAGES[(i + 3) % MOCK_PROJECT_IMAGES.length] : ""),
    })),
  );
}

export async function getJournalPost(slug: string): Promise<JournalPost | null> {
  const all = await getJournal();
  return all.find((p) => p.slug === slug) ?? null;
}

export function getExperience(): Promise<Experience[]> {
  return load(
    "experiences",
    (q) => q.select("*").eq("published", true).order("sort_order", { ascending: true }),
    (r) => ({
      id: s(r.id),
      role: s(r.role),
      organization: s(r.organization),
      kind: s(r.kind),
      start_label: s(r.start_label),
      end_label: s(r.end_label),
      location: s(r.location),
      description: s(r.description),
      sort_order: n(r.sort_order),
    }),
    mockExperience,
  );
}

export function getEducation(): Promise<Education[]> {
  return load(
    "education",
    (q) => q.select("*").eq("published", true).order("sort_order", { ascending: true }),
    (r) => ({
      id: s(r.id),
      institution: s(r.institution),
      degree: s(r.degree),
      period: s(r.period),
      grade: s(r.grade),
      sort_order: n(r.sort_order),
    }),
    mockEducation,
  );
}

export function getCertifications(): Promise<Certification[]> {
  return load(
    "certifications",
    (q) => q.select("*").eq("published", true).order("sort_order", { ascending: true }),
    (r) => ({
      id: s(r.id),
      title: s(r.title),
      issuer: s(r.issuer),
      issued: s(r.issued),
      credential_url: s(r.credential_url),
      sort_order: n(r.sort_order),
    }),
    mockCertifications,
  );
}

export function getStats(): Promise<Stat[]> {
  return load(
    "stats",
    (q) => q.select("*").order("sort_order", { ascending: true }),
    (r) => ({ id: s(r.id), label: s(r.label), value: s(r.value), sort_order: n(r.sort_order) }),
    mockStats,
  );
}

const mapGallery = (r: Row): GalleryImage => ({
  id: s(r.id),
  url: s(r.url),
  alt: s(r.alt),
  placement: r.placement === "hero" ? "hero" : "marquee",
  sort_order: n(r.sort_order),
});

async function getGallery(placement: "hero" | "marquee", mock: GalleryImage[]): Promise<GalleryImage[]> {
  return load(
    "gallery_images",
    (q) => q.select("*").eq("placement", placement).order("sort_order", { ascending: true }),
    mapGallery,
    mock,
  );
}

export const getMarqueeImages = () => getGallery("marquee", mockGallery);
export const getHeroChips = () => getGallery("hero", mockHeroChips);
