import { z } from 'zod';

export const workshopWaiverAcknowledgementSchema = z.object({
  id: z.string(),
  workshopSlug: z.string(),
  sessionId: z.string(),
  guestName: z.string(),
  guestEmail: z.string().email(),
  acknowledgedAt: z.string(),
  policyVersion: z.string(),
});

export const workshopRegistrationSchema = z.object({
  id: z.string(),
  workshopSlug: z.string(),
  sessionId: z.string(),
  guestName: z.string(),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  intakeSchemaRef: z.string(),
  intakeSchemaVersion: z.string(),
  intakeResponses: z.record(z.union([z.string(), z.number(), z.boolean()])),
  waiverId: z.string(),
  waiverAcknowledgedAt: z.string(),
  registeredAt: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  confirmationSent: z.boolean(),
  notes: z.string().optional(),
});

export const workshopEmailCaptureSchema = z.object({
  id: z.string(),
  template: z.literal('workshop-confirmation'),
  recipient: z.string().email(),
  subject: z.string(),
  renderedAt: z.string(),
  registrationId: z.string(),
  payload: z.record(z.unknown()),
});

export type WorkshopWaiverAcknowledgement = z.infer<typeof workshopWaiverAcknowledgementSchema>;
export type WorkshopRegistration = z.infer<typeof workshopRegistrationSchema>;
export type WorkshopEmailCapture = z.infer<typeof workshopEmailCaptureSchema>;
