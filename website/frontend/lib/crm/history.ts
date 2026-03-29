/**
 * Event History Query Layer per A-3.2.2 (DEC-060)
 *
 * Queries across existing stores with unified projection.
 * No data migration - reads from sources on demand.
 */

import { readdir } from 'fs/promises';
import path from 'path';

import { getDataPath, readJsonFile } from '@/lib/server/repo';

import {
  unifiedEventSchema,
  type ExtendedEventType,
  type HistoryQueryOptions,
  type UnifiedEvent,
} from './types';
import { normalizeGuestEmail, type GuestEvent } from './events';

// ============================================================================
// Source Adapters - Read from existing stores and project to unified format
// ============================================================================

async function readGuestEvents(): Promise<UnifiedEvent[]> {
  const directory = getDataPath('guest-events');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const events: UnifiedEvent[] = [];

  for (const file of files) {
    const data = await readJsonFile<GuestEvent | null>(path.join(directory, file), null);
    if (data) {
      const unified = unifiedEventSchema.safeParse({
        id: data.id,
        guestEmail: normalizeGuestEmail(data.guestEmail),
        eventType: data.eventType,
        eventRef: data.eventRef,
        source: 'guest-events',
        metadata: data.metadata,
        occurredAt: data.occurredAt,
        tags: data.tags,
      });
      if (unified.success) {
        events.push(unified.data);
      }
    }
  }

  return events;
}

async function readAnalyticsEvents(): Promise<UnifiedEvent[]> {
  const eventsPath = getDataPath('analytics', 'events.jsonl');
  const events: UnifiedEvent[] = [];

  try {
    const { readFile } = await import('fs/promises');
    const raw = await readFile(eventsPath, 'utf8');
    const lines = raw.trim().split('\n').filter(Boolean);

    for (const line of lines) {
      const data = JSON.parse(line);

      // Map analytics event types to extended types
      const eventTypeMap: Record<string, ExtendedEventType> = {
        booking_confirmed: 'booking',
        workshop_registered: 'registration',
        shop_order_created: 'purchase',
        rental_quote_requested: 'rental_quote',
        rental_approved: 'rental',
        donation_completed: 'donation',
      };

      const eventType = eventTypeMap[data.eventType];
      if (eventType && data.guestEmailHash) {
        // Note: We can't reconstruct email from hash, but we can use it as identifier
        // In practice, this would be linked via profile
        events.push({
          id: data.eventId,
          guestEmail: `${data.guestEmailHash}@hashed.local`, // Placeholder - needs profile resolution
          eventType,
          eventRef: data.path,
          source: 'analytics',
          metadata: data.metadata,
          occurredAt: data.occurredAt,
        });
      }
    }
  } catch {
    // Analytics file may not exist
  }

  return events;
}

async function readBookingRecords(): Promise<UnifiedEvent[]> {
  const directory = getDataPath('booking');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const events: UnifiedEvent[] = [];

  for (const file of files) {
    const data = await readJsonFile<{ id: string; guestEmail: string; createdAt: string; status: string } | null>(
      path.join(directory, file),
      null
    );
    if (data && data.guestEmail) {
      events.push({
        id: `booking_${data.id}`,
        guestEmail: normalizeGuestEmail(data.guestEmail),
        eventType: 'booking',
        eventRef: data.id,
        source: 'booking',
        metadata: { status: data.status },
        occurredAt: data.createdAt,
      });
    }
  }

  return events;
}

async function readWorkshopRegistrations(): Promise<UnifiedEvent[]> {
  const directory = getDataPath('workshop', 'registrations');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const events: UnifiedEvent[] = [];

  for (const file of files) {
    const data = await readJsonFile<{ id: string; guestEmail: string; registeredAt: string; status: string; workshopSlug: string } | null>(
      path.join(directory, file),
      null
    );
    if (data && data.guestEmail) {
      events.push({
        id: `registration_${data.id}`,
        guestEmail: normalizeGuestEmail(data.guestEmail),
        eventType: 'registration',
        eventRef: data.id,
        source: 'workshop',
        metadata: { status: data.status, workshopSlug: data.workshopSlug },
        occurredAt: data.registeredAt,
      });
    }
  }

  return events;
}

async function readShopOrders(): Promise<UnifiedEvent[]> {
  const directory = getDataPath('shop', 'orders');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const events: UnifiedEvent[] = [];

  for (const file of files) {
    const data = await readJsonFile<{ id: string; guestEmail: string; createdAt: string; status: string; subtotalAmount: number } | null>(
      path.join(directory, file),
      null
    );
    if (data && data.guestEmail) {
      events.push({
        id: `purchase_${data.id}`,
        guestEmail: normalizeGuestEmail(data.guestEmail),
        eventType: 'purchase',
        eventRef: data.id,
        source: 'shop',
        metadata: { status: data.status, amount: data.subtotalAmount },
        occurredAt: data.createdAt,
      });
    }
  }

  return events;
}

