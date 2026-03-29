'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

const FALLBACK_GRADIENT =
  'radial-gradient(circle at top, rgba(238,211,153,0.35), transparent 38%), linear-gradient(160deg, rgba(49,103,174,0.9), rgba(27,34,16,0.92))';

export function ImageWithFallback({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className = '',
  priority = false,
}: ImageWithFallbackProps) {
  // Check for empty/missing src BEFORE any hooks to ensure consistent render
  const hasValidSrc = Boolean(src && src.trim());

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !hasValidSrc) {
    return (
      <div
        className={className}
        style={{ background: FALLBACK_GRADIENT }}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading gradient shown while image loads */}
      {isLoading && (
        <div
          className="absolute inset-0"
          style={{ background: FALLBACK_GRADIENT }}
        />
      )}
      <Image
        src={hasValidSrc ? src : '/placeholder.png'}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
