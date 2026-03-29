import { z } from 'zod';

/**
 * Event Operations Types per A-3.3.2 (DEC-066)
 *
 * Multi-day event scheduling, session structure, capacity,
 * registration lifecycle, and partner role assignments.
 */

// ============================================================================
// Event Type Classification
// ============================================================================

export const eventTypeSchema = z.enum([
  'conservation_gathering', // Primary flagship event
  'symposium',             // Educational/discussion events
  'maker_market',          // Local artisan showcase
  'retreat_summit',        // Multi-day retreat
]);

export type EventType = z.infer<typeof eventTypeSchema>;

// ============================================================================
// Event Status Lifecycle
// ============================================================================

export const eventStatusSchema = z.enum([
  'planning',           // Initial planning phase
  'registration_open',  // Accepting registrations
  'sold_out',          // Capacity reached
  'in_progress',       // Event currently happening
  'completed',         // Event finished
  'cancelled',         // Event cancelled
]);

export type EventStatus = z.infer<typeof eventStatusSchema>;

// ============================================================================
// Event Session (Individual Time Block)
// ============================================================================

export const eventSessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  date: z.string(), // ISO date
  startTime: z.string(), // HH:mm format
  endTime: z.string(), // HH:mm format
  location: z.string().optional(),
  capacity: z.number().int().positive().optional(), // If different from event capacity
  sessionType: z.enum([
    'keynote',
    'workshop',
    'panel',
    'networking',
    'meal',
    'excursion',
    'break',
    'ceremony',
  ]),
  speakers: z.array(z.object({
    name: z.string(),
    title: z.string().optional(),
    bio: z.string().optional(),
    partnerId: z.string().optional(), // Link to partner if applicable
  })).default([]),
  requiresRegistration: z.boolean().default(true), // Some sessions may be open
  registeredCount: z.number().int().nonnegative().default(0),
});

export type EventSession = z.infer<typeof eventSessionSchema>;

// ============================================================================
// Partner Role Assignment
// ============================================================================

export const eventPartnerRoleSchema = z.enum([
  'sponsor',
  'presenter',
  'vendor',
  'volunteer_coordinator',
  'venue_provider',
  'catering',
  'logistics',
]);

export type EventPartnerRole = z.infer<typeof eventPartnerRoleSchema>;

export const eventPartnerAssignmentSchema = z.object({
  partnerId: z.string(),
  role: eventPartnerRoleSchema,
  sessions: z.array(z.string()).default([]), // Session IDs where partner participates
  assignedAt: z.string(),
  assignedBy: z.string(),
  notes: z.string().optional(),
});

export type EventPartnerAssignment = z.infer<typeof eventPartnerAssignmentSchema>;

// ============================================================================
// Event Communication Schedule
// ============================================================================

export const eventCommunicationTypeSchema = z.enum([
  'registration_confirmation',
  'reminder_7_day',
  'reminder_1_day',
  'schedule_update',
  'weather_advisory',
  'post_event_survey',
  'thank_you',
]);

export type EventCommunicationType = z.infer<typeof eventCommunicationTypeSchema>;

export const eventCommunicationSchema = z.object({
  id: z.string(),
  type: eventCommunicationTypeSchema,
  scheduledFor: z.string(), // ISO timestamp
  templateRef: z.string(), // Reference to email template
  status: z.enum(['scheduled', 'sent', 'failed', 'cancelled']).default('scheduled'),
  sentAt: z.string().optional(),
  recipientCount: z.number().int().nonnegative().optional(),
  createdBy: z.string(),
  createdAt: z.string(),
});

export type EventCommunication = z.infer<typeof eventCommunicationSchema>;

// ============================================================================
// Pricing Tiers (Package Options)
// ============================================================================

export const eventPricingTierSchema = z.object({
  id: z.string(),
  name: z.string(), // e.g., "Full Event Pass", "Day Pass", "Student"
  description: z.string().optional(),
  priceUsd: z.number().nonnegative(),
  capacity: z.number().int().positive().optional(), // Limited spots for this tier
  soldCount: z.number().int().nonnegative().default(0),
  includedSessions: z.array(z.string()).optional(), // null means all sessions
  includesAccommodation: z.boolean().default(false),
  accommodationRef: z.string().optional(), // Link to itinerary lodging
  earlyBirdDeadline: z.string().optional(),
  earlyBirdPriceUsd: z.number().nonnegative().optional(),
});

