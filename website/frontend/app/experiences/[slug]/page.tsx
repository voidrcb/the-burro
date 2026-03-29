import { notFound } from 'next/navigation';

import { ContentSection } from '@/components/ContentSection';
import { Hero } from '@/components/Hero';
import { getPublicExperienceProductBySlug } from '@/lib/content/experiences';

export default async function ExperienceDetailPage({ params }: { params: { slug: string } }) {
  const experience = await getPublicExperienceProductBySlug(params.slug);

  if (!experience) {
    notFound();
  }

  return (
    <>
      <Hero
        eyebrow="Experience detail"
        title={experience.name}
        body={experience.summary}
        primaryAction={{ href: '/contact', label: 'Inquire about this experience' }}
        secondaryAction={{ href: '/experiences', label: 'Back to experiences' }}
      />

      <ContentSection
        kicker="Operator-ready context"
        title="Partner attribution, seasonality, and risk posture stay visible"
        body="Everything you need to know before booking: partner coordination, seasonal availability, and what to expect in the field."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Delivery and logistics</p>
            <div className="mt-4 space-y-2 text-sm text-text-muted">
              <p>Delivery model: {experience.deliveryModel.replace('_', ' ')}</p>
              <p>Meeting point: {experience.meetingPoint}</p>
              <p>Location: {experience.locationSummary}</p>
              <p>Duration: {experience.durationHours} hours</p>
              <p>Capacity: up to {experience.maxGroupSize} guests</p>
              <p>Partner: {experience.partnerName ?? 'Owned / guide-led in house'}</p>
            </div>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Seasonality and safety</p>
            <div className="mt-4 space-y-2 text-sm text-text-muted">
              <p>Available months: {experience.seasonality.available.join(', ')}</p>
              <p>Peak months: {experience.seasonality.peakMonths?.join(', ') ?? 'Not flagged'}</p>
              <p>Safety level: {experience.safetyLevel}</p>
              <p>Waiver required: {experience.waiverRequired ? 'Yes' : 'No'}</p>
              <p>Status: {experience.status}</p>
            </div>
          </article>
        </div>

        <article className="rounded-panel border border-text-strong/10 bg-[#faf7ef] p-6 shadow-soft">
          <p className="text-sm leading-8 text-text-body">{experience.description}</p>
        </article>
      </ContentSection>
    </>
  );
}
