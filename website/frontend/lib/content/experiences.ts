import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { experienceProductSchema, type ExperienceProduct } from '@/lib/experience/types';
import { packagePricingRuleSchema, type PackagePricingRule } from '@/lib/itinerary/types';
import { getCmsPath } from '@/lib/server/repo';

const experiencesDirectory = getCmsPath('experiences');
const pricingRulesPath = getCmsPath('pricing', 'package-rules.json');

async function readExperienceFile(fileName: string): Promise<ExperienceProduct> {
  const raw = await readFile(path.join(experiencesDirectory, fileName), 'utf8');
  return experienceProductSchema.parse(JSON.parse(raw));
}

export async function listExperienceProducts(): Promise<ExperienceProduct[]> {
  const entries = await readdir(experiencesDirectory);
  const files = entries.filter((entry) => entry.endsWith('.json') && entry !== 'schema.json');
  const experiences = await Promise.all(files.map((fileName) => readExperienceFile(fileName)));
  return experiences.sort((left, right) => left.name.localeCompare(right.name));
}

export async function listPublicExperienceProducts(): Promise<ExperienceProduct[]> {
  const experiences = await listExperienceProducts();
  return experiences.filter((experience) => experience.status !== 'private');
}

export async function listBookableExperienceProducts(): Promise<ExperienceProduct[]> {
  const experiences = await listExperienceProducts();
  return experiences.filter((experience) => experience.status === 'available' || experience.status === 'seasonal');
}

export async function getExperienceProductBySlug(slug: string): Promise<ExperienceProduct | null> {
  const experiences = await listExperienceProducts();
  return experiences.find((experience) => experience.slug === slug) ?? null;
}

export async function getPublicExperienceProductBySlug(slug: string): Promise<ExperienceProduct | null> {
  const experience = await getExperienceProductBySlug(slug);
  return experience && experience.status !== 'private' ? experience : null;
}

export async function getExperienceProductById(id: string): Promise<ExperienceProduct | null> {
  const experiences = await listExperienceProducts();
  return experiences.find((experience) => experience.id === id) ?? null;
}

export async function listPackagePricingRules(): Promise<PackagePricingRule[]> {
  const raw = await readFile(pricingRulesPath, 'utf8');
  const payload = JSON.parse(raw) as { rules: unknown[] };
  return payload.rules.map((rule) => packagePricingRuleSchema.parse(rule));
}
