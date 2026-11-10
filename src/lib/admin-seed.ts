import {
  mockCertifications,
  mockEducation,
  mockExperience,
  mockGallery,
  mockHeroChips,
  mockJournal,
  mockProjects,
  mockStats,
} from "@/lib/mock-data";

type Row = Record<string, unknown>;

/**
 * The sample content the public site shows while a table is empty.
 * The admin copies these rows into the database the first time you open a section,
 * so everything you see on the website can be edited, replaced or deleted.
 */
export function sampleRows(table: string): Row[] | null {
  switch (table) {
    case "projects":
      return mockProjects as unknown as Row[];
    case "journal_posts":
      return mockJournal as unknown as Row[];
    case "experiences":
      return mockExperience as unknown as Row[];
    case "education":
      return mockEducation as unknown as Row[];
    case "certifications":
      return mockCertifications as unknown as Row[];
    case "stats":
      return mockStats as unknown as Row[];
    case "gallery_images":
      return [...mockHeroChips, ...mockGallery] as unknown as Row[];
    default:
      return null;
  }
}
