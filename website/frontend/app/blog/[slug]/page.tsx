import { notFound } from 'next/navigation';

import { getBlogCategoryLabel, getBlogPost, getBlogPostSlugs } from '@/lib/content/blog';

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl rounded-panel border border-text-strong/10 bg-white/85 p-8 shadow-soft">
      <p className="text-sm uppercase tracking-[0.22em] text-accent-earth">{post.frontmatter.eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl text-text-strong">{post.frontmatter.title}</h1>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-muted">
        <span>{getBlogCategoryLabel(post.frontmatter.category)}</span>
        <span>{post.frontmatter.publishedAt}</span>
        <span>{post.readingMinutes} min read</span>
      </div>
      <p className="mt-5 text-lg leading-8 text-text-body">{post.frontmatter.summary}</p>
      <div className="prose prose-stone mt-8 max-w-none prose-headings:font-display prose-headings:text-text-strong prose-p:text-text-body prose-a:text-accent-primary">
        {post.content}
      </div>
    </article>
  );
}