async function readRentalBookings(): Promise<UnifiedEvent[]> {
  const directory = getDataPath('rental-bookings');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const events: UnifiedEvent[] = [];

  for (const file of files) {
    const data = await readJsonFile<{ id: string; customerEmail: string; createdAt: string; state: string; totalAmount: number } | null>(
      path.join(directory, file),
      null
    );
    if (data && data.customerEmail) {
      events.push({
        id: `rental_${data.id}`,
        guestEmail: normalizeGuestEmail(data.customerEmail),
        eventType: 'rental',
        eventRef: data.id,
        source: 'rental',
        metadata: { state: data.state, amount: data.totalAmount },
        occurredAt: data.createdAt,
      });
    }
  }

  return events;
}

async function readItineraryDrafts(): Promise<UnifiedEvent[]> {
  const directory = getDataPath('itinerary', 'drafts');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const events: UnifiedEvent[] = [];

  for (const file of files) {
    const data = await readJsonFile<{ id: string; guestEmail?: string; createdAt: string } | null>(
      path.join(directory, file),
      null
    );
    if (data && data.guestEmail) {
      events.push({
        id: `itinerary_${data.id}`,
        guestEmail: normalizeGuestEmail(data.guestEmail),
        eventType: 'itinerary',
        eventRef: data.id,
        source: 'itinerary',
        occurredAt: data.createdAt,
      });
    }
  }

  return events;
}

// ============================================================================
// Main Query Functions
// ============================================================================

/**
 * Get unified event history across all sources
 */
export async function getEventHistory(options?: HistoryQueryOptions): Promise<UnifiedEvent[]> {
  const sources = options?.sources ?? [
    'guest-events',
    'analytics',
    'booking',
    'workshop',
    'shop',
    'rental',
    'itinerary',
  ];

  // Collect events from all requested sources
  const allEvents: UnifiedEvent[] = [];

  if (sources.includes('guest-events')) {
    allEvents.push(...await readGuestEvents());
  }
  if (sources.includes('analytics')) {
    allEvents.push(...await readAnalyticsEvents());
  }
  if (sources.includes('booking')) {
    allEvents.push(...await readBookingRecords());
  }
  if (sources.includes('workshop')) {
    allEvents.push(...await readWorkshopRegistrations());
  }
  if (sources.includes('shop')) {
    allEvents.push(...await readShopOrders());
  }
  if (sources.includes('rental')) {
    allEvents.push(...await readRentalBookings());
  }
  if (sources.includes('itinerary')) {
    allEvents.push(...await readItineraryDrafts());
  }

  // Apply filters
  let filtered = allEvents;

  if (options?.email) {
    const normalizedEmail = normalizeGuestEmail(options.email);
    filtered = filtered.filter((e) => e.guestEmail === normalizedEmail);
  }

  if (options?.eventTypes && options.eventTypes.length > 0) {
    filtered = filtered.filter((e) => options.eventTypes!.includes(e.eventType));
  }

  if (options?.fromDate) {
    filtered = filtered.filter((e) => e.occurredAt >= options.fromDate!);
  }

  if (options?.toDate) {
    filtered = filtered.filter((e) => e.occurredAt <= options.toDate!);
  }

  // Sort by occurredAt descending
  filtered.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));

  // Apply limit
  if (options?.limit && options.limit > 0) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

/**
 * Get event history for a specific email
 */
export async function getEventHistoryForEmail(
  email: string,
  options?: Omit<HistoryQueryOptions, 'email'>
): Promise<UnifiedEvent[]> {
  return getEventHistory({ ...options, email });
}

/**
 * Get event counts by type for an email
 */
export async function getEventCountsByType(email: string): Promise<Record<string, number>> {
  const events = await getEventHistoryForEmail(email);
  const counts: Record<string, number> = {};

  for (const event of events) {
    counts[event.eventType] = (counts[event.eventType] ?? 0) + 1;
  }

  return counts;
}

/**
 * Get first and last event dates for an email
 */
export async function getEventDateRange(email: string): Promise<{
  firstEventAt: string | null;
  lastEventAt: string | null;
}> {
  const events = await getEventHistoryForEmail(email);

  if (events.length === 0) {
    return { firstEventAt: null, lastEventAt: null };
  }

  // Events are sorted descending, so last is first in array
  return {
    firstEventAt: events[events.length - 1].occurredAt,
    lastEventAt: events[0].occurredAt,
  };
}

/**
 * Check if email has event of type within N days
 */
export async function hasRecentEvent(
  email: string,
  eventType: string,
  withinDays: number
): Promise<boolean> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - withinDays);
  const cutoffStr = cutoff.toISOString();

  const events = await getEventHistory({
    email,
    eventTypes: [eventType as any],
    fromDate: cutoffStr,
    limit: 1,
  });

  return events.length > 0;
}

/**
 * Get unique emails with activity
 */
export async function getActiveEmails(options?: {
  fromDate?: string;
  eventTypes?: string[];
}): Promise<string[]> {
  const events = await getEventHistory({
    fromDate: options?.fromDate,
    eventTypes: options?.eventTypes as any,
  });

  const emails = new Set<string>();
  for (const event of events) {
    if (!event.guestEmail.endsWith('@hashed.local')) {
      emails.add(event.guestEmail);
    }
  }

  return Array.from(emails);
}
