import { NextResponse } from 'next/server';
import { z } from 'zod';

import { logWebhookEvent } from '../../../../../../../assistant/services/logging';
import { createPendingBooking, listBookings, readWaiverById, saveBookingRecord } from '@/lib/booking/store';
import { getUnitById, listAvailableUnits } from '@/lib/content/units';
import { notifyOperatorOfBooking } from '@/lib/notifications/operator-booking';
import { sendBookingConfirmation } from '@/lib/email/booking-confirmation';

const webhookSchema = z.object({
  event: z.string(),
  booking_id: z.string(),
  status: z.string(),
  property_id: z.string().optional(),
  guest: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
  check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  check_out: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(request: Request) {
  try {
    const payload = webhookSchema.parse(await request.json());
    await logWebhookEvent('lodgify', payload, { route: 'booking-confirmation' });

    const bookings = await listBookings();
    const existing =
      bookings.find(
        (booking) =>
          booking.status === 'pending' &&
          booking.guestEmail.toLowerCase() === payload.guest.email.toLowerCase() &&
          booking.checkIn === payload.check_in &&
          booking.checkOut === payload.check_out,
      ) ?? null;

    const booking =
      existing ??
      (await createPendingBooking({
        unitId: (await listAvailableUnits())[0]?.id ?? 'unit_unmatched',
        guestName: payload.guest.name,
        guestEmail: payload.guest.email,
        checkIn: payload.check_in,
        checkOut: payload.check_out,
        partySize: { adults: 1, children: 0 },
        waiverId: 'waiver_unlinked',
      }));

    const operatorNotifiedAt = await notifyOperatorOfBooking({
      ...booking,
      status: payload.status === 'cancelled' ? 'cancelled' : 'confirmed',
      lodgifyBookingId: payload.booking_id,
      confirmedAt: new Date().toISOString(),
    });

    const updated = await saveBookingRecord({
      ...booking,
      status: payload.status === 'cancelled' ? 'cancelled' : 'confirmed',
      lodgifyBookingId: payload.booking_id,
      confirmedAt: new Date().toISOString(),
      operatorNotifiedAt,
    });

    const unit = (await getUnitById(updated.unitId)) ?? (await listAvailableUnits())[0];
    if (!unit) {
      return NextResponse.json({ error: 'No unit record available for booking confirmation.' }, { status: 500 });
    }

    const waiver = await readWaiverById(updated.waiverId);
    const confirmation = await sendBookingConfirmation({
      booking: updated,
      unit,
      waiver,
    });

    const finalRecord = await saveBookingRecord({
      ...updated,
      guestNotifiedAt: confirmation.capture.renderedAt,
    });

    return NextResponse.json({
      ok: true,
      bookingId: finalRecord.id,
      lodgifyBookingId: payload.booking_id,
      status: finalRecord.status,
      emailCaptureId: confirmation.capture.id,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to process Lodgify booking webhook.' }, { status: 400 });
  }
}
