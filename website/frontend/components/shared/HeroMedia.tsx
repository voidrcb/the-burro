import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface HeroMediaProps {
  label: string;
  caption: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  linkLabel?: string;
}

export function HeroMedia({ label, caption, imageSrc, imageAlt, href, linkLabel }: HeroMediaProps) {
  return (
    <div className="rounded-[28px] border border-nightSafe-glow/20 bg-gradient-to-br from-nightSafe-glow/20 via-white/10 to-transparent p-5 text-left">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-nightSafe-haze">{label}</p>
      <ImageWithFallback
        src={imageSrc ?? ''}
        alt={imageAlt ?? label}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="mt-4 h-48 rounded-[22px] shadow-night"
        priority
      />
      <p className="mt-4 text-sm leading-6 text-text-body">{caption}</p>
      {href && (
        <Link
          href={href}
          className="mt-4 inline-block text-sm font-semibold text-accent-primary hover:text-accent-earth transition-colors"
        >
          {linkLabel ?? 'View collection'}
        </Link>
      )}
    </div>
  );
}
