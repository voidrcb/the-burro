import { randomUUID } from 'crypto';
import { readdir } from 'fs/promises';
import path from 'path';

import { getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';

import {
  eventOperationSchema,
  eventRegistrationSchema,
  eventSessionSchema,
  eventCommunicationSchema,
  eventPricingTierSchema,
  type EventOperation,
  type EventRegistration,
  type EventSession,
  type EventCommunication,
  type EventPricingTier,
  type EventStatus,
  type EventQueryOptions,
  type RegistrationQueryOptions,
} from './types';

// ============================================================================
// Path Helpers
// ============================================================================

function getEventPath(id: string): string {
  return getDataPath('events', `${id}.json`);
}

function getRegistrationPath(id: string): string {
  return getDataPath('events', 'registrations', `${id}.json`);
}

// ============================================================================
// ID Generators
// ============================================================================

function generateEventId(): string {
  return `event_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateRegistrationId(): string {
  return `reg_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateSessionId(): string {
  return `session_${randomUUID().slice(0, 8)}`;
}

function generateCommunicationId(): string {
  return `comm_${randomUUID().slice(0, 8)}`;
}

function generateTierId(): string {
  return `tier_${randomUUID().slice(0, 8)}`;
}

// ============================================================================
// Event Operations CRUD
// ============================================================================

export interface CreateEventInput {
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  eventType: EventOperation['eventType'];
  dateRange: EventOperation['dateRange'];
  capacityTotal: number;
  registrationOpen: string;
  registrationClose: string;
  venue: string;
  venueAddress?: string;
  locationNotes?: string;
  heroImageUrl?: string;
  createdBy: string;
}

export async function createEvent(input: CreateEventInput): Promise<EventOperation> {
  const now = new Date().toISOString();

  const event = eventOperationSchema.parse({
    id: generateEventId(),
    slug: input.slug,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    eventType: input.eventType,
    dateRange: input.dateRange,
    sessions: [],
    capacityTotal: input.capacityTotal,
    registeredCount: 0,
    waitlistCount: 0,
    waitlistEnabled: true,
    registrationOpen: input.registrationOpen,
    registrationClose: input.registrationClose,
    status: 'planning',
    statusHistory: [{
      status: 'planning',
      changedAt: now,
      changedBy: input.createdBy,
      reason: 'Event created',
    }],
    pricingTiers: [],
    partners: [],
    communications: [],
    venue: input.venue,
    venueAddress: input.venueAddress,
    locationNotes: input.locationNotes,
    heroImageUrl: input.heroImageUrl,
    galleryUrls: [],
    createdAt: now,
    updatedAt: now,
    createdBy: input.createdBy,
  });

  await writeJsonFile(getEventPath(event.id), event);
  return event;
}

export async function getEvent(id: string): Promise<EventOperation | null> {
  const data = await readJsonFile<unknown>(getEventPath(id), null);
  if (!data) return null;

  const parsed = eventOperationSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function getEventBySlug(slug: string): Promise<EventOperation | null> {
  const events = await listEvents();
  return events.find((e) => e.slug === slug) ?? null;
}

export async function updateEvent(
  id: string,
  updates: Partial<EventOperation>
): Promise<EventOperation | null> {
  const existing = await getEvent(id);
  if (!existing) return null;

  const updated = eventOperationSchema.parse({
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  await writeJsonFile(getEventPath(id), updated);
  return updated;
}

export async function listEvents(options?: EventQueryOptions): Promise<EventOperation[]> {
  const directory = getDataPath('events');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json') && !f.includes('registrations'));
  const events: EventOperation[] = [];

  for (const file of files) {
    const data = await readJsonFile<unknown>(path.join(directory, file), null);
    const parsed = eventOperationSchema.safeParse(data);
    if (parsed.success) {
      events.push(parsed.data);
    }
  }

  let filtered = events;

  if (options?.status) {
    const statuses = Array.isArray(options.status) ? options.status : [options.status];
    filtered = filtered.filter((e) => statuses.includes(e.status));
  }

  if (options?.eventType) {
    const types = Array.isArray(options.eventType) ? options.eventType : [options.eventType];
    filtered = filtered.filter((e) => types.includes(e.eventType));
  }

  if (options?.fromDate) {
    filtered = filtered.filter((e) => e.dateRange.start >= options.fromDate!);
  }

  if (options?.toDate) {
    filtered = filtered.filter((e) => e.dateRange.end <= options.toDate!);
  }

  // Sort by start date
  filtered.sort((a, b) => a.dateRange.start.localeCompare(b.dateRange.start));

  if (options?.limit && options.limit > 0) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

// ============================================================================
// Event Status Transitions
// ============================================================================

const validStatusTransitions: Record<EventStatus, EventStatus[]> = {
  planning: ['registration_open', 'cancelled'],
  registration_open: ['sold_out', 'in_progress', 'cancelled'],
  sold_out: ['registration_open', 'in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export async function transitionEventStatus(
  eventId: string,
  newStatus: EventStatus,
  changedBy: string,
  reason?: string
): Promise<EventOperation | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  const allowed = validStatusTransitions[event.status];
  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Cannot transition event from ${event.status} to ${newStatus}`
    );
  }

  const now = new Date().toISOString();

  return updateEvent(eventId, {
    status: newStatus,
    statusHistory: [
      ...event.statusHistory,
      { status: newStatus, changedAt: now, changedBy, reason },
    ],
    ...(newStatus === 'cancelled' ? { cancelledAt: now, cancellationReason: reason } : {}),
  });
}

// ============================================================================
// Session Management
// ============================================================================

export async function addSession(
  eventId: string,
  session: Omit<EventSession, 'id' | 'registeredCount'>
): Promise<EventOperation | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  const newSession = eventSessionSchema.parse({
    ...session,
    id: generateSessionId(),
    registeredCount: 0,
  });

  return updateEvent(eventId, {
    sessions: [...event.sessions, newSession],
  });
}

export async function updateSession(
  eventId: string,
  sessionId: string,
  updates: Partial<EventSession>
): Promise<EventOperation | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  const sessions = event.sessions.map((s) =>
    s.id === sessionId ? { ...s, ...updates } : s
  );

  return updateEvent(eventId, { sessions });
}

export async function removeSession(
  eventId: string,
  sessionId: string
): Promise<EventOperation | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  return updateEvent(eventId, {
    sessions: event.sessions.filter((s) => s.id !== sessionId),
  });
}

// ============================================================================
// Pricing Tier Management
// ============================================================================

export async function addPricingTier(
  eventId: string,
  tier: Omit<EventPricingTier, 'id' | 'soldCount'>
): Promise<EventOperation | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  const newTier = eventPricingTierSchema.parse({
    ...tier,
    id: generateTierId(),
    soldCount: 0,
  });

  return updateEvent(eventId, {
    pricingTiers: [...event.pricingTiers, newTier],
  });
}

export async function updatePricingTier(
  eventId: string,
  tierId: string,
  updates: Partial<EventPricingTier>
): Promise<EventOperation | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  const tiers = event.pricingTiers.map((t) =>
    t.id === tierId ? { ...t, ...updates } : t
  );

  return updateEvent(eventId, { pricingTiers: tiers });
}

// ============================================================================
// Communication Scheduling
// ============================================================================

export async function scheduleCommunication(
  eventId: string,
  comm: Omit<EventCommunication, 'id' | 'status' | 'createdAt'>
): Promise<EventOperation | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  const newComm = eventCommunicationSchema.parse({
    ...comm,
    id: generateCommunicationId(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  });

  return updateEvent(eventId, {
    communications: [...event.communications, newComm],
  });
}

export async function updateCommunication(
  eventId: string,
  commId: string,
  updates: Partial<EventCommunication>
): Promise<EventOperation | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  const communications = event.communications.map((c) =>
    c.id === commId ? { ...c, ...updates } : c
  );

  return updateEvent(eventId, { communications });
}

// ============================================================================
// Registration Operations per A-3.3.6
// ============================================================================

export interface CreateRegistrationInput {
  eventId: string;
  pricingTierId: string;
  guestEmail: string;
  profileId?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  selectedSessions?: string[];
  dietaryRequirements?: string;
  accessibilityNeeds?: string;
  emergencyContact?: EventRegistration['emergencyContact'];
  registeredBy?: string;
}

export async function createRegistration(
  input: CreateRegistrationInput
): Promise<EventRegistration> {
  const event = await getEvent(input.eventId);
  if (!event) {
    throw new Error(`Event ${input.eventId} not found`);
  }

  // Check capacity
  if (event.registeredCount >= event.capacityTotal) {
    if (!event.waitlistEnabled) {
      throw new Error('Event is at capacity and waitlist is disabled');
    }
  }

  const now = new Date().toISOString();
  const isWaitlist = event.registeredCount >= event.capacityTotal;

  const registration = eventRegistrationSchema.parse({
    id: generateRegistrationId(),
    eventId: input.eventId,
    pricingTierId: input.pricingTierId,
    guestEmail: input.guestEmail,
    profileId: input.profileId,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    selectedSessions: input.selectedSessions ?? [],
    dietaryRequirements: input.dietaryRequirements,
    accessibilityNeeds: input.accessibilityNeeds,
    emergencyContact: input.emergencyContact,
    status: isWaitlist ? 'waitlisted' : 'pending_payment',
    statusHistory: [{
      status: isWaitlist ? 'waitlisted' : 'pending_payment',
      changedAt: now,
      changedBy: input.registeredBy ?? 'self',
    }],
    amountPaidUsd: 0,
    createdAt: now,
    updatedAt: now,
    registeredBy: input.registeredBy ?? 'self',
  });

  await writeJsonFile(getRegistrationPath(registration.id), registration);

  // Update event counts
  if (isWaitlist) {
    await updateEvent(input.eventId, {
      waitlistCount: event.waitlistCount + 1,
    });
  }

  return registration;
}

export async function getRegistration(id: string): Promise<EventRegistration | null> {
  const data = await readJsonFile<unknown>(getRegistrationPath(id), null);
  if (!data) return null;

  const parsed = eventRegistrationSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function updateRegistration(
  id: string,
  updates: Partial<EventRegistration>
): Promise<EventRegistration | null> {
  const existing = await getRegistration(id);
  if (!existing) return null;

  const updated = eventRegistrationSchema.parse({
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  await writeJsonFile(getRegistrationPath(id), updated);
  return updated;
}

export async function listRegistrations(
  options?: RegistrationQueryOptions
): Promise<EventRegistration[]> {
  const directory = getDataPath('events', 'registrations');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const registrations: EventRegistration[] = [];

  for (const file of files) {
    const data = await readJsonFile<unknown>(path.join(directory, file), null);
    const parsed = eventRegistrationSchema.safeParse(data);
    if (parsed.success) {
      registrations.push(parsed.data);
    }
  }

  let filtered = registrations;

  if (options?.eventId) {
    filtered = filtered.filter((r) => r.eventId === options.eventId);
  }

  if (options?.guestEmail) {
    filtered = filtered.filter((r) => r.guestEmail === options.guestEmail);
  }

  if (options?.profileId) {
    filtered = filtered.filter((r) => r.profileId === options.profileId);
  }

  if (options?.status) {
    const statuses = Array.isArray(options.status) ? options.status : [options.status];
    filtered = filtered.filter((r) => statuses.includes(r.status));
  }

  // Sort by most recent first
  filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (options?.limit && options.limit > 0) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

// ============================================================================
// Registration Status Transitions
// ============================================================================

export async function confirmRegistration(
  registrationId: string,
  paymentRef: string,
  amountPaid: number
): Promise<EventRegistration | null> {
  const registration = await getRegistration(registrationId);
  if (!registration) return null;

  const now = new Date().toISOString();

  const updated = await updateRegistration(registrationId, {
    status: 'confirmed',
    statusHistory: [
      ...registration.statusHistory,
      { status: 'confirmed', changedAt: now },
    ],
    paymentRef,
    amountPaidUsd: amountPaid,
    paidAt: now,
  });

  // Update event registered count
  if (updated) {
    const event = await getEvent(registration.eventId);
    if (event) {
      await updateEvent(event.id, {
        registeredCount: event.registeredCount + 1,
      });

      // Update pricing tier sold count
      const tier = event.pricingTiers.find((t) => t.id === registration.pricingTierId);
      if (tier) {
        await updatePricingTier(event.id, tier.id, {
          soldCount: tier.soldCount + 1,
        });
      }
    }
  }

  return updated;
}

export async function cancelRegistration(
  registrationId: string,
  reason?: string,
  refund: boolean = false
): Promise<EventRegistration | null> {
  const registration = await getRegistration(registrationId);
  if (!registration) return null;

  const now = new Date().toISOString();
  const newStatus = refund ? 'refunded' : 'cancelled';

  const updated = await updateRegistration(registrationId, {
    status: newStatus,
    statusHistory: [
      ...registration.statusHistory,
      { status: newStatus, changedAt: now, reason },
    ],
  });

  // Update event counts if was confirmed
  if (updated && registration.status === 'confirmed') {
    const event = await getEvent(registration.eventId);
    if (event) {
      await updateEvent(event.id, {
        registeredCount: Math.max(0, event.registeredCount - 1),
      });
    }
  }

  return updated;
}

export async function checkInRegistration(
  registrationId: string,
  checkedInBy: string
): Promise<EventRegistration | null> {
  const registration = await getRegistration(registrationId);
  if (!registration) return null;

  if (registration.status !== 'confirmed') {
    throw new Error('Can only check in confirmed registrations');
  }

  const now = new Date().toISOString();

  return updateRegistration(registrationId, {
    status: 'checked_in',
    statusHistory: [
      ...registration.statusHistory,
      { status: 'checked_in', changedAt: now, changedBy: checkedInBy },
    ],
    checkedInAt: now,
    checkedInBy,
  });
}
