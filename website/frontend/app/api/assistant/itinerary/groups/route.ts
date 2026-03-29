import { NextResponse } from 'next/server';
import { z } from 'zod';

import { expandDateRange } from '@/lib/itinerary/engine';
import { createGroupBooking, getItineraryDraftById } from '@/lib/itinerary/store';

const groupBookingSchema = z.object({
  itineraryRef: z.string().min(1),
  groupName: z.string().min(1),
  facilitatorName: z.string().min(1),
  facilitatorEmail: z.string().email(),
  facilitatorPhone: z.string().optional(),
  participantCount: z.number().int().positive(),
  depositRequired: z.boolean(),
  depositAmount: z.number().nonnegative().optional(),
  depositDueBy: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  unitIds: z.array(z.string()).min(1),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = groupBookingSchema.parse(await request.json());
    const itinerary = await getItineraryDraftById(payload.itineraryRef);
    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary draft not found.' }, { status: 404 });
    }

    const booking = await createGroupBooking({
      groupName: payload.groupName,
      facilitator: {
        name: payload.facilitatorName,
        email: payload.facilitatorEmail,
        phone: payload.facilitatorPhone,
      },
      participantCount: payload.participantCount,
      itineraryRef: payload.itineraryRef,
      depositRules: {
        required: payload.depositRequired,
        amount: payload.depositAmount,
        dueBy: payload.depositDueBy || undefined,
      },
      unitHolds: payload.unitIds.map((unitId) => ({
        unitId,
        dates: expandDateRange(itinerary.dateRange.start, itinerary.dateRange.end),
        status: itinerary.status === 'approved' ? 'confirmed' : 'held',
      })),
      notes: payload.notes ?? '',
      status: itinerary.status === 'approved' ? 'confirmed' : 'pending',
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create group booking.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
