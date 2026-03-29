import { z } from 'zod';

export const workshopSessionSchema = z.object({
  id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  spotsAvailable: z.number().int().nonnegative(),
  status: z.enum(['open', 'full', 'cancelled']),
});

export const workshopProgramSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.enum(['craft', 'photography']),
  description: z.string(),
  summary: z.string(),
  instructorName: z.string(),
  instructorBio: z.string().optional(),
  heroImage: z.string().optional(),
  duration: z.object({
    hours: z.number(),
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
  schedule: z.array(workshopSessionSchema),
  status: z.enum(['draft', 'published', 'archived']),
  intakeSchemaRef: z.string(),
  waiverRequired: z.boolean(),
  specialInstructions: z.string().optional(),
  shippingFollowUp: z.object({
    required: z.boolean(),
    description: z.string().optional(),
  }).optional(),
});

export const intakeQuestionSchema = z.object({
  questionId: z.string(),
  label: z.string(),
  type: z.enum(['short_text', 'long_text', 'single_select', 'boolean', 'number']),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

export const intakeSchemaDefinitionSchema = z.object({
  schemaRef: z.string(),
  schemaVersion: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(intakeQuestionSchema),
});

export type WorkshopProgram = z.infer<typeof workshopProgramSchema>;
export type WorkshopSession = z.infer<typeof workshopSessionSchema>;
export type IntakeQuestion = z.infer<typeof intakeQuestionSchema>;
export type IntakeSchemaDefinition = z.infer<typeof intakeSchemaDefinitionSchema>;
