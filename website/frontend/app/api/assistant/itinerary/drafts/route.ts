import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getExperienceProductById } from '@/lib/content/experiences';
import { getUnitById } from '@/lib/content/units';
import { getWorkshopProgramBySlug } from '@/lib/content/workshops';
import { applyPricingRules, expandDateRange, validateItineraryComponents } from '@/lib/itinerary/engine';
import { createItineraryDraft, listActiveCapacityHolds, syncCapacityHoldsForDraft } from '@/lib/itinerary/store';
import { itineraryComponentSchema } from '@/lib/itinerary/types';

const createDraftSchema = z.object({
  title: z.string().min(1),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional().or(z.literal('')),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  participantCount: z.number().int().positive().default(1),
  lodgingUnitId: z.string().min(1),
  experienceId: z.string().min(1),
  workshopRef: z.string().optional(),
  adjustmentType: z.enum(['discount', 'surcharge']).optional(),
  adjustmentAmount: z.number().nonnegative().optional(),
  adjustmentReason: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = createDraftSchema.parse(await request.json());
    const [unit, experience, activeHolds] = await Promise.all([
      getUnitById(payload.lodgingUnitId),
      getExperienceProductById(payload.experienceId),
      listActiveCapacityHolds(),
    ]);

    if (!unit || !experience) {
      return NextResponse.json({ error: 'Selected lodging or experience could not be found.' }, { status: 400 });
    }

    const dateSpan = expandDateRange(payload.startDate, payload.endDate);
    const components = [
      itineraryComponentSchema.parse({
        type: 'lodging',
        refId: unit.id,
        title: unit.name,
        dates: dateSpan,
        quantity: 1,
        priceAtDraft: 225 * Math.max(1, dateSpan.length - 1),
        holdStatus: 'pending',
      }),
      itineraryComponentSchema.parse({
        type: 'experience',
        refId: experience.id,
        title: experience.name,
        dates: [payload.startDate],
        quantity: payload.participantCount,
        priceAtDraft: experience.priceUsd * payload.participantCount,
        holdStatus: 'pending',
      }),
    ];

    if (payload.workshopRef) {
      const [workshopSlug, sessionId] = payload.workshopRef.split('::');
      const workshop = workshopSlug ? await getWorkshopProgramBySlug(workshopSlug) : null;
      const session = workshop?.schedule.find((entry) => entry.id === sessionId);
      if (workshop && session) {
        components.push(
          itineraryComponentSchema.parse({
            type: 'workshop',
            refId: payload.workshopRef,
            title: workshop.title,
            dates: [session.date],
            quantity: payload.participantCount,
            priceAtDraft: workshop.pricing.basePrice * payload.participantCount,
            holdStatus: 'pending',
          }),
        );
      }
    }

    const manualAdjustment =
      payload.adjustmentType && payload.adjustmentAmount
        ? {
            type: payload.adjustmentType,
            amount: payload.adjustmentAmount,
            reason: payload.adjustmentReason ?? 'Manual package adjustment',
          }
        : undefined;

    const validation = await validateItineraryComponents(components, activeHolds, {
      start: payload.startDate,
      end: payload.endDate,
    });

    if (validation.errors.length > 0) {
      return NextResponse.json({ error: validation.errors.join(' ') }, { status: 400 });
    }

    const pricing = await applyPricingRules(components, manualAdjustment, payload.participantCount, payload.startDate);
    const draft = await createItineraryDraft({
      title: payload.title,
      source: 'manual',
      dateRange: {
        start: payload.startDate,
        end: payload.endDate,
      },
      components,
      totalPrice: pricing.totalPrice,
      packageAdjustment: manualAdjustment,
      pricingRuleIds: pricing.pricingRuleIds,
      status: 'pending_review',
      guestName: payload.guestName,
      guestEmail: payload.guestEmail || undefined,
      notes: payload.notes,
      fallbackSuggestions: validation.fallbackSuggestions,
      validationNotes: validation.notes,
    });

    await syncCapacityHoldsForDraft(draft);
    return NextResponse.json({ draft }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create itinerary draft.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
