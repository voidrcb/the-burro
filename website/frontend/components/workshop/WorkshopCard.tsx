import Link from 'next/link';

import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import type { WorkshopProgram } from '@/lib/workshop/content-types';
import { getSessionLabel, isSessionRegisterable } from '@/lib/workshop/helpers';

export function WorkshopCard({ workshop }: { workshop: WorkshopProgram }) {
  const nextSession = workshop.schedule.find((session) => session.status !== 'cancelled') ?? workshop.schedule[0];
  const sessionLabel = nextSession ? getSessionLabel(nextSession) : 'No sessions scheduled';
  const canRegister = nextSession ? isSessionRegisterable(nextSession) : false;

  return (
    <article className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
      {workshop.heroImage && (
        <ImageWithFallback
          src={workshop.heroImage}
          alt={workshop.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="mb-4 h-40 rounded-[22px]"
        />
      )}
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{workshop.category === 'craft' ? 'Craft workshop' : 'Photography workshop'}</p>
      <h3 className="mt-2 font-display text-3xl text-text-strong">{workshop.title}</h3>
      <p className="mt-3 text-sm leading-7 text-text-muted">{workshop.summary}</p>

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-text-muted">
        <span>{workshop.duration.hours} hours</span>
        <span>{workshop.capacity.min}-{workshop.capacity.max} guests</span>
        <span>${workshop.pricing.basePrice}</span>
      </div>

      <div className="mt-5 rounded-[22px] border border-text-strong/10 bg-surface-base/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Next session</p>
        {nextSession ? (
          <>
            <p className="mt-2 text-sm font-semibold text-text-strong">{nextSession.date} • {nextSession.startTime}-{nextSession.endTime}</p>
            <p className="mt-2 text-sm text-text-muted">{sessionLabel}</p>
          </>
        ) : (
          <p className="mt-2 text-sm text-text-muted">Schedule coming soon.</p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/workshops/${workshop.slug}`} className="rounded-pill bg-text-strong px-4 py-3 text-sm font-semibold text-text-inverse no-underline">
          View details
        </Link>
        {nextSession && canRegister ? (
          <Link href={`/workshops/${workshop.slug}/register?sessionId=${nextSession.id}`} className="rounded-pill border border-text-strong/15 bg-surface-elevated px-4 py-3 text-sm font-semibold text-text-strong no-underline">
            Register now
          </Link>
        ) : (
          <span className="rounded-pill border border-text-strong/10 px-4 py-3 text-sm font-semibold text-text-muted">{sessionLabel}</span>
        )}
      </div>
    </article>
  );
}
