import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  getActiveStream,
  getStreamHealth,
  listStreamHealthEvents,
  transitionStreamState,
} from '@/lib/livestream/store';
import { streamStateSchema } from '@/lib/livestream/types';

const postSchema = z.object({
  streamId: z.string(),
  newState: streamStateSchema,
  failureReason: z.string().optional(),
  bandwidthMbps: z.number().optional(),
});

const getSchema = z.object({
  streamId: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  eventsOnly: z.enum(['true', 'false']).optional(),
});

// POST /api/livestream/health - Transition stream state per A-2.3.3/A-2.3.4
export async function POST(request: Request) {
  try {
    const body = postSchema.parse(await request.json());

    const result = await transitionStreamState(body.streamId, body.newState, {
      failureReason: body.failureReason,
      bandwidthMbps: body.bandwidthMbps,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    const health = await getStreamHealth(body.streamId);
    return NextResponse.json({ ok: true, health });
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

// GET /api/livestream/health - Get current health or health events
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = getSchema.parse({
      streamId: url.searchParams.get('streamId') ?? undefined,
      fromDate: url.searchParams.get('fromDate') ?? undefined,
      toDate: url.searchParams.get('toDate') ?? undefined,
      eventsOnly: (url.searchParams.get('eventsOnly') as 'true' | 'false' | null) ?? undefined,
    });

    // If eventsOnly, return health event log per A-2.3.4
    if (params.eventsOnly === 'true') {
      const events = await listStreamHealthEvents({
        streamId: params.streamId,
        fromDate: params.fromDate,
        toDate: params.toDate,
      });
      return NextResponse.json({ events, count: events.length });
    }

    // If streamId provided, return specific stream health
    if (params.streamId) {
      const health = await getStreamHealth(params.streamId);
      if (!health) {
        return NextResponse.json(
          { error: 'Stream not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ health });
    }

    // Otherwise, return active stream health
    const activeStream = await getActiveStream();
    if (!activeStream) {
      return NextResponse.json({
        health: null,
        message: 'No active stream configured',
      });
    }

    return NextResponse.json({
      config: activeStream.config,
      health: activeStream.health,
    });
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
