/**
 * Describes every editable table. The admin panel builds its list and form screens
 * from these objects, so adding a field here adds it to the form.
 * Keep this file free of functions so it can be passed from server to client components.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "select"
  | "date"
  | "image"
  | "images"
  | "tags"
  | "url";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
  placeholder?: string;
  /** For slug fields: fill from this field when left empty. */
  slugFrom?: string;
  /** Renders a section heading before this field. */
  section?: string;
  defaultValue?: string | number | boolean | string[];
};

export type ResourceConfig = {
  table: string;
  title: string;
  singular: string;
  description: string;
  fields: FieldDef[];
  /** Column names shown in the list table. */
  columns: string[];
  orderBy: string;
  ascending?: boolean;
  /** Table has a boolean "published" column. */
  publishable?: boolean;
};

import { LOADER_SHAPE_OPTIONS, LOADER_STYLE_OPTIONS } from "@/lib/loader-shapes";

const today = () => new Date().toISOString().slice(0, 10);

export const projectsConfig: ResourceConfig = {
  table: "projects",
  title: "Projects",
  singular: "project",
  description: "Shown on the home page list, the Projects page and each project page. Lower sort order appears first.",
  orderBy: "sort_order",
  publishable: true,
  columns: ["cover_url", "title", "category", "year", "sort_order"],
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "URL slug", type: "text", required: true, slugFrom: "title", help: "Used in the address, for example /projects/my-project. Leave empty to generate from the title." },
    { name: "category", label: "Category", type: "text", placeholder: "Web app, AI prototype, Community" },
    { name: "location", label: "Location", type: "text", placeholder: "Telangana, India" },
    { name: "year", label: "Year", type: "text", placeholder: "2026" },
    { name: "role", label: "Your role", type: "text" },
    { name: "summary", label: "Short summary", type: "textarea", help: "One or two sentences. Used on the project page and in search results." },
    { name: "description", label: "Full description", type: "textarea", help: "Each new line becomes a paragraph." },
    { name: "cover_url", label: "Cover image", type: "image", help: "Shown in the list, hover preview and at the top of the project page." },
    { name: "images", label: "Gallery images", type: "images" },
    { name: "tags", label: "Tags", type: "tags", help: "Type a tag and press Enter." },
    { name: "link_url", label: "Live link", type: "url" },
    { name: "repo_url", label: "Code link", type: "url" },
    { name: "featured", label: "Featured", type: "boolean" },
    { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
    { name: "published", label: "Published", type: "boolean", defaultValue: true },
  ],
};

export const journalConfig: ResourceConfig = {
  table: "journal_posts",
  title: "Journal",
  singular: "post",
  description: "Posts for the Journal page. Categories you type here become the filter buttons.",
  orderBy: "published_at",
  ascending: false,
  publishable: true,
  columns: ["cover_url", "title", "category", "published_at"],
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "URL slug", type: "text", required: true, slugFrom: "title" },
    { name: "category", label: "Category", type: "text", placeholder: "Learning, Events, Thoughts" },
    { name: "published_at", label: "Publish date", type: "date", required: true, defaultValue: today() },
    { name: "excerpt", label: "Excerpt", type: "textarea", help: "Shown on the journal grid." },
    { name: "cover_url", label: "Cover image", type: "image" },
    { name: "content", label: "Content", type: "markdown", help: "Markdown is supported: ## headings, - lists, **bold**, [links](https://example.com)." },
    { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
    { name: "published", label: "Published", type: "boolean", defaultValue: true },
  ],
};

