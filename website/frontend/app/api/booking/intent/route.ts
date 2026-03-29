import { NextResponse } from 'next/server';
import { z } from 'zod';

import { buildLodgifyRedirectUrl } from '@/lib/booking/lodgify-redirect';
import { createRedirectIntent, readWaiverById, saveBookingRecord } from '@/lib/booking/store';
import { getPublicUnitBySlug } from '@/lib/content/units';

const bookingIntentSchema = z.object({
  unitSlug: z.string(),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  partySize: z.object({
    adults: z.number().int().min(1),
    children: z.number().int().nonnegative(),
  }),
  specialRequests: z.string().optional(),
  waiverId: z.string().min(1),
  totalAmount: z.number().nonnegative().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = bookingIntentSchema.parse(await request.json());
    const unit = await getPublicUnitBySlug(payload.unitSlug);

    if (!unit || unit.status !== 'available') {
      return NextResponse.json({ error: 'Stay unit is not available for booking handoff.' }, { status: 404 });
    }

    const waiver = await readWaiverById(payload.waiverId);
    if (!waiver) {
      return NextResponse.json({ error: 'Waiver acknowledgement record not found.' }, { status: 404 });
    }

    const provisionalUrl = buildLodgifyRedirectUrl({
      unit,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      guestEmail: payload.guestEmail,
      guestName: payload.guestName,
    });

    const booking = await createRedirectIntent({
      unitId: unit.id,
      guestName: payload.guestName,
      guestEmail: payload.guestEmail,
      guestPhone: payload.guestPhone,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      partySize: payload.partySize,
      specialRequests: payload.specialRequests,
      waiverId: payload.waiverId,
      totalAmount: payload.totalAmount,
      redirectUrl: provisionalUrl,
    });

    const redirectUrl = buildLodgifyRedirectUrl({
      unit,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      guestEmail: payload.guestEmail,
      guestName: payload.guestName,
      bookingRecordId: booking.id,
    });

    await saveBookingRecord({ ...booking, redirectUrl });

    return NextResponse.json({ bookingId: booking.id, redirectUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create booking intent.' }, { status: 400 });
  }
}
