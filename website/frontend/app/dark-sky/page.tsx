import Link from 'next/link';

import { Card } from '@/components/Card';
import { ContentSection } from '@/components/ContentSection';
import { Hero } from '@/components/Hero';
import { StoryBlock } from '@/components/StoryBlock';

const seasons = [
  {
    name: 'Winter',
    months: 'December - February',
    highlights: 'Orion at its peak, Pleiades cluster, longest nights for photography',
    conditions: 'Cold nights (30-50°F), minimal humidity, excellent visibility',
  },
  {
    name: 'Spring',
    months: 'March - May',
    highlights: 'Milky Way season begins, meteor showers, galaxy season',
    conditions: 'Mild temperatures, occasional wind, some humidity',
  },
  {
    name: 'Summer',
    months: 'June - August',
    highlights: 'Milky Way core overhead, Saturn and Jupiter visible, monsoon lightning',
    conditions: 'Hot days, warm nights, monsoon clouds possible',
  },
  {
    name: 'Fall',
    months: 'September - November',
    highlights: 'Peak dark sky season, clear skies, Andromeda Galaxy visible',
    conditions: 'Perfect temperatures, low humidity, stable weather',
  },
];

const events = [
  { name: 'New Moon', description: 'Darkest skies for deep-sky photography and naked-eye Milky Way' },
  { name: 'Meteor Showers', description: 'Perseids (August), Geminids (December), Leonids (November)' },
  { name: 'Planet Viewing', description: 'Jupiter, Saturn, Mars, and Venus at various times throughout the year' },
  { name: 'Eclipses', description: 'Lunar eclipses visible from Big Bend; partial solar eclipses occasionally' },
];

export default function DarkSkyPage() {
  return (
    <>
      <Hero
        eyebrow="Dark Sky Reserve"
        title="The darkest skies in the continental United States"
        body="Big Bend sits within the Greater Big Bend International Dark Sky Reserve - over 15,000 square miles of protected night sky. On a clear night, you can see 2,000+ stars with your naked eye."
        primaryAction={{ href: '/stay', label: 'Book a stay' }}
        secondaryAction={{ href: '/workshops', label: 'Photography workshops' }}
      />

      <StoryBlock
        eyebrow="What makes it special"
        title="True darkness is increasingly rare"
        body="In most of America, light pollution obscures all but the brightest stars. Here, 16 miles from the nearest streetlight, you experience the sky as humans have seen it for millennia. The Milky Way casts shadows. The Andromeda Galaxy is visible to the naked eye. This is why astronomers, photographers, and seekers come to Big Bend."
      />

      <ContentSection
        kicker="Certification"
        title="International Dark-Sky Association recognized"
        body="The Greater Big Bend International Dark Sky Reserve received official certification from the International Dark-Sky Association. Our property follows strict lighting guidelines to maintain these pristine conditions."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Card
            title="15,000+ Square Miles"
            description="The largest dark sky reserve in the world, encompassing Big Bend National Park, Big Bend Ranch State Park, and surrounding lands."
          />
          <Card
            title="Bortle Class 1-2"
            description="The darkest classification on the Bortle scale. Zodiacal light, gegenschein, and zodiacal band all visible."
          />
          <Card
            title="2,000+ Visible Stars"
            description="Compare to 200-300 visible stars in suburban areas, or fewer than 20 in major cities."
          />
        </div>
      </ContentSection>

      <ContentSection
        kicker="Best times"
        title="Seasonal stargazing guide"
        body="Every season offers different celestial highlights. Here's what to expect throughout the year."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {seasons.map((season) => (
            <article key={season.name} className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{season.months}</p>
              <h3 className="mt-2 font-display text-xl text-text-strong">{season.name}</h3>
              <p className="mt-3 text-sm font-semibold text-text-strong">{season.highlights}</p>
              <p className="mt-2 text-sm text-text-muted">{season.conditions}</p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        kicker="Celestial events"
        title="Special viewing opportunities"
        body="Plan your visit around these celestial highlights for an even more memorable experience."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => (
            <Card key={event.name} title={event.name} description={event.description} />
          ))}
        </div>
      </ContentSection>

      <ContentSection
        kicker="Photography"
        title="Capture the night sky"
        body="Dark sky photography is both art and science. Our workshops teach you the techniques, and our location provides the perfect canvas."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Card
            title="Photography Workshops"
            description="Learn dark sky photography with Chuck. Small groups, hands-on instruction, and access to the best shooting locations on our property."
          >
            <Link href="/workshops" className="text-sm font-semibold text-accent-primary">
              View workshop schedule
            </Link>
          </Card>
          <Card
            title="Equipment Rental"
            description="Rent Sony A7R night photography kits, star trackers, and accessories. All equipment tested and optimized for Big Bend conditions."
          >
            <Link href="/rentals" className="text-sm font-semibold text-accent-primary">
              Browse equipment
            </Link>
          </Card>
        </div>
      </ContentSection>

      <ContentSection
        kicker="Viewing tips"
        title="Get the most from your night sky experience"
        body="A few simple preparations will dramatically improve your stargazing."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Dark adaptation</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Your eyes need 20-30 minutes to fully adapt. Avoid all white light. Use red-filtered flashlights only.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Moon phases</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              New moon offers the darkest skies. Even a quarter moon significantly brightens the sky. Plan accordingly.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Dress warm</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Desert nights get cold year-round. Layers, blankets, and hot drinks make extended viewing comfortable.
            </p>
          </article>
        </div>
      </ContentSection>

      <section className="rounded-panel border border-text-strong/10 bg-gradient-to-r from-surface-night to-[#1b2210] p-6 text-text-inverse shadow-night">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nightSafe-haze">Ready to see the stars?</p>
            <h2 className="mt-2 font-display text-3xl">Book your dark sky experience</h2>
            <p className="mt-2 max-w-xl text-sm text-nightSafe-glow/80">
              Our solar-powered cabins are designed for stargazing. No light pollution, no distractions - just you and the universe.
            </p>
          </div>
          <Link href="/stay" className="rounded-pill bg-surface-warm px-5 py-3 text-sm font-semibold text-text-strong no-underline transition-transform hover:scale-105">
            View accommodations
          </Link>
        </div>
      </section>
    </>
  );
}
