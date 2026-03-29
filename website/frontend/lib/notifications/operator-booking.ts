import type { BookingRecord } from '@/lib/content/stay-types';

import { appendJsonLine, getDataPath } from '@/lib/server/repo';

export async function notifyOperatorOfBooking(booking: BookingRecord) {
  const notifiedAt = new Date().toISOString();
  await appendJsonLine(getDataPath('assistant-logs', 'operator-bookings.jsonl'), {
    notifiedAt,
    bookingId: booking.id,
    status: booking.status,
    guestEmail: booking.guestEmail,
    unitId: booking.unitId,
  });

  return notifiedAt;
}
