import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createStreamConfig,
  getActiveStream,
  getStreamConfig,
  listStreamConfigs,
  logViewerInteraction,
  saveStreamConfig,
} from '@/lib/livestream/store';
import { streamTypeSchema } from '@/lib/livestream/types';

const postSchema = z.object({
  name: z.string().min(1),
  type: streamTypeSchema,
  description: z.string(),
  embedUrl: z.string().url().optional(),
  hlsUrl: z.string().url().optional(),
  staticFallbackUrl: z.string().url(),
  timelapseFallbackUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  scheduledOfflineStart: z.string().optional(),
  scheduledOfflineEnd: z.string().optional(),
  scheduledOfflineMessage: z.string().optional(),
  isActive: z.boolean().default(false),
});

const patchSchema = z.object({
  streamId: z.string(),
  updates: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    embedUrl: z.string().url().optional(),
    hlsUrl: z.string().url().optional(),
    staticFallbackUrl: z.string().url().optional(),
    timelapseFallbackUrl: z.string().url().optional(),
    thumbnailUrl: z.string().url().optional(),
    scheduledOfflineStart: z.string().optional(),
    scheduledOfflineEnd: z.string().optional(),
    scheduledOfflineMessage: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

const interactionSchema = z.object({
  streamId: z.string(),
  interactionType: z.enum(['viewed', 'newsletter_signup', 'share']),
  sessionId: z.string().optional(),
  guestEmailHash: z.string().optional(),
});

// POST /api/livestream/state - Create new stream config per A-2.3.5
export async function POST(request: Request) {
  try {
    const body = postSchema.parse(await request.json());

    // A-2.3.5: Single stream type for Sprint 2.3
    // If setting as active, deactivate others
    if (body.isActive) {
      const existing = await listStreamConfigs();
      for (const config of existing) {
        if (config.isActive) {
          config.isActive = false;
          config.updatedAt = new Date().toISOString();
          await saveStreamConfig(config);
        }
      }
    }

    const config = await createStreamConfig(body);

    return NextResponse.json({ config });
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

// PATCH /api/livestream/state - Update stream config
export async function PATCH(request: Request) {
  try {
    const body = patchSchema.parse(await request.json());

    const config = await getStreamConfig(body.streamId);
    if (!config) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      );
    }

    // If activating, deactivate others per A-2.3.5
    if (body.updates.isActive && !config.isActive) {
      const existing = await listStreamConfigs();
      for (const other of existing) {
        if (other.id !== config.id && other.isActive) {
          other.isActive = false;
          other.updatedAt = new Date().toISOString();
          await saveStreamConfig(other);
        }
      }
    }

    const updatedConfig = {
      ...config,
      ...body.updates,
      updatedAt: new Date().toISOString(),
    };

    await saveStreamConfig(updatedConfig);

    return NextResponse.json({ config: updatedConfig });
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

// GET /api/livestream/state - Get active stream or list all
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const streamId = url.searchParams.get('streamId');
    const listAll = url.searchParams.get('all') === 'true';

    if (streamId) {
      const config = await getStreamConfig(streamId);
      if (!config) {
        return NextResponse.json(
          { error: 'Stream not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ config });
    }

    if (listAll) {
      const configs = await listStreamConfigs();
      return NextResponse.json({ configs, count: configs.length });
    }

    // Return active stream for public display
    const activeStream = await getActiveStream();
    if (!activeStream) {
      return NextResponse.json({
        config: null,
        health: null,
        message: 'No active stream configured',
      });
    }

    return NextResponse.json(activeStream);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/livestream/state - Log viewer interaction (A-2.3.6 compliant)
export async function PUT(request: Request) {
  try {
    const body = interactionSchema.parse(await request.json());

    await logViewerInteraction({
      streamId: body.streamId,
      interactionType: body.interactionType,
      sessionId: body.sessionId,
      guestEmailHash: body.guestEmailHash,
      occurredAt: new Date().toISOString(),
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
