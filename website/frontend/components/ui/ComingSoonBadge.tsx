import clsx from 'clsx';

type BadgeVariant = 'inline' | 'overlay' | 'banner';

interface ComingSoonBadgeProps {
  variant?: BadgeVariant;
  message?: string;
  className?: string;
}

export function ComingSoonBadge({
  variant = 'inline',
  message = 'Coming Soon',
  className,
}: ComingSoonBadgeProps) {
  if (variant === 'banner') {
    return (
      <div
        className={clsx(
          'rounded-panel border border-accent-secondary/40 bg-accent-secondary/15 px-5 py-4',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-secondary/30">
            <svg
              className="h-4 w-4 text-accent-earth"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-accent-earth">{message}</p>
            <p className="text-xs text-text-muted">
              We&apos;re preparing this feature. Check back soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div
        className={clsx(
          'absolute inset-0 z-10 flex items-center justify-center rounded-panel bg-surface-base/80 backdrop-blur-sm',
          className
        )}
      >
        <div className="rounded-pill border border-accent-secondary/40 bg-accent-secondary/20 px-4 py-2">
          <span className="text-sm font-semibold text-accent-earth">{message}</span>
        </div>
      </div>
    );
  }

  // inline variant (default)
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-pill border border-accent-secondary/40 bg-accent-secondary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-earth',
        className
      )}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-secondary" />
      {message}
    </span>
  );
}
