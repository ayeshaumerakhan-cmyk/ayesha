import type {
  Certification,
  Education,
  Experience,
  GalleryImage,
  JournalPost,
  Project,
  Stat,
} from "@/types";
import { PINTEREST_IMAGES } from "@/lib/mock-images";

/**
 * SAMPLE CONTENT.
 * Each block below disappears on its own as soon as the matching Supabase table
 * has at least one published row. Project and journal text here is placeholder
 * copy, replace it from the admin panel. Experience, education and
 * certifications mirror the client's LinkedIn profile.
 */

const img = (n: number) =>
  PINTEREST_IMAGES.length > 0
    ? PINTEREST_IMAGES[(n - 1) % PINTEREST_IMAGES.length]
    : `/mock/mock-${String(n).padStart(2, "0")}.jpg`;

export const MOCK_PROJECT_IMAGES = Array.from({ length: 14 }, (_, i) => img(i + 1));

export const mockProjects: Project[] = [
  {
    id: "mock-p1",
    slug: "campus-insights-dashboard",
    title: "Campus Insights Dashboard",
    category: "Web app",
    location: "Telangana, India",
    year: "2026",
    role: "Design and build",
    summary: "A live dashboard that turns campus event feedback into clear charts.",
    description:
      "Sample project. This is placeholder text that shows how a project page reads.\n\nReplace it from the admin panel under Projects. Add a cover image, extra gallery images, tags, and links to the live site and the repository.",
    cover_url: img(1),
    images: [img(2), img(3), img(4)],
    tags: ["Next.js", "Supabase", "Charts"],
    link_url: "",
    repo_url: "",
    featured: true,
    sort_order: 1,
  },
  {
    id: "mock-p2",
    slug: "gemini-study-companion",
    title: "Gemini Study Companion",
    category: "AI prototype",
    location: "Remote",
    year: "2026",
    role: "Prototype",
    summary: "A study helper prototype built with the Gemini API and Google AI Studio.",
    description:
      "Sample project. A prototype that explains difficult lecture topics in plain language, built while exploring the Gemini API.\n\nEdit or delete this entry from the admin panel.",
    cover_url: img(5),
    images: [img(6), img(7)],
    tags: ["Gemini API", "Google AI Studio", "Python"],
    link_url: "",
    repo_url: "",
    featured: true,
    sort_order: 2,
  },
  {
    id: "mock-p3",
    slug: "event-flow-planner",
    title: "Event Flow Planner",
    category: "Community",
    location: "Telangana, India",
    year: "2026",
    role: "Planning and coordination",
    summary: "A checklist and timeline tool for running student tech events smoothly.",
    description:
      "Sample project. Planning tools shaped by real event coordination work with a student community.\n\nReplace with your own write-up.",
    cover_url: img(8),
    images: [img(9), img(10)],
    tags: ["Events", "Planning", "Teamwork"],
    link_url: "",
    repo_url: "",
    featured: false,
    sort_order: 3,
  },
  {
    id: "mock-p4",
    slug: "speech-notes-assistant",
    title: "Speech Notes Assistant",
    category: "Machine learning",
    location: "Remote",
    year: "2026",
    role: "Experiment",
    summary: "Turning spoken workshop talks into tidy, searchable notes.",
    description:
      "Sample project. An experiment with pre-trained speech and language APIs.\n\nEdit this text from the admin panel.",
    cover_url: img(11),
    images: [img(12), img(13)],
    tags: ["Speech API", "Language API", "Notes"],
    link_url: "",
    repo_url: "",
    featured: false,
    sort_order: 4,
  },
  {
    id: "mock-p5",
    slug: "vertex-prototype-lab",
    title: "Vertex Prototype Lab",
    category: "Cloud",
    location: "Remote",
    year: "2026",
    role: "Learning project",
    summary: "Small experiments using Vertex AI and Google Cloud compute.",
    description:
      "Sample project. A collection of hands-on labs completed on the way to Google Cloud skill badges.\n\nReplace with real details.",
    cover_url: img(14),
    images: [img(1), img(5)],
    tags: ["Vertex AI", "Google Cloud", "Compute"],
    link_url: "",
    repo_url: "",
    featured: false,
    sort_order: 5,
  },
  {
    id: "mock-p6",
    slug: "hackathon-toolkit",
    title: "Hackathon Toolkit",
    category: "Open source",
    location: "India",
    year: "2026",
    role: "Maintainer",
    summary: "Starter kits and checklists for first-time hackathon teams.",
    description:
      "Sample project. A starter repository to help newcomers ship a demo in a weekend.\n\nReplace with your own project.",
    cover_url: img(3),
    images: [img(8), img(11)],
    tags: ["Hackathons", "Templates"],
    link_url: "",
    repo_url: "",
    featured: false,
    sort_order: 6,
  },
];

