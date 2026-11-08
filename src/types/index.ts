export type SiteSettings = {
  site_name: string;
  role_line: string;
  hero_title: string;
  hero_hint: string;
  tagline: string;
  about_headline: string;
  about_highlight: string;
  about_intro: string;
  about_body: string;
  contact_headline: string;
  contact_intro: string;
  email: string;
  phone: string;
  contact_method: string;
  whatsapp_number: string;
  location: string;
  address: string;
  linkedin_url: string;
  github_url: string;
  instagram_url: string;
  twitter_url: string;
  resume_url: string;
  footer_cta: string;
  footer_highlight: string;
  seo_title: string;
  seo_description: string;
  og_image_url: string;
  loader_enabled: string;
  loader_shape: string;
  loader_style: string;
  loader_custom_path: string;
  loader_label_left: string;
  loader_label_right: string;
  loader_duration: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  role: string;
  summary: string;
  description: string;
  cover_url: string;
  images: string[];
  tags: string[];
  link_url: string;
  repo_url: string;
  featured: boolean;
  sort_order: number;
};

export type JournalPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover_url: string;
  published_at: string;
  sort_order: number;
};

export type Experience = {
  id: string;
  role: string;
  organization: string;
  kind: string;
  start_label: string;
  end_label: string;
  location: string;
  description: string;
  sort_order: number;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  period: string;
  grade: string;
  sort_order: number;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  credential_url: string;
  sort_order: number;
};

export type Stat = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  placement: "hero" | "marquee";
  sort_order: number;
};
