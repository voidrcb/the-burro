import { randomUUID } from 'crypto';
import { readdir } from 'fs/promises';
import path from 'path';

import { z } from 'zod';

import { getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';

export const guestEventSchema = z.object({
  id: z.string(),
  guestEmail: z.string().email(),
  eventType: z.enum(['booking', 'registration', 'purchase', 'follow-up-sent', 'note', 'itinerary', 'group-booking']),
  eventRef: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  occurredAt: z.string(),
  tags: z.array(z.string()).optional(),
});

export type GuestEvent = z.infer<typeof guestEventSchema>;

function eventPath(id: string): string {
  return getDataPath('guest-events', `${id}.json`);
}

export function normalizeGuestEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function listGuestEvents(): Promise<GuestEvent[]> {
  const directory = getDataPath('guest-events');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const events: GuestEvent[] = [];

  for (const fileName of files) {
    const payload = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = guestEventSchema.safeParse(payload);
    if (parsed.success) {
      events.push(parsed.data);
    }
  }

  return events.sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
}

export async function recordGuestEvent(payload: Omit<GuestEvent, 'id' | 'occurredAt' | 'guestEmail'> & { id?: string; occurredAt?: string; guestEmail: string }) {
  const normalizedEmail = normalizeGuestEmail(payload.guestEmail);
  const events = await listGuestEvents();
  const duplicate = events.find((event) => event.guestEmail === normalizedEmail && event.eventType === payload.eventType && event.eventRef === payload.eventRef);
  if (duplicate) {
    return duplicate;
  }

  const event = guestEventSchema.parse({
    ...payload,
    id: payload.id ?? `guest_event_${randomUUID()}`,
    guestEmail: normalizedEmail,
    occurredAt: payload.occurredAt ?? new Date().toISOString(),
  });

  await writeJsonFile(eventPath(event.id), event);
  return event;
}

export async function listGuestEventsForEmail(email: string): Promise<GuestEvent[]> {
  const normalizedEmail = normalizeGuestEmail(email);
  const events = await listGuestEvents();
  return events.filter((event) => event.guestEmail === normalizedEmail);
}

export async function listGuestEventsByEmail(emails: string[]): Promise<Record<string, GuestEvent[]>> {
  const unique = [...new Set(emails.map((email) => normalizeGuestEmail(email)))];
  const events = await listGuestEvents();

  return unique.reduce<Record<string, GuestEvent[]>>((accumulator, email) => {
    accumulator[email] = events.filter((event) => event.guestEmail === email).slice(0, 4);
    return accumulator;
  }, {});
}
