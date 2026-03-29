import { useState } from 'react';

import type { BurroFollowUp } from '@/lib/burro/followups';

export function FollowUpCard({
  draft,
  onApproved,
}: {
  draft: BurroFollowUp;
  onApproved: (draft: BurroFollowUp) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleApprove() {
    setBusy(true);
    setMessage('Capturing scaffold-mode approval...');

    try {
      const response = await fetch('/api/assistant/followups/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId: draft.id }),
      });
      const payload = (await response.json()) as { draft?: BurroFollowUp; error?: string };
      if (!response.ok || !payload.draft) {
        throw new Error(payload.error ?? 'Unable to approve follow-up draft.');
      }

      onApproved(payload.draft);
      setMessage('Approved and captured locally.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to approve follow-up draft.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 rounded-[18px] border border-text-strong/10 bg-white/85 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-earth">{draft.type}</p>
        <span className="rounded-full bg-surface-base/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
          {draft.status}
        </span>
      </div>
      <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-7 text-text-muted">{draft.draftContent}</pre>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy || draft.status !== 'draft'}
          onClick={() => void handleApprove()}
          className="rounded-pill bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse disabled:opacity-50"
        >
          {busy ? 'Saving...' : draft.status === 'draft' ? 'Approve draft' : 'Approved'}
        </button>
      </div>
      {message ? <p className="mt-3 text-xs leading-6 text-text-muted">{message}</p> : null}
    </div>
  );
}
