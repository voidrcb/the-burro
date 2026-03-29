import { z } from 'zod';

export type MirrorContract = 'MIRROR' | 'VIEW_MODEL';

export type Page = {
  slug: string;
  title: string;
  summary: string;
  publicStatus: 'draft' | 'active' | 'archived';
  layout: 'landing' | 'content' | 'grid';
};

export type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
  tags: string[];
  summary: string;
};

export type ActivismUpdate = {
  update_id: string;
  title: string;
  status_date: string;
  status_type: 'policy_change' | 'litigation' | 'local_resolution' | 'event' | 'media' | 'call_to_action';
  summary: string;
  source_pack_ref: string;
  public_visibility: boolean;
};

export type NewsletterSubscriber = {
  email: string;
  source: 'public_site';
  subscribedAt: string;
  status: 'pending_postmark' | 'active';
};

export type PageMeta = {
  eyebrow: string;
  title: string;
  summary: string;
};

export type WorkshopProgram = {
  slug: string;
  title: string;
  category: 'craft' | 'photography';
  description: string;
  summary: string;
  instructorName: string;
  instructorBio?: string;
  heroImage?: string;
  duration: {
    hours: number;
    format: 'single-session' | 'multi-day';
  };
  capacity: {
    min: number;
    max: number;
  };
  pricing: {
    basePrice: number;
    depositRequired?: number;
    materialsIncluded: boolean;
    materialsFee?: number;
  };
  schedule: WorkshopSession[];
  status: 'draft' | 'published' | 'archived';
  intakeSchemaRef: string;
  waiverRequired: boolean;
  specialInstructions?: string;
  shippingFollowUp?: {
    required: boolean;
    description?: string;
  };
};

export type WorkshopSession = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  spotsAvailable: number;
  status: 'open' | 'full' | 'cancelled';
};

export type WorkshopIntakeQuestion = {
  questionId: string;
  label: string;
  helpText?: string;
  type: 'short_text' | 'long_text' | 'number' | 'boolean' | 'single_select';
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
};

export type WorkshopIntakeSchema = {
  schemaRef: string;
  schemaVersion: string;
  title: string;
  description: string;
  questions: WorkshopIntakeQuestion[];
};

export type MaintenanceEntry = {
  date: string;
  description: string;
  resolvedAt?: string;
};

export type EquipmentAsset = {
  id: string;
  slug: string;
  name: string;
  category: 'camera' | 'telescope' | 'outdoor-gear' | 'craft-supplies' | 'excavator' | 'heavy-equipment';
  description: string;
  dailyRate: number;
  weeklyRate?: number;
  depositRequired: number;
  deliveryFee?: number;
  status: 'available' | 'reserved' | 'maintenance' | 'retired';
  maintenanceLog: Array<MaintenanceEntry & { resolution?: string }>;
  images?: Array<string | { url: string; alt: string }>;
  specifications?: string[];
  deliveryNotes?: string;
  operatingRequirements?: string[];
  insuranceRequired?: boolean;
  featured?: boolean;
};

/** @deprecated Use ExperienceProduct from `@/lib/experience/types` as the canonical experience contract. */
export type Experience = {
  experience_id: string;
  name: string;
  category: 'river' | 'stargazing' | 'craft' | 'mining_history' | 'boquillas_partner' | 'offroad' | 'wellness' | 'retreat' | 'touring';
  delivery_model: 'owned' | 'partner_led' | 'guide_led' | 'self_guided';
  meeting_point: string;
  seasonality: Record<string, string>;
  safety_level: 'low' | 'medium' | 'high';
  waiver_required: boolean;
};

export type LodgingUnit = {
  unit_id: string;
  name: string;
  unit_type: 'tent' | 'safari_tent' | 'yurt' | 'dome' | 'cabin' | 'a_frame' | 'pod';
  zone_id: string;
  capacity: number;
  private_bath: boolean;
  hvac: boolean;
  solar_backed: boolean;
  public_status: 'planned' | 'active' | 'hidden' | 'maintenance';
  base_rate_ruleset_id: string;
};

export const contractMap = {
  Page: 'VIEW_MODEL',
  BlogPost: 'VIEW_MODEL',
  ActivismUpdate: 'MIRROR',
  NewsletterSubscriber: 'VIEW_MODEL',
  PageMeta: 'VIEW_MODEL',
  WorkshopProgram: 'MIRROR',
  Experience: 'MIRROR',
  LodgingUnit: 'MIRROR',
} as const satisfies Record<string, MirrorContract>;

