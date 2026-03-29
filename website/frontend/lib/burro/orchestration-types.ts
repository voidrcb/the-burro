import { z } from 'zod';

/**
 * Burro Task Orchestration Schema per A-2.4.3 (DEC-048)
 *
 * Task orchestration with 5-state machine, approval gates, and audit trail.
 * Operator-only in Sprint 2.4 per A-2.4.7 (DEC-052).
 */

// Task types per HF-2403
export const burroTaskTypeSchema = z.enum([
  'package_draft',
  'partner_coordination',
  'content_review',
  'followup_sequence',
]);

export type BurroTaskType = z.infer<typeof burroTaskTypeSchema>;

// Task state machine: 5 states per A-2.4.3
export const burroTaskStateSchema = z.enum([
  'created',
  'pending_approval',
  'approved',
  'executing',
  'completed',
  'failed',
]);

export type BurroTaskState = z.infer<typeof burroTaskStateSchema>;

// Approval gate record
export const approvalGateSchema = z.object({
  gateId: z.string(),
  gateName: z.string(),
  requiredApproverRole: z.enum(['operator', 'reviewer', 'admin']),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
  rejectedBy: z.string().optional(),
  rejectedAt: z.string().optional(),
  rejectionReason: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

export type ApprovalGate = z.infer<typeof approvalGateSchema>;

// Task state transition record
export const taskStateTransitionSchema = z.object({
  fromState: burroTaskStateSchema.nullable(),
  toState: burroTaskStateSchema,
  transitionedAt: z.string(),
  transitionedBy: z.string(),
  notes: z.string().optional(),
});

export type TaskStateTransition = z.infer<typeof taskStateTransitionSchema>;

// Task context - what the task operates on
export const taskContextSchema = z.object({
  contextType: z.enum(['itinerary', 'partner', 'experience', 'guest', 'content']),
  contextId: z.string(),
  contextLabel: z.string().optional(),
  relatedRefs: z.array(z.object({
    type: z.string(),
    id: z.string(),
  })).optional(),
});

export type TaskContext = z.infer<typeof taskContextSchema>;

// Task output - what the task produces
export const taskOutputSchema = z.object({
  outputType: z.enum(['draft_message', 'draft_itinerary', 'partner_request', 'content_update', 'followup_created']),
  outputRef: z.string(),
  outputLabel: z.string().optional(),
  outputData: z.record(z.unknown()).optional(),
});

export type TaskOutput = z.infer<typeof taskOutputSchema>;

// Main BurroTaskRun schema per A-2.4.3
export const burroTaskRunSchema = z.object({
  // Identity
  id: z.string(),
  taskType: burroTaskTypeSchema,
  title: z.string(),
  description: z.string().optional(),

  // Context
  context: taskContextSchema,

  // State machine
  state: burroTaskStateSchema,
  stateHistory: z.array(taskStateTransitionSchema),

  // Approval gates
  approvalGates: z.array(approvalGateSchema),

  // Outputs (populated on completion)
  outputs: z.array(taskOutputSchema),

  // Execution details
  executionStartedAt: z.string().optional(),
  executionCompletedAt: z.string().optional(),
  executionError: z.string().optional(),

  // Operator-only per A-2.4.7
  operatorOnly: z.boolean().default(true),
  initiatedBy: z.string(),

  // Analytics event link per HF-2408
  analyticsEventId: z.string().optional(),

  // Audit
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BurroTaskRun = z.infer<typeof burroTaskRunSchema>;

// Task run summary for dashboard
export const taskRunSummarySchema = z.object({
  id: z.string(),
  taskType: burroTaskTypeSchema,
  title: z.string(),
  state: burroTaskStateSchema,
  pendingApprovals: z.number().int().nonnegative(),
  contextLabel: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TaskRunSummary = z.infer<typeof taskRunSummarySchema>;

// Task templates for common orchestration patterns
export const taskTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  taskType: burroTaskTypeSchema,
  description: z.string(),
  defaultGates: z.array(z.object({
    gateName: z.string(),
    requiredApproverRole: z.enum(['operator', 'reviewer', 'admin']),
  })),
  contextTypeRequired: taskContextSchema.shape.contextType,
});

export type TaskTemplate = z.infer<typeof taskTemplateSchema>;

// Predefined task templates per Sprint 2.4 scope
export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'tmpl_package_draft',
    name: 'Package Draft Assembly',
    taskType: 'package_draft',
    description: 'Assemble a multi-experience package draft for guest review',
    defaultGates: [
      { gateName: 'Package Review', requiredApproverRole: 'operator' },
    ],
    contextTypeRequired: 'itinerary',
  },
  {
    id: 'tmpl_partner_coordination',
    name: 'Partner Coordination Request',
    taskType: 'partner_coordination',
    description: 'Coordinate availability or details with a partner',
    defaultGates: [
      { gateName: 'Partner Outreach Approval', requiredApproverRole: 'operator' },
      { gateName: 'Partner Response Verified', requiredApproverRole: 'operator' },
    ],
    contextTypeRequired: 'partner',
  },
  {
    id: 'tmpl_content_review',
    name: 'Content Review Request',
    taskType: 'content_review',
    description: 'Review and approve partner-submitted content',
    defaultGates: [
      { gateName: 'Content Quality Check', requiredApproverRole: 'reviewer' },
    ],
    contextTypeRequired: 'content',
  },
  {
    id: 'tmpl_followup_sequence',
    name: 'Follow-up Sequence',
    taskType: 'followup_sequence',
    description: 'Orchestrate a series of follow-up communications',
    defaultGates: [
      { gateName: 'Sequence Approval', requiredApproverRole: 'operator' },
    ],
    contextTypeRequired: 'guest',
  },
];
