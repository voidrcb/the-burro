import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { getCmsPath } from '@/lib/server/repo';
import {
  intakeSchemaDefinitionSchema,
  workshopProgramSchema,
  type IntakeSchemaDefinition,
  type WorkshopProgram,
} from '@/lib/workshop/content-types';
import { getSessionLabel, isSessionRegisterable } from '@/lib/workshop/helpers';

const workshopsDirectory = getCmsPath('workshops');
const intakeDirectory = getCmsPath('workshops', 'intake');

async function readWorkshopFile(fileName: string): Promise<WorkshopProgram> {
  const raw = await readFile(path.join(workshopsDirectory, fileName), 'utf8');
  return workshopProgramSchema.parse(JSON.parse(raw));
}

export async function listWorkshopPrograms(): Promise<WorkshopProgram[]> {
  const entries = await readdir(workshopsDirectory);
  const files = entries.filter((entry) => entry.endsWith('.json') && entry !== 'schema.json');
  const workshops = await Promise.all(files.map(async (fileName) => readWorkshopFile(fileName)));
  return workshops.sort((left, right) => left.title.localeCompare(right.title));
}

export async function listPublishedWorkshopPrograms(): Promise<WorkshopProgram[]> {
  const workshops = await listWorkshopPrograms();
  return workshops.filter((program) => program.status === 'published');
}

export async function getWorkshopProgramBySlug(slug: string): Promise<WorkshopProgram | null> {
  const workshops = await listWorkshopPrograms();
  return workshops.find((program) => program.slug === slug) ?? null;
}

export async function getPublishedWorkshopProgramBySlug(slug: string): Promise<WorkshopProgram | null> {
  const program = await getWorkshopProgramBySlug(slug);
  return program && program.status === 'published' ? program : null;
}

export async function getWorkshopIntakeSchema(schemaRef: string): Promise<IntakeSchemaDefinition> {
  const raw = await readFile(path.join(intakeDirectory, `${schemaRef}.json`), 'utf8');
  return intakeSchemaDefinitionSchema.parse(JSON.parse(raw));
}

