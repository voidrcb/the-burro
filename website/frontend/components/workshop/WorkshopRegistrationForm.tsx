'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { IntakeSchemaDefinition, WorkshopProgram } from '@/lib/workshop/content-types';
import { getSessionLabel, isSessionRegisterable } from '@/lib/workshop/helpers';

import { ComingSoonBadge } from '@/components/ui/ComingSoonBadge';
import { IntakeForm } from './IntakeForm';
import { RegistrationSubmit } from './RegistrationSubmit';
import { WorkshopWaiver } from './WorkshopWaiver';

export function WorkshopRegistrationForm({
  program,
  intakeSchema,
  sessionId,
}: {
  program: WorkshopProgram;
  intakeSchema: IntakeSchemaDefinition;
  sessionId: string;
}) {
  const router = useRouter();
  const session = program.schedule.find((entry) => entry.id === sessionId) ?? program.schedule[0];
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [intakeResponses, setIntakeResponses] = useState<Record<string, string | number | boolean>>({});
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sessionLabel = session ? getSessionLabel(session) : 'Session unavailable';
  const registerable = session ? isSessionRegisterable(session) : false;

  const requiredAnswered = useMemo(() => {
    return intakeSchema.questions.every((question) => {
      if (!question.required) {
        return true;
      }
      const value = intakeResponses[question.questionId];
      return value !== undefined && value !== '';
    });
  }, [intakeResponses, intakeSchema.questions]);

  const canSubmit = Boolean(registerable && guestName && guestEmail && waiverAccepted && requiredAnswered);

  async function handleSubmit() {
    if (!session || !canSubmit) {
      setMessage('Complete all required fields before registering.');
      return;
    }

    setIsSubmitting(true);
    setMessage('Saving waiver and confirming registration...');

    try {
      const waiverResponse = await fetch('/api/workshop/waiver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshopSlug: program.slug,
          sessionId: session.id,
          guestName,
          guestEmail,
          policyVersion: 'workshop-waiver-v1',
        }),
      });
      const waiverBody = (await waiverResponse.json()) as { waiverId?: string; error?: string };
      if (!waiverResponse.ok || !waiverBody.waiverId) {
        throw new Error(waiverBody.error ?? 'Unable to store workshop waiver.');
      }

      const registrationResponse = await fetch('/api/workshop/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshopSlug: program.slug,
          sessionId: session.id,
          guestName,
          guestEmail,
          guestPhone,
          intakeSchemaRef: intakeSchema.schemaRef,
          intakeSchemaVersion: intakeSchema.schemaVersion,
          intakeResponses,
          waiverId: waiverBody.waiverId,
        }),
      });
      const registrationBody = (await registrationResponse.json()) as { registrationId?: string; error?: string };
      if (!registrationResponse.ok || !registrationBody.registrationId) {
        throw new Error(registrationBody.error ?? 'Unable to confirm workshop registration.');
      }

      router.push(`/workshops/${program.slug}/register/confirmation?registrationId=${registrationBody.registrationId}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unexpected workshop registration error.');
      setIsSubmitting(false);
    }
  }

  if (!session) {
    return <p className="text-sm text-text-muted">No session available for registration.</p>;
  }

  if (!registerable) {
    return <p className="text-sm font-semibold text-accent-earth">{sessionLabel}</p>;
  }

  return (
    <div className="space-y-6 rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
      <ComingSoonBadge variant="banner" message="Online Payment Coming Soon" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Workshop registration</p>
        <h2 className="mt-2 font-display text-3xl text-text-strong">{program.title}</h2>
        <p className="mt-3 text-sm leading-7 text-text-muted">Session {session.date} • {session.startTime}-{session.endTime}</p>
        <p className="mt-2 text-sm font-semibold text-accent-earth">
          Register your interest below. We&apos;ll follow up to confirm your spot and arrange payment.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-text-strong">
          Guest name
          <input value={guestName} onChange={(event) => setGuestName(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
        </label>
        <label className="text-sm font-semibold text-text-strong">
          Email
          <input type="email" value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
        </label>
        <label className="md:col-span-2 text-sm font-semibold text-text-strong">
          Phone
          <input value={guestPhone} onChange={(event) => setGuestPhone(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
        </label>
      </div>

      <IntakeForm schema={intakeSchema} value={intakeResponses} disabled={isSubmitting} onChange={setIntakeResponses} />
      <WorkshopWaiver checked={waiverAccepted} disabled={isSubmitting} onChange={setWaiverAccepted} />
      {message ? <p className="text-sm text-text-muted">{message}</p> : null}
      <RegistrationSubmit disabled={!canSubmit} isSubmitting={isSubmitting} sessionLabel={sessionLabel} onSubmit={() => void handleSubmit()} />
    </div>
  );
}
