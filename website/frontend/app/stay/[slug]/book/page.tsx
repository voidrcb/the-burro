import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BookingFlowForm } from '@/components/stay/BookingFlowForm';
import { PolicyDisplay } from '@/components/stay/PolicyDisplay';
import { getPriceQuote } from '@/lib/content/rates';
import { getPublicUnitBySlug, listAvailableUnits } from '@/lib/content/units';

export async function generateStaticParams() {
  const units = await listAvailableUnits();
  return units.map((unit) => ({ slug: unit.slug }));
}

export default async function StayBookingPage({ params }: { params: { slug: string } }) {
  const unit = await getPublicUnitBySlug(params.slug);
  if (!unit) {
    notFound();
  }

  const quote = await getPriceQuote(unit);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-accent-sage">Book your stay</p>
          <h1 className="mt-3 font-display text-4xl text-text-strong">{unit.name}</h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-text-body">
            This flow stores the waiver acknowledgement and pending redirect intent on-site, then sends the guest to Lodgify for provider-managed checkout.
          </p>
        </div>
        <Link href={`/stay/${unit.slug}`} className="rounded-pill border border-text-strong/15 bg-surface-elevated px-4 py-3 text-sm font-semibold text-text-strong no-underline">
          Back to stay details
        </Link>
      </section>

      {unit.status === 'available' ? (
        <BookingFlowForm unit={unit} initialQuote={quote} />
      ) : (
        <section className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
          <p className="text-sm leading-7 text-text-muted">This stay is visible for planning context only. It is not yet bookable, so the Lodgify handoff remains disabled.</p>
        </section>
      )}

      <PolicyDisplay unit={unit} />
    </div>
  );
}
