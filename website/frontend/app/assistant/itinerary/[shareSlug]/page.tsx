import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getItineraryDraftByShareSlug, listGroupBookings } from '@/lib/itinerary/store';

export default async function ItinerarySharePage({ params }: { params: { shareSlug: string } }) {
  const [draft, groupBookings] = await Promise.all([getItineraryDraftByShareSlug(params.shareSlug), listGroupBookings()]);
  const groupBooking = groupBookings.find((booking) => booking.itineraryRef === draft?.id);

  if (!draft) {
    notFound();
  }

  return (
    <section className="rounded-panel border border-text-strong/10 bg-white p-8 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Printable itinerary summary</p>
          <h1 className="mt-3 font-display text-4xl text-text-strong">{draft.title}</h1>
          <p className="mt-2 text-sm text-text-muted">{draft.dateRange.start} through {draft.dateRange.end}</p>
        </div>
        <Link href="/assistant/itinerary" className="rounded-pill border border-text-strong/15 px-4 py-2 text-sm font-semibold text-text-strong no-underline">
          Back to composer
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-4">
          {draft.components.map((component) => (
            <article key={`${draft.id}-${component.refId}`} className="rounded-[20px] border border-text-strong/10 bg-surface-base/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-earth">{component.type}</p>
              <p className="mt-2 text-lg font-semibold text-text-strong">{component.title}</p>
              <p className="mt-2 text-sm text-text-muted">Dates: {component.dates.join(', ')}</p>
              <p className="mt-1 text-sm text-text-muted">Hold state: {component.holdStatus}</p>
              <p className="mt-1 text-sm text-text-muted">Drafted price: ${component.priceAtDraft.toFixed(2)}</p>
            </article>
          ))}
        </div>
        <aside className="space-y-4">
          <article className="rounded-[20px] border border-text-strong/10 bg-[#faf7ef] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-earth">Review status</p>
            <p className="mt-2 text-lg font-semibold text-text-strong">{draft.status}</p>
            <p className="mt-2 text-sm text-text-muted">Source: {draft.source}</p>
            <p className="mt-1 text-sm text-text-muted">Total: ${draft.totalPrice.toFixed(2)}</p>
          </article>
          {groupBooking ? (
            <article className="rounded-[20px] border border-text-strong/10 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-earth">Group booking</p>
              <p className="mt-2 text-lg font-semibold text-text-strong">{groupBooking.groupName}</p>
              <p className="mt-2 text-sm text-text-muted">Facilitator: {groupBooking.facilitator.name}</p>
              <p className="mt-1 text-sm text-text-muted">Participants: {groupBooking.participantCount}</p>
            </article>
          ) : null}
          {draft.validationNotes.length ? (
            <article className="rounded-[20px] border border-text-strong/10 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-earth">Validation notes</p>
              <div className="mt-2 space-y-2 text-sm text-text-muted">
                {draft.validationNotes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            </article>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
