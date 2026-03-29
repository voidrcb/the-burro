'use client';

import Link from 'next/link';
import { startTransition, useState } from 'react';

import type { BurroFollowUp } from '@/lib/burro/followups';
import type { BookingRecord } from '@/lib/content/stay-types';
import type { GuestEvent } from '@/lib/crm/events';
import type { WorkshopRegistration } from '@/lib/workshop/types';

import { BookingPanel } from './BookingPanel';
import { WorkshopPanel } from './WorkshopPanel';

type AssistantMode = 'property' | 'artisan';

type FeasibilityCard = {
  id: string;
  title: string;
  value: string;
  note: string;
};

type AssistantResponse = {
  status: 'grounded' | 'unknown' | 'stub';
  message: string;
  citations: Array<{
    sourceId: string;
    label: string;
    path: string;
    trustLevel: string;
  }>;
  advisories: string[];
  contextSummary: string[];
  snapshot: {
    cards: FeasibilityCard[];
  };
};

const samplePrompts: Record<AssistantMode, string[]> = {
  property: [
    'What is still blocking the land from being cleanly sold or improved?',
    'Which next actions matter most for the pilot unit decision?',
    'How should we think about the lowest-capex lodging option?'
  ],
  artisan: [
    'Should Susan prioritize workshops or fragile product sales first?',
    'How should dark-sky photography fit into the artisan plan?',
    'What is the safest early strategy for tiles and pottery?'
  ],
};

const defaultCards: FeasibilityCard[] = [
  {
    id: 'scaffold-mode',
    title: 'Scaffold mode',
    value: 'R1_ASSISTED',
    note: 'Live inference and provider-backed automation are still deferred.',
  },
];

export function BurroAssistantShell({
  initialCards,
  recentBookings,
  recentWorkshopRegistrations,
  bookingFollowUps,
  workshopFollowUps,
  guestEventsByEmail,
}: {
  initialCards: FeasibilityCard[];
  recentBookings: BookingRecord[];
  recentWorkshopRegistrations: WorkshopRegistration[];
  bookingFollowUps: Record<string, BurroFollowUp | undefined>;
  workshopFollowUps: Record<string, BurroFollowUp | undefined>;
  guestEventsByEmail: Record<string, GuestEvent[]>;
}) {
  const [mode, setMode] = useState<AssistantMode>('property');
  const [query, setQuery] = useState(samplePrompts.property[0]);
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [isPending, setIsPending] = useState(false);
  const cards = response?.snapshot.cards ?? initialCards ?? defaultCards;

  function submit(nextQuery?: string) {
    const outgoingQuery = (nextQuery ?? query).trim();
    if (!outgoingQuery) {
      return;
    }

    setIsPending(true);
    startTransition(async () => {
      const result = await fetch('/api/assistant/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode, query: outgoingQuery }),
      });

      const body = (await result.json()) as AssistantResponse | { error: string };
      if ('error' in body) {
        setResponse({
          status: 'unknown',
          message: body.error,
          citations: [],
          advisories: ['Request validation failed.'],
          contextSummary: [],
          snapshot: { cards },
        });
      } else {
        setResponse(body);
      }
      setIsPending(false);
    });
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[28px] border border-text-strong/10 bg-white/85 p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-earth">Sprint 1.4 internal Burro</p>
            <h1 className="mt-2 font-display text-4xl text-text-strong">Assistant shell with retrieval-backed scaffolding</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">
              This route is intentionally internal. It assembles grounded context and now exposes recent booking and workshop records, attached follow-up drafts, and thin guest-event history while provider-backed automation remains deferred.
            </p>
          </div>
          <div className="rounded-full border border-accent-earth/25 bg-accent-secondary/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-earth">
            Stub mode until credentials exist
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/assistant/equipment" className="rounded-pill border border-text-strong/15 bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong no-underline">
            Open equipment scheduler
          </Link>
          <Link href="/assistant/itinerary" className="rounded-pill border border-text-strong/15 bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong no-underline">
            Open itinerary composer
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {(['property', 'artisan'] as AssistantMode[]).map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => {
                setMode(candidate);
                setQuery(samplePrompts[candidate][0]);
                setResponse(null);
              }}
              className={candidate === mode ? 'rounded-full bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse' : 'rounded-full bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong'}
            >
              {candidate === 'property' ? 'Property Planner' : 'Artisan Assistant'}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[24px] border border-text-strong/10 bg-surface-base/75 p-5">
          <label htmlFor="burro-query" className="text-sm font-semibold text-text-strong">
            Ask Burro
          </label>
          <textarea
            id="burro-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={5}
            className="mt-3 w-full rounded-[20px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong outline-none transition focus:border-accent-primary"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => submit()}
              disabled={isPending}
              className="rounded-full bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse disabled:opacity-60"
            >
              {isPending ? 'Working...' : 'Run grounded response'}
            </button>
            <div className="flex flex-wrap gap-2">
              {samplePrompts[mode].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setQuery(prompt);
                    submit(prompt);
                  }}
                  className="rounded-full border border-text-strong/10 px-3 py-2 text-xs font-medium text-text-muted"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-text-strong/10 bg-[#faf7ef] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-text-strong">Response</h2>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">
              {response?.status ?? 'ready'}
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-text-muted">
            {response?.message ?? 'Burro is ready to assemble grounded context for an internal planning question.'}
          </p>
          {response?.advisories?.length ? (
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              {response.advisories.map((advisory) => (
                <li key={advisory}>- {advisory}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="space-y-6">
        <BookingPanel bookings={recentBookings} followUpsByContext={bookingFollowUps} guestEventsByEmail={guestEventsByEmail} />
        <WorkshopPanel registrations={recentWorkshopRegistrations} followUpsByContext={workshopFollowUps} guestEventsByEmail={guestEventsByEmail} />

        <div className="rounded-[28px] border border-text-strong/10 bg-white/85 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-text-strong">Feasibility snapshot</h2>
          <div className="mt-5 grid gap-4">
            {cards.map((card) => (
              <article key={card.id} className="rounded-[22px] border border-text-strong/10 bg-surface-base/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{card.title}</p>
                <p className="mt-2 font-display text-2xl text-text-strong">{card.value}</p>
                <p className="mt-2 text-sm leading-6 text-text-muted">{card.note}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-text-strong/10 bg-white/85 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-text-strong">Grounding sources</h2>
          <div className="mt-5 space-y-4">
            {(response?.citations ?? []).length ? (
              response?.citations.map((citation) => (
                <article key={`${citation.sourceId}-${citation.path}`} className="rounded-[20px] border border-text-strong/10 bg-surface-base/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{citation.sourceId}</p>
                  <p className="mt-2 text-sm font-semibold text-text-strong">{citation.label}</p>
                  <p className="mt-1 text-xs text-text-muted">{citation.path}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-muted">{citation.trustLevel}</p>
                </article>
              ))
            ) : (
              <p className="text-sm leading-7 text-text-muted">Run a question to see which approved sources were used.</p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-text-strong/10 bg-white/85 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-text-strong">Context assembly</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-text-muted">
            {(response?.contextSummary ?? []).length ? (
              response?.contextSummary.map((item) => <p key={item}>{item}</p>)
            ) : (
              <p>Burro is configured to read Sprint 0.1 trackers plus approved research encyclopedias, then return a cite-or-unknown answer.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
