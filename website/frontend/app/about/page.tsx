import { ContentSection } from '@/components/ContentSection';
import { Hero } from '@/components/Hero';
import { HeroMedia } from '@/components/shared/HeroMedia';
import { StoryBlock } from '@/components/StoryBlock';

export default function AboutPage() {
  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Hero
          eyebrow="About Chuck and Susan"
          title="A Big Bend project built around care, patience, and useful work."
          body="Chuck and Susan are building Big Bend Burro as a long-horizon desert project: part hospitality, part workshop space, part field journal, and part defense of the landscape that makes the entire idea viable."
          primaryAction={{ href: '/contact', label: 'Get in touch' }}
          secondaryAction={{ href: '/blog', label: 'Read the journal' }}
        />
        <HeroMedia
          label="The mood of the site"
          caption="This is not a generic lodging brand. The tone is grounded in Susan's photographs, Chuck and Susan's lived planning work, and the scale of the place itself."
        />
      </section>

      <StoryBlock
        eyebrow="The mission"
        title="Build the full system carefully, then activate it at a human pace"
        body="Burro is designed around a practical sequence: solve the land and utility questions, publish field notes honestly, introduce workshops and future stays with clear boundaries, and protect the conservation identity as the business grows."
      />

      <ContentSection
        kicker="What Burro is not"
        title="Not a rush job, not a generic glamping clone"
        body="The project is intentionally resisting the usual pattern of polished launch pages followed by fragile operations. The site explains the work before it sells the dream, because that is the only way this place stays durable."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-panel border border-text-strong/10 bg-white/80 p-6 shadow-soft">
            <h3 className="font-display text-2xl text-text-strong">What we are building toward</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">Dark-sky stays, workshop-led experiences, careful local partnerships, and a public record of what the land can realistically support.</p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/80 p-6 shadow-soft">
            <h3 className="font-display text-2xl text-text-strong">What we refuse to fake</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">Ready-now capacity, instant luxury mythology, or a conservation story treated as decorative copy instead of operating principle.</p>
          </article>
        </div>
      </ContentSection>
    </>
  );
}
