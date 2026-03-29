import { NextResponse } from 'next/server';
import { z } from 'zod';

import { generateBurroDraft } from '@/lib/burro/itinerary';
import { validateItineraryComponents } from '@/lib/itinerary/engine';
import { createItineraryDraft, listActiveCapacityHolds, syncCapacityHoldsForDraft } from '@/lib/itinerary/store';

const generateSchema = z.object({
  prompt: z.string().min(1),
  title: z.string().optional(),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional().or(z.literal('')),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  participantCount: z.number().int().positive().default(2),
});

export async function POST(request: Request) {
  try {
    const payload = generateSchema.parse(await request.json());
    const [draftSeed, activeHolds] = await Promise.all([
      generateBurroDraft({
        ...payload,
        guestEmail: payload.guestEmail || undefined,
      }),
      listActiveCapacityHolds(),
    ]);

    const validation = await validateItineraryComponents(draftSeed.components, activeHolds, draftSeed.dateRange);
    if (validation.errors.length > 0) {
      return NextResponse.json({ error: validation.errors.join(' ') }, { status: 400 });
    }

    const draft = await createItineraryDraft({
      ...draftSeed,
      fallbackSuggestions: [...draftSeed.fallbackSuggestions, ...validation.fallbackSuggestions],
      validationNotes: [...draftSeed.validationNotes, ...validation.notes],
    });

    await syncCapacityHoldsForDraft(draft);
    return NextResponse.json({ draft }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate Burro draft.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
