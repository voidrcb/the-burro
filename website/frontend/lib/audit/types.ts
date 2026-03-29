import { z } from 'zod';

/**
 * Admin Audit Log Types per A-3.3.4 (DEC-068)
 *
 * Audit event schema with actor, action, resource, change details,
 * and reason tracking. JSONL storage at data/audit/.
 */

// ============================================================================
// Actor Types
// ============================================================================

export const auditActorTypeSchema = z.enum([
  'operator',    // Human operator via assistant dashboard
  'system',      // Automated system process
  'automation',  // Lifecycle automation or scheduled task
]);

export type AuditActorType = z.infer<typeof auditActorTypeSchema>;

// ============================================================================
// Action Types (High-Impact Operations)
// ============================================================================

export const auditActionTypeSchema = z.enum([
  // Partner actions
  'partner_status_change',
  'partner_tier_change',
  'partner_suspension',
  'partner_offboarding',

  // Content actions
  'content_publish',
  'content_unpublish',
  'content_delete',

  // Booking actions
  'booking_override',
  'booking_cancel_admin',
  'booking_refund',

  // Event actions
  'event_cancel',
  'event_reschedule',
  'event_capacity_change',

  // Configuration actions
  'config_change',
  'commission_rule_change',
  'automation_change',

  // Operational actions
  'runbook_execute',
  'checklist_complete',
  'incident_declare',
  'incident_resolve',

  // CRM actions
  'profile_merge',
  'profile_delete',
  'consent_override',
]);

export type AuditActionType = z.infer<typeof auditActionTypeSchema>;

// ============================================================================
// Resource Types
// ============================================================================

export const auditResourceTypeSchema = z.enum([
  'partner',
  'experience',
  'workshop',
  'event',
  'booking',
  'registration',
  'rental',
  'profile',
  'automation',
  'commission_rule',
  'config',
  'runbook',
  'checklist',
  'stream',
  'content',
]);

export type AuditResourceType = z.infer<typeof auditResourceTypeSchema>;

// ============================================================================
// Change Details
// ============================================================================

export const changeDetailSchema = z.object({
  field: z.string(),
  before: z.unknown(),
  after: z.unknown(),
});

export type ChangeDetail = z.infer<typeof changeDetailSchema>;

// ============================================================================
// Main Admin Audit Event Schema per A-3.3.4
// ============================================================================

export const adminAuditEventSchema = z.object({
  // Identity
  eventId: z.string(),
  occurredAt: z.string(), // ISO timestamp

  // Actor
  actorId: z.string(), // User ID, 'system', or automation ID
  actorType: auditActorTypeSchema,
  actorName: z.string().optional(), // Display name for readability

  // Action
  actionType: auditActionTypeSchema,
  actionDescription: z.string().optional(), // Human-readable description

  // Resource
  resourceType: auditResourceTypeSchema,
  resourceId: z.string(),
  resourceName: z.string().optional(), // Display name for readability

  // Change details
  changeDetails: z.array(changeDetailSchema).default([]),

  // Context
  reason: z.string().nullable().default(null),
  metadata: z.record(z.unknown()).optional(),

  // Related entities
  relatedEvents: z.array(z.string()).default([]), // Related audit event IDs
});

export type AdminAuditEvent = z.infer<typeof adminAuditEventSchema>;

// ============================================================================
// Query Options
// ============================================================================

export interface AuditQueryOptions {
  actorId?: string;
  actorType?: AuditActorType;
  actionType?: AuditActionType | AuditActionType[];
  resourceType?: AuditResourceType;
  resourceId?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}

// ============================================================================
// Audit Summary Types
// ============================================================================

export interface AuditSummary {
  totalEvents: number;
  eventsByAction: Record<string, number>;
  eventsByActor: Record<string, number>;
  recentHighImpact: AdminAuditEvent[];
  dateRange: {
    earliest: string | null;
    latest: string | null;
  };
}