export const mockJournal: JournalPost[] = [
  {
    id: "mock-j1",
    slug: "earning-the-vertex-ai-gemini-badge",
    title: "What I learned earning the Vertex AI Gemini skill badge",
    excerpt: "Sample post. Notes from the first generative AI labs I completed on Google Cloud Skills Boost.",
    content:
      "This is a sample journal post. Replace it from the admin panel under Journal.\n\n## Why I started\n\nI wanted a structured way to move from curiosity to hands-on practice with generative AI.\n\n## What stuck\n\n- Small labs teach faster than long videos\n- Reading error messages is a skill\n- Writing notes right after a lab doubles retention",
    category: "Learning",
    cover_url: img(2),
    published_at: "2026-10-18",
    sort_order: 1,
  },
  {
    id: "mock-j2",
    slug: "my-first-months-as-a-campus-ambassador",
    title: "My first months as a campus ambassador",
    excerpt: "Sample post. What outreach, workshops and student communities have taught me so far.",
    content:
      "This is a sample journal post.\n\n## Starting out\n\nMost of the work is listening to what students actually want to learn.\n\n## Lessons\n\nConsistency beats big one-off events. A small session every week builds trust.",
    category: "Community",
    cover_url: img(6),
    published_at: "2026-10-02",
    sort_order: 2,
  },
  {
    id: "mock-j3",
    slug: "planning-events-with-a-founding-team",
    title: "Planning events with a founding team",
    excerpt: "Sample post. Behind the scenes of coordinating events for a brand new community.",
    content:
      "This is a sample journal post.\n\n## Roles\n\nEveryone owns a small piece, and a shared checklist keeps it honest.\n\n## Next up\n\nMore workshops, more hackathon nights, and better feedback loops.",
    category: "Events",
    cover_url: img(9),
    published_at: "2026-09-21",
    sort_order: 3,
  },
  {
    id: "mock-j4",
    slug: "notes-from-a-machine-learning-internship",
    title: "Notes from a remote machine learning internship",
    excerpt: "Sample post. How I organise learning, practice and questions while working remotely.",
    content:
      "This is a sample journal post.\n\n## Routine\n\nA fixed hour for theory, a fixed hour for code.\n\n## Questions worth asking\n\nWhat is the data? What does good look like? How will I know it works?",
    category: "Thoughts",
    cover_url: img(12),
    published_at: "2026-09-05",
    sort_order: 4,
  },
  {
    id: "mock-j5",
    slug: "a-beginner-checklist-for-hackathons",
    title: "A beginner checklist for your first hackathon",
    excerpt: "Sample post. Practical steps that make a first hackathon less stressful.",
    content:
      "This is a sample journal post.\n\n## Before\n\nPick a team, pick a stack you already know, agree on a scope.\n\n## During\n\nShip the smallest demo that tells a story.",
    category: "Projects",
    cover_url: img(4),
    published_at: "2026-08-24",
    sort_order: 5,
  },
  {
    id: "mock-j6",
    slug: "why-i-write-things-down",
    title: "Why I write things down",
    excerpt: "Sample post. A short note on keeping a learning journal.",
    content:
      "This is a sample journal post.\n\nWriting forces clarity. If I cannot explain a concept in a paragraph, I have not learned it yet.",
    category: "Thoughts",
    cover_url: img(13),
    published_at: "2026-08-10",
    sort_order: 6,
  },
];