export const experienceConfig: ResourceConfig = {
  table: "experiences",
  title: "Experience",
  singular: "role",
  description: "Roles shown as coloured blocks on the About page.",
  orderBy: "sort_order",
  publishable: true,
  columns: ["role", "organization", "start_label", "end_label", "sort_order"],
  fields: [
    { name: "role", label: "Role", type: "text", required: true },
    { name: "organization", label: "Organisation", type: "text", required: true },
    { name: "kind", label: "Type", type: "text", placeholder: "Internship, Community, Ambassador" },
    { name: "start_label", label: "Start", type: "text", placeholder: "Sep 2026" },
    { name: "end_label", label: "End", type: "text", placeholder: "Present" },
    { name: "location", label: "Location", type: "text" },
    { name: "description", label: "Description", type: "textarea", help: "One line per bullet point." },
    { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
    { name: "published", label: "Published", type: "boolean", defaultValue: true },
  ],
};

export const educationConfig: ResourceConfig = {
  table: "education",
  title: "Education",
  singular: "entry",
  description: "Schools and degrees listed on the About page.",
  orderBy: "sort_order",
  publishable: true,
  columns: ["institution", "degree", "period", "grade", "sort_order"],
  fields: [
    { name: "institution", label: "Institution", type: "text", required: true },
    { name: "degree", label: "Degree or programme", type: "text", required: true },
    { name: "period", label: "Period", type: "text", placeholder: "Aug 2025 to Jul 2029" },
    { name: "grade", label: "Grade", type: "text", placeholder: "8.30 CGPA" },
    { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
    { name: "published", label: "Published", type: "boolean", defaultValue: true },
  ],
};

export const certificationsConfig: ResourceConfig = {
  table: "certifications",
  title: "Certifications",
  singular: "certification",
  description: "Licenses and certifications listed on the About page.",
  orderBy: "sort_order",
  publishable: true,
  columns: ["title", "issuer", "issued", "sort_order"],
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "issuer", label: "Issuer", type: "text", placeholder: "Google Cloud Skills Boost" },
    { name: "issued", label: "Issued", type: "text", placeholder: "Oct 2026" },
    { name: "credential_url", label: "Credential link", type: "url" },
    { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
    { name: "published", label: "Published", type: "boolean", defaultValue: true },
  ],
};

export const statsConfig: ResourceConfig = {
  table: "stats",
  title: "Stats",
  singular: "stat",
  description: "The big numbers shown under the project list on the home page.",
  orderBy: "sort_order",
  columns: ["value", "label", "sort_order"],
  fields: [
    { name: "value", label: "Number or text", type: "text", required: true, placeholder: "5" },
    { name: "label", label: "Label", type: "text", required: true, placeholder: "Certifications" },
    { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
  ],
};

export const galleryConfig: ResourceConfig = {
  table: "gallery_images",
  title: "Gallery",
  singular: "image",
  description: "Hero chips are the small images inside the home tagline. Marquee images scroll across the Contact page.",
  orderBy: "sort_order",
  columns: ["url", "placement", "alt", "sort_order"],
  fields: [
    { name: "url", label: "Image", type: "image", required: true },
    { name: "placement", label: "Where it appears", type: "select", options: ["marquee", "hero"], required: true, defaultValue: "marquee" },
    { name: "alt", label: "Alt text", type: "text", help: "Describe the image for screen readers." },
    { name: "sort_order", label: "Sort order", type: "number", defaultValue: 0 },
  ],
};

export const settingsFields: FieldDef[] = [
  { section: "Identity", name: "site_name", label: "Site name", type: "text" },
  { name: "role_line", label: "One-line role", type: "text" },
  { section: "Home page", name: "hero_title", label: "Hero title", type: "text", help: "The huge lowercase title at the top." },
  { name: "hero_hint", label: "Hero hint word", type: "text", help: "The small word under the title, for example CLICK." },
  { name: "tagline", label: "Tagline", type: "textarea", help: "Small images from Gallery (hero) are placed between the words." },
  { section: "About page", name: "about_headline", label: "Headline", type: "text" },
  { name: "about_highlight", label: "Gradient word", type: "text", help: "A word from the headline that gets the colour gradient." },
  { name: "about_intro", label: "Intro paragraph", type: "textarea" },
  { name: "about_body", label: "Body text", type: "textarea", help: "Each new line becomes a paragraph." },
  { section: "Contact", name: "contact_headline", label: "Contact headline", type: "text", help: "The first word gets the rotating badge." },
  { name: "contact_intro", label: "Contact intro", type: "textarea" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "address", label: "Address", type: "textarea", help: "One line per row." },
  { section: "Links", name: "linkedin_url", label: "LinkedIn", type: "url" },
  { name: "github_url", label: "GitHub", type: "url" },
  { name: "instagram_url", label: "Instagram", type: "url" },
  { name: "twitter_url", label: "Twitter or X", type: "url" },
  { name: "resume_url", label: "Resume link", type: "url", help: "Upload a PDF in Gallery or paste any link." },
  { section: "Footer", name: "footer_cta", label: "Footer message", type: "text" },
  { name: "footer_highlight", label: "Footer blue word", type: "text" },
  { section: "Search and sharing", name: "seo_title", label: "SEO title", type: "text" },
  { name: "seo_description", label: "SEO description", type: "textarea", help: "Keep it under 160 characters." },
  { name: "og_image_url", label: "Share image", type: "image", help: "1200 by 630 pixels works best." },
  { section: "Intro loader", name: "loader_enabled", label: "Show the intro loader", type: "select", options: ["yes", "no"], help: "Shown once per visit, before the home page appears." },
  { name: "loader_shape", label: "Loader shape", type: "select", options: LOADER_SHAPE_OPTIONS, help: "Pick a built-in shape, or choose custom and paste your own path below." },
  { name: "loader_style", label: "Loader animation", type: "select", options: [...LOADER_STYLE_OPTIONS], help: "draw traces the lines, fill traces then fills, pulse breathes, spin rotates while drawing." },
  { name: "loader_custom_path", label: "Custom SVG path", type: "textarea", help: "Only used when the shape is custom. Paste the d attribute of an SVG path drawn inside a 100 by 100 box, for example M10 90 L50 10 L90 90 Z." },
  { name: "loader_label_left", label: "Loader text, top left", type: "text" },
  { name: "loader_label_right", label: "Loader text, top right", type: "text" },
  { name: "loader_duration", label: "Loader length in seconds", type: "text", help: "Between 0.8 and 6. The default is 2." },
];
