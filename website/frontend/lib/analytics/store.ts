import { createHash } from 'crypto';
import { readFile } from 'fs/promises';

import { appendJsonLine, getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';

import type {
  AnalyticsEvent,
  AnalyticsEventType,
  MonthlyReport,
} from './types';

// Generate unique event ID
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Hash email for privacy per A-2.3.1
export function hashEmail(email: string): string {
  return createHash('sha256').update(email.toLowerCase().trim()).digest('hex').slice(0, 16);
}

// Log analytics event (server-side per HF-907)
export async function logAnalyticsEvent(
  eventType: AnalyticsEventType,
  path: string,
  options?: {
    guestEmail?: string;
    sessionId?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  const event: AnalyticsEvent = {
    eventId: generateEventId(),
    eventType,
    occurredAt: new Date().toISOString(),
    path,
    guestEmailHash: options?.guestEmail ? hashEmail(options.guestEmail) : undefined,
    sessionId: options?.sessionId,
    metadata: options?.metadata,
  };

  await appendJsonLine(getDataPath('analytics', 'events.jsonl'), event);
}

// Read all analytics events (for reporting)
export async function listAnalyticsEvents(options?: {
  fromDate?: string;
  toDate?: string;
  eventType?: AnalyticsEventType;
}): Promise<AnalyticsEvent[]> {
  try {
    const raw = await readFile(getDataPath('analytics', 'events.jsonl'), 'utf8');
    const lines = raw.trim().split('\n').filter(Boolean);
    let events: AnalyticsEvent[] = lines.map((line) => JSON.parse(line) as AnalyticsEvent);

    if (options?.fromDate) {
      events = events.filter((e) => e.occurredAt >= options.fromDate!);
    }
    if (options?.toDate) {
      events = events.filter((e) => e.occurredAt <= options.toDate!);
    }
    if (options?.eventType) {
      events = events.filter((e) => e.eventType === options.eventType);
    }

    return events;
  } catch {
    return [];
  }
}

// Count events by type
export async function countEventsByType(
  fromDate: string,
  toDate: string
): Promise<Record<AnalyticsEventType, number>> {
  const events = await listAnalyticsEvents({ fromDate, toDate });
  const counts: Partial<Record<AnalyticsEventType, number>> = {};

  for (const event of events) {
    counts[event.eventType] = (counts[event.eventType] ?? 0) + 1;
  }

  return counts as Record<AnalyticsEventType, number>;
}

// Get unique visitors count
export async function countUniqueVisitors(fromDate: string, toDate: string): Promise<number> {
  const events = await listAnalyticsEvents({
    fromDate,
    toDate,
    eventType: 'page_view',
  });

  const uniqueSessions = new Set(events.map((e) => e.sessionId ?? e.guestEmailHash ?? 'unknown'));
  return uniqueSessions.size;
}

// Calculate conversion rate
export async function calculateBookingConversionRate(fromDate: string, toDate: string): Promise<number> {
  const events = await listAnalyticsEvents({ fromDate, toDate });
  const intents = events.filter((e) => e.eventType === 'booking_intent').length;
  const confirmed = events.filter((e) => e.eventType === 'booking_confirmed').length;

  return intents > 0 ? confirmed / intents : 0;
}

// Calculate newsletter signup rate
export async function calculateNewsletterSignupRate(fromDate: string, toDate: string): Promise<number> {
  const events = await listAnalyticsEvents({ fromDate, toDate });
  const pageViews = events.filter((e) => e.eventType === 'page_view').length;
  const signups = events.filter((e) => e.eventType === 'newsletter_subscribed').length;

  return pageViews > 0 ? signups / pageViews : 0;
}

// Get top paths by views
export async function getTopPaths(
  fromDate: string,
  toDate: string,
  limit = 10
): Promise<Array<{ path: string; views: number }>> {
  const events = await listAnalyticsEvents({
    fromDate,
    toDate,
    eventType: 'page_view',
  });

  const pathCounts: Record<string, number> = {};
  for (const event of events) {
    pathCounts[event.path] = (pathCounts[event.path] ?? 0) + 1;
  }

  return Object.entries(pathCounts)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

// Calculate shop revenue from metadata
export async function calculateShopRevenue(fromDate: string, toDate: string): Promise<number> {
  const events = await listAnalyticsEvents({
    fromDate,
    toDate,
    eventType: 'shop_order_created',
  });

  return events.reduce((sum, e) => {
    const amount = (e.metadata?.subtotalAmount as number) ?? 0;
    return sum + amount;
  }, 0);
}

// Calculate donation total from metadata
export async function calculateDonationTotal(fromDate: string, toDate: string): Promise<number> {
  const events = await listAnalyticsEvents({
    fromDate,
    toDate,
    eventType: 'donation_completed',
  });

  return events.reduce((sum, e) => {
    const amount = (e.metadata?.amount as number) ?? 0;
    return sum + amount;
  }, 0);
}

// Generate monthly report per HF-908
export async function generateMonthlyReport(
  year: number,
  month: number
): Promise<MonthlyReport> {
  const periodStart = `${year}-${String(month).padStart(2, '0')}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const periodEnd = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

  const [
    uniqueVisitors,
    bookingConversionRate,
    eventCounts,
    topPaths,
    shopRevenueUsd,
    donationTotal,
  ] = await Promise.all([
    countUniqueVisitors(periodStart, periodEnd),
    calculateBookingConversionRate(periodStart, periodEnd),
    countEventsByType(periodStart, periodEnd),
    getTopPaths(periodStart, periodEnd),
    calculateShopRevenue(periodStart, periodEnd),
    calculateDonationTotal(periodStart, periodEnd),
  ]);

  const workshopRegistrationCount = eventCounts.workshop_registered ?? 0;
  const rentalQuotes = eventCounts.rental_quote_requested ?? 0;
  const assistantInteractions = eventCounts.assistant_interaction ?? 0;
  const newsletterSignups = eventCounts.newsletter_subscribed ?? 0;
  const pageViews = eventCounts.page_view ?? 0;

  // Stream uptime is calculated from stream health store
  const { getStreamUptimePercentage } = await import('@/lib/livestream/store');
  const streamUptimePct = await getStreamUptimePercentage(periodStart, periodEnd);

  const report: MonthlyReport = {
    reportId: `report_${year}_${String(month).padStart(2, '0')}`,
    periodStart,
    periodEnd,
    generatedAt: new Date().toISOString(),
    tier1Metrics: {
      uniqueVisitors,
      bookingConversionRate,
      workshopRegistrationCount,
      shopRevenueUsd,
      newsletterSignupRate: pageViews > 0 ? newsletterSignups / pageViews : 0,
    },
    tier2Metrics: {
      rentalQuotes,
      assistantInteractions,
      donationTotal,
      streamUptimePct,
    },
    eventCounts,
    topPaths,
  };

  // Save the report
  await writeJsonFile(
    getDataPath('analytics', 'reports', `${report.reportId}.json`),
    report
  );

  return report;
}

// Get existing monthly report
export async function getMonthlyReport(
  year: number,
  month: number
): Promise<MonthlyReport | null> {
  const reportId = `report_${year}_${String(month).padStart(2, '0')}`;
  return readJsonFile<MonthlyReport | null>(
    getDataPath('analytics', 'reports', `${reportId}.json`),
    null
  );
}

// List available reports
export async function listAvailableReports(): Promise<string[]> {
  try {
    const { readdir } = await import('fs/promises');
    const files = await readdir(getDataPath('analytics', 'reports'));
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''));
  } catch {
    return [];
  }
}
