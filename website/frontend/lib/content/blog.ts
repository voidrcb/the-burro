import { readFile, readdir } from 'fs/promises';
import path from 'path';

import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { z } from 'zod';

import { getCmsPath } from '@/lib/server/repo';

export const blogFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  publishedAt: z.preprocess((value) => {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    return value;
  }, z.string()),
  summary: z.string(),
  category: z.enum(['field_notes', 'construction', 'workshops', 'preservation']),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  eyebrow: z.string(),
});

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;

export type BlogPostListItem = BlogFrontmatter & {
  readingMinutes: number;
};

type ParsedBlogFile = {
  fileName: string;
  frontmatter: BlogFrontmatter;
  source: string;
  content: string;
};

const blogDirectory = getCmsPath('blog');

function readingMinutes(source: string): number {
  return Math.max(2, Math.ceil(source.split(/\s+/).filter(Boolean).length / 220));
}

async function loadParsedBlogFiles(): Promise<ParsedBlogFile[]> {
  const entries = await readdir(blogDirectory);
  const mdxFiles = entries.filter((entry) => entry.endsWith('.mdx'));
  const parsed = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const filePath = path.join(blogDirectory, fileName);
      const source = await readFile(filePath, 'utf8');
      const data = matter(source);
      const result = blogFrontmatterSchema.safeParse(data.data);

      if (!result.success) {
        return null;
      }

      return {
        fileName,
        frontmatter: result.data,
        source,
        content: data.content,
      } satisfies ParsedBlogFile;
    }),
  );

  return parsed.filter((entry): entry is ParsedBlogFile => entry !== null);
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const posts = await loadParsedBlogFiles();
  return posts.map((post) => post.frontmatter.slug);
}

export async function listBlogPosts(): Promise<BlogPostListItem[]> {
  const posts = await loadParsedBlogFiles();
  return posts
    .map((post) => ({
      ...post.frontmatter,
      readingMinutes: readingMinutes(post.content),
    }))
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function getBlogPost(slug: string): Promise<{ frontmatter: BlogFrontmatter; content: React.ReactNode; readingMinutes: number } | null> {
  const posts = await loadParsedBlogFiles();
  const post = posts.find((entry) => entry.frontmatter.slug === slug);

  if (!post) {
    return null;
  }

  const compiled = await compileMDX<BlogFrontmatter>({
    source: post.source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return {
    frontmatter: post.frontmatter,
    content: compiled.content,
    readingMinutes: readingMinutes(post.content),
  };
}

export function getBlogCategoryLabel(category: BlogFrontmatter['category']): string {
  return {
    field_notes: 'Field Notes',
    construction: 'Construction',
    workshops: 'Workshops',
    preservation: 'Preservation',
  }[category];
}