export const pageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  publicStatus: z.enum(['draft', 'active', 'archived']),
  layout: z.enum(['landing', 'content', 'grid']),
});

export const blogPostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  publishedAt: z.string(),
  tags: z.array(z.string()),
  summary: z.string(),
});

export const activismUpdateSchema = z.object({
  update_id: z.string(),
  title: z.string(),
  status_date: z.string(),
  status_type: z.enum(['policy_change', 'litigation', 'local_resolution', 'event', 'media', 'call_to_action']),
  summary: z.string(),
  source_pack_ref: z.string(),
  public_visibility: z.boolean(),
});

export const newsletterSubscriberSchema = z.object({
  email: z.string().email(),
  source: z.literal('public_site'),
  subscribedAt: z.string(),
  status: z.enum(['pending_postmark', 'active']),
});

export const pageMetaSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  summary: z.string(),
});

export const workshopSessionSchema = z.object({
  id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  spotsAvailable: z.number().int().nonnegative(),
  status: z.enum(['open', 'full', 'cancelled']),
});

export const workshopSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.enum(['craft', 'photography']),
  description: z.string(),
  summary: z.string(),
  instructorName: z.string(),
  instructorBio: z.string().optional(),
  heroImage: z.string().optional(),
  duration: z.object({
    hours: z.number().positive(),
    format: z.enum(['single-session', 'multi-day']),
  }),
  capacity: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
  }),
  pricing: z.object({
    basePrice: z.number().nonnegative(),
    depositRequired: z.number().nonnegative().optional(),
    materialsIncluded: z.boolean(),
    materialsFee: z.number().nonnegative().optional(),
  }),
  schedule: z.array(workshopSessionSchema).min(1),
  status: z.enum(['draft', 'published', 'archived']),
  intakeSchemaRef: z.string(),
  waiverRequired: z.boolean(),
  specialInstructions: z.string().optional(),
  shippingFollowUp: z
    .object({
      required: z.boolean(),
      description: z.string().optional(),
    })
    .optional(),
});

export const workshopIntakeQuestionSchema = z.object({
  questionId: z.string(),
  label: z.string(),
  helpText: z.string().optional(),
  type: z.enum(['short_text', 'long_text', 'number', 'boolean', 'single_select']),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

export const workshopIntakeSchema = z.object({
  schemaRef: z.string(),
  schemaVersion: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(workshopIntakeQuestionSchema).min(1),
});

export const maintenanceEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string(),
  resolvedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const equipmentAssetSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.enum(['camera', 'telescope', 'outdoor-gear', 'craft-supplies', 'excavator', 'heavy-equipment']),
  description: z.string(),
  dailyRate: z.number().nonnegative(),
  weeklyRate: z.number().nonnegative().optional(),
  depositRequired: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative().optional(),
  status: z.enum(['available', 'reserved', 'maintenance', 'retired']),
  maintenanceLog: z.array(maintenanceEntrySchema.extend({ resolution: z.string().optional() })),
  images: z.array(z.union([z.string(), z.object({ url: z.string(), alt: z.string() })])).optional(),
  specifications: z.array(z.string()).optional(),
  deliveryNotes: z.string().optional(),
  operatingRequirements: z.array(z.string()).optional(),
  insuranceRequired: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const experienceSchema = z.object({
  experience_id: z.string(),
  name: z.string(),
  category: z.enum(['river', 'stargazing', 'craft', 'mining_history', 'boquillas_partner', 'offroad', 'wellness', 'retreat', 'touring']),
  delivery_model: z.enum(['owned', 'partner_led', 'guide_led', 'self_guided']),
  meeting_point: z.string(),
  seasonality: z.record(z.string()),
  safety_level: z.enum(['low', 'medium', 'high']),
  waiver_required: z.boolean(),
});

export const lodgingUnitSchema = z.object({
  unit_id: z.string(),
  name: z.string(),
  unit_type: z.enum(['tent', 'safari_tent', 'yurt', 'dome', 'cabin', 'a_frame', 'pod']),
  zone_id: z.string(),
  capacity: z.number().int(),
  private_bath: z.boolean(),
  hvac: z.boolean(),
  solar_backed: z.boolean(),
  public_status: z.enum(['planned', 'active', 'hidden', 'maintenance']),
  base_rate_ruleset_id: z.string(),
});