export const mockExperience: Experience[] = [
  {
    id: "e1",
    role: "iNSIGHTS Campus Ambassador",
    organization: "Thore Network Pvt. Ltd.",
    kind: "Internship",
    start_label: "Sep 2026",
    end_label: "Present",
    location: "Campus",
    description:
      "Selected as an iNSIGHTS Campus Ambassador for Batch 5.\nPromote awareness and adoption of iNSIGHTS AI tools among students.\nSupport AI sessions, workshops, campus activations and tech events.\nEncourage student participation in hackathons and community initiatives.\nContribute to student engagement through content and social media.",
    sort_order: 1,
  },
  {
    id: "e2",
    role: "Founding Cohort Member, Events Team",
    organization: "Future Makers Hub",
    kind: "Community",
    start_label: "Sep 2026",
    end_label: "Present",
    location: "",
    description:
      "Selected as a Founding Cohort Member in the Events Team.\nContributing to event planning, coordination, execution and community activities while developing skills in teamwork, leadership and event management.",
    sort_order: 2,
  },
  {
    id: "e3",
    role: "Machine Learning Intern",
    organization: "Learn Depth",
    kind: "Internship",
    start_label: "Aug 2026",
    end_label: "Present",
    location: "India, Remote",
    description: "Hands-on learning and practice in machine learning.",
    sort_order: 3,
  },
  {
    id: "e4",
    role: "Campus Ambassador, Tata Imagination Challenge 2026",
    organization: "Tata Group",
    kind: "Ambassador",
    start_label: "Aug 2026",
    end_label: "Present",
    location: "Campus",
    description:
      "Selected as an Official Campus Ambassador for Tata Imagination Challenge 2026.\nRepresenting and promoting the challenge among students at my college.\nCreating awareness about the opportunities and participation process.\nSupporting outreach and engagement activities to increase student participation.",
    sort_order: 4,
  },
];

export const mockEducation: Education[] = [
  {
    id: "ed1",
    institution: "Kakatiya Institute of Technology and Science for Women",
    degree: "Bachelor of Technology, Artificial Intelligence and Machine Learning",
    period: "Aug 2025 to Jul 2029",
    grade: "8.30 CGPA",
    sort_order: 1,
  },
  {
    id: "ed2",
    institution: "SR Junior College",
    degree: "Intermediate, MPC",
    period: "Jun 2023 to Mar 2025",
    grade: "97.8",
    sort_order: 2,
  },
  {
    id: "ed3",
    institution: "Deccan High School",
    degree: "10th grade",
    period: "Mar 2022 to Apr 2023",
    grade: "9.2 GPA",
    sort_order: 3,
  },
];

export const mockCertifications: Certification[] = [
  {
    id: "c1",
    title: "Explore Generative AI with the Vertex AI Gemini API Skill Badge",
    issuer: "Google Cloud Skills Boost",
    issued: "Oct 2026",
    credential_url: "",
    sort_order: 1,
  },
  {
    id: "c2",
    title: "Create Your First Gemini Enterprise Application",
    issuer: "Google Cloud Skills Boost",
    issued: "Oct 2026",
    credential_url: "",
    sort_order: 2,
  },
  {
    id: "c3",
    title: "Develop AI-Powered Prototypes in Google AI Studio",
    issuer: "Google",
    issued: "Oct 2026",
    credential_url: "",
    sort_order: 3,
  },
  {
    id: "c4",
    title: "The Basics of Google Cloud Compute Skill Badge",
    issuer: "Google",
    issued: "Oct 2026",
    credential_url: "",
    sort_order: 4,
  },
  {
    id: "c5",
    title: "Implement Speech and Language Solutions with Pre-trained APIs",
    issuer: "Google",
    issued: "Oct 2026",
    credential_url: "",
    sort_order: 5,
  },
];

export const mockStats: Stat[] = [
  { id: "s1", label: "Active roles", value: "4", sort_order: 1 },
  { id: "s2", label: "Certifications", value: "5", sort_order: 2 },
  { id: "s3", label: "Graduating", value: "2029", sort_order: 3 },
];

export const mockGallery: GalleryImage[] = MOCK_PROJECT_IMAGES.slice(0, 8).map((url, i) => ({
  id: `g${i}`,
  url,
  alt: "Abstract colour study",
  placement: "marquee" as const,
  sort_order: i,
}));

export const mockHeroChips: GalleryImage[] = [2, 5, 8, 11, 14].map((n, i) => ({
  id: `h${i}`,
  url: img(n),
  alt: "Abstract colour study",
  placement: "hero" as const,
  sort_order: i,
}));
