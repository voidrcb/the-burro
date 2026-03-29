import { randomUUID } from 'crypto';
import { readdir } from 'fs/promises';
import path from 'path';

import { z } from 'zod';

import { getCmsPath, getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';
import { appendGuestEvent } from '@/lib/guest-events/store';
import { getWorkshopProgramBySlug } from '@/lib/content/workshops';
import {
  workshopEmailCaptureSchema,
  workshopRegistrationSchema,
  workshopWaiverAcknowledgementSchema,
  type WorkshopEmailCapture,
  type WorkshopRegistration,
  type WorkshopWaiverAcknowledgement,
} from '@/lib/workshop/types';

const workshopWaiverInputSchema = z.object({
  workshopSlug: z.string(),
  sessionId: z.string(),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  policyVersion: z.string().min(1),
});

const workshopRegistrationInputSchema = z.object({
  workshopSlug: z.string(),
  sessionId: z.string(),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  intakeSchemaRef: z.string(),
  intakeSchemaVersion: z.string(),
  intakeResponses: z.record(z.union([z.string(), z.number(), z.boolean()])),
  waiverId: z.string(),
});

function waiverPath(id: string): string {
  return getDataPath('workshop-waivers', `${id}.json`);
}

function registrationPath(id: string): string {
  return getDataPath('workshop-registrations', `${id}.json`);
}

function capturePath(id: string): string {
  return getDataPath('email-captures', `${id}.json`);
}

async function writeWorkshopProgram(program: unknown): Promise<void> {
  const parsed = z.any().parse(program) as { slug: string };
  await writeJsonFile(getCmsPath('workshops', `${parsed.slug}.json`), program);
}

export async function createWorkshopWaiverAcknowledgement(payload: unknown): Promise<WorkshopWaiverAcknowledgement> {
  const input = workshopWaiverInputSchema.parse(payload);
  const waiver = workshopWaiverAcknowledgementSchema.parse({
    id: `workshop_waiver_${randomUUID()}`,
    workshopSlug: input.workshopSlug,
    sessionId: input.sessionId,
    guestName: input.guestName,
    guestEmail: input.guestEmail.trim().toLowerCase(),
    acknowledgedAt: new Date().toISOString(),
    policyVersion: input.policyVersion,
  });

  await writeJsonFile(waiverPath(waiver.id), waiver);
  return waiver;
}

export async function readWorkshopWaiverById(id: string): Promise<WorkshopWaiverAcknowledgement | null> {
  const payload = await readJsonFile<WorkshopWaiverAcknowledgement | null>(waiverPath(id), null);
  const parsed = workshopWaiverAcknowledgementSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

export async function createWorkshopRegistration(payload: unknown): Promise<WorkshopRegistration> {
  const input = workshopRegistrationInputSchema.parse(payload);
  const waiver = await readWorkshopWaiverById(input.waiverId);
  if (!waiver) {
    throw new Error('Workshop waiver record not found.');
  }

  const program = await getWorkshopProgramBySlug(input.workshopSlug);
  if (!program) {
    throw new Error('Workshop program not found.');
  }

  const session = program.schedule.find((entry) => entry.id === input.sessionId);
  if (!session) {
    throw new Error('Workshop session not found.');
  }
  if (session.status !== 'open' || session.spotsAvailable <= 0) {
    throw new Error('Registration closed for this session.');
  }

  const registration = workshopRegistrationSchema.parse({
    id: `workshop_registration_${randomUUID()}`,
    workshopSlug: input.workshopSlug,
    sessionId: input.sessionId,
    guestName: input.guestName,
    guestEmail: input.guestEmail.trim().toLowerCase(),
    guestPhone: input.guestPhone,
    intakeSchemaRef: input.intakeSchemaRef,
    intakeSchemaVersion: input.intakeSchemaVersion,
    intakeResponses: input.intakeResponses,
    waiverId: input.waiverId,
    waiverAcknowledgedAt: waiver.acknowledgedAt,
    registeredAt: new Date().toISOString(),
    status: 'confirmed',
    confirmationSent: false,
  });

  const updatedSchedule = program.schedule.map((entry) => {
    if (entry.id !== input.sessionId) {
      return entry;
    }

    const nextSpots = Math.max(0, entry.spotsAvailable - 1);
    return {
      ...entry,
      spotsAvailable: nextSpots,
      status: nextSpots <= 0 ? 'full' : entry.status,
    };
  });

  await writeJsonFile(registrationPath(registration.id), registration);
  await writeWorkshopProgram({ ...program, schedule: updatedSchedule });
  await appendGuestEvent({
    guestEmail: registration.guestEmail,
    eventType: 'registration',
    eventRef: registration.id,
    occurredAt: registration.registeredAt,
    tags: [registration.status, registration.workshopSlug],
    metadata: {
      workshopSlug: registration.workshopSlug,
      status: registration.status,
    },
  });
  return registration;
}

export async function saveWorkshopRegistration(record: WorkshopRegistration): Promise<WorkshopRegistration> {
  const parsed = workshopRegistrationSchema.parse(record);
  await writeJsonFile(registrationPath(parsed.id), parsed);
  return parsed;
}

export async function listWorkshopRegistrations(): Promise<WorkshopRegistration[]> {
  const directory = getDataPath('workshop-registrations');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: WorkshopRegistration[] = [];

  for (const fileName of files) {
    const payload = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = workshopRegistrationSchema.safeParse(payload);
    if (parsed.success) {
      records.push(parsed.data);
    }
  }

  return records.sort((left, right) => right.registeredAt.localeCompare(left.registeredAt));
}

export async function storeWorkshopEmailCapture(payload: Omit<WorkshopEmailCapture, 'id' | 'renderedAt'> & { id?: string; renderedAt?: string }) {
  const capture = workshopEmailCaptureSchema.parse({
    ...payload,
    id: payload.id ?? `workshop_email_${randomUUID()}`,
    renderedAt: payload.renderedAt ?? new Date().toISOString(),
  });

  await writeJsonFile(capturePath(capture.id), capture);
  return capture;
}
