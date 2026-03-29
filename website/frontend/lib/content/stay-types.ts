import { z } from 'zod';

export const stayPhotoSchema = z.object({
  url: z.string(),
  alt: z.string(),
});

export const stayPoliciesSchema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  cancellation: z.string(),
  pets: z.string(),
  smoking: z.string(),
  access: z.string(),
  weather: z.string(),
});

export const lodgingUnitSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  shortDescription: z.string(),
  capacity: z.object({
    adults: z.number().int().nonnegative(),
    children: z.number().int().nonnegative(),
  }),
  amenities: z.array(z.string()).min(1),
  photos: z.array(stayPhotoSchema).min(1),
  policies: stayPoliciesSchema,
  lodgifyPropertyId: z.string().optional(),
  status: z.enum(['available', 'coming_soon', 'private']),
  featured: z.boolean().default(false),
});

export const unitRateSchema = z.object({
  unitId: z.string(),
  nightly: z.number().nonnegative(),
  weeklyDiscount: z.number().nonnegative().optional(),
  cleaningFee: z.number().nonnegative(),
});

export const seasonalRateSchema = z.object({
  seasonId: z.string(),
  name: z.string(),
  startDate: z.string().regex(/^\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{2}-\d{2}$/),
  rates: z.array(unitRateSchema).min(1),
  blackoutDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).default([]),
});

export const rateRulesetSchema = z.object({
  defaultRate: z.object({
    nightly: z.number().nonnegative(),
    cleaningFee: z.number().nonnegative(),
  }),
  seasons: z.array(seasonalRateSchema).min(1),
});

export const waiverAcknowledgementSchema = z.object({
  id: z.string(),
  guestEmail: z.string().email(),
  guestName: z.string(),
  unitId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  acknowledgedAt: z.string(),
  policyVersion: z.string(),
  ipAddress: z.string().optional(),
});

export const partySizeSchema = z.object({
  adults: z.number().int().nonnegative(),
  children: z.number().int().nonnegative(),
});

export const bookingRecordSchema = z.object({
  id: z.string(),
  lodgifyBookingId: z.string().optional(),
  unitId: z.string(),
  guestName: z.string(),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  checkIn: z.string(),
  checkOut: z.string(),
  partySize: partySizeSchema,
  specialRequests: z.string().optional(),
  totalAmount: z.number().nonnegative().optional(),
  depositAmount: z.number().nonnegative().optional(),
  waiverId: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  createdAt: z.string(),
  confirmedAt: z.string().optional(),
  operatorNotifiedAt: z.string().optional(),
  guestNotifiedAt: z.string().optional(),
  redirectUrl: z.string().optional(),
});

export const bookingEmailCaptureSchema = z.object({
  id: z.string(),
  template: z.literal('booking-confirmation'),
  recipient: z.string().email(),
  subject: z.string(),
  renderedAt: z.string(),
  bookingId: z.string(),
  payload: z.record(z.unknown()),
});

export type LodgingUnit = z.infer<typeof lodgingUnitSchema>;
export type RateRuleset = z.infer<typeof rateRulesetSchema>;
export type SeasonalRate = z.infer<typeof seasonalRateSchema>;
export type WaiverAcknowledgement = z.infer<typeof waiverAcknowledgementSchema>;
export type BookingRecord = z.infer<typeof bookingRecordSchema>;
export type BookingEmailCapture = z.infer<typeof bookingEmailCaptureSchema>;
