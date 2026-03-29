import { NextResponse } from 'next/server';
import { z } from 'zod';

import { reviewItineraryDraft } from '@/lib/itinerary/store';

const reviewSchema = z.object({
  draftId: z.string().min(1),
  action: z.enum(['approve', 'decline']),
  reviewNotes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = reviewSchema.parse(await request.json());
    const draft = await reviewItineraryDraft({
      ...payload,
      reviewedBy: 'JEKYLL_OPERATOR',
    });

    return NextResponse.json({ draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to review itinerary draft.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
