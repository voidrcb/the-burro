import type { LodgingUnit } from '@/lib/content/stay-types';

export function PolicyDisplay({ unit }: { unit: LodgingUnit }) {
  const rows = [
    ['Check-in', unit.policies.checkIn],
    ['Check-out', unit.policies.checkOut],
    ['Cancellation', unit.policies.cancellation],
    ['Pets', unit.policies.pets],
    ['Smoking', unit.policies.smoking],
    ['Access', unit.policies.access],
    ['Weather', unit.policies.weather],
  ] as const;

  return (
    <div className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
      <h2 className="font-display text-3xl text-text-strong">Policies and expectations</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <article key={label} className="rounded-[22px] border border-text-strong/10 bg-surface-base/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{label}</p>
            <p className="mt-2 text-sm leading-7 text-text-muted">{value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
