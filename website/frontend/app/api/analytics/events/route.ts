import { NextResponse } from 'next/server';
import { z } from 'zod';

import { listAnalyticsEvents, logAnalyticsEvent } from '@/lib/analytics/store';
import { analyticsEventTypeSchema } from '@/lib/analytics/types';

const postSchema = z.object({
  eventType: analyticsEventTypeSchema,
  path: z.string(),
  guestEmail: z.string().email().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const getSchema = z.object({
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  eventType: analyticsEventTypeSchema.optional(),
});

// POST /api/analytics/events - Log an analytics event (server-side per HF-907)
export async function POST(request: Request) {
  try {
    const body = postSchema.parse(await request.json());

    await logAnalyticsEvent(body.eventType, body.path, {
      guestEmail: body.guestEmail,
      sessionId: body.sessionId,
      metadata: body.metadata,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/analytics/events - List analytics events (internal/operator use)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = getSchema.parse({
      fromDate: url.searchParams.get('fromDate') ?? undefined,
      toDate: url.searchParams.get('toDate') ?? undefined,
      eventType: url.searchParams.get('eventType') ?? undefined,
    });

    const events = await listAnalyticsEvents(params);

    return NextResponse.json({ events, count: events.length });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
