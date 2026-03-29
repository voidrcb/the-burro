'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/assistant';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Redirect to the return URL
      router.push(returnTo);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {error && (
        <div className="rounded-[12px] border border-status-error/20 bg-status-error/10 p-3 text-sm text-status-error">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-semibold text-text-strong">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="mt-2 w-full rounded-[12px] border border-text-strong/15 bg-surface-base px-4 py-3 text-sm text-text-strong focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
          placeholder="Enter your username"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-text-strong">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-[12px] border border-text-strong/15 bg-surface-base px-4 py-3 text-sm text-text-strong focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
