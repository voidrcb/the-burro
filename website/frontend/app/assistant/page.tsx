import { getFeasibilitySnapshot } from '../../../../assistant/services/feasibility';
import { BurroAssistantShell } from '@/components/assistant/BurroAssistantShell';
import { ensureBookingFollowUpDraft, ensureWorkshopFollowUpDraft, listFollowUpsByContextIds } from '@/lib/burro/followups';
import { listBookingRecords } from '@/lib/booking/store';
import { listGuestEventsByEmail, recordGuestEvent } from '@/lib/crm/events';
import { listWorkshopRegistrations } from '@/lib/workshop/store';

export default async function AssistantPage() {
  const [snapshot, bookings, workshopRegistrations] = await Promise.all([
    getFeasibilitySnapshot(),
    listBookingRecords(),
    listWorkshopRegistrations(),
  ]);

  const recentBookings = bookings.slice(0, 5);
  const recentWorkshopRegistrations = workshopRegistrations.slice(0, 5);

  await Promise.all([
    ...recentBookings.map((booking) => recordGuestEvent({ guestEmail: booking.guestEmail, eventType: 'booking', eventRef: booking.id, tags: ['stay'] })),
    ...recentWorkshopRegistrations.map((registration) => recordGuestEvent({ guestEmail: registration.guestEmail, eventType: 'registration', eventRef: registration.id, tags: ['workshop'] })),
    ...recentBookings.map((booking) => ensureBookingFollowUpDraft(booking)),
    ...recentWorkshopRegistrations.map((registration) => ensureWorkshopFollowUpDraft(registration)),
  ]);

  const [bookingFollowUps, workshopFollowUps, guestEventsByEmail] = await Promise.all([
    listFollowUpsByContextIds(recentBookings.map((booking) => booking.id)),
    listFollowUpsByContextIds(recentWorkshopRegistrations.map((registration) => registration.id)),
    listGuestEventsByEmail([
      ...recentBookings.map((booking) => booking.guestEmail),
      ...recentWorkshopRegistrations.map((registration) => registration.guestEmail),
    ]),
  ]);

  return (
    <BurroAssistantShell
      initialCards={snapshot.cards}
      recentBookings={recentBookings}
      recentWorkshopRegistrations={recentWorkshopRegistrations}
      bookingFollowUps={bookingFollowUps}
      workshopFollowUps={workshopFollowUps}
      guestEventsByEmail={guestEventsByEmail}
    />
  );
}
