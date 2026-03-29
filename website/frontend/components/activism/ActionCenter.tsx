import Link from 'next/link';

import type { ActivismAction } from '@/lib/content/activism';

export function ActionCenter({ actions }: { actions: ActivismAction[] }) {
  return (
    <section className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Action center</p>
      <h3 className="mt-2 font-display text-3xl text-text-strong">External next steps, kept narrow on purpose</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {actions.map((action, index) => (
          <article key={`${action.label}-${index}`} className="rounded-[20px] border border-text-strong/10 bg-surface-base/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{action.type}</p>
            <Link href={action.url} className="mt-3 block text-sm font-semibold text-accent-primary no-underline">
              {action.label}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
