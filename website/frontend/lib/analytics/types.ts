import { z } from 'zod';

// A-2.3.1: Canonical analytics event schema with 10 event types
// Extended in Sprint 2.4 per HF-2408 to include partner activity tracking
export const analyticsEventTypeSchema = z.enum([
  'page_view',
  'booking_intent',
  'booking_confirmed',
  'workshop_registered',
  'shop_order_created',
  'rental_quote_requested',
  'rental_approved',
  'donation_completed',
  'assistant_interaction',
  'newsletter_subscribed',
  // Sprint 2.4: Partner activity events per HF-2408
  'partner_experience_booked',
  'partner_onboarded',
  'marketplace_item_published',
]);

export type AnalyticsEventType = z.infer<typeof analyticsEventTypeSchema>;

// Standard field structure per A-2.3.1
export const analyticsEventSchema = z.object({
  eventId: z.string(),
  eventType: analyticsEventTypeSchema,
  occurredAt: z.string(), // ISO 8601
  path: z.string(),
  guestEmailHash: z.string().optional(), // SHA-256 hash for privacy
  sessionId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

// A-2.3.2: Core metrics hierarchy
export const tier1MetricSchema = z.enum([
  'unique_visitors',
  'booking_conversion_rate',
  'workshop_registration_count',
  'shop_revenue_usd',
  'newsletter_signup_rate',
]);

export const tier2MetricSchema = z.enum([
  'rental_quotes',
  'assistant_interactions',
  'donation_total',
  'stream_uptime_pct',
]);

export type Tier1Metric = z.infer<typeof tier1MetricSchema>;
export type Tier2Metric = z.infer<typeof tier2MetricSchema>;

// Monthly report structure per HF-908
export const monthlyReportSchema = z.object({
  reportId: z.string(),
  periodStart: z.string(), // YYYY-MM-DD
  periodEnd: z.string(), // YYYY-MM-DD
  generatedAt: z.string(),
  tier1Metrics: z.object({
    uniqueVisitors: z.number().int().nonnegative(),
    bookingConversionRate: z.number().min(0).max(1),
    workshopRegistrationCount: z.number().int().nonnegative(),
    shopRevenueUsd: z.number().nonnegative(),
    newsletterSignupRate: z.number().min(0).max(1),
  }),
  tier2Metrics: z.object({
    rentalQuotes: z.number().int().nonnegative(),
    assistantInteractions: z.number().int().nonnegative(),
    donationTotal: z.number().nonnegative(),
    streamUptimePct: z.number().min(0).max(100),
  }),
  eventCounts: z.record(analyticsEventTypeSchema, z.number().int().nonnegative()),
  topPaths: z.array(z.object({
    path: z.string(),
    views: z.number().int().nonnegative(),
  })),
});

export type MonthlyReport = z.infer<typeof monthlyReportSchema>;

// Event producer mapping for documentation
export const EVENT_PRODUCERS: Record<AnalyticsEventType, string[]> = {
  page_view: ['/api/analytics/track'],
  booking_intent: ['/api/booking/intent', '/api/booking/quote'],
  booking_confirmed: ['/api/webhooks/lodgify/booking'],
  workshop_registered: ['/api/workshop/register'],
  shop_order_created: ['/api/shop/orders'],
  rental_quote_requested: ['/api/rentals/quote'],
  rental_approved: ['/api/rentals/approve'],
  donation_completed: ['/api/webhooks/stripe'], // Future: donation webhook
  assistant_interaction: ['/api/assistant/respond'],
  newsletter_subscribed: ['/api/newsletter/subscribe'],
  // Sprint 2.4: Partner activity events per HF-2408
  partner_experience_booked: ['/api/booking/partner-experience'],
  partner_onboarded: ['/api/partners'],
  marketplace_item_published: ['/api/marketplace'],
};
