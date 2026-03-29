import Link from 'next/link';

import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import type { ExperienceProduct } from '@/lib/experience/types';

const categoryLabels: Record<ExperienceProduct['category'], string> = {
  river: 'River',
  stargazing: 'Stargazing',
  craft: 'Craft',
  mining_history: 'Mining history',
  boquillas_partner: 'Boquillas partner',
  offroad: 'Off-road',
  wellness: 'Wellness',
  touring: 'Touring',
};

export function ExperienceCatalog({
  experiences,
  activeCategory,
}: {
  experiences: ExperienceProduct[];
  activeCategory?: string;
}) {
  const categories = [...new Set(experiences.map((experience) => experience.category))];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/experiences"
          className={activeCategory ? 'rounded-full bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong no-underline' : 'rounded-full bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse no-underline'}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/experiences?category=${category}`}
            className={activeCategory === category ? 'rounded-full bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse no-underline' : 'rounded-full bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong no-underline'}
          >
            {categoryLabels[category]}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {experiences.map((experience) => (
          <article key={experience.id} className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
            {experience.images[0] && (
              <ImageWithFallback
                src={experience.images[0]}
                alt={experience.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="mb-4 h-40 rounded-[22px]"
              />
            )}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{categoryLabels[experience.category]}</p>
                <h3 className="mt-2 font-display text-3xl text-text-strong">{experience.name}</h3>
              </div>
              <span className="rounded-full bg-surface-base px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{experience.status}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-text-muted">{experience.summary}</p>
            <div className="mt-5 grid gap-2 text-sm text-text-muted">
              <p>Price: ${experience.priceUsd.toFixed(0)} base</p>
              <p>Delivery: {experience.deliveryModel.replace('_', ' ')}</p>
              <p>Meeting point: {experience.meetingPoint}</p>
              <p>Seasonality: {experience.seasonality.available.join(', ')}</p>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{experience.partnerName ? `Partner: ${experience.partnerName}` : 'Operated in-house'}</p>
              <Link href={`/experiences/${experience.slug}`} className="rounded-pill bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse no-underline">
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
