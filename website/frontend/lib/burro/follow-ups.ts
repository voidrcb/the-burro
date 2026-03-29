import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

import { z } from 'zod';

import { getCmsPath, getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';
import { appendGuestEvent, listGuestEvents, type GuestEvent } from '@/lib/guest-events/store';
import type { BookingRecord } from '@/lib/content/stay-types';
import type { WorkshopRegistration } from '@/lib/workshop/types';
import type { ShopOrder } from '@/lib/shop/types';

const followUpTemplateSchema = z.object({
  id: z.enum(['post-stay', 'workshop-reminder']),
  title: z.string(),
  subject: z.string(),
  body: z.string(),
});

const burroFollowUpSchema = z.object({
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

export type DraftCard = {
  id: string;
  type: 'post-stay' | 'workshop-reminder';
  title: string;
  subject: string;
  draftContent: string;
  status: BurroFollowUp['status'];
  generatedAt: string;
  reviewedAt?: string;
  contextRef: {
    type: 'booking' | 'registration';
    id: string;
  };
  guestEmail: string;
};

type FollowUpTemplate = z.infer<typeof followUpTemplateSchema>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function templatePath(id: FollowUpTemplate['id']): string {
  return getCmsPath('burro', 'templates', `${id}.json`);
}

function followUpPath(id: string): string {
  return getDataPath('follow-ups', `${id}.json`);
}

async function readTemplate(id: FollowUpTemplate['id']): Promise<FollowUpTemplate> {
  const raw = await readFile(templatePath(id), 'utf8');
  return followUpTemplateSchema.parse(JSON.parse(raw));
}

export async function listFollowUps(): Promise<BurroFollowUp[]> {
  const directory = getDataPath('follow-ups');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const records: BurroFollowUp[] = [];

  for (const fileName of entries.filter((entry) => entry.endsWith('.json'))) {
    const payload = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = burroFollowUpSchema.safeParse(payload);
    if (parsed.success) {
      records.push(parsed.data);
    }
  }

  return records.sort((left, right) => right.generatedAt.localeCompare(left.generatedAt));
}

function renderTemplate(template: string, values: Record<string, string>): string {
  return template.replaceAll(/{{(\w+)}}/g, (_, key: string) => values[key] ?? '');
}

export async function buildBookingDraft(booking: BookingRecord, existing?: BurroFollowUp): Promise<DraftCard> {
  const template = await readTemplate('post-stay');
  return {
    id: existing?.id ?? `draft_booking_${booking.id}`,
    type: 'post-stay',
    title: template.title,
    subject: template.subject,
    draftContent: existing?.draftContent ?? renderTemplate(template.body, {
      guestName: booking.guestName,
      contextLabel: booking.unitId,
      dateLabel: `${booking.checkIn} to ${booking.checkOut}`,
    }),
    status: existing?.status ?? 'draft',
    generatedAt: existing?.generatedAt ?? new Date().toISOString(),
    reviewedAt: existing?.reviewedAt,
    contextRef: { type: 'booking', id: booking.id },
    guestEmail: normalizeEmail(booking.guestEmail),
  };
}

export async function buildWorkshopDraft(registration: WorkshopRegistration, existing?: BurroFollowUp): Promise<DraftCard> {
  const template = await readTemplate('workshop-reminder');
  return {
    id: existing?.id ?? `draft_registration_${registration.id}`,
    type: 'workshop-reminder',
    title: template.title,
    subject: template.subject,
    draftContent: existing?.draftContent ?? renderTemplate(template.body, {
      guestName: registration.guestName,
      contextLabel: registration.workshopSlug,
      dateLabel: registration.registeredAt.slice(0, 10),
    }),
    status: existing?.status ?? 'draft',
    generatedAt: existing?.generatedAt ?? new Date().toISOString(),
    reviewedAt: existing?.reviewedAt,
    contextRef: { type: 'registration', id: registration.id },
    guestEmail: normalizeEmail(registration.guestEmail),
  };
}

export async function approveFollowUpDraft(payload: {
  id?: string;
  type: DraftCard['type'];
  templateRef: string;
  contextRef: DraftCard['contextRef'];
  guestEmail: string;
  draftContent: string;
}): Promise<BurroFollowUp> {
  const record = burroFollowUpSchema.parse({
    id: payload.id ?? `follow_up_${randomUUID()}`,
    type: payload.type,
    templateRef: payload.templateRef,
    contextRef: payload.contextRef,
    guestEmail: normalizeEmail(payload.guestEmail),
    draftContent: payload.draftContent,
    status: 'approved',
    generatedAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
  });

  await writeJsonFile(followUpPath(record.id), record);
  await appendGuestEvent({
    guestEmail: record.guestEmail,
    eventType: 'note',
    eventRef: record.id,
    occurredAt: record.reviewedAt ?? record.generatedAt,
    tags: ['follow-up', record.type],
    metadata: {
      stage: 'approved',
      contextType: record.contextRef.type,
      contextId: record.contextRef.id,
    },
  });

  return record;
}

export async function syncGuestHistory(payload: {
  bookings: BookingRecord[];
  registrations: WorkshopRegistration[];
  orders: ShopOrder[];
  followUps: BurroFollowUp[];
}): Promise<GuestEvent[]> {
  await Promise.all([
    ...payload.bookings.map((booking) =>
      appendGuestEvent({
        guestEmail: booking.guestEmail,
        eventType: 'booking',
        eventRef: booking.id,
        occurredAt: booking.createdAt,
        tags: [booking.status, booking.unitId],
        metadata: {
          unitId: booking.unitId,
          status: booking.status,
        },
      }),
    ),
    ...payload.registrations.map((registration) =>
      appendGuestEvent({
        guestEmail: registration.guestEmail,
        eventType: 'registration',
        eventRef: registration.id,
        occurredAt: registration.registeredAt,
        tags: [registration.status, registration.workshopSlug],
        metadata: {
          workshopSlug: registration.workshopSlug,
          status: registration.status,
        },
      }),
    ),
    ...payload.orders.map((order) =>
      appendGuestEvent({
        guestEmail: order.guestEmail,
        eventType: 'purchase',
        eventRef: order.id,
        occurredAt: order.createdAt,
        tags: ['shop', order.shippingProfile],
        metadata: {
          status: order.status,
        },
      }),
    ),
    ...payload.followUps
      .filter((followUp) => followUp.status === 'approved' || followUp.status === 'sent')
      .map((followUp) =>
        appendGuestEvent({
          guestEmail: followUp.guestEmail,
          eventType: followUp.status === 'sent' ? 'follow-up-sent' : 'note',
          eventRef: followUp.id,
          occurredAt: followUp.reviewedAt ?? followUp.generatedAt,
          tags: ['follow-up', followUp.type],
          metadata: {
            status: followUp.status,
            contextType: followUp.contextRef.type,
          },
        }),
      ),
  ]);

  return listGuestEvents();
}

export function getGuestTimeline(events: GuestEvent[], guestEmail: string): GuestEvent[] {
  const normalized = normalizeEmail(guestEmail);
  return events.filter((event) => normalizeEmail(event.guestEmail) === normalized).slice(0, 4);
}
