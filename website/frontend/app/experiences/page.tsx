import { ContentSection } from '@/components/ContentSection';
import { ExperienceCatalog } from '@/components/experience/ExperienceCatalog';
import { Hero } from '@/components/Hero';
import { StoryBlock } from '@/components/StoryBlock';
import { listPublicExperienceProducts } from '@/lib/content/experiences';

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams?: { category?: string | string[] };
}) {
  const experiences = await listPublicExperienceProducts();
  const activeCategory = Array.isArray(searchParams?.category) ? searchParams?.category[0] : searchParams?.category;
  const filtered = activeCategory ? experiences.filter((experience) => experience.category === activeCategory) : experiences;

  return (
    <>
      <Hero
        eyebrow="Guided Experiences"
        title="Discover Big Bend with people who know it best"
        body="River trips, night sky tours, cultural excursions to Boquillas, and off-road adventures. We work with local experts and trusted partners to create experiences you can't find on your own."
        primaryAction={{ href: '#catalog', label: 'Browse experiences' }}
        secondaryAction={{ href: '/contact', label: 'Custom trip inquiry' }}
      />

      <StoryBlock
        eyebrow="Local knowledge"
        title="We partner with guides who live this landscape"
        body="Big Bend rewards local expertise. Seasonal river conditions change daily. Night sky photography spots require knowing the terrain. Border crossings to Boquillas have their own rhythm. Our experiences connect you with people who understand these nuances - not generic tour operators passing through."
      />

      <ContentSection
        kicker="Browse experiences"
        title="Adventures for every interest"
        body="Filter by category to find what speaks to you. Each listing includes seasonal availability, group size, and what to expect."
      >
        <div id="catalog">
          <ExperienceCatalog experiences={filtered} activeCategory={activeCategory} />
        </div>
      </ContentSection>

      <ContentSection
        kicker="How it works"
        title="Booking and coordination"
        body="Most experiences require advance notice for scheduling and preparation. Here's what to expect."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Partner-led trips</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              River floats and some tours are led by licensed partners. We handle introduction and coordination; they handle the guiding.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Seasonal availability</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Rio Grande water levels, weather, and border conditions affect what&apos;s possible when. We keep listings honest about timing.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Custom trips</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Want something not listed? Contact us about custom itineraries. We can often arrange special experiences for small groups.
            </p>
          </article>
        </div>
      </ContentSection>
    </>
  );
}
