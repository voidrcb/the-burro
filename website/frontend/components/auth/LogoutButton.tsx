'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-pill border border-text-strong/15 bg-surface-elevated px-3 py-2 text-xs font-semibold text-text-strong transition-colors hover:bg-surface-base"
    >
      Sign out
    </button>
  );
}
