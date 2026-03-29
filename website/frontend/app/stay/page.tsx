import Link from 'next/link';

import { ContentSection } from '@/components/ContentSection';
import { Hero } from '@/components/Hero';
import { StoryBlock } from '@/components/StoryBlock';
import { UnitCard } from '@/components/stay/UnitCard';
import { getPriceQuote } from '@/lib/content/rates';
import { listPublicUnits } from '@/lib/content/units';

export default async function StayPage() {
  const units = await listPublicUnits();
  const pricedUnits = await Promise.all(
    units.map(async (unit) => ({
      unit,
      quote: await getPriceQuote(unit),
    })),
  );

  return (
    <>
      <Hero
        eyebrow="Dark Sky Lodging"
        title="Desert retreats under the darkest skies in Texas"
        body="Solar-powered cabins and desert lookouts designed for stargazing, photography, and genuine disconnection. Located in the Greater Big Bend International Dark Sky Reserve."
        primaryAction={{ href: '#catalog', label: 'View accommodations' }}
        secondaryAction={{ href: '/contact', label: 'Ask us anything' }}
      />

      <ContentSection
        kicker="Why stay here"
        title="An experience, not just a room"
        body="These aren't ordinary vacation rentals. Every stay is designed around the night sky, the desert landscape, and the peace that comes from being truly remote."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft transition-transform hover:scale-[1.02]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Certified Dark Sky</p>
            <h3 className="mt-2 font-display text-xl text-text-strong">No light pollution</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              All structures follow International Dark-Sky Association guidelines. See the Milky Way like you never have before.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft transition-transform hover:scale-[1.02]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Off-Grid Solar</p>
            <h3 className="mt-2 font-display text-xl text-text-strong">Sustainable power</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Modern comfort powered by the sun. Climate control, lighting, and charging without a generator hum.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft transition-transform hover:scale-[1.02]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">True Remote</p>
            <h3 className="mt-2 font-display text-xl text-text-strong">16 miles off pavement</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              High clearance vehicle recommended. This is real Big Bend country, not a roadside motel.
            </p>
          </article>
        </div>
      </ContentSection>

      <StoryBlock
        eyebrow="The setting"
        title="Greater Big Bend International Dark Sky Reserve"
        body="Our property sits within the largest dark sky reserve in the world - over 15,000 square miles of protected night sky. On a clear night, you can see the Andromeda Galaxy with your naked eye. The Chisos Mountains rise to the south, and the desert stretches in every direction. This is why people come to Big Bend."
      />

      <section id="catalog" className="space-y-6">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-accent-sage">Accommodations</p>
          <h2 className="mt-3 font-display text-4xl text-text-strong">Choose your desert retreat</h2>
          <p className="mt-3 text-sm leading-7 text-text-muted">
            Each accommodation has its own character. Seasonal rates adjust for peak dark sky season (September-February) and summer heat.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {pricedUnits.map(({ unit, quote }) => (
            <UnitCard key={unit.id} unit={unit} nightly={quote.nightly} seasonName={quote.seasonName} />
          ))}
        </div>
      </section>

      <ContentSection
        kicker="What to expect"
        title="Honest logistics before you book"
        body="Remote locations require preparation. Here's what you should know before reserving."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Access</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              16 miles of unpaved road from Terlingua Ghost Town. High clearance vehicle strongly recommended. 4WD helpful in wet conditions.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Connectivity</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Limited cell service. Starlink WiFi available but not guaranteed. Plan for a digital detox - that&apos;s part of the experience.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Supplies</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Stock up in Study Butte or Terlingua before arrival. Basic provisions available but selection is limited in this remote area.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Weather</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Summer highs can exceed 100°F. Winter nights drop to freezing. Spring and fall offer the most comfortable conditions.
            </p>
          </article>
        </div>
      </ContentSection>

      <section className="rounded-panel border border-text-strong/10 bg-gradient-to-r from-[#faf7ef] to-[#f5efe3] p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Questions?</p>
            <h2 className="mt-2 font-display text-3xl text-text-strong">Talk to Chuck and Susan</h2>
            <p className="mt-2 text-sm text-text-muted">
              We&apos;re happy to answer questions about access, amenities, or what to expect. Real people, real answers.
            </p>
          </div>
          <Link href="/contact" className="rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse no-underline transition-transform hover:scale-105">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
