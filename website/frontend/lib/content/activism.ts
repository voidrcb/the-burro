import { z } from 'zod';

import { getCmsPath, readJsonFile } from '@/lib/server/repo';

const sourceRefSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const activismActionSchema = z.object({
  type: z.enum(['petition', 'donation', 'contact', 'share']),
  label: z.string(),
  url: z.string(),
});

export const activismUpdateSchema = z.object({
  update_id: z.string(),
  slug: z.string().optional(),
  title: z.string(),
  status_date: z.string(),
  status_type: z.enum(['policy_change', 'litigation', 'local_resolution', 'event', 'media', 'call_to_action']),
  summary: z.string(),
  content: z.string().optional(),
  source_pack_ref: z.string(),
  public_visibility: z.boolean(),
  action_label: z.string().optional(),
  action_href: z.string().optional(),
  source_refs: z.array(sourceRefSchema).optional(),
  actions: z.array(activismActionSchema).optional(),
  category: z.enum(['legislative', 'conservation', 'community', 'education']).optional(),
});

export type ActivismUpdateSeed = z.infer<typeof activismUpdateSchema>;
export type ActivismAction = z.infer<typeof activismActionSchema>;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function defaultCategory(entry: Pick<ActivismUpdateSeed, 'status_type'>): NonNullable<ActivismUpdateSeed['category']> {
  switch (entry.status_type) {
    case 'policy_change':
    case 'litigation':
      return 'legislative';
    case 'local_resolution':
      return 'community';
    case 'media':
      return 'education';
    case 'call_to_action':
      return 'conservation';
    default:
      return 'community';
  }
}

export async function loadActivismUpdates(): Promise<ActivismUpdateSeed[]> {
  const target = getCmsPath('activism', 'updates.json');
  const payload = await readJsonFile<{ updates: ActivismUpdateSeed[] }>(target, { updates: [] });
  return payload.updates
    .map((entry) => activismUpdateSchema.parse(entry))
    .filter((entry) => entry.public_visibility)
    .map((entry) => ({
      ...entry,
      slug: entry.slug ?? slugify(entry.title),
      content: entry.content ?? entry.summary,
      source_refs: entry.source_refs ?? [],
      actions: entry.actions ?? (entry.action_label && entry.action_href ? [{ type: 'share', label: entry.action_label, url: entry.action_href }] : []),
      category: entry.category ?? defaultCategory(entry),
    }))
    .sort((left, right) => right.status_date.localeCompare(left.status_date));
}

export async function getActivismUpdateBySlug(slug: string): Promise<ActivismUpdateSeed | null> {
  const updates = await loadActivismUpdates();
  return updates.find((entry) => entry.slug === slug) ?? null;
}

export async function listActivismActionItems(): Promise<ActivismAction[]> {
  const updates = await loadActivismUpdates();
  return updates.flatMap((entry) => entry.actions ?? []);
}
