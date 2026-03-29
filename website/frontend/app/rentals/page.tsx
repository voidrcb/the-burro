import Link from 'next/link';

import { ContentSection } from '@/components/ContentSection';
import { Hero } from '@/components/Hero';
import { StoryBlock } from '@/components/StoryBlock';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { listRentalAssets } from '@/lib/content/rentals';

function getCategoryLabel(category: string): string {
  return category
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'available':
      return 'Available now';
    case 'reserved':
      return 'Reserved';
    case 'maintenance':
      return 'Under maintenance';
    case 'retired':
      return 'Retired';
    default:
      return status;
  }
}

export default async function RentalsPage() {
  const assets = await listRentalAssets();

  return (
    <>
      <Hero
        eyebrow="Equipment Rental"
        title="Construction and photography equipment for Big Bend projects"
        body="Heavy equipment for remote property work and specialty gear for dark sky photography. Delivery available throughout Brewster County where applicable."
        primaryAction={{ href: '/rentals/request', label: 'Request a quote' }}
        secondaryAction={{ href: '/steel-buildings', label: 'Steel buildings' }}
      />

      <StoryBlock
        eyebrow="Why we do this"
        title="Remote property work requires the right tools"
        body="Building and maintaining property 16 miles off pavement presents unique challenges. We keep a small, practical equipment catalog for neighbors, workshop guests, and contractors who need gear that is already local to Big Bend."
      />

      <ContentSection
        kicker="Available equipment"
        title="Current rental inventory"
        body="Rates, availability, and delivery rules now pull from the equipment CMS so the public catalog and operator tools stay aligned."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {assets.map((asset) => {
            const isAvailable = asset.status === 'available' && !asset.maintenanceFlag;
            return (
              <article
                key={asset.id}
                className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft"
              >
                <ImageWithFallback
                  src={asset.images[0]?.url ?? ''}
                  alt={asset.images[0]?.alt ?? asset.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-52 rounded-[24px]"
                />
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">
                    {getCategoryLabel(asset.category)}
                  </p>
                  <span className="rounded-full bg-surface-elevated px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                    {getStatusLabel(asset.status)}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl text-text-strong">{asset.name}</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{asset.description}</p>
                {asset.specifications.length ? (
                  <ul className="mt-4 space-y-1">
                    {asset.specifications.slice(0, 3).map((spec) => (
                      <li key={spec} className="text-sm text-text-muted">
                        • {spec}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-text-strong/10 pt-4">
                  <div>
                    <p className="text-xs text-text-muted">Daily</p>
                    <p className="font-display text-xl text-text-strong">${asset.dailyRate}</p>
                  </div>
                  {asset.weeklyRate ? (
                    <div>
                      <p className="text-xs text-text-muted">Weekly</p>
                      <p className="font-display text-xl text-text-strong">${asset.weeklyRate}</p>
                    </div>
                  ) : null}
                  <div>
                    <p className="text-xs text-text-muted">Deposit</p>
                    <p className="font-display text-xl text-text-strong">${asset.depositRequired}</p>
                  </div>
                  {asset.deliveryFee > 0 ? (
                    <div>
                      <p className="text-xs text-text-muted">Delivery</p>
                      <p className="font-display text-xl text-text-strong">${asset.deliveryFee}</p>
                    </div>
                  ) : null}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/rentals/${asset.slug}`} className="rounded-pill border border-text-strong/15 bg-surface-elevated px-4 py-3 text-sm font-semibold text-text-strong no-underline">
                    View specs
                  </Link>
                  {isAvailable ? (
                    <Link href={`/rentals/request?asset=${asset.slug}`} className="rounded-pill bg-text-strong px-4 py-3 text-sm font-semibold text-text-inverse no-underline">
                      Request quote
                    </Link>
                  ) : (
                    <span className="rounded-pill border border-text-strong/10 px-4 py-3 text-sm font-semibold text-text-muted">Currently unavailable</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </ContentSection>

      <ContentSection
        kicker="Rental process"
        title="How it works"
        body="Simple, straightforward rental with no surprises."
      >
        <div className="grid gap-5 md:grid-cols-4">
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <h3 className="font-display text-xl text-text-strong">1. Request a quote</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">Tell us what you need, when you need it, and where you are working. We confirm availability and fit.</p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <h3 className="font-display text-xl text-text-strong">2. Approve the booking</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">We lock the rental, confirm the deposit, and review any insurance or operating requirements.</p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <h3 className="font-display text-xl text-text-strong">3. Delivery or pickup</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">Where delivery is offered, we schedule a safe handoff and walk through the equipment before use.</p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <h3 className="font-display text-xl text-text-strong">4. Return and inspection</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">We document condition at return and release the deposit once the inspection is complete.</p>
          </article>
        </div>
      </ContentSection>

      <section className="rounded-panel border border-text-strong/10 bg-gradient-to-r from-[#faf7ef] to-[#f5efe3] p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Need a building too?</p>
            <h2 className="mt-2 font-display text-3xl text-text-strong">Steel Buildings for Big Bend</h2>
            <p className="mt-2 max-w-xl text-sm text-text-muted">
              Chuck helps ranchers and businesses with commercial steel buildings. From equipment storage to workshops,
              we can help you plan and source the right structure.
            </p>
          </div>
          <Link href="/steel-buildings" className="rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse no-underline transition-transform hover:scale-105">
            Learn about steel buildings
          </Link>
        </div>
      </section>
    </>
  );
}
