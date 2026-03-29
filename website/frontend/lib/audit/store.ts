import { randomUUID } from 'crypto';
import { readFile, appendFile, mkdir } from 'fs/promises';
import path from 'path';

import { getDataPath } from '@/lib/server/repo';

import {
  adminAuditEventSchema,
  type AdminAuditEvent,
  type AuditQueryOptions,
  type AuditSummary,
  type AuditActionType,
  type AuditResourceType,
  type AuditActorType,
  type ChangeDetail,
} from './types';

// ============================================================================
// Path Helpers
// ============================================================================

function getAuditLogPath(): string {
  return getDataPath('audit', 'admin_audit.jsonl');
}

function getAuditDirectory(): string {
  return getDataPath('audit');
}

// ============================================================================
// ID Generator
// ============================================================================

function generateEventId(): string {
  return `audit_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

// ============================================================================
// Audit Event Creation
// ============================================================================

export interface CreateAuditEventInput {
  actorId: string;
  actorType: AuditActorType;
  actorName?: string;
  actionType: AuditActionType;
  actionDescription?: string;
  resourceType: AuditResourceType;
  resourceId: string;
  resourceName?: string;
  changeDetails?: ChangeDetail[];
  reason?: string | null;
  metadata?: Record<string, unknown>;
  relatedEvents?: string[];
}

export async function createAuditEvent(
  input: CreateAuditEventInput
): Promise<AdminAuditEvent> {
  const event = adminAuditEventSchema.parse({
    eventId: generateEventId(),
    occurredAt: new Date().toISOString(),
    actorId: input.actorId,
    actorType: input.actorType,
    actorName: input.actorName,
    actionType: input.actionType,
    actionDescription: input.actionDescription,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    resourceName: input.resourceName,
    changeDetails: input.changeDetails ?? [],
    reason: input.reason ?? null,
    metadata: input.metadata,
    relatedEvents: input.relatedEvents ?? [],
  });

  await appendAuditEvent(event);
  return event;
}

// ============================================================================
// JSONL Operations (Append-Only)
// ============================================================================

async function appendAuditEvent(event: AdminAuditEvent): Promise<void> {
  const directory = getAuditDirectory();
  await mkdir(directory, { recursive: true });

  const logPath = getAuditLogPath();
  const line = JSON.stringify(event) + '\n';
  await appendFile(logPath, line, 'utf-8');
}

async function readAuditLog(): Promise<AdminAuditEvent[]> {
  const logPath = getAuditLogPath();

  try {
    const content = await readFile(logPath, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);
    const events: AdminAuditEvent[] = [];

    for (const line of lines) {
      try {
        const parsed = adminAuditEventSchema.safeParse(JSON.parse(line));
        if (parsed.success) {
          events.push(parsed.data);
        }
      } catch {
        // Skip malformed lines
      }
    }

    return events;
  } catch {
    return [];
  }
}

// ============================================================================
// Query Functions
// ============================================================================

export async function queryAuditEvents(
  options?: AuditQueryOptions
): Promise<AdminAuditEvent[]> {
  const allEvents = await readAuditLog();

  let filtered = allEvents;

  if (options?.actorId) {
    filtered = filtered.filter((e) => e.actorId === options.actorId);
  }

  if (options?.actorType) {
    filtered = filtered.filter((e) => e.actorType === options.actorType);
  }

  if (options?.actionType) {
    const types = Array.isArray(options.actionType)
      ? options.actionType
      : [options.actionType];
    filtered = filtered.filter((e) => types.includes(e.actionType));
  }

  if (options?.resourceType) {
    filtered = filtered.filter((e) => e.resourceType === options.resourceType);
  }

  if (options?.resourceId) {
    filtered = filtered.filter((e) => e.resourceId === options.resourceId);
  }

  if (options?.fromDate) {
    filtered = filtered.filter((e) => e.occurredAt >= options.fromDate!);
  }

  if (options?.toDate) {
    filtered = filtered.filter((e) => e.occurredAt <= options.toDate!);
  }

  // Sort by most recent first
  filtered.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));

  if (options?.limit && options.limit > 0) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

export async function getAuditEvent(eventId: string): Promise<AdminAuditEvent | null> {
  const events = await readAuditLog();
  return events.find((e) => e.eventId === eventId) ?? null;
}

export async function getResourceAuditHistory(
  resourceType: AuditResourceType,
  resourceId: string,
  options?: { limit?: number }
): Promise<AdminAuditEvent[]> {
  return queryAuditEvents({
    resourceType,
    resourceId,
    limit: options?.limit,
  });
}

// ============================================================================
// Summary Functions
// ============================================================================

export async function getAuditSummary(
  options?: { fromDate?: string; toDate?: string }
): Promise<AuditSummary> {
  const events = await queryAuditEvents({
    fromDate: options?.fromDate,
    toDate: options?.toDate,
  });

  const eventsByAction: Record<string, number> = {};
  const eventsByActor: Record<string, number> = {};

  for (const event of events) {
    eventsByAction[event.actionType] = (eventsByAction[event.actionType] ?? 0) + 1;
    eventsByActor[event.actorId] = (eventsByActor[event.actorId] ?? 0) + 1;
  }

  // High-impact actions for recent list
  const highImpactTypes: AuditActionType[] = [
    'partner_suspension',
    'partner_offboarding',
    'event_cancel',
    'incident_declare',
    'booking_cancel_admin',
    'profile_delete',
    'content_delete',
  ];

  const recentHighImpact = events
    .filter((e) => highImpactTypes.includes(e.actionType))
    .slice(0, 10);

  return {
    totalEvents: events.length,
    eventsByAction,
    eventsByActor,
    recentHighImpact,
    dateRange: {
      earliest: events.length > 0 ? events[events.length - 1].occurredAt : null,
      latest: events.length > 0 ? events[0].occurredAt : null,
    },
  };
}

// ============================================================================
// Convenience Functions for Common Audit Events
// ============================================================================

export async function auditPartnerStatusChange(
  partnerId: string,
  partnerName: string,
  actorId: string,
  beforeStatus: string,
  afterStatus: string,
  reason?: string
): Promise<AdminAuditEvent> {
  return createAuditEvent({
    actorId,
    actorType: 'operator',
    actionType: 'partner_status_change',
    actionDescription: `Changed partner ${partnerName} status from ${beforeStatus} to ${afterStatus}`,
    resourceType: 'partner',
    resourceId: partnerId,
    resourceName: partnerName,
    changeDetails: [{ field: 'approvalStatus', before: beforeStatus, after: afterStatus }],
    reason,
  });
}

export async function auditContentPublish(
  resourceType: AuditResourceType,
  resourceId: string,
  resourceName: string,
  actorId: string
): Promise<AdminAuditEvent> {
  return createAuditEvent({
    actorId,
    actorType: 'operator',
    actionType: 'content_publish',
    actionDescription: `Published ${resourceType} "${resourceName}"`,
    resourceType,
    resourceId,
    resourceName,
  });
}

export async function auditBookingOverride(
  bookingId: string,
  actorId: string,
  changes: ChangeDetail[],
  reason: string
): Promise<AdminAuditEvent> {
  return createAuditEvent({
    actorId,
    actorType: 'operator',
    actionType: 'booking_override',
    actionDescription: `Override on booking ${bookingId}`,
    resourceType: 'booking',
    resourceId: bookingId,
    changeDetails: changes,
    reason,
  });
}

export async function auditIncidentDeclare(
  runbookId: string,
  incidentId: string,
  actorId: string,
  severity: string,
  description: string
): Promise<AdminAuditEvent> {
  return createAuditEvent({
    actorId,
    actorType: 'operator',
    actionType: 'incident_declare',
    actionDescription: `Declared ${severity} incident: ${description}`,
    resourceType: 'runbook',
    resourceId: runbookId,
    metadata: { incidentId, severity },
  });
}

export async function auditRunbookExecute(
  runbookId: string,
  runbookName: string,
  actorId: string,
  context?: Record<string, unknown>
): Promise<AdminAuditEvent> {
  return createAuditEvent({
    actorId,
    actorType: 'operator',
    actionType: 'runbook_execute',
    actionDescription: `Executed runbook "${runbookName}"`,
    resourceType: 'runbook',
    resourceId: runbookId,
    resourceName: runbookName,
    metadata: context,
  });
}

export async function auditProfileMerge(
  targetProfileId: string,
  sourceProfileId: string,
  actorId: string,
  reason?: string
): Promise<AdminAuditEvent> {
  return createAuditEvent({
    actorId,
    actorType: 'operator',
    actionType: 'profile_merge',
    actionDescription: `Merged profile ${sourceProfileId} into ${targetProfileId}`,
    resourceType: 'profile',
    resourceId: targetProfileId,
    changeDetails: [{ field: 'mergedFrom', before: null, after: sourceProfileId }],
    reason,
  });
}
