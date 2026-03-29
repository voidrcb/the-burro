import Link from 'next/link';

import type { LodgingUnit } from '@/lib/content/stay-types';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

import { PriceDisplay } from './PriceDisplay';

export function UnitCard({ unit, nightly, seasonName }: { unit: LodgingUnit; nightly: number; seasonName: string }) {
  const isAvailable = unit.status === 'available';

  return (
    <article className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">
            {isAvailable ? 'Available now' : 'Coming soon'}
          </p>
          <h3 className="mt-2 font-display text-3xl text-text-strong">{unit.name}</h3>
          <p className="mt-3 text-sm leading-7 text-text-muted">{unit.shortDescription}</p>
        </div>
        <div className="rounded-full bg-surface-elevated px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
          Sleeps {unit.capacity.adults + unit.capacity.children}
        </div>
      </div>

      <ImageWithFallback
        src={unit.photos[0]?.url ?? ''}
        alt={unit.photos[0]?.alt ?? unit.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="mt-5 h-48 rounded-[22px]"
      />

      <div className="mt-5">
        <PriceDisplay nightly={nightly} seasonName={seasonName} />
      </div>

      <ul className="mt-5 flex flex-wrap gap-2 text-xs text-text-muted">
        {unit.amenities.slice(0, 4).map((amenity) => (
          <li key={amenity} className="rounded-full bg-surface-base px-3 py-2">{amenity}</li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/stay/${unit.slug}`} className="rounded-pill bg-text-strong px-4 py-3 text-sm font-semibold text-text-inverse no-underline">
          View stay details
        </Link>
        {isAvailable ? (
          <Link href={`/stay/${unit.slug}/book`} className="rounded-pill border border-text-strong/15 bg-surface-elevated px-4 py-3 text-sm font-semibold text-text-strong no-underline">
            Start booking handoff
          </Link>
        ) : (
          <span className="rounded-pill border border-text-strong/10 px-4 py-3 text-sm font-semibold text-text-muted">Coming soon</span>
        )}
      </div>
    </article>
  );
}
