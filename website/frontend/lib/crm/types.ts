import { z } from 'zod';

/**
 * CRM Types per Sprint 3.2
 *
 * Customer Profile, Communication Preferences, Recommendation Rules,
 * and Lifecycle Automation schemas.
 */

// ============================================================================
// Customer Profile per A-3.2.1 (DEC-059)
// ============================================================================

// External ID mapping for integrations
export const externalIdMappingSchema = z.object({
  source: z.enum(['lodgify', 'stripe', 'postmark', 'manual']),
  externalId: z.string(),
  linkedAt: z.string(),
  linkedBy: z.string().optional(),
});

export type ExternalIdMapping = z.infer<typeof externalIdMappingSchema>;

// Profile merge audit record
export const profileMergeRecordSchema = z.object({
  mergedProfileId: z.string(),
  mergedEmail: z.string(),
  mergedAt: z.string(),
  mergedBy: z.string(),
  reason: z.string().optional(),
  eventsMigrated: z.number().int().nonnegative(),
});

export type ProfileMergeRecord = z.infer<typeof profileMergeRecordSchema>;

// Communication preferences per A-3.2.4 (DEC-062)
export const communicationPreferencesSchema = z.object({
  marketingOptIn: z.boolean().default(false), // Explicit opt-in required
  workshopNotifications: z.boolean().default(true), // Default true for registrants
  followUpAllowed: z.boolean().default(true), // Default true, opt-out
  unsubscribedAt: z.string().nullable().default(null),
  unsubscribeReason: z.string().optional(),
  consentUpdatedAt: z.string().optional(),
  consentSource: z.enum(['registration', 'checkout', 'explicit', 'import']).optional(),
});

export type CommunicationPreferences = z.infer<typeof communicationPreferencesSchema>;

// Customer profile schema
export const customerProfileSchema = z.object({
  // Identity per A-3.2.1
  profileId: z.string(), // Stable UUID
  primaryEmail: z.string().email(), // Normalized
  aliasEmails: z.array(z.string().email()).default([]), // Known alternates
  externalIds: z.array(externalIdMappingSchema).default([]), // Lodgify, Stripe, etc.

  // Basic info
  displayName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),

  // Communication preferences per A-3.2.4
  communicationPreferences: communicationPreferencesSchema,

  // Tags for segmentation
  tags: z.array(z.string()).default([]),

  // Derived stats (computed on read, cached)
  stats: z.object({
    totalBookings: z.number().int().nonnegative().default(0),
    totalWorkshops: z.number().int().nonnegative().default(0),
    totalPurchases: z.number().int().nonnegative().default(0),
    firstEventAt: z.string().nullable().default(null),
    lastEventAt: z.string().nullable().default(null),
    lifetimeValueUsd: z.number().nonnegative().default(0),
  }).optional(),

  // Merge history per A-3.2.1
  mergeHistory: z.array(profileMergeRecordSchema).default([]),

  // Audit
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string().optional(),
});

export type CustomerProfile = z.infer<typeof customerProfileSchema>;

// ============================================================================
// Recommendation Rules per A-3.2.3 (DEC-061)
// ============================================================================

// Condition types for rule evaluation
export const ruleConditionTypeSchema = z.enum([
  'has_event',       // Guest has event of type X
  'event_count_gte', // Guest has >= N events of type X
  'recency_within',  // Last event of type X within N days
  'seasonality_match', // Current date matches season
  'has_tag',         // Guest has tag X
  'missing_event',   // Guest does NOT have event of type X
]);

export type RuleConditionType = z.infer<typeof ruleConditionTypeSchema>;

export const ruleConditionSchema = z.object({
  type: ruleConditionTypeSchema,
  eventType: z.string().optional(), // For event-based conditions
  value: z.union([z.string(), z.number()]).optional(), // Threshold or match value
  tag: z.string().optional(), // For tag-based conditions
  months: z.array(z.number().int().min(1).max(12)).optional(), // For seasonality
});

export type RuleCondition = z.infer<typeof ruleConditionSchema>;

// Action types for recommendations
export const ruleActionTypeSchema = z.enum([
  'suggest_product',   // Recommend a product (experience, workshop, etc.)
  'add_tag',           // Add tag to customer profile
  'trigger_followup',  // Create follow-up draft
  'suppress_marketing', // Suppress marketing for duration
]);

export type RuleActionType = z.infer<typeof ruleActionTypeSchema>;

export const ruleActionSchema = z.object({
  type: ruleActionTypeSchema,
  productType: z.enum(['experience', 'workshop', 'stay', 'shop']).optional(),
  productSlug: z.string().optional(),
  tag: z.string().optional(),
  templateRef: z.string().optional(),
  suppressDays: z.number().int().positive().optional(),
});

export type RuleAction = z.infer<typeof ruleActionSchema>;

// Recommendation rule schema
export const recommendationRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  conditions: z.array(ruleConditionSchema).min(1), // AND logic
  actions: z.array(ruleActionSchema).min(1),
  priority: z.number().int().default(0), // Higher wins on conflict
  enabled: z.boolean().default(true),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string().optional(),
});

export type RecommendationRule = z.infer<typeof recommendationRuleSchema>;

