import { z } from 'zod';

/**
 * Incident Runbook Types per A-3.3.3 (DEC-067)
 *
 * Runbook artifact structure with detection, response, rollback,
 * and drill tracking. Stored at docs/runbooks/.
 */

// ============================================================================
// System Areas
// ============================================================================

export const systemAreaSchema = z.enum([
  'booking',
  'payment',
  'stream',
  'content',
  'partner',
  'rental',
  'event',
  'crm',
  'email',
  'integration', // External service integrations
]);

export type SystemArea = z.infer<typeof systemAreaSchema>;

// ============================================================================
// Severity Levels
// ============================================================================

export const incidentSeveritySchema = z.enum([
  'critical', // Complete service outage or data loss
  'high',     // Major feature unavailable
  'medium',   // Degraded functionality
  'low',      // Minor issue with workaround
]);

export type IncidentSeverity = z.infer<typeof incidentSeveritySchema>;

// ============================================================================
// Runbook Step
// ============================================================================

export const runbookStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  action: z.string(),
  command: z.string().optional(), // CLI command if applicable
  expectedOutcome: z.string(),
  timeEstimateMins: z.number().int().positive().optional(),
  requiresApproval: z.boolean().default(false),
  approvalRole: z.string().optional(), // Who can approve this step
  notes: z.string().optional(),
});

export type RunbookStep = z.infer<typeof runbookStepSchema>;

// ============================================================================
// Drill Record
// ============================================================================

export const drillRecordSchema = z.object({
  drillId: z.string(),
  conductedAt: z.string(), // ISO timestamp
  conductedBy: z.string(),
  scenario: z.string(),
  durationMins: z.number().int().positive(),
  outcome: z.enum(['success', 'partial', 'failed']),
  findings: z.array(z.string()).default([]),
  remediationStatus: z.enum(['none_needed', 'pending', 'completed']).default('none_needed'),
  remediationNotes: z.string().optional(),
});

export type DrillRecord = z.infer<typeof drillRecordSchema>;

// ============================================================================
// Incident Record (Active or Historical)
// ============================================================================

export const incidentRecordSchema = z.object({
  incidentId: z.string(),
  runbookId: z.string(),
  declaredAt: z.string(),
  declaredBy: z.string(),
  severity: incidentSeveritySchema,
  description: z.string(),
  status: z.enum(['active', 'mitigated', 'resolved', 'post_mortem']).default('active'),
  mitigatedAt: z.string().optional(),
  resolvedAt: z.string().optional(),
  rootCause: z.string().optional(),
  affectedUsers: z.number().int().nonnegative().optional(),
  stepsExecuted: z.array(z.number().int()).default([]), // Step numbers completed
  timeline: z.array(z.object({
    timestamp: z.string(),
    event: z.string(),
    actor: z.string().optional(),
  })).default([]),
  postMortemUrl: z.string().optional(),
});

export type IncidentRecord = z.infer<typeof incidentRecordSchema>;

// ============================================================================
// Main Incident Runbook Schema per A-3.3.3
// ============================================================================

export const incidentRunbookSchema = z.object({
  // Identity
  id: z.string(),
  slug: z.string(), // e.g., 'payment-webhook-failure'
  name: z.string(),
  description: z.string(),

  // Classification
  systemArea: systemAreaSchema,
  incidentType: z.string(), // e.g., 'payment_webhook_failure', 'stream_outage'
  severity: incidentSeveritySchema,

  // Detection
  detectionMethod: z.string(), // How to identify this incident
  alertSource: z.string().optional(), // e.g., 'monitoring', 'customer_report', 'webhook_failure'
  symptoms: z.array(z.string()).default([]), // Observable symptoms

  // Response
  responseSteps: z.array(runbookStepSchema),
  estimatedResolutionMins: z.number().int().positive().optional(),
  requiredAccess: z.array(z.string()).default([]), // e.g., ['stripe_dashboard', 'vercel_logs']

  // Rollback
  rollbackProcedure: z.string(),
  rollbackSteps: z.array(runbookStepSchema).optional(),
  canAutoRollback: z.boolean().default(false),

  // Responsibility
  responsibleRole: z.string(), // e.g., 'operator', 'developer'
  escalationPath: z.array(z.string()).default([]), // Escalation contacts

  // Communication
  statusPageTemplate: z.string().optional(), // Template for public status
  customerNotificationTemplate: z.string().optional(),

  // Drill tracking per HF-3308
  drillSchedule: z.enum(['monthly', 'quarterly', 'annually']).optional(),
  drills: z.array(drillRecordSchema).default([]),
  lastDrillDate: z.string().nullable().default(null),

  // Incident history
  incidents: z.array(incidentRecordSchema).default([]),
  lastIncidentDate: z.string().nullable().default(null),

  // Metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  version: z.number().int().positive().default(1),
});

export type IncidentRunbook = z.infer<typeof incidentRunbookSchema>;

// ============================================================================
// Runbook Index (Summary for Dashboard)
// ============================================================================

export interface RunbookSummary {
  id: string;
  slug: string;
  name: string;
  systemArea: SystemArea;
  severity: IncidentSeverity;
  lastDrillDate: string | null;
  lastIncidentDate: string | null;
  drillOverdue: boolean;
  incidentCount: number;
}

// ============================================================================
// Query Options
// ============================================================================

export interface RunbookQueryOptions {
  systemArea?: SystemArea;
  severity?: IncidentSeverity;
  drillOverdue?: boolean;
  limit?: number;
}
