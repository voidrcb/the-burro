import { randomUUID } from 'crypto';
import { readFile, readdir } from 'fs/promises';
import path from 'path';

import { z } from 'zod';

import type { BookingRecord } from '@/lib/content/stay-types';
import { normalizeGuestEmail, recordGuestEvent } from '@/lib/crm/events';
import { getDataPath, getCmsPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';
import type { WorkshopRegistration } from '@/lib/workshop/types';

export const burroFollowUpSchema = z.object({
  id: z.string(),
  type: z.enum(['post-stay', 'workshop-reminder', 'drop-announcement', 'activism-script']),
  templateRef: z.string(),
  contextRef: z.object({
    type: z.enum(['booking', 'registration']),
    id: z.string(),
  }),
  guestEmail: z.string().email(),
  draftContent: z.string(),
  status: z.enum(['draft', 'approved', 'sent', 'cancelled']),
  generatedAt: z.string(),
  reviewedAt: z.string().optional(),
  sentAt: z.string().optional(),
});

export type BurroFollowUp = z.infer<typeof burroFollowUpSchema>;

function followUpPath(id: string): string {
  return getDataPath('burro-followups', `${id}.json`);
}

function approvalCapturePath(id: string): string {
  return getDataPath('assistant-logs', 'followup-captures', `${id}.json`);
}

async function readTemplate(templateRef: string): Promise<string> {
  const target = getCmsPath('burro', 'templates', `${templateRef}.txt`);
  return readFile(target, 'utf8');
}

function fillTemplate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((output, [key, value]) => output.replaceAll(`{{${key}}}`, value), template);
}

export async function listBurroFollowUps(): Promise<BurroFollowUp[]> {
  const directory = getDataPath('burro-followups');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const followUps: BurroFollowUp[] = [];

  for (const fileName of files) {
    const payload = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = burroFollowUpSchema.safeParse(payload);
    if (parsed.success) {
      followUps.push(parsed.data);
    }
  }

  return followUps.sort((left, right) => right.generatedAt.localeCompare(left.generatedAt));
}

export async function saveBurroFollowUp(followUp: BurroFollowUp): Promise<BurroFollowUp> {
  const parsed = burroFollowUpSchema.parse({
    ...followUp,
    guestEmail: normalizeGuestEmail(followUp.guestEmail),
  });
  await writeJsonFile(followUpPath(parsed.id), parsed);
  return parsed;
}

export async function getBurroFollowUpById(id: string): Promise<BurroFollowUp | null> {
  const payload = await readJsonFile<unknown>(followUpPath(id), null);
  const parsed = burroFollowUpSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

async function ensureFollowUpDraft(payload: {
  id: string;
  type: BurroFollowUp['type'];
  templateRef: string;
  contextRef: BurroFollowUp['contextRef'];
  guestEmail: string;
  values: Record<string, string>;
}) {
  const existing = await getBurroFollowUpById(payload.id);
  if (existing) {
    return existing;
  }

  const template = await readTemplate(payload.templateRef);
  const followUp = burroFollowUpSchema.parse({
    id: payload.id,
    type: payload.type,
    templateRef: payload.templateRef,
    contextRef: payload.contextRef,
    guestEmail: normalizeGuestEmail(payload.guestEmail),
    draftContent: fillTemplate(template, payload.values),
    status: 'draft',
    generatedAt: new Date().toISOString(),
  });

  await writeJsonFile(followUpPath(followUp.id), followUp);
  return followUp;
}

export async function ensureBookingFollowUpDraft(booking: BookingRecord): Promise<BurroFollowUp> {
  return ensureFollowUpDraft({
    id: `followup_post_stay_${booking.id}`,
    type: 'post-stay',
    templateRef: 'post-stay',
    contextRef: { type: 'booking', id: booking.id },
    guestEmail: booking.guestEmail,
    values: {
      guestName: booking.guestName,
      unitId: booking.unitId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    },
  });
}

export async function ensureWorkshopFollowUpDraft(registration: WorkshopRegistration): Promise<BurroFollowUp> {
  return ensureFollowUpDraft({
    id: `followup_workshop_${registration.id}`,
    type: 'workshop-reminder',
    templateRef: 'workshop-reminder',
    contextRef: { type: 'registration', id: registration.id },
    guestEmail: registration.guestEmail,
    values: {
      guestName: registration.guestName,
      workshopSlug: registration.workshopSlug,
      sessionId: registration.sessionId,
    },
  });
}

export async function listFollowUpsByContextIds(contextIds: string[]): Promise<Record<string, BurroFollowUp | undefined>> {
  const followUps = await listBurroFollowUps();
  return contextIds.reduce<Record<string, BurroFollowUp | undefined>>((accumulator, contextId) => {
    accumulator[contextId] = followUps.find((followUp) => followUp.contextRef.id === contextId);
    return accumulator;
  }, {});
}

export async function approveBurroFollowUp(id: string): Promise<BurroFollowUp> {
  const followUp = await getBurroFollowUpById(id);
  if (!followUp) {
    throw new Error('Follow-up draft not found.');
  }

  const approved = await saveBurroFollowUp({
    ...followUp,
    status: 'approved',
    reviewedAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
  });

  await writeJsonFile(approvalCapturePath(approved.id), {
    id: `followup_capture_${randomUUID()}`,
    draftId: approved.id,
    status: approved.status,
    capturedAt: approved.sentAt,
    contextRef: approved.contextRef,
    guestEmail: approved.guestEmail,
  });

  await recordGuestEvent({
    guestEmail: approved.guestEmail,
    eventType: 'follow-up-sent',
    eventRef: approved.id,
    metadata: {
      scaffoldMode: true,
      contextType: approved.contextRef.type,
    },
    tags: ['follow-up'],
  });

  return approved;
}
