import { randomUUID } from 'crypto';
import { readdir } from 'fs/promises';
import path from 'path';

import { getCmsPath, readJsonFile, writeJsonFile, ensureDir } from '@/lib/server/repo';

import {
  translationRecordSchema,
  VALID_TRANSLATION_TRANSITIONS,
  type Locale,
  type TranslationQueryOptions,
  type TranslationRecord,
  type TranslationStatus,
} from './types';

/**
 * Translation Memory Store per A-3.1.4 (DEC-056)
 *
 * File-based storage at cms/translations/{locale}/ with namespace organization.
 */

// Path helpers per A-3.1.4
function getTranslationDir(locale: Locale, namespace: string): string {
  return getCmsPath('translations', locale, namespace);
}

function getTranslationPath(locale: Locale, namespace: string, id: string): string {
  return path.join(getTranslationDir(locale, namespace), `${id}.json`);
}

function generateTranslationId(): string {
  return `tr_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

// Translation Record Operations

export async function createTranslation(
  payload: Omit<TranslationRecord, 'id' | 'status' | 'reviewedBy' | 'reviewedAt' | 'approvedBy' | 'approvedAt' | 'createdAt' | 'updatedAt'>
): Promise<TranslationRecord> {
  const now = new Date().toISOString();

  const record = translationRecordSchema.parse({
    ...payload,
    id: generateTranslationId(),
    status: 'draft',
    reviewedBy: null,
    reviewedAt: null,
    approvedBy: null,
    approvedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  const filePath = getTranslationPath(record.targetLocale, record.namespace, record.id);
  await ensureDir(filePath);
  await writeJsonFile(filePath, record);

  return record;
}

export async function getTranslation(
  locale: Locale,
  namespace: string,
  id: string
): Promise<TranslationRecord | null> {
  const data = await readJsonFile<unknown>(
    getTranslationPath(locale, namespace, id),
    null
  );
  if (!data) return null;

  const parsed = translationRecordSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function getTranslationByKey(
  locale: Locale,
  namespace: string,
  sourceKey: string
): Promise<TranslationRecord | null> {
  const records = await listTranslations({ locale, namespace });
  return records.find((r) => r.sourceKey === sourceKey) ?? null;
}

export async function updateTranslation(
  locale: Locale,
  namespace: string,
  id: string,
  updates: Partial<TranslationRecord>
): Promise<TranslationRecord | null> {
  const existing = await getTranslation(locale, namespace, id);
  if (!existing) return null;

  const updated = translationRecordSchema.parse({
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  await writeJsonFile(getTranslationPath(locale, namespace, id), updated);
  return updated;
}

// State transition with validation
export async function transitionTranslationStatus(
  locale: Locale,
  namespace: string,
  id: string,
  newStatus: TranslationStatus,
  actorId: string
): Promise<TranslationRecord> {
  const record = await getTranslation(locale, namespace, id);
  if (!record) {
    throw new Error(`Translation not found: ${id}`);
  }

  const validNextStates = VALID_TRANSLATION_TRANSITIONS[record.status];
  if (!validNextStates.includes(newStatus)) {
    throw new Error(
      `Invalid transition from '${record.status}' to '${newStatus}'. Valid: ${validNextStates.join(', ')}`
    );
  }

  // Policy content requires human edit before approval per HF-3108
  if (newStatus === 'approved' && !record.humanEdited && record.namespace === 'policy') {
    throw new Error('Policy content must be human-edited before approval');
  }

  const now = new Date().toISOString();
  const updates: Partial<TranslationRecord> = {
    status: newStatus,
    updatedAt: now,
  };

  if (newStatus === 'reviewed') {
    updates.reviewedBy = actorId;
    updates.reviewedAt = now;
  }

  if (newStatus === 'approved') {
    updates.approvedBy = actorId;
    updates.approvedAt = now;
  }

  const updated = translationRecordSchema.parse({
    ...record,
    ...updates,
  });

  await writeJsonFile(getTranslationPath(locale, namespace, id), updated);
  return updated;
}

// List translations with optional filtering
export async function listTranslations(
  options?: TranslationQueryOptions
): Promise<TranslationRecord[]> {
  const records: TranslationRecord[] = [];
  const locales: Locale[] = options?.locale ? [options.locale] : ['es']; // Default to es since en is source

  for (const locale of locales) {
    const baseDir = getCmsPath('translations', locale);
    const namespaces = options?.namespace
      ? [options.namespace]
      : await readdir(baseDir).catch(() => [] as string[]);

    for (const namespace of namespaces) {
      const namespaceDir = path.join(baseDir, namespace);
      const files = await readdir(namespaceDir).catch(() => [] as string[]);

      for (const file of files.filter((f) => f.endsWith('.json'))) {
        const data = await readJsonFile<unknown>(path.join(namespaceDir, file), null);
        const parsed = translationRecordSchema.safeParse(data);

        if (parsed.success) {
          const record = parsed.data;

          // Apply filters
          if (options?.status && record.status !== options.status) continue;
          if (!options?.includeDeprecated && record.status === 'deprecated') continue;

          records.push(record);
        }
      }
    }
  }

  return records.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

// Get approved translations for a namespace (for runtime use)
export async function getApprovedTranslations(
  locale: Locale,
  namespace: string
): Promise<Map<string, string>> {
  const records = await listTranslations({
    locale,
    namespace,
    status: 'approved',
  });

  const map = new Map<string, string>();
  for (const record of records) {
    map.set(record.sourceKey, record.translatedText);
  }

  return map;
}

// Get translation coverage stats
export async function getTranslationCoverage(locale: Locale): Promise<{
  total: number;
  draft: number;
  reviewed: number;
  approved: number;
  deprecated: number;
  coveragePercent: number;
}> {
  const all = await listTranslations({ locale, includeDeprecated: true });

  const stats = {
    total: all.length,
    draft: 0,
    reviewed: 0,
    approved: 0,
    deprecated: 0,
    coveragePercent: 0,
  };

  for (const record of all) {
    stats[record.status]++;
  }

  const active = stats.total - stats.deprecated;
  stats.coveragePercent = active > 0 ? (stats.approved / active) * 100 : 0;

  return stats;
}

// Bulk import translations (for seeding)
export async function importTranslations(
  records: Array<Omit<TranslationRecord, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<TranslationRecord[]> {
  const created: TranslationRecord[] = [];

  for (const record of records) {
    const now = new Date().toISOString();
    const full = translationRecordSchema.parse({
      ...record,
      id: generateTranslationId(),
      createdAt: now,
      updatedAt: now,
    });

    const filePath = getTranslationPath(full.targetLocale, full.namespace, full.id);
    await ensureDir(filePath);
    await writeJsonFile(filePath, full);
    created.push(full);
  }

  return created;
}

// Mark translation as human-edited
export async function markAsHumanEdited(
  locale: Locale,
  namespace: string,
  id: string,
  editorId: string,
  newText: string
): Promise<TranslationRecord | null> {
  return updateTranslation(locale, namespace, id, {
    translatedText: newText,
    humanEdited: true,
  });
}