export type EventPricingTier = z.infer<typeof eventPricingTierSchema>;

// ============================================================================
// Main Event Operation Schema per A-3.3.2
// ============================================================================

export const eventOperationSchema = z.object({
  // Identity
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  tagline: z.string().optional(),
  description: z.string(),

  // Classification
  eventType: eventTypeSchema,

  // Date range for multi-day events
  dateRange: z.object({
    start: z.string(), // ISO date
    end: z.string(),   // ISO date
  }),

  // Sessions (individual time blocks)
  sessions: z.array(eventSessionSchema).default([]),

  // Capacity
  capacityTotal: z.number().int().positive(),
  registeredCount: z.number().int().nonnegative().default(0),
  waitlistCount: z.number().int().nonnegative().default(0),
  waitlistEnabled: z.boolean().default(true),

  // Registration window
  registrationOpen: z.string(), // ISO timestamp
  registrationClose: z.string(), // ISO timestamp

  // Status lifecycle
  status: eventStatusSchema.default('planning'),
  statusHistory: z.array(z.object({
    status: eventStatusSchema,
    changedAt: z.string(),
    changedBy: z.string(),
    reason: z.string().optional(),
  })).default([]),

  // Pricing
  pricingTiers: z.array(eventPricingTierSchema).default([]),

  // Partner assignments
  partners: z.array(eventPartnerAssignmentSchema).default([]),

  // Communications
  communications: z.array(eventCommunicationSchema).default([]),

  // Location
  venue: z.string(),
  venueAddress: z.string().optional(),
  locationNotes: z.string().optional(), // Directions, parking, etc.

  // Media
  heroImageUrl: z.string().optional(),
  galleryUrls: z.array(z.string()).default([]),

  // Metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  publishedAt: z.string().optional(),
  cancelledAt: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export type EventOperation = z.infer<typeof eventOperationSchema>;

// ============================================================================
// Event Registration per A-3.3.6 (DEC-070)
// ============================================================================

export const eventRegistrationStatusSchema = z.enum([
  'pending_payment',
  'confirmed',
  'waitlisted',
  'cancelled',
  'refunded',
  'checked_in',
]);

export type EventRegistrationStatus = z.infer<typeof eventRegistrationStatusSchema>;

export const eventRegistrationSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  pricingTierId: z.string(),

  // Registrant info
  guestEmail: z.string().email(),
  profileId: z.string().optional(), // Link to CRM profile
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),

  // Session selections (for events with optional sessions)
  selectedSessions: z.array(z.string()).default([]),

  // Accommodation (if included in tier)
  accommodationBookingRef: z.string().optional(),

  // Dietary/accessibility
  dietaryRequirements: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string(),
  }).optional(),

  // Status
  status: eventRegistrationStatusSchema.default('pending_payment'),
  statusHistory: z.array(z.object({
    status: eventRegistrationStatusSchema,
    changedAt: z.string(),
    changedBy: z.string().optional(),
    reason: z.string().optional(),
  })).default([]),

  // Payment
  amountPaidUsd: z.number().nonnegative().default(0),
  paymentRef: z.string().optional(), // Stripe payment ID
  paidAt: z.string().optional(),

  // Check-in
  checkedInAt: z.string().optional(),
  checkedInBy: z.string().optional(),

  // Audit
  createdAt: z.string(),
  updatedAt: z.string(),
  registeredBy: z.string().optional(), // 'self' or operator ID
  notes: z.string().optional(),
});

export type EventRegistration = z.infer<typeof eventRegistrationSchema>;

// ============================================================================
// Query Options
// ============================================================================

export interface EventQueryOptions {
  status?: EventStatus | EventStatus[];
  eventType?: EventType | EventType[];
  fromDate?: string;
  toDate?: string;
  limit?: number;
}

export interface RegistrationQueryOptions {
  eventId?: string;
  guestEmail?: string;
  profileId?: string;
  status?: EventRegistrationStatus | EventRegistrationStatus[];
  limit?: number;
}
