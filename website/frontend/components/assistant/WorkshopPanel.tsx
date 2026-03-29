import Link from 'next/link';
import { useState } from 'react';

import { FollowUpCard } from '@/components/assistant/FollowUpCard';
import type { BurroFollowUp } from '@/lib/burro/followups';
import type { GuestEvent } from '@/lib/crm/events';
import type { WorkshopRegistration } from '@/lib/workshop/types';

export function WorkshopPanel({
  registrations,
  followUpsByContext,
  guestEventsByEmail,
}: {
  registrations: WorkshopRegistration[];
  followUpsByContext: Record<string, BurroFollowUp | undefined>;
  guestEventsByEmail: Record<string, GuestEvent[]>;
}) {
  const [drafts, setDrafts] = useState(followUpsByContext);

  return (
    <section className="rounded-[28px] border border-text-strong/10 bg-white/85 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Workshop registrations</p>
          <h2 className="mt-2 font-display text-3xl text-text-strong">Recent local workshop records</h2>
        </div>
        <Link href="/workshops" className="text-sm font-semibold text-accent-primary no-underline">
          Open workshops
        </Link>
      </div>
      <div className="mt-5 space-y-4">
        {registrations.length ? registrations.map((registration) => {
          const guestEvents = guestEventsByEmail[registration.guestEmail.trim().toLowerCase()] ?? [];
          const draft = drafts[registration.id];

          return (
            <article key={registration.id} className="rounded-[22px] border border-text-strong/10 bg-surface-base/80 p-4">
              <p className="text-sm font-semibold text-text-strong">{registration.guestName}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-text-muted">{registration.workshopSlug} • {registration.sessionId}</p>
              <div className="mt-3 grid gap-2 text-sm text-text-muted">
                <p>Email: {registration.guestEmail}</p>
                <p>Status: {registration.status}</p>
                <p>Schema: {registration.intakeSchemaRef}@{registration.intakeSchemaVersion}</p>
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
              {draft ? <FollowUpCard draft={draft} onApproved={(updatedDraft) => setDrafts((current) => ({ ...current, [registration.id]: updatedDraft }))} /> : null}
            </article>
          );
        }) : <p className="text-sm leading-7 text-text-muted">No workshop registrations yet.</p>}
      </div>
    </section>
  );
}
