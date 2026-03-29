import { randomUUID } from 'crypto';

import type { BookingRecord, LodgingUnit, WaiverAcknowledgement } from '@/lib/content/stay-types';

import { storeEmailCapture } from '@/lib/booking/store';

export async function sendBookingConfirmation(options: {
  booking: BookingRecord;
  unit: LodgingUnit;
  waiver: WaiverAcknowledgement | null;
}) {
  const renderedAt = new Date().toISOString();
  const subject = `Booking confirmation for ${options.unit.name}`;

  const capture = await storeEmailCapture({
    id: `email_${randomUUID()}`,
    template: 'booking-confirmation',
    recipient: options.booking.guestEmail,
    subject,
    renderedAt,
    bookingId: options.booking.id,
    payload: {
      bookingId: options.booking.id,
      unitName: options.unit.name,
      checkIn: options.booking.checkIn,
      checkOut: options.booking.checkOut,
      guestName: options.booking.guestName,
      lodgifyBookingId: options.booking.lodgifyBookingId ?? null,
      waiverAcknowledgedAt: options.waiver?.acknowledgedAt ?? null,
    },
  });

  return {
    mode: 'scaffold' as const,
    capture,
  };
}
