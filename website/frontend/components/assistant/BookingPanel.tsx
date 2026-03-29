import Link from 'next/link';
import { useState } from 'react';

import { FollowUpCard } from '@/components/assistant/FollowUpCard';
import type { BurroFollowUp } from '@/lib/burro/followups';
import type { BookingRecord } from '@/lib/content/stay-types';
import type { GuestEvent } from '@/lib/crm/events';

export function BookingPanel({
  bookings,
  followUpsByContext,
  guestEventsByEmail,
}: {
  bookings: BookingRecord[];
  followUpsByContext: Record<string, BurroFollowUp | undefined>;
  guestEventsByEmail: Record<string, GuestEvent[]>;
}) {
  const [drafts, setDrafts] = useState(followUpsByContext);

  return (
    <section className="rounded-[28px] border border-text-strong/10 bg-white/85 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Operator booking panel</p>
          <h2 className="mt-2 font-display text-3xl text-text-strong">Recent local booking records</h2>
        </div>
        <Link href="/stay" className="text-sm font-semibold text-accent-primary no-underline">
          Open stay page
        </Link>
      </div>
      <div className="mt-5 space-y-4">
        {bookings.length ? (
          bookings.map((booking) => {
            const guestEvents = guestEventsByEmail[booking.guestEmail.trim().toLowerCase()] ?? [];
            const draft = drafts[booking.id];

            return (
              <article key={booking.id} className="rounded-[22px] border border-text-strong/10 bg-surface-base/80 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text-strong">{booking.guestName}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{booking.status} • {booking.unitId}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-earth">{booking.checkIn} to {booking.checkOut}</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-text-muted">
                  <p>Email: {booking.guestEmail}</p>
                  <p>Waiver: {booking.waiverId}</p>
                  <p>Lodgify: {booking.lodgifyBookingId ?? 'pending webhook'}</p>
                </div>
                {guestEvents.length ? (
                  <div className="mt-4 rounded-[18px] border border-text-strong/10 bg-white/85 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Guest activity</p>
                    <div className="mt-2 space-y-2 text-sm text-text-muted">
                      {guestEvents.slice(0, 3).map((event) => (
                        <p key={event.id}>{event.eventType} • {event.occurredAt.slice(0, 10)}</p>
                      ))}
                    </div>
                  </div>
                ) : null}
                {draft ? <FollowUpCard draft={draft} onApproved={(updatedDraft) => setDrafts((current) => ({ ...current, [booking.id]: updatedDraft }))} /> : null}
              </article>
            );
          })
        ) : (
          <p className="text-sm leading-7 text-text-muted">No booking records yet. Records will appear here after a guest starts the Lodgify handoff.</p>
        )}
      </div>
    </section>
  );
}
