'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useDeferredValue, useState } from 'react';

import type { ExperienceProduct } from '@/lib/experience/types';
import type { GroupBooking, ItineraryDraft, PackagePricingRule } from '@/lib/itinerary/types';
import type { LodgingUnit } from '@/lib/content/stay-types';
import type { WorkshopProgram } from '@/lib/workshop/content-types';

export function ItineraryWorkbench({
  units,
  workshops,
  experiences,
  drafts,
  groupBookings,
  pricingRules,
}: {
  units: LodgingUnit[];
  workshops: WorkshopProgram[];
  experiences: ExperienceProduct[];
  drafts: ItineraryDraft[];
  groupBookings: GroupBooking[];
  pricingRules: PackagePricingRule[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [prompt, setPrompt] = useState('Build a stargazing weekend with a quiet stay and one guided add-on.');
  const deferredPrompt = useDeferredValue(prompt);

  async function submitJson(url: string, payload: unknown) {
    setIsPending(true);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { error?: string };
    setMessage(body.error ?? 'Saved.');
    setIsPending(false);
    if (response.ok) {
      startTransition(() => router.refresh());
    }
  }

  return (
    <section className="space-y-6">
      <section className="rounded-panel border border-text-strong/10 bg-white/90 p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Sprint 2.1 itinerary composer</p>
            <h1 className="mt-3 font-display text-4xl text-text-strong">Internal package drafting, review, and retreat setup</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-text-body">
              This surface stays internal-first. Burro can draft a package, operators can review it, and group metadata stays attached to the same itinerary instead of creating a separate retreat domain.
            </p>
          </div>
          <Link href="/assistant" className="rounded-pill border border-text-strong/15 px-4 py-2 text-sm font-semibold text-text-strong no-underline">
            Back to assistant shell
          </Link>
        </div>
        {message ? <p className="mt-4 text-sm text-text-muted">{message}</p> : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <form
            className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void submitJson('/api/assistant/itinerary/drafts', {
                title: String(form.get('title') ?? ''),
                guestName: String(form.get('guestName') ?? ''),
                guestEmail: String(form.get('guestEmail') ?? ''),
                startDate: String(form.get('startDate') ?? ''),
                endDate: String(form.get('endDate') ?? ''),
                participantCount: Number(form.get('participantCount') ?? 1),
                lodgingUnitId: String(form.get('lodgingUnitId') ?? ''),
                experienceId: String(form.get('experienceId') ?? ''),
                workshopRef: String(form.get('workshopRef') ?? ''),
                adjustmentType: form.get('adjustmentType') ? String(form.get('adjustmentType')) : undefined,
                adjustmentAmount: form.get('adjustmentAmount') ? Number(form.get('adjustmentAmount')) : undefined,
                adjustmentReason: String(form.get('adjustmentReason') ?? ''),
                notes: String(form.get('notes') ?? ''),
              });
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Manual composer</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-text-strong">
                Title
                <input name="title" required className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" defaultValue="Field-built itinerary draft" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Guest email
                <input name="guestEmail" type="email" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Guest name
                <input name="guestName" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Participants
                <input name="participantCount" type="number" min={1} defaultValue={2} className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Start date
                <input name="startDate" type="date" required className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                End date
                <input name="endDate" type="date" required className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Lodging anchor
                <select name="lodgingUnitId" required className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3">
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Experience
                <select name="experienceId" required className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3">
                  {experiences.map((experience) => (
                    <option key={experience.id} value={experience.id}>
                      {experience.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Workshop add-on
                <select name="workshopRef" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3">
                  <option value="">No workshop</option>
                  {workshops.flatMap((workshop) =>
                    workshop.schedule.map((session) => (
                      <option key={`${workshop.slug}-${session.id}`} value={`${workshop.slug}::${session.id}`}>
                        {workshop.title} ({session.date})
                      </option>
                    )),
                  )}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Adjustment type
                <select name="adjustmentType" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3">
                  <option value="">None</option>
                  <option value="discount">Discount</option>
                  <option value="surcharge">Surcharge</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Adjustment amount
                <input name="adjustmentAmount" type="number" min={0} step="0.01" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm text-text-strong">
              Notes
              <textarea name="notes" rows={3} className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
            </label>
            <button type="submit" disabled={isPending} className="mt-5 rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse disabled:opacity-60">
              {isPending ? 'Saving...' : 'Create draft and holds'}
            </button>
          </form>

          <form
            className="rounded-panel border border-text-strong/10 bg-[#faf7ef] p-6 shadow-soft"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void submitJson('/api/assistant/itinerary/generate', {
                prompt: String(form.get('prompt') ?? ''),
                title: String(form.get('title') ?? ''),
                guestName: String(form.get('guestName') ?? ''),
                guestEmail: String(form.get('guestEmail') ?? ''),
                startDate: String(form.get('startDate') ?? ''),
                endDate: String(form.get('endDate') ?? ''),
                participantCount: Number(form.get('participantCount') ?? 2),
              });
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Burro draft assembly</p>
            <h2 className="mt-2 font-display text-3xl text-text-strong">Prompt-guided package suggestion</h2>
            <p className="mt-3 text-sm leading-7 text-text-muted">Burro drafts from current CMS inventory only, then sends the result straight into the same review queue.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-text-strong md:col-span-2">
                Prompt
                <textarea name="prompt" rows={4} value={prompt} onChange={(event) => setPrompt(event.target.value)} className="rounded-[18px] border border-text-strong/10 bg-white px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Draft title
                <input name="title" className="rounded-[18px] border border-text-strong/10 bg-white px-4 py-3" defaultValue="Burro suggested itinerary" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Participants
                <input name="participantCount" type="number" min={1} defaultValue={4} className="rounded-[18px] border border-text-strong/10 bg-white px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Start date
                <input name="startDate" type="date" required className="rounded-[18px] border border-text-strong/10 bg-white px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                End date
                <input name="endDate" type="date" required className="rounded-[18px] border border-text-strong/10 bg-white px-4 py-3" />
              </label>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-text-muted">Deferred prompt preview: {deferredPrompt}</p>
            <button type="submit" disabled={isPending} className="mt-5 rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse disabled:opacity-60">
              {isPending ? 'Generating...' : 'Generate Burro draft'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <section className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Pricing rules in play</p>
            <div className="mt-4 space-y-3">
              {pricingRules.map((rule) => (
                <article key={rule.id} className="rounded-[18px] border border-text-strong/10 bg-surface-base/80 p-4">
                  <p className="text-sm font-semibold text-text-strong">{rule.name}</p>
                  <p className="mt-1 text-sm text-text-muted">{rule.description ?? `${rule.triggerType} => ${rule.adjustmentType}`}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Group booking setup</p>
            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                const unitSelect = event.currentTarget.elements.namedItem('unitIds') as HTMLSelectElement | null;
                const selectedOptions = Array.from(unitSelect?.selectedOptions ?? []).map((option) => option.value);
                void submitJson('/api/assistant/itinerary/groups', {
                  itineraryRef: String(form.get('itineraryRef') ?? ''),
                  groupName: String(form.get('groupName') ?? ''),
                  facilitatorName: String(form.get('facilitatorName') ?? ''),
                  facilitatorEmail: String(form.get('facilitatorEmail') ?? ''),
                  facilitatorPhone: String(form.get('facilitatorPhone') ?? ''),
                  participantCount: Number(form.get('participantCount') ?? 1),
                  depositRequired: form.get('depositRequired') === 'on',
                  depositAmount: form.get('depositAmount') ? Number(form.get('depositAmount')) : undefined,
                  depositDueBy: String(form.get('depositDueBy') ?? ''),
                  unitIds: selectedOptions,
                  notes: String(form.get('notes') ?? ''),
                });
              }}
            >
              <label className="grid gap-2 text-sm text-text-strong">
                Approved itinerary
                <select name="itineraryRef" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3">
                  {drafts.filter((draft) => draft.status === 'approved').map((draft) => (
                    <option key={draft.id} value={draft.id}>
                      {draft.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Group name
                <input name="groupName" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Facilitator
                <input name="facilitatorName" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Facilitator email
                <input name="facilitatorEmail" type="email" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Facilitator phone
                <input name="facilitatorPhone" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Participants
                <input name="participantCount" type="number" min={1} defaultValue={6} className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="flex items-center gap-3 text-sm text-text-strong">
                <input name="depositRequired" type="checkbox" />
                Deposit required
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Deposit amount
                <input name="depositAmount" type="number" min={0} step="0.01" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Deposit due by
                <input name="depositDueBy" type="date" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Unit block holds
                <select name="unitIds" multiple className="min-h-28 rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3">
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-text-strong">
                Facilitator notes
                <textarea name="notes" rows={3} className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3" />
              </label>
              <button type="submit" disabled={isPending || drafts.every((draft) => draft.status !== 'approved')} className="rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse disabled:opacity-60">
                Create group booking
              </button>
            </form>
            <div className="mt-5 space-y-3">
              {groupBookings.slice(0, 3).map((booking) => (
                <article key={booking.id} className="rounded-[18px] border border-text-strong/10 bg-surface-base/80 p-4">
                  <p className="text-sm font-semibold text-text-strong">{booking.groupName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-text-muted">{booking.status} • {booking.participantCount} guests</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Review queue</p>
        <div className="mt-4 space-y-4">
          {drafts.length ? (
            drafts.map((draft) => (
              <article key={draft.id} className="rounded-[22px] border border-text-strong/10 bg-surface-base/80 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text-strong">{draft.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-text-muted">{draft.source} • {draft.status} • ${draft.totalPrice.toFixed(2)}</p>
                  </div>
                  <Link href={`/assistant/itinerary/${draft.shareSlug}`} className="text-sm font-semibold text-accent-primary no-underline">
                    Printable summary
                  </Link>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-text-muted">
                  {draft.components.map((component) => (
                    <p key={`${draft.id}-${component.refId}`}>{component.type}: {component.title} ({component.dates.join(', ')})</p>
                  ))}
                </div>
                {draft.validationNotes.length ? (
                  <div className="mt-4 rounded-[18px] border border-text-strong/10 bg-white/80 p-4">
                    {draft.validationNotes.map((note) => (
                      <p key={note} className="text-sm text-text-muted">{note}</p>
                    ))}
                  </div>
                ) : null}
                {draft.status === 'pending_review' ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button type="button" disabled={isPending} onClick={() => void submitJson('/api/assistant/itinerary/review', { draftId: draft.id, action: 'approve' })} className="rounded-pill bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse disabled:opacity-60">
                      Approve
                    </button>
                    <button type="button" disabled={isPending} onClick={() => void submitJson('/api/assistant/itinerary/review', { draftId: draft.id, action: 'decline' })} className="rounded-pill border border-text-strong/15 px-4 py-2 text-sm font-semibold text-text-strong disabled:opacity-60">
                      Decline
                    </button>
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <p className="text-sm leading-7 text-text-muted">No itinerary drafts yet. Manual and Burro-generated drafts will appear here for review.</p>
          )}
        </div>
      </section>
    </section>
  );
}
