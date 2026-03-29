import { NextRequest, NextResponse } from 'next/server';

import {
  createAuditEvent,
  queryAuditEvents,
  getAuditEvent,
  getResourceAuditHistory,
  getAuditSummary,
} from '@/lib/audit/store';
import type { AuditQueryOptions, AuditResourceType } from '@/lib/audit/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const summary = searchParams.get('summary') === 'true';
    const resourceType = searchParams.get('resourceType');
    const resourceId = searchParams.get('resourceId');
    const actorId = searchParams.get('actorId');
    const actorType = searchParams.get('actorType');
    const actionType = searchParams.get('actionType');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const limit = searchParams.get('limit');

    // Get single event
    if (eventId) {
      const event = await getAuditEvent(eventId);
      return NextResponse.json({ event });
    }

    // Get summary
    if (summary) {
      const auditSummary = await getAuditSummary({ fromDate: fromDate ?? undefined, toDate: toDate ?? undefined });
      return NextResponse.json({ summary: auditSummary });
    }

    // Get resource history
    if (resourceType && resourceId) {
      const events = await getResourceAuditHistory(
        resourceType as AuditResourceType,
        resourceId,
        { limit: limit ? parseInt(limit, 10) : undefined }
      );
      return NextResponse.json({ events });
    }

    // Query events
    const options: AuditQueryOptions = {};

    if (actorId) options.actorId = actorId;
    if (actorType) options.actorType = actorType as AuditQueryOptions['actorType'];
    if (actionType) {
      options.actionType = actionType.split(',') as AuditQueryOptions['actionType'];
    }
    if (resourceType) options.resourceType = resourceType as AuditQueryOptions['resourceType'];
    if (fromDate) options.fromDate = fromDate;
    if (toDate) options.toDate = toDate;
    if (limit) options.limit = parseInt(limit, 10);

    const events = await queryAuditEvents(options);
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error querying audit events:', error);
    return NextResponse.json(
      { error: 'Failed to query audit events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = await createAuditEvent({
      actorId: body.actorId,
      actorType: body.actorType,
      actorName: body.actorName,
      actionType: body.actionType,
      actionDescription: body.actionDescription,
      resourceType: body.resourceType,
      resourceId: body.resourceId,
      resourceName: body.resourceName,
      changeDetails: body.changeDetails,
      reason: body.reason,
      metadata: body.metadata,
      relatedEvents: body.relatedEvents,
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error creating audit event:', error);
    const message = error instanceof Error ? error.message : 'Failed to create audit event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
