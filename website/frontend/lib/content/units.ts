import { readFile, readdir } from 'fs/promises';
import path from 'path';

import { getCmsPath } from '@/lib/server/repo';

import { lodgingUnitSchema, type LodgingUnit } from './stay-types';

const unitsDirectory = getCmsPath('units');

async function readUnitFile(fileName: string): Promise<LodgingUnit> {
  const raw = await readFile(path.join(unitsDirectory, fileName), 'utf8');
  return lodgingUnitSchema.parse(JSON.parse(raw));
}

export async function listUnits(): Promise<LodgingUnit[]> {
  const entries = await readdir(unitsDirectory);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const units = await Promise.all(files.map((fileName) => readUnitFile(fileName)));

  return units.sort((left, right) => {
    if (left.featured === right.featured) {
      return left.name.localeCompare(right.name);
    }
    return left.featured ? -1 : 1;
  });
}

export async function listPublicUnits(): Promise<LodgingUnit[]> {
  const units = await listUnits();
  return units.filter((unit) => unit.status !== 'private');
}

export async function listAvailableUnits(): Promise<LodgingUnit[]> {
  const units = await listUnits();
  return units.filter((unit) => unit.status === 'available');
}

export async function listAssistantUnits(): Promise<LodgingUnit[]> {
  return listUnits();
}

export async function getUnitBySlug(slug: string): Promise<LodgingUnit | null> {
  const units = await listUnits();
  return units.find((unit) => unit.slug === slug) ?? null;
}

export async function getPublicUnitBySlug(slug: string): Promise<LodgingUnit | null> {
  const unit = await getUnitBySlug(slug);
  return unit && unit.status !== 'private' ? unit : null;
}

export async function getUnitById(id: string): Promise<LodgingUnit | null> {
  const units = await listUnits();
  return units.find((unit) => unit.id === id) ?? null;
}
