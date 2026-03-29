import { z } from 'zod';

const monthSchema = z.enum(['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']);

export type Month = z.infer<typeof monthSchema>;

export const experienceProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.enum(['river', 'stargazing', 'craft', 'mining_history', 'boquillas_partner', 'offroad', 'wellness', 'touring']),
  deliveryModel: z.enum(['owned', 'partner_led', 'guide_led', 'self_guided']),
  partnerRef: z.string().optional(),
  partnerName: z.string().optional(),
  locationSummary: z.string(),
  meetingPoint: z.string(),
  durationHours: z.number().positive(),
  priceUsd: z.number().nonnegative(),
  maxGroupSize: z.number().int().positive(),
  seasonality: z.object({
    available: z.array(monthSchema).min(1),
    peakMonths: z.array(monthSchema).optional(),
    unavailable: z.array(monthSchema).optional(),
  }),
  safetyLevel: z.enum(['low', 'medium', 'high']),
  waiverRequired: z.boolean(),
  status: z.enum(['available', 'seasonal', 'coming-soon', 'private']),
  summary: z.string(),
  description: z.string(),
  images: z.array(z.string()).min(1),
});

export type ExperienceProduct = z.infer<typeof experienceProductSchema>;
