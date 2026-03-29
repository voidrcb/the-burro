import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ContentSection } from '@/components/ContentSection';
import { PolicyDisplay } from '@/components/stay/PolicyDisplay';
import { PriceDisplay } from '@/components/stay/PriceDisplay';
import { getPriceQuote } from '@/lib/content/rates';
import { getPublicUnitBySlug, listPublicUnits } from '@/lib/content/units';

export async function generateStaticParams() {
  const units = await listPublicUnits();
  return units.map((unit) => ({ slug: unit.slug }));
}

export default async function StayDetailPage({ params }: { params: { slug: string } }) {
  const unit = await getPublicUnitBySlug(params.slug);
  if (!unit) {
    notFound();
  }

  const quote = await getPriceQuote(unit);
  const isAvailable = unit.status === 'available';

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div
          className="rounded-panel px-8 py-12 text-text-inverse shadow-night"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(24,39,33,0.16), rgba(24,39,33,0.72)), url(${unit.photos[0]?.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <p className="text-sm uppercase tracking-[0.28em] text-nightSafe-haze">{isAvailable ? 'Available stay' : 'Coming soon'}</p>
          <h1 className="mt-4 font-display text-5xl leading-tight">{unit.name}</h1>
          <p className="mt-5 max-w-2xl text-lg text-nightSafe-glow/85">{unit.description}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-nightSafe-glow/85">
            <span>Sleeps {unit.capacity.adults} adults</span>
            {unit.capacity.children > 0 ? <span>+ {unit.capacity.children} children</span> : null}
            <span>{unit.amenities.slice(0, 2).join(' • ')}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            {isAvailable ? (
              <Link href={`/stay/${unit.slug}/book`} className="rounded-pill bg-surface-warm px-5 py-3 font-semibold text-text-strong no-underline">
                Start booking handoff
              </Link>
            ) : (
              <span className="rounded-pill border border-nightSafe-glow/30 px-5 py-3 font-semibold text-text-inverse">Coming soon</span>
            )}
            <Link href="/contact" className="rounded-pill border border-nightSafe-glow/30 px-5 py-3 font-semibold text-text-inverse no-underline">
              Ask before you plan travel
            </Link>
          </div>
        </div>
        <div className="space-y-6">
          <PriceDisplay
            nightly={quote.nightly}
            seasonName={quote.seasonName}
            totalEstimate={quote.totalEstimate}
            nights={quote.nights}
            cleaningFee={quote.cleaningFee}
            weeklyDiscount={quote.weeklyDiscount}
          />
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Amenities</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-text-muted">
              {unit.amenities.map((amenity) => (
                <li key={amenity}>- {amenity}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <PolicyDisplay unit={unit} />

      <ContentSection
        kicker="Why the handoff exists"
        title="The site handles clarity and records. Lodgify handles the provider checkout."
        body="This MVP keeps payment, provider inventory, and final confirmation outside the site. Burro stores the waiver, logs the redirect intent, and then waits for the Lodgify webhook to confirm the booking."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Stage 1</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">Guest acknowledges access, weather, and stay policies.</p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Stage 2</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">Burro records pending booking intent and redirects into Lodgify.</p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Stage 3</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">After checkout, your booking is confirmed and you will receive confirmation details.</p>
          </article>
        </div>
      </ContentSection>
    </>
  );
}
