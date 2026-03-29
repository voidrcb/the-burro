import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getActivismUpdateBySlug } from '@/lib/content/activism';

export default async function ActivismUpdatePage({ params }: { params: { slug: string } }) {
  const update = await getActivismUpdateBySlug(params.slug);

  if (!update) {
    notFound();
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <article className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{update.category}</p>
        <h1 className="mt-3 font-display text-5xl text-text-strong">{update.title}</h1>
        <p className="mt-4 text-sm leading-7 text-text-muted">{update.summary}</p>
        <div className="mt-6 rounded-[24px] border border-text-strong/10 bg-[#faf7ef] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Source pack {update.source_pack_ref}</p>
          <p className="mt-3 text-sm leading-7 text-text-muted">{update.content}</p>
        </div>
      </article>

      <aside className="space-y-6">
        <section className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-text-strong">Sources</h2>
          <div className="mt-4 space-y-3">
            {(update.source_refs ?? []).map((source) => (
              <Link key={`${source.label}-${source.url}`} href={source.url} className="block rounded-[18px] border border-text-strong/10 bg-surface-base/80 p-4 text-sm font-semibold text-accent-primary no-underline">
                {source.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-text-strong">Next steps</h2>
          <div className="mt-4 space-y-3">
            {(update.actions ?? []).map((action) => (
              <Link key={`${action.label}-${action.url}`} href={action.url} className="block rounded-[18px] border border-text-strong/10 bg-surface-base/80 p-4 text-sm font-semibold text-accent-primary no-underline">
                {action.label}
              </Link>
            ))}
          </div>
        </section>
      </aside>
    </section>
  );
}
