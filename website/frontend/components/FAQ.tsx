const faqs = [
  'This is a route stub, not live booking content.',
  'Purpose notes point back to the blueprint route definition.',
  'Operators remain in R0_OBSERVE during this sprint.',
];

export function FAQ() {
  return (
    <div className="space-y-3">
      {faqs.map((entry) => (
        <details key={entry} className="rounded-panel border border-text-strong/10 bg-surface-base p-4">
          <summary className="cursor-pointer font-semibold text-text-strong">Why this placeholder exists</summary>
          <p className="mt-3 text-sm leading-7 text-text-muted">{entry}</p>
        </details>
      ))}
    </div>
  );
}
