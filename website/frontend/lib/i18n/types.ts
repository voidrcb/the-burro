import { z } from 'zod';

/**
 * Internationalisation Types per Sprint 3.1
 *
 * Implements A-3.1.1, A-3.1.2, A-3.1.3 amendments.
 */

// Supported locales per A-3.1.1
export const localeSchema = z.enum(['en', 'es']);
export type Locale = z.infer<typeof localeSchema>;

export const DEFAULT_LOCALE: Locale = 'en';
export const SUPPORTED_LOCALES: Locale[] = ['en', 'es'];

// Translation record status lifecycle per A-3.1.2 (DEC-054)
export const translationStatusSchema = z.enum([
  'draft',
  'reviewed',
  'approved',
  'deprecated',
]);

export type TranslationStatus = z.infer<typeof translationStatusSchema>;

// Translation record per A-3.1.2
export const translationRecordSchema = z.object({
  id: z.string(),
  sourceKey: z.string(), // Stable identifier (e.g., 'nav.home', 'booking.confirmation.title')
  sourceLocale: localeSchema.default('en'),
  targetLocale: localeSchema,
  sourceText: z.string(),
  translatedText: z.string(),
  status: translationStatusSchema,
  machineTranslated: z.boolean(),
  humanEdited: z.boolean(),
  reviewedBy: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  approvedBy: z.string().nullable(),
  approvedAt: z.string().nullable(),
  namespace: z.string(), // e.g., 'nav', 'booking', 'forms', 'errors'
  context: z.string().optional(), // Additional context for translators
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TranslationRecord = z.infer<typeof translationRecordSchema>;

// Translation state transitions per A-3.1.2
export const VALID_TRANSLATION_TRANSITIONS: Record<TranslationStatus, TranslationStatus[]> = {
  draft: ['reviewed'],
  reviewed: ['approved', 'draft'], // Can return to draft for revisions
  approved: ['deprecated', 'draft'], // Can deprecate or go back to draft for updates
  deprecated: ['draft'], // Can be reactivated by returning to draft
};

// Route tier classification per A-3.1.3 (DEC-055)
export const routeTierSchema = z.enum(['tier1', 'tier2', 'tier3']);
export type RouteTier = z.infer<typeof routeTierSchema>;

// Tier 1: Mandatory for first Spanish release
export const TIER_1_ROUTES: string[] = [
  '/',
  '/about',
  '/stay',
  '/stay/[slug]',
  '/contact',
  '/policies',
  '/etiquette',
];

// Tier 2: Recommended (high value)
export const TIER_2_ROUTES: string[] = [
  '/workshops',
  '/workshops/[slug]',
  '/experiences',
  '/experiences/[slug]',
  '/shop',
  '/rentals',
];

// Tier 3: Deferred (low priority or high volume)
export const TIER_3_ROUTES: string[] = [
  '/blog',
  '/blog/[slug]',
  '/activism',
  '/activism/updates/[slug]',
  '/dark-sky',
];

export function getRouteTier(route: string): RouteTier {
  // Normalize dynamic routes
  const normalized = route
    .replace(/\/[^/]+$/, '/[slug]')
    .replace(/\/$/, '');

  if (TIER_1_ROUTES.includes(normalized) || TIER_1_ROUTES.includes(route)) {
    return 'tier1';
  }
  if (TIER_2_ROUTES.includes(normalized) || TIER_2_ROUTES.includes(route)) {
    return 'tier2';
  }
  return 'tier3';
}

// Translation namespace definitions per A-3.1.4
export const TRANSLATION_NAMESPACES = [
  'common',    // Shared UI elements (buttons, nav, footer)
  'nav',       // Navigation labels
  'forms',     // Form labels and validation
  'errors',    // Error messages
  'booking',   // Booking-related strings
  'workshop',  // Workshop-related strings
  'shop',      // Shop-related strings
  'rental',    // Rental-related strings
  'assistant', // Burro assistant phrases
  'email',     // Email templates
  'policy',    // Policy and legal content
] as const;

export type TranslationNamespace = typeof TRANSLATION_NAMESPACES[number];

// Translation batch for import/export
export const translationBatchSchema = z.object({
  locale: localeSchema,
  namespace: z.string(),
  exportedAt: z.string(),
  records: z.array(translationRecordSchema),
});

export type TranslationBatch = z.infer<typeof translationBatchSchema>;

// Locale cookie configuration per A-3.1.1
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
export const LOCALE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

// Translation memory query options
export interface TranslationQueryOptions {
  locale?: Locale;
  namespace?: string; // Allow any string for flexibility in querying
  status?: TranslationStatus;
  includeDeprecated?: boolean;
}