// Recommendation output
export const recommendationSchema = z.object({
  id: z.string(),
  ruleId: z.string(),
  ruleName: z.string(),
  profileId: z.string(),
  actions: z.array(ruleActionSchema),
  generatedAt: z.string(),
  expiresAt: z.string().optional(),
  dismissed: z.boolean().default(false),
  dismissedAt: z.string().optional(),
  accepted: z.boolean().default(false),
  acceptedAt: z.string().optional(),
});

export type Recommendation = z.infer<typeof recommendationSchema>;

// ============================================================================
// Lifecycle Automation per A-3.2.5 (DEC-063)
// ============================================================================

// Trigger condition types
export const triggerConditionTypeSchema = z.enum([
  'event_created',     // When event of type X is created
  'booking_confirmed', // When booking is confirmed
  'registration_complete', // When workshop registration completes
  'purchase_complete', // When shop order completes
  'days_since_event',  // N days after event of type X
  'days_before_date',  // N days before a date field
]);

export type TriggerConditionType = z.infer<typeof triggerConditionTypeSchema>;

export const triggerConditionSchema = z.object({
  type: triggerConditionTypeSchema,
  eventType: z.string().optional(),
  dateField: z.string().optional(), // For date-based triggers (e.g., 'checkIn')
  daysOffset: z.number().int().optional(), // Negative for before, positive for after
});

export type TriggerCondition = z.infer<typeof triggerConditionSchema>;

// Cancel condition types
export const cancelConditionTypeSchema = z.enum([
  'event_exists',      // Cancel if event of type X exists
  'booking_cancelled', // Cancel if related booking cancelled
  'unsubscribed',      // Cancel if customer unsubscribed
  'manual',            // Manual cancellation
]);

export type CancelConditionType = z.infer<typeof cancelConditionTypeSchema>;

export const cancelConditionSchema = z.object({
  type: cancelConditionTypeSchema,
  eventType: z.string().optional(),
});

export type CancelCondition = z.infer<typeof cancelConditionSchema>;

// Automation action types
export const automationActionTypeSchema = z.enum([
  'send_email',
  'create_followup_draft',
  'add_tag',
  'create_task', // Creates Burro task
]);

export type AutomationActionType = z.infer<typeof automationActionTypeSchema>;

// Lifecycle automation schema
export const lifecycleAutomationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  trigger: triggerConditionSchema,
  delay: z.object({
    amount: z.number().int().nonnegative(),
    unit: z.enum(['hours', 'days']),
  }),
  action: automationActionTypeSchema,
  templateRef: z.string(),
  cancelIf: z.array(cancelConditionSchema).default([]),
  status: z.enum(['active', 'paused', 'disabled']).default('active'),
  requiresConsent: z.boolean().default(false), // True for marketing
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string().optional(),
});

export type LifecycleAutomation = z.infer<typeof lifecycleAutomationSchema>;

// Scheduled automation run
export const scheduledAutomationRunSchema = z.object({
  id: z.string(),
  automationId: z.string(),
  profileId: z.string(),
  triggerEventId: z.string().optional(),
  scheduledFor: z.string(), // ISO timestamp
  status: z.enum(['pending', 'executed', 'cancelled', 'failed']),
  executedAt: z.string().optional(),
  cancelledAt: z.string().optional(),
  cancelReason: z.string().optional(),
  error: z.string().optional(),
  createdAt: z.string(),
});

export type ScheduledAutomationRun = z.infer<typeof scheduledAutomationRunSchema>;

// ============================================================================
// Extended Event Types per A-3.2.6 (DEC-064)
// ============================================================================

// Extended guest event types (supersedes lib/guest-events/store.ts)
export const extendedEventTypeSchema = z.enum([
  'booking',
  'registration',
  'purchase',
  'follow-up-sent',
  'note',
  'itinerary',
  'group-booking',
  // New event types for Sprint 3.2
  'rental',
  'rental_quote',
  'donation',
  'recommendation_accepted',
  'recommendation_dismissed',
  'consent_updated',
  'profile_merged',
  'tag_added',
  'tag_removed',
]);

export type ExtendedEventType = z.infer<typeof extendedEventTypeSchema>;

// ============================================================================
// Unified Event Projection per A-3.2.2 (DEC-060)
// ============================================================================

// Unified event for history query layer
export const unifiedEventSchema = z.object({
  id: z.string(),
  profileId: z.string().optional(), // May not have profile yet
  guestEmail: z.string().email(),
  eventType: extendedEventTypeSchema,
  eventRef: z.string().optional(),
  source: z.enum([
    'guest-events',
    'analytics',
    'booking',
    'workshop',
    'shop',
    'rental',
    'crm',
    'itinerary',
  ]),
  metadata: z.record(z.unknown()).optional(),
  occurredAt: z.string(),
  tags: z.array(z.string()).optional(),
});

export type UnifiedEvent = z.infer<typeof unifiedEventSchema>;

// Query options for history
export interface HistoryQueryOptions {
  profileId?: string;
  email?: string;
  eventTypes?: ExtendedEventType[];
  fromDate?: string;
  toDate?: string;
  limit?: number;
  sources?: string[];
}
