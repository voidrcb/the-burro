'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    void fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || 'direct' }),
    });
  }, [pathname]);

  return null;
}
