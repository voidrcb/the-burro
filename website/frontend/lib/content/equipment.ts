import { readFile, readdir } from 'fs/promises';
import path from 'path';

import { z } from 'zod';

import { getCmsPath } from '@/lib/server/repo';

const maintenanceEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string(),
  resolvedAt: z.string().optional(),
  resolution: z.string().optional(),
});

export const equipmentAssetSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.enum(['camera', 'telescope', 'outdoor-gear', 'craft-supplies', 'excavator', 'heavy-equipment']),
  description: z.string(),
  dailyRate: z.number().nonnegative(),
  depositRequired: z.number().nonnegative(),
  status: z.enum(['available', 'reserved', 'maintenance', 'retired']),
  maintenanceLog: z.array(maintenanceEntrySchema),
  images: z.array(z.union([z.string(), z.object({ url: z.string(), alt: z.string() })])).optional(),
  weeklyRate: z.number().nonnegative().optional(),
  deliveryFee: z.number().nonnegative().optional(),
  specifications: z.array(z.string()).optional(),
  deliveryNotes: z.string().optional(),
  operatingRequirements: z.array(z.string()).optional(),
  insuranceRequired: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export type EquipmentAsset = z.infer<typeof equipmentAssetSchema>;

const equipmentDirectory = getCmsPath('equipment');

async function readAssetFile(fileName: string): Promise<EquipmentAsset> {
  const raw = await readFile(path.join(equipmentDirectory, fileName), 'utf8');
  return equipmentAssetSchema.parse(JSON.parse(raw));
}

export async function listEquipmentAssets(): Promise<EquipmentAsset[]> {
  const entries = await readdir(equipmentDirectory);
  const files = entries.filter((entry) => entry.endsWith('.json') && entry !== 'schema.json');
  const assets = await Promise.all(files.map(async (fileName) => readAssetFile(fileName)));
  return assets.sort((left, right) => left.name.localeCompare(right.name));
}

export async function getEquipmentAssetById(id: string): Promise<EquipmentAsset | null> {
  const assets = await listEquipmentAssets();
  return assets.find((asset) => asset.id === id) ?? null;
}
