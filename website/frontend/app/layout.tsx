import type { Metadata } from 'next';
import './globals.css';

import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { SiteShell } from '@/components/SiteShell';

export const metadata: Metadata = {
  title: 'Big Bend Burro',
  description: 'A stewardship-first Big Bend project for stays, workshops, dark skies, and careful growth.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PageViewTracker />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
