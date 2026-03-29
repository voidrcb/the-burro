import { z } from 'zod';

/**
 * Partner Entity Contract per A-2.4.1 (DEC-046)
 *
 * Canonical partner record definition with identity, contact, category,
 * approval status, liability, revenue model, and CMS rights fields.
 */

// Partner categories per HF-2401
export const partnerCategorySchema = z.enum([
  'guide',
  'artisan',
  'observatory',
  'preservation_org',
  'local_maker',
  'hospitality',
  'transport',
]);

export type PartnerCategory = z.infer<typeof partnerCategorySchema>;

// Partner approval status lifecycle per HF-2401
export const partnerApprovalStatusSchema = z.enum([
  'pending',
  'approved',
  'suspended',
  'inactive',
]);

export type PartnerApprovalStatus = z.infer<typeof partnerApprovalStatusSchema>;

// Revenue model types per HF-2406
export const partnerRevenueModelSchema = z.enum([
  'referral_fee',
  'commission_pct',
  'flat_fee',
]);

export type PartnerRevenueModel = z.infer<typeof partnerRevenueModelSchema>;

// Liability acknowledgment fields
export const partnerLiabilitySchema = z.object({
  waiverAccepted: z.boolean(),
  waiverAcceptedAt: z.string().optional(),
  insuranceVerified: z.boolean(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceExpiresAt: z.string().optional(),
});

export type PartnerLiability = z.infer<typeof partnerLiabilitySchema>;

// CMS publication rights per HF-2401
export const partnerCmsRightsSchema = z.object({
  canPublish: z.boolean(),
  requiresReview: z.boolean(),
  publishedExperienceCount: z.number().int().nonnegative().default(0),
});

export type PartnerCmsRights = z.infer<typeof partnerCmsRightsSchema>;

// Contact information
export const partnerContactSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  primaryContactName: z.string(),
  primaryContactRole: z.string().optional(),
  preferredLanguage: z.enum(['en', 'es']).default('en'),
});

export type PartnerContact = z.infer<typeof partnerContactSchema>;

// Main Partner Record schema per A-2.4.1
export const partnerRecordSchema = z.object({
  // Identity
  id: z.string(),
  slug: z.string(),
  legalName: z.string(),
  displayName: z.string(),

  // Contact
  contact: partnerContactSchema,

  // Category
  category: partnerCategorySchema,

  // Approval status lifecycle
  approvalStatus: partnerApprovalStatusSchema,
  approvalStatusHistory: z.array(z.object({
    status: partnerApprovalStatusSchema,
    changedAt: z.string(),
    changedBy: z.string(),
    reason: z.string().optional(),
  })),

  // Liability acknowledgment
  liability: partnerLiabilitySchema,

  // Revenue model
  revenueModel: partnerRevenueModelSchema,
  defaultCommissionRate: z.number().min(0).max(1).optional(), // e.g., 0.15 for 15%

  // CMS publication rights
  cmsRights: partnerCmsRightsSchema,

  // Location info
  serviceArea: z.string().optional(), // e.g., "Big Bend Region"
  physicalAddress: z.string().optional(),

  // Audit
  createdAt: z.string(),
  updatedAt: z.string(),
  onboardedBy: z.string().optional(),
  notes: z.string().optional(),
});

export type PartnerRecord = z.infer<typeof partnerRecordSchema>;

/**
 * Commission Rule type per A-2.4.6 (DEC-051)
 *
 * Defines commission calculation rules with partner/category scope,
 * model, rate, and timing fields.
 */
export const commissionCalculationTimingSchema = z.enum([
  'booking',
  'confirmation',
  'completion',
]);

export type CommissionCalculationTiming = z.infer<typeof commissionCalculationTimingSchema>;

export const commissionProductTypeSchema = z.enum([
  'experience',
  'goods',
  'all',
]);

export type CommissionProductType = z.infer<typeof commissionProductTypeSchema>;

export const commissionModelSchema = z.enum([
  'percentage',
  'flat_fee',
  'referral_only',
]);

export type CommissionModel = z.infer<typeof commissionModelSchema>;

export const commissionRuleSchema = z.object({
  id: z.string(),
  partnerId: z.string(), // 'default' for category-wide rules
  productType: commissionProductTypeSchema,
  model: commissionModelSchema,
  rate: z.number().nonnegative(), // percentage as decimal or flat fee amount
  calculatedAt: commissionCalculationTimingSchema,
  validFrom: z.string(), // ISO date
  validTo: z.string().optional(), // ISO date, null means no expiry
  priority: z.number().int().default(0), // Higher priority rules override lower
  createdAt: z.string(),
  updatedAt: z.string(),
  notes: z.string().optional(),
});

export type CommissionRule = z.infer<typeof commissionRuleSchema>;

/**
 * Marketplace Publication State Machine per A-2.4.4 (DEC-049)
 *
 * 6-state workflow for marketplace item publication.
 */
