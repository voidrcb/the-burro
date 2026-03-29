import Link from 'next/link';

import { Card } from '@/components/Card';
import { ContentSection } from '@/components/ContentSection';
import { listBlogPosts, getBlogCategoryLabel } from '@/lib/content/blog';

export default async function BlogPage() {
  const posts = await listBlogPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  return (
    <ContentSection
      kicker="Field journal"
      title="Construction notes, preservation updates, and workshop thinking"
      body="The Burro journal exists so the public site can carry real progress and real context. The publishing rhythm is simple: meaningful updates when something changes, not filler for the sake of cadence."
    >
      <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.16em] text-text-muted">
        {categories.map((category) => (
          <span key={category} className="rounded-full bg-surface-elevated px-3 py-2">{getBlogCategoryLabel(category)}</span>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.slug} title={post.title} description={post.summary}>
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>{getBlogCategoryLabel(post.category)}</span>
              <span>{post.readingMinutes} min read</span>
            </div>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-semibold text-accent-primary">
              Open post
            </Link>
          </Card>
        ))}
      </div>
    </ContentSection>
  );
}
