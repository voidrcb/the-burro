export function Button({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' }) {
  const base = 'inline-flex rounded-pill px-4 py-2 text-sm font-semibold';
  const variantClasses =
    variant === 'primary'
      ? 'bg-text-strong text-text-inverse'
      : 'border border-text-strong/15 bg-surface-elevated text-text-strong';

  return <button className={`${base} ${variantClasses}`}>{label}</button>;
}
