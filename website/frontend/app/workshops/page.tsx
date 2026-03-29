import { ContentSection } from '@/components/ContentSection';
import { Hero } from '@/components/Hero';
import { StoryBlock } from '@/components/StoryBlock';
import { WorkshopCalendar } from '@/components/workshop/WorkshopCalendar';
import { WorkshopCatalog } from '@/components/workshop/WorkshopCatalog';
import { listPublishedWorkshopPrograms } from '@/lib/content/workshops';

export default async function WorkshopsPage() {
  const workshops = await listPublishedWorkshopPrograms();

  return (
    <>
      <Hero
        eyebrow="Creative Workshops"
        title="Learn from artists who call Big Bend home"
        body="Small-group workshops in desert tile-making, pottery, and dark sky photography. Hands-on instruction, authentic materials, and settings you won't find anywhere else."
        primaryAction={{ href: '#catalog', label: 'Browse workshops' }}
        secondaryAction={{ href: '#calendar', label: 'See schedule' }}
      />

      <StoryBlock
        eyebrow="Our approach"
        title="Small groups, real skills, unforgettable settings"
        body="Our workshops aren't tourist activities. They're genuine learning experiences led by working artists. Susan teaches tile-making techniques she's developed over years of practice. Chuck shares the dark sky photography methods that produce gallery-quality images. Small groups (usually 4-6 people) mean personal attention and real skill development."
      />

      <ContentSection
        kicker="Workshop programs"
        title="Choose your craft"
        body="Each workshop is designed to give you hands-on experience and skills you can take home. No prior experience required."
      >
        <div id="catalog">
          <WorkshopCatalog workshops={workshops} />
        </div>
      </ContentSection>

      <ContentSection
        kicker="Upcoming sessions"
        title="Schedule and availability"
        body="Sessions fill quickly due to small group sizes. Register early to secure your spot."
      >
        <div id="calendar">
          <WorkshopCalendar workshops={workshops} />
        </div>
      </ContentSection>

      <ContentSection
        kicker="What to expect"
        title="Workshop logistics"
        body="Everything you need to know before registering."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Materials included</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              All workshop materials and tools are provided. For photography workshops, camera equipment is available to rent.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Take home your work</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Tile and pottery workshops include firing and finishing. Your pieces are shipped to you after the kiln cycle completes.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Refreshments provided</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Water, coffee, and light snacks are available throughout. Longer workshops include a break for lunch.
            </p>
          </article>
        </div>
      </ContentSection>
    </>
  );
}
