export function PriceDisplay({
  nightly,
  seasonName,
  totalEstimate,
  nights,
  cleaningFee,
  weeklyDiscount,
}: {
  nightly: number;
  seasonName: string;
  totalEstimate?: number;
  nights?: number;
  cleaningFee?: number;
  weeklyDiscount?: number;
}) {
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <div className="rounded-[24px] border border-text-strong/10 bg-surface-base/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{seasonName}</p>
          <p className="mt-2 font-display text-3xl text-text-strong">{currency.format(nightly)}<span className="ml-2 text-base text-text-muted">nightly</span></p>
        </div>
        {totalEstimate ? <p className="text-sm font-semibold text-text-strong">Est. total {currency.format(totalEstimate)}</p> : null}
      </div>
      {(nights || cleaningFee || weeklyDiscount) ? (
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-text-muted">
          {typeof nights === 'number' ? <span>{nights} night stay</span> : null}
          {typeof cleaningFee === 'number' ? <span>Cleaning {currency.format(cleaningFee)}</span> : null}
          {typeof weeklyDiscount === 'number' ? <span>{Math.round(weeklyDiscount * 100)}% weekly discount when applicable</span> : null}
        </div>
      ) : null}
    </div>
  );
}
