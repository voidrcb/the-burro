import Link from 'next/link';

import type { ActivismUpdateSeed } from '@/lib/content/activism';

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export function StatusFeed({ updates }: { updates: ActivismUpdateSeed[] }) {
  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <article key={update.update_id} className="rounded-[24px] border border-text-strong/10 bg-white/80 p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{update.category}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{formatDate(update.status_date)}</p>
          </div>
          <h3 className="mt-3 font-display text-2xl text-text-strong">{update.title}</h3>
          <p className="mt-3 text-sm leading-7 text-text-muted">{update.summary}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-text-muted">
            <span>Source {update.source_pack_ref}</span>
            <div className="flex flex-wrap gap-3">
              <Link href={`/activism/updates/${update.slug}`} className="font-semibold text-accent-primary no-underline">
                Read update
              </Link>
              {(update.actions ?? [])[0] ? (
                <Link href={(update.actions ?? [])[0]!.url} className="font-semibold text-accent-primary no-underline">
                  {(update.actions ?? [])[0]!.label}
                </Link>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
