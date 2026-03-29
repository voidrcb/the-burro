import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ContentSection } from '@/components/ContentSection';
import { WorkshopCalendar } from '@/components/workshop/WorkshopCalendar';
import { getPublishedWorkshopProgramBySlug, listPublishedWorkshopPrograms } from '@/lib/content/workshops';
import { getSessionLabel } from '@/lib/workshop/helpers';

export async function generateStaticParams() {
  const workshops = await listPublishedWorkshopPrograms();
  return workshops.map((workshop) => ({ slug: workshop.slug }));
}

export default async function WorkshopDetailPage({ params }: { params: { slug: string } }) {
  const workshop = await getPublishedWorkshopProgramBySlug(params.slug);
  if (!workshop) {
    notFound();
  }

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-panel bg-night-horizon px-8 py-12 text-text-inverse shadow-night">
          <p className="text-sm uppercase tracking-[0.28em] text-nightSafe-haze">{workshop.category === 'craft' ? 'Craft workshop' : 'Photography workshop'}</p>
          <h1 className="mt-4 font-display text-5xl leading-tight">{workshop.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-nightSafe-glow/85">{workshop.description}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-nightSafe-glow/85">
            <span>{workshop.duration.hours} hours</span>
            <span>{workshop.capacity.min}-{workshop.capacity.max} guests</span>
            <span>${workshop.pricing.basePrice}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={`/workshops/${workshop.slug}/register`} className="rounded-pill bg-surface-warm px-5 py-3 font-semibold text-text-strong no-underline">
              Start registration
            </Link>
            <Link href="/contact" className="rounded-pill border border-nightSafe-glow/30 px-5 py-3 font-semibold text-text-inverse no-underline">
              Ask before committing travel
            </Link>
          </div>
        </div>
        <div className="space-y-6">
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Instructor</p>
            <h2 className="mt-2 font-display text-3xl text-text-strong">{workshop.instructorName}</h2>
            <p className="mt-3 text-sm leading-7 text-text-muted">{workshop.instructorBio ?? 'Instructor details coming soon.'}</p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Special instructions</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">{workshop.specialInstructions ?? 'No extra special instructions recorded yet.'}</p>
          </article>
        </div>
      </section>

      <ContentSection kicker="Sessions" title="Upcoming workshop sessions" body="Session states stay explicit. Full and cancelled sessions are not collapsed into one generic closed label.">
        <div className="space-y-4">
          {workshop.schedule.map((session) => (
            <article key={session.id} className="rounded-[22px] border border-text-strong/10 bg-white/85 p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text-strong">{session.date} • {session.startTime}-{session.endTime}</p>
                  <p className="mt-2 text-sm text-text-muted">{getSessionLabel(session)} • {session.spotsAvailable} spots available</p>
                </div>
                {session.status === 'open' && session.spotsAvailable > 0 ? (
                  <Link href={`/workshops/${workshop.slug}/register?sessionId=${session.id}`} className="rounded-pill bg-text-strong px-4 py-3 text-sm font-semibold text-text-inverse no-underline">
                    Register Now
                  </Link>
                ) : (
                  <span className="rounded-pill border border-text-strong/10 px-4 py-3 text-sm font-semibold text-text-muted">{getSessionLabel(session)}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection kicker="Schedule view" title="Full workshop calendar" body="See all upcoming sessions across our workshop programs.">
        <WorkshopCalendar workshops={[workshop]} />
      </ContentSection>
    </>
  );
}
