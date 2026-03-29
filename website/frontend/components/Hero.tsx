import Link from 'next/link';
import clsx from 'clsx';

import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface HeroProps {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: { href: string; label: string };
  secondaryAction: { href: string; label: string };
  backgroundImage?: string;
  fullHeight?: boolean;
  overlay?: 'dark' | 'gradient' | 'none';
}

export function Hero({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  backgroundImage,
  fullHeight = false,
  overlay = 'gradient',
}: HeroProps) {
  const hasImage = Boolean(backgroundImage);

  return (
    <section
      className={clsx(
        'relative overflow-hidden rounded-panel text-text-inverse shadow-night',
        fullHeight ? 'min-h-[85vh] flex items-center' : 'px-8 py-14',
        !hasImage && 'bg-night-horizon'
      )}
    >
      {/* Background Image */}
      {hasImage && backgroundImage && (
        <div className="absolute inset-0">
          <ImageWithFallback
            src={backgroundImage}
            alt=""
            fill
            className="h-full w-full object-cover"
            priority
          />
          {/* Overlay */}
          {overlay === 'dark' && (
            <div className="absolute inset-0 bg-surface-night/70" />
          )}
          {overlay === 'gradient' && (
            <div className="absolute inset-0 bg-gradient-to-t from-surface-night via-surface-night/60 to-surface-night/30" />
          )}
        </div>
      )}

      {/* Content */}
      <div className={clsx('relative z-10', fullHeight && 'px-8 py-14')}>
        <p className="mb-4 text-sm uppercase tracking-[0.28em] text-nightSafe-haze">{eyebrow}</p>
        <h1 className="max-w-3xl font-display text-4xl leading-tight md:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-nightSafe-glow/85">{body}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={primaryAction.href}
            className="rounded-pill bg-surface-warm px-5 py-3 font-semibold text-text-strong no-underline transition-transform hover:scale-105"
          >
            {primaryAction.label}
          </Link>
          <Link
            href={secondaryAction.href}
            className="rounded-pill border border-nightSafe-glow/30 px-5 py-3 font-semibold text-text-inverse no-underline transition-colors hover:bg-nightSafe-glow/10"
          >
            {secondaryAction.label}
          </Link>
        </div>
      </div>

      {/* Decorative star twinkle animation for dark sky theme */}
      {!hasImage && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-4 right-8 h-1 w-1 animate-pulse rounded-full bg-nightSafe-glow/60" />
          <div className="absolute top-12 right-24 h-0.5 w-0.5 animate-pulse rounded-full bg-nightSafe-glow/40 delay-300" />
          <div className="absolute top-8 left-1/3 h-1 w-1 animate-pulse rounded-full bg-nightSafe-glow/50 delay-700" />
          <div className="absolute top-16 left-1/4 h-0.5 w-0.5 animate-pulse rounded-full bg-nightSafe-glow/30 delay-500" />
        </div>
      )}
    </section>
  );
}
