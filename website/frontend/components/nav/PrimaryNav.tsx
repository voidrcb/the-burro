'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const routes = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/blog', 'Journal'],
  ['/activism', 'Activism'],
  ['/stay', 'Stay'],
  ['/experiences', 'Experiences'],
  ['/workshops', 'Workshops'],
  ['/steel-buildings', 'Steel Buildings'],
  ['/shop', 'Shop'],
  ['/contact', 'Contact'],
] as const;

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 text-sm">
      {routes.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              'rounded-pill px-3 py-2 no-underline transition-colors',
              active ? 'bg-text-strong text-text-inverse' : 'bg-surface-elevated text-text-strong hover:bg-accent-secondary/20',
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
