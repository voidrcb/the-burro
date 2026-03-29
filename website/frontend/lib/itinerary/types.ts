import { z } from 'zod';

export const itineraryComponentSchema = z.object({
  type: z.enum(['lodging', 'workshop', 'experience']),
  refId: z.string(),
  title: z.string(),
  dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1),
  quantity: z.number().int().positive(),
  priceAtDraft: z.number().nonnegative(),
  holdStatus: z.enum(['pending', 'held', 'released', 'confirmed']),
  notes: z.string().optional(),
});

export const itineraryDraftSchema = z.object({
  id: z.string(),
  shareSlug: z.string(),
  title: z.string(),
  source: z.enum(['manual', 'burro']),
  templateRef: z.string().optional(),
  dateRange: z.object({
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  components: z.array(itineraryComponentSchema).min(2),
  totalPrice: z.number().nonnegative(),
  packageAdjustment: z
    .object({
      type: z.enum(['discount', 'surcharge']),
      amount: z.number().nonnegative(),
      reason: z.string(),
    })
    .optional(),
  pricingRuleIds: z.array(z.string()).default([]),
  status: z.enum(['draft', 'pending_review', 'approved', 'declined', 'expired']),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  notes: z.string().optional(),
  fallbackSuggestions: z.array(z.string()).default([]),
  validationNotes: z.array(z.string()).default([]),
  createdAt: z.string(),
  reviewedAt: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewNotes: z.string().optional(),
});

export const groupBookingSchema = z.object({
  id: z.string(),
  groupName: z.string(),
  facilitator: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  participantCount: z.number().int().positive(),
  itineraryRef: z.string(),
  depositRules: z.object({
    required: z.boolean(),
    amount: z.number().nonnegative().optional(),
    dueBy: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
  unitHolds: z.array(
    z.object({
      unitId: z.string(),
      dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1),
      status: z.enum(['held', 'confirmed', 'released']),
    }),
  ),
  notes: z.string(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  createdAt: z.string(),
});

export const packagePricingRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  triggerType: z.enum(['min_nights', 'group_size', 'seasonal', 'component_combo']),
  triggerValue: z.union([z.number(), z.string()]),
  adjustmentType: z.enum(['percentage_discount', 'fixed_discount', 'fixed_surcharge']),
  adjustmentValue: z.number(),
  applicableTo: z.enum(['all', 'lodging', 'experiences', 'workshops']),
  validFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  validTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  description: z.string().optional(),
});

export const capacityHoldSchema = z.object({
  id: z.string(),
  componentType: z.enum(['lodging', 'workshop', 'experience']),
  componentId: z.string(),
  itineraryRef: z.string(),
  dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1),
  quantity: z.number().int().positive(),
  holdStatus: z.enum(['active', 'converted', 'expired', 'released']),
  expiresAt: z.string(),
  createdAt: z.string(),
});

export const itineraryConfirmationSchema = z.object({
  id: z.string(),
  itineraryRef: z.string(),
  shareSlug: z.string(),
  capturedAt: z.string(),
  status: z.literal('approved'),
  title: z.string(),
  guestEmail: z.string().email().optional(),
  totalPrice: z.number().nonnegative(),
});

export type ItineraryComponent = z.infer<typeof itineraryComponentSchema>;
export type ItineraryDraft = z.infer<typeof itineraryDraftSchema>;
export type GroupBooking = z.infer<typeof groupBookingSchema>;
export type PackagePricingRule = z.infer<typeof packagePricingRuleSchema>;
export type CapacityHold = z.infer<typeof capacityHoldSchema>;
export type ItineraryConfirmation = z.infer<typeof itineraryConfirmationSchema>;
