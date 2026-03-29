import { NextResponse } from 'next/server';
import { z } from 'zod';

import { logAnalyticsEvent } from '@/lib/analytics/events';

const trackSchema = z.object({
  path: z.string(),
  referrer: z.string().optional(),
});

export async function POST(request: Request) {
  const body = trackSchema.parse(await request.json());
  await logAnalyticsEvent({
    event: 'page_view',
    path: body.path,
    occurredAt: new Date().toISOString(),
    metadata: {
      referrer: body.referrer ?? 'direct',
    },
  });

  return NextResponse.json({ ok: true });
}
