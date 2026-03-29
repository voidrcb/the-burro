import { readdir } from 'fs/promises';
import path from 'path';
import { createHash, randomUUID } from 'crypto';

import { z } from 'zod';

import { getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';

export const guestEventSchema = z.object({
  id: z.string(),
  guestEmail: z.string().email(),
  eventType: z.enum(['booking', 'registration', 'purchase', 'follow-up-sent', 'note']),
  eventRef: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  occurredAt: z.string(),
  tags: z.array(z.string()).optional(),
});

export type GuestEvent = z.infer<typeof guestEventSchema>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function buildStableId(input: Omit<GuestEvent, 'id'>): string {
  const key = `${input.eventType}:${input.eventRef ?? 'none'}:${normalizeEmail(input.guestEmail)}`;
  const digest = createHash('sha1').update(key).digest('hex').slice(0, 12);
  return `guest_event_${digest}`;
}

function eventPath(id: string): string {
  return getDataPath('guest-events', `${id}.json`);
}

export async function appendGuestEvent(payload: Omit<GuestEvent, 'id'> & { id?: string }): Promise<GuestEvent> {
  const event = guestEventSchema.parse({
    ...payload,
    id: payload.id ?? buildStableId(payload),
    guestEmail: normalizeEmail(payload.guestEmail),
  });
  const existing = await readJsonFile<GuestEvent | null>(eventPath(event.id), null);
  if (!existing) {
    await writeJsonFile(eventPath(event.id), event);
  }
  return event;
}

export async function createGuestNote(payload: {
  guestEmail: string;
  note: string;
  occurredAt?: string;
  tags?: string[];
  eventRef?: string;
}): Promise<GuestEvent> {
  return appendGuestEvent({
    id: `guest_event_${randomUUID()}`,
    guestEmail: payload.guestEmail,
    eventType: 'note',
    eventRef: payload.eventRef,
    occurredAt: payload.occurredAt ?? new Date().toISOString(),
    tags: payload.tags,
    metadata: { note: payload.note },
  });
}

export async function listGuestEvents(): Promise<GuestEvent[]> {
  const directory = getDataPath('guest-events');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const records: GuestEvent[] = [];

  for (const fileName of entries.filter((entry) => entry.endsWith('.json'))) {
    const payload = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = guestEventSchema.safeParse(payload);
    if (parsed.success) {
      records.push(parsed.data);
    }
  }

  return records.sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
}
