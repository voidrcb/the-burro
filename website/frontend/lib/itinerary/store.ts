import { randomUUID } from 'crypto';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

import { recordGuestEvent } from '@/lib/crm/events';
import { getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';
import {
  capacityHoldSchema,
  groupBookingSchema,
  itineraryConfirmationSchema,
  itineraryDraftSchema,
  type CapacityHold,
  type GroupBooking,
  type ItineraryConfirmation,
  type ItineraryDraft,
} from '@/lib/itinerary/types';

import { getHoldExpiry } from './engine';

function draftPath(id: string): string {
  return getDataPath('itineraries', 'drafts', `${id}.json`);
}

function holdPath(id: string): string {
  return getDataPath('itineraries', 'holds', `${id}.json`);
}

function groupBookingPath(id: string): string {
  return getDataPath('itineraries', 'groups', `${id}.json`);
}

function confirmationPath(id: string): string {
  return getDataPath('itineraries', 'confirmations', `${id}.json`);
}

async function readRecords<T>(directory: string, parser: { safeParse(value: unknown): { success: true; data: T } | { success: false } }): Promise<T[]> {
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: T[] = [];

  for (const fileName of files) {
    const payload = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = parser.safeParse(payload);
    if (parsed.success) {
      records.push(parsed.data);
    }
  }

  return records;
}

async function expireHoldIfNeeded(hold: CapacityHold): Promise<CapacityHold> {
  if (hold.holdStatus !== 'active') {
    return hold;
  }

  if (hold.expiresAt <= new Date().toISOString()) {
    const expired = capacityHoldSchema.parse({ ...hold, holdStatus: 'expired' });
    await writeJsonFile(holdPath(expired.id), expired);
    return expired;
  }

  return hold;
}

export async function listCapacityHolds(): Promise<CapacityHold[]> {
  const holds = await readRecords(getDataPath('itineraries', 'holds'), capacityHoldSchema);
  const resolved = await Promise.all(holds.map((hold) => expireHoldIfNeeded(hold)));
  return resolved.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function listActiveCapacityHolds(): Promise<CapacityHold[]> {
  const holds = await listCapacityHolds();
  return holds.filter((hold) => hold.holdStatus === 'active');
}

export async function listItineraryDrafts(): Promise<ItineraryDraft[]> {
  const drafts = await readRecords(getDataPath('itineraries', 'drafts'), itineraryDraftSchema);
  return drafts.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getItineraryDraftById(id: string): Promise<ItineraryDraft | null> {
  const payload = await readJsonFile<unknown>(draftPath(id), null);
  const parsed = itineraryDraftSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

export async function getItineraryDraftByShareSlug(shareSlug: string): Promise<ItineraryDraft | null> {
  const drafts = await listItineraryDrafts();
  return drafts.find((draft) => draft.shareSlug === shareSlug) ?? null;
}

export async function saveItineraryDraft(draft: ItineraryDraft): Promise<ItineraryDraft> {
  const parsed = itineraryDraftSchema.parse(draft);
  await writeJsonFile(draftPath(parsed.id), parsed);
  return parsed;
}

export async function createItineraryDraft(payload: Omit<ItineraryDraft, 'id' | 'shareSlug' | 'createdAt'>): Promise<ItineraryDraft> {
  const draft = itineraryDraftSchema.parse({
    ...payload,
    id: `itinerary_${randomUUID()}`,
    shareSlug: `share-${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  });

  await saveItineraryDraft(draft);

  if (draft.guestEmail) {
    await recordGuestEvent({
      guestEmail: draft.guestEmail,
      eventType: 'itinerary',
      eventRef: draft.id,
      tags: [draft.status, draft.source],
      metadata: {
        source: draft.source,
        totalPrice: draft.totalPrice,
      },
    });
  }

  return draft;
}

export async function syncCapacityHoldsForDraft(draft: ItineraryDraft): Promise<CapacityHold[]> {
  const existingHolds = await listCapacityHolds();
  const byDraft = existingHolds.filter((hold) => hold.itineraryRef === draft.id && hold.holdStatus === 'active');

  await Promise.all(
    byDraft.map((hold) =>
      writeJsonFile(
        holdPath(hold.id),
        capacityHoldSchema.parse({
          ...hold,
          holdStatus: 'released',
        }),
      ),
    ),
  );

  const holds = await Promise.all(
    draft.components.map((component) => {
      const hold = capacityHoldSchema.parse({
        id: `hold_${randomUUID()}`,
        componentType: component.type,
        componentId: component.refId,
        itineraryRef: draft.id,
        dates: component.dates,
        quantity: component.quantity,
        holdStatus: 'active',
        expiresAt: getHoldExpiry(),
        createdAt: new Date().toISOString(),
      });
      return writeJsonFile(holdPath(hold.id), hold).then(() => hold);
    }),
  );

  await saveItineraryDraft({
    ...draft,
    components: draft.components.map((component) => ({ ...component, holdStatus: 'held' })),
  });

  return holds;
}

export async function reviewItineraryDraft(payload: {
  draftId: string;
  action: 'approve' | 'decline';
  reviewedBy: string;
  reviewNotes?: string;
}): Promise<ItineraryDraft> {
  const draft = await getItineraryDraftById(payload.draftId);
  if (!draft) {
    throw new Error('Itinerary draft not found.');
  }

  const holds = await listCapacityHolds();
  const nextHoldStatus = payload.action === 'approve' ? 'converted' : 'released';
  await Promise.all(
    holds
      .filter((hold) => hold.itineraryRef === draft.id && hold.holdStatus === 'active')
      .map((hold) =>
        writeJsonFile(
          holdPath(hold.id),
          capacityHoldSchema.parse({
            ...hold,
            holdStatus: nextHoldStatus,
          }),
        ),
      ),
  );

  const nextStatus = payload.action === 'approve' ? 'approved' : 'declined';
  const reviewed = await saveItineraryDraft({
    ...draft,
    status: nextStatus,
    reviewedAt: new Date().toISOString(),
    reviewedBy: payload.reviewedBy,
    reviewNotes: payload.reviewNotes,
    components: draft.components.map((component) => ({
      ...component,
      holdStatus: payload.action === 'approve' ? 'confirmed' : 'released',
    })),
  });

  if (payload.action === 'approve') {
    const confirmation = itineraryConfirmationSchema.parse({
      id: `itinerary_confirmation_${randomUUID()}`,
      itineraryRef: reviewed.id,
      shareSlug: reviewed.shareSlug,
      capturedAt: new Date().toISOString(),
      status: 'approved',
      title: reviewed.title,
      guestEmail: reviewed.guestEmail,
      totalPrice: reviewed.totalPrice,
    });
    await writeJsonFile(confirmationPath(confirmation.id), confirmation);
  }

  if (reviewed.guestEmail) {
    await recordGuestEvent({
      guestEmail: reviewed.guestEmail,
      eventType: 'note',
      eventRef: reviewed.id,
      tags: [reviewed.status, 'itinerary-review'],
      metadata: {
        reviewedBy: reviewed.reviewedBy,
      },
    });
  }

  return reviewed;
}

export async function listItineraryConfirmations(): Promise<ItineraryConfirmation[]> {
  const confirmations = await readRecords(getDataPath('itineraries', 'confirmations'), itineraryConfirmationSchema);
  return confirmations.sort((left, right) => right.capturedAt.localeCompare(left.capturedAt));
}

export async function listGroupBookings(): Promise<GroupBooking[]> {
  const bookings = await readRecords(getDataPath('itineraries', 'groups'), groupBookingSchema);
  return bookings.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function createGroupBooking(payload: Omit<GroupBooking, 'id' | 'createdAt'>): Promise<GroupBooking> {
  const booking = groupBookingSchema.parse({
    ...payload,
    id: `group_booking_${randomUUID()}`,
    createdAt: new Date().toISOString(),
  });

  await writeJsonFile(groupBookingPath(booking.id), booking);

  const itinerary = await getItineraryDraftById(booking.itineraryRef);
  if (itinerary?.guestEmail) {
    await recordGuestEvent({
      guestEmail: itinerary.guestEmail,
      eventType: 'group-booking',
      eventRef: booking.id,
      tags: [booking.status, booking.groupName],
      metadata: {
        participantCount: booking.participantCount,
      },
    });
  }

  await Promise.all(
    booking.unitHolds.map((unitHold) => {
      const hold = capacityHoldSchema.parse({
        id: `hold_${randomUUID()}`,
        componentType: 'lodging',
        componentId: unitHold.unitId,
        itineraryRef: booking.itineraryRef,
        dates: unitHold.dates,
        quantity: 1,
        holdStatus: booking.status === 'confirmed' ? 'converted' : 'active',
        expiresAt: getHoldExpiry(),
        createdAt: new Date().toISOString(),
      });
      return writeJsonFile(holdPath(hold.id), hold);
    }),
  );

  return booking;
}
