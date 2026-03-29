import { readFile, readdir } from 'fs/promises';
import path from 'path';

import { getCmsPath } from '@/lib/server/repo';
import { rentalAssetSchema, type RentalAsset } from '@/lib/rental/types';

const rentalsDirectory = getCmsPath('rentals');

async function readAssetFile(fileName: string): Promise<RentalAsset> {
  const raw = await readFile(path.join(rentalsDirectory, fileName), 'utf8');
  return rentalAssetSchema.parse(JSON.parse(raw));
}

export async function listRentalAssets(): Promise<RentalAsset[]> {
  try {
    const entries = await readdir(rentalsDirectory);
    const files = entries.filter((entry) => entry.endsWith('.json') && entry !== 'schema.json');
    const assets = await Promise.all(files.map(async (fileName) => readAssetFile(fileName)));
    return assets.sort((left, right) => left.name.localeCompare(right.name));
  } catch {
    return [];
  }
}

export async function listAvailableRentalAssets(): Promise<RentalAsset[]> {
  const all = await listRentalAssets();
  return all.filter((asset) => asset.status === 'available' && !asset.maintenanceFlag);
}

export async function listFeaturedRentalAssets(): Promise<RentalAsset[]> {
  const available = await listAvailableRentalAssets();
  return available.filter((asset) => asset.featured);
}

export async function getRentalAssetById(id: string): Promise<RentalAsset | null> {
  const assets = await listRentalAssets();
  return assets.find((asset) => asset.id === id) ?? null;
}

export async function getRentalAssetBySlug(slug: string): Promise<RentalAsset | null> {
  const assets = await listRentalAssets();
  return assets.find((asset) => asset.slug === slug) ?? null;
}

// Helper to check if asset is available for a date range
export async function checkAssetAvailability(
  assetId: string,
  startDate: string,
  endDate: string
): Promise<{ available: boolean; reason?: string }> {
  const asset = await getRentalAssetById(assetId);

  if (!asset) {
    return { available: false, reason: 'Asset not found' };
  }

  if (asset.status !== 'available') {
    return { available: false, reason: `Asset is currently ${asset.status}` };
  }

  if (asset.maintenanceFlag) {
    return { available: false, reason: 'Asset is under maintenance' };
  }

  // In a real implementation, we would check against existing bookings
  // For now, we assume available if status is 'available'
  return { available: true };
}
