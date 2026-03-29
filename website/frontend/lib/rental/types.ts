import { z } from 'zod';

// Rental booking lifecycle states per A-2.2.5
export const rentalBookingStateSchema = z.enum([
  'quoted',
  'reserved',
  'delivered',
  'active',
  'returned',
  'inspected',
  'closed',
]);

export type RentalBookingState = z.infer<typeof rentalBookingStateSchema>;

// Rental asset categories - single flagship for A-2.2.2
export const rentalAssetCategorySchema = z.enum([
  'excavator',
  'heavy-equipment',
  'camera',
  'telescope',
  'outdoor-gear',
  'craft-supplies',
  'tractor',
  'utility-vehicle',
  'trailer',
  'water-equipment',
]);

export type RentalAssetCategory = z.infer<typeof rentalAssetCategorySchema>;

// Rental asset status
export const rentalAssetStatusSchema = z.enum([
  'available',
  'reserved',
  'rented',
  'maintenance',
  'retired',
]);

export type RentalAssetStatus = z.infer<typeof rentalAssetStatusSchema>;

// Rental asset definition
export const rentalAssetSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: rentalAssetCategorySchema,
  description: z.string(),
  specifications: z.array(z.string()),
  dailyRate: z.number().nonnegative(),
  weeklyRate: z.number().nonnegative().optional(),
  depositRequired: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  status: rentalAssetStatusSchema,
  maintenanceFlag: z.boolean().default(false), // A-2.2.6: parallel flag
  images: z.array(z.object({
    url: z.string(),
    alt: z.string(),
  })),
  deliveryNotes: z.string().optional(),
  operatingRequirements: z.array(z.string()),
  insuranceRequired: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export type RentalAsset = z.infer<typeof rentalAssetSchema>;

// Inspection evidence per A-2.2.4
export const inspectionPhotoSchema = z.object({
  id: z.string(),
  url: z.string(),
  angle: z.enum(['front', 'back', 'left', 'right', 'console', 'damage']),
  capturedAt: z.string(),
  notes: z.string().optional(),
});

export type InspectionPhoto = z.infer<typeof inspectionPhotoSchema>;

export const inspectionEvidenceSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  type: z.enum(['checkout', 'checkin']),
  photos: z.array(inspectionPhotoSchema).min(5), // A-2.2.4: 4 exterior + 1 console minimum
  videoUrl: z.string().optional(), // Optional 30-second walkthrough
  operatorNotes: z.string().optional(),
  damageNoted: z.boolean().default(false),
  damageDescription: z.string().optional(),
  customerAcknowledged: z.boolean().default(false),
  customerSignature: z.string().optional(), // Base64 or name
  capturedAt: z.string(),
  capturedBy: z.string(), // Operator identifier
  deviceInfo: z.string().optional(), // Mobile device info for audit
  offlineQueued: z.boolean().default(false), // A-2.2.3: offline tolerance
});

export type InspectionEvidence = z.infer<typeof inspectionEvidenceSchema>;

// State transition record per A-2.2.5
export const stateTransitionSchema = z.object({
  fromState: rentalBookingStateSchema.nullable(),
  toState: rentalBookingStateSchema,
  transitionedAt: z.string(),
  transitionedBy: z.string(),
  notes: z.string().optional(),
});

export type StateTransition = z.infer<typeof stateTransitionSchema>;

// Deposit event types
export const depositEventTypeSchema = z.enum([
  'hold_placed',
  'hold_released',
  'partial_charge',
  'full_charge',
  'refunded',
]);

export type DepositEventType = z.infer<typeof depositEventTypeSchema>;

export const depositEventSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  type: depositEventTypeSchema,
  amount: z.number(),
  occurredAt: z.string(),
  notes: z.string().optional(),
  stripePaymentIntentId: z.string().optional(),
});

export type DepositEvent = z.infer<typeof depositEventSchema>;

// Tax event for local records per HF-806
export const taxEventSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  taxType: z.enum(['county_rental_tax', 'state_sales_tax']),
  rate: z.number(), // e.g., 0.0825 for 8.25%
  baseAmount: z.number(),
  taxAmount: z.number(),
  calculatedAt: z.string(),
});

export type TaxEvent = z.infer<typeof taxEventSchema>;

// Delivery event per HF-807
export const deliveryEventSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  type: z.enum(['delivery', 'pickup']),
  scheduledAt: z.string(),
  departedAt: z.string().optional(),
  arrivedAt: z.string().optional(),
  completedAt: z.string().optional(),
  operatorNotes: z.string().optional(),
  customerAcknowledged: z.boolean().default(false),
  deliveryAddress: z.string().optional(),
  deliveryCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

export type DeliveryEvent = z.infer<typeof deliveryEventSchema>;

// Quote request - public facing per A-2.2.1
export const quoteRequestSchema = z.object({
  id: z.string(),
  assetId: z.string(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  requestedStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  requestedEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  deliveryRequired: z.boolean(),
  deliveryAddress: z.string().optional(),
  intendedUse: z.string().min(10),
  previousRentalExperience: z.boolean(),
  insuranceConfirmed: z.boolean(),
  policyAcknowledged: z.boolean(),
  createdAt: z.string(),
  status: z.enum(['pending', 'quoted', 'approved', 'rejected', 'expired']),
  operatorNotes: z.string().optional(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

// Rental booking - the core lifecycle object
export const rentalBookingSchema = z.object({
  id: z.string(),
  quoteRequestId: z.string().optional(),
  assetId: z.string(),
  assetName: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),

  // Dates
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  // Delivery
  deliveryRequired: z.boolean(),
  deliveryAddress: z.string().optional(),
  deliveryScheduled: z.string().optional(),
  pickupScheduled: z.string().optional(),

  // Pricing - stored locally per HF-806
  dailyRate: z.number().nonnegative(),
  totalDays: z.number().int().positive(),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  taxAmount: z.number().nonnegative(),
  depositAmount: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),

  // State machine per A-2.2.5
  state: rentalBookingStateSchema,
  maintenanceFlag: z.boolean().default(false), // A-2.2.6: parallel flag
  stateHistory: z.array(stateTransitionSchema),

  // References
  checkoutInspectionId: z.string().optional(),
  checkinInspectionId: z.string().optional(),

  // Timestamps
  createdAt: z.string(),
  updatedAt: z.string(),
  reservedAt: z.string().optional(),
  deliveredAt: z.string().optional(),
  activatedAt: z.string().optional(),
  returnedAt: z.string().optional(),
  inspectedAt: z.string().optional(),
  closedAt: z.string().optional(),

  // Operator
  approvedBy: z.string().optional(),
  operatorNotes: z.string().optional(),
});

export type RentalBooking = z.infer<typeof rentalBookingSchema>;

// API response types
export const quoteResponseSchema = z.object({
  assetId: z.string(),
  assetName: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  totalDays: z.number(),
  dailyRate: z.number(),
  subtotal: z.number(),
  deliveryFee: z.number(),
  taxEstimate: z.number(),
  depositRequired: z.number(),
  totalEstimate: z.number(),
  validUntil: z.string(),
});

export type QuoteResponse = z.infer<typeof quoteResponseSchema>;
