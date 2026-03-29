'use client';

import { useState } from 'react';

export function SignupForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'success' | 'duplicate' | 'error'>('idle');
  const [message, setMessage] = useState('Quiet updates when there is something worth sharing.');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('saving');

    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const body = (await response.json()) as { status?: 'subscribed' | 'duplicate'; message?: string; error?: string };

    if (!response.ok || body.error) {
      setState('error');
      setMessage(body.error ?? 'Subscription could not be saved.');
      return;
    }

    setState(body.status === 'duplicate' ? 'duplicate' : 'success');
    setMessage(body.message ?? 'Saved.');
    if (body.status === 'subscribed') {
      setEmail('');
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? 'space-y-3' : 'space-y-4'}>
      <label htmlFor="newsletter-email" className="text-sm font-semibold text-text-strong">
        Join the Burro field notes
      </label>
      <div className={compact ? 'flex flex-col gap-3 sm:flex-row' : 'flex flex-col gap-3'}>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-pill border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong outline-none transition focus:border-accent-primary"
          required
        />
        <button
          type="submit"
          disabled={state === 'saving'}
          className="rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse disabled:opacity-60"
        >
          {state === 'saving' ? 'Saving...' : 'Stay in the loop'}
        </button>
      </div>
      <p className="text-sm leading-6 text-text-muted">{message}</p>
    </form>
  );
}
