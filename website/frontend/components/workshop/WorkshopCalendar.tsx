import Link from 'next/link';

import type { WorkshopProgram } from '@/lib/workshop/content-types';
import { getSessionLabel, isSessionRegisterable } from '@/lib/workshop/helpers';

export function WorkshopCalendar({ workshops }: { workshops: WorkshopProgram[] }) {
  const sessions = workshops
    .flatMap((workshop) => workshop.schedule.map((session) => ({ workshop, session })))
    .sort((left, right) => `${left.session.date}${left.session.startTime}`.localeCompare(`${right.session.date}${right.session.startTime}`));

  return (
    <div className="space-y-4">
      {sessions.map(({ workshop, session }) => {
        const label = getSessionLabel(session);
        const registerable = isSessionRegisterable(session);

        return (
          <article key={session.id} className="rounded-[22px] border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{workshop.category}</p>
                <h3 className="mt-2 font-display text-2xl text-text-strong">{workshop.title}</h3>
                <p className="mt-2 text-sm leading-7 text-text-muted">{session.date} • {session.startTime}-{session.endTime}</p>
              </div>
              <span className="rounded-full bg-surface-elevated px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{label}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-text-muted">
              <span>{session.spotsAvailable} spots available</span>
              <span>${workshop.pricing.basePrice}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/workshops/${workshop.slug}`} className="text-sm font-semibold text-accent-primary no-underline">Open workshop</Link>
              {registerable ? (
                <Link href={`/workshops/${workshop.slug}/register?sessionId=${session.id}`} className="text-sm font-semibold text-accent-primary no-underline">Register</Link>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