export const marketplacePublicationStateSchema = z.enum([
  'draft',
  'pending_review',
  'approved',
  'published',
  'suspended',
  'archived',
]);

export type MarketplacePublicationState = z.infer<typeof marketplacePublicationStateSchema>;

export const marketplaceStateTransitionSchema = z.object({
  fromState: marketplacePublicationStateSchema.nullable(),
  toState: marketplacePublicationStateSchema,
  transitionedAt: z.string(),
  transitionedBy: z.string(),
  notes: z.string().optional(),
});

export type MarketplaceStateTransition = z.infer<typeof marketplaceStateTransitionSchema>;

// Marketplace item wrapper for partner experiences/goods
export const marketplaceItemSchema = z.object({
  id: z.string(),
  partnerId: z.string(),
  itemType: z.enum(['experience', 'goods']),
  itemRef: z.string(), // Reference to ExperienceProduct.id or goods item
  publicationState: marketplacePublicationStateSchema,
  stateHistory: z.array(marketplaceStateTransitionSchema),
  reviewerRequired: z.boolean().default(true),
  lastReviewedBy: z.string().optional(),
  lastReviewedAt: z.string().optional(),
  publishedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type MarketplaceItem = z.infer<typeof marketplaceItemSchema>;

/**
 * Partner Experience Link per A-2.4.2 (DEC-047)
 *
 * Partner experiences use existing ExperienceProduct type with mandatory
 * partnerRef link to PartnerRecord. This type provides validation.
 */
export const partnerExperienceLinkSchema = z.object({
  experienceId: z.string(),
  partnerId: z.string(),
  linkedAt: z.string(),
  linkedBy: z.string(),
  commissionRuleId: z.string().optional(),
});

export type PartnerExperienceLink = z.infer<typeof partnerExperienceLinkSchema>;

/**
 * Local Maker Goods Reference per A-2.4.5 (DEC-050)
 *
 * Sprint 2.4 limits local goods to referral links and single featured maker.
 * No consignment or inventory tracking in this sprint.
 */
export const localMakerGoodsRefSchema = z.object({
  id: z.string(),
  partnerId: z.string(),
  name: z.string(),
  description: z.string(),
  referralUrl: z.string().url(),
  imageUrl: z.string().optional(),
  featured: z.boolean().default(false), // Single featured maker allowed
  category: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type LocalMakerGoodsRef = z.infer<typeof localMakerGoodsRefSchema>;

/**
 * Partner Governance Extension per A-3.3.1 (DEC-065)
 *
 * Tier system, insurance requirements, performance thresholds,
 * and suspension triggers for partner governance.
 */
export const partnerTierSchema = z.enum([
  'starter',    // No self-service, operator creates/edits all content
  'standard',   // Can edit own descriptions, operator approves
  'premium',    // Can publish directly, audit-only oversight
]);

export type PartnerTier = z.infer<typeof partnerTierSchema>;

export const performanceThresholdSchema = z.object({
  metric: z.string(), // e.g., 'booking_completion_rate', 'review_score', 'response_time_hours'
  minimum: z.number(),
  measurementPeriodDays: z.number().int().positive().default(90),
});

export type PerformanceThreshold = z.infer<typeof performanceThresholdSchema>;

export const partnerGovernanceSchema = z.object({
  // Tier determines self-service level per A-3.3.7
  tier: partnerTierSchema.default('starter'),

  // Content review requirements based on tier
  contentReviewRequired: z.boolean().default(true), // false only for premium

  // Insurance requirements
  insuranceRequired: z.boolean().default(false),
  insuranceMinimumUsd: z.number().nullable().default(null), // Minimum coverage amount

  // Performance thresholds
  performanceThresholds: z.array(performanceThresholdSchema).default([]),

  // Suspension triggers (e.g., 'insurance_expired', 'low_rating', 'unresponsive')
  suspensionTriggers: z.array(z.string()).default([]),

  // Offboarding notice period
  offboardingNoticeDays: z.number().int().positive().default(30),

  // Self-service capabilities per tier
  selfServiceCapabilities: z.object({
    canEditDescription: z.boolean().default(false),
    canEditPricing: z.boolean().default(false),
    canEditAvailability: z.boolean().default(false),
    canPublishDirectly: z.boolean().default(false),
  }).default({}),

  // Governance metadata
  tierChangedAt: z.string().optional(),
  tierChangedBy: z.string().optional(),
  lastPerformanceReviewAt: z.string().optional(),
});

export type PartnerGovernance = z.infer<typeof partnerGovernanceSchema>;

/**
 * Extended Partner Record with Governance per A-3.3.1
 *
 * Extends the base PartnerRecord with governance fields.
 */
export const extendedPartnerRecordSchema = partnerRecordSchema.extend({
  governance: partnerGovernanceSchema.default({}),
});

export type ExtendedPartnerRecord = z.infer<typeof extendedPartnerRecordSchema>;
