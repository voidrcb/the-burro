import { NextResponse } from 'next/server';

import { logAssistantAction } from '../../../../../../assistant/services/logging';
import { planArtisanQuery } from '../../../../../../assistant/services/artisan-assistant';
import { getFeasibilitySnapshot } from '../../../../../../assistant/services/feasibility';
import { planPropertyQuery } from '../../../../../../assistant/services/property-planner';
import type { AssistantMode } from '../../../../../../assistant/services/types';

export async function POST(request: Request) {
  const body = (await request.json()) as { mode?: AssistantMode; query?: string };
  const mode = body.mode;
  const query = body.query?.trim();

  if (!mode || (mode !== 'property' && mode !== 'artisan') || !query) {
    return NextResponse.json({ error: 'Mode and query are required.' }, { status: 400 });
  }

  const response = mode === 'property' ? await planPropertyQuery(query) : await planArtisanQuery(query);
  const snapshot = await getFeasibilitySnapshot();

  await logAssistantAction({
    timestamp: new Date().toISOString(),
    mode,
    query,
    status: response.status,
    citations: response.citations.map((citation) => citation.sourceId),
  });

  return NextResponse.json({
    ...response,
    snapshot,
  });
}
