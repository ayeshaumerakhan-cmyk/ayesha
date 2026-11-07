import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { AnimatedChars } from "@/components/AnimatedChars";
import { Img } from "@/components/Img";
import { TLink } from "@/components/PageTransition";
import { Reveal } from "@/components/Reveal";
import { getJournal, getJournalPost } from "@/lib/data";
import { absoluteUrl, jsonLd, pageMetadata } from "@/lib/seo";
import { formatDate, truncate } from "@/lib/utils";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getJournal();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  return pageMetadata({
    title: post.title,
    description: truncate(post.excerpt || post.content.replace(/[#*_>`-]/g, " ").replace(/\s+/g, " ").trim(), 160),
    path: `/journal/${post.slug}`,
    image: post.cover_url,
    type: "article",
    publishedTime: post.published_at || undefined,
  });
}

export default async function JournalPostPage({ params }: Params) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getJournalPost(slug), getJournal()]);
  if (!post) notFound();

  const index = all.findIndex((p) => p.slug === post.slug);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at || undefined,
    image: post.cover_url ? absoluteUrl(post.cover_url) : undefined,
    mainEntityOfPage: absoluteUrl(`/journal/${post.slug}`),
    author: { "@type": "Person", name: "Ayesha Umera" },
  };

  return (
    <article className="jpost">
      <header className="jpost__head">
        <p className="jpost__meta">
          <span>{post.category}</span>
          <span>{formatDate(post.published_at)}</span>
        </p>
        <h1 className="jpost__title">
          <AnimatedChars text={post.title} />
        </h1>
      </header>

      {post.cover_url && (
        <Reveal variant="mask" className="jpost__cover">
          <Img src={post.cover_url} alt={post.title} sizes="(max-width: 800px) 100vw, 70vw" priority />
        </Reveal>
      )}

      <div className="prose">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <div className="jpost__nav">
        <TLink href="/journal" className="ulink">
          All journal posts
        </TLink>
      </div>

      {next && (
        <TLink href={`/journal/${next.slug}`} className="nextlink" data-cursor="Next">
          <span className="nextlink__small">Next post</span>
          <span className="nextlink__title">{next.title}</span>
        </TLink>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    </article>
  );
}
