import { type EquipmentAsset, listEquipmentAssets } from '@/lib/content/equipment';
import { rentalAssetSchema, type RentalAsset } from '@/lib/rental/types';

function mapEquipmentToRentalAsset(asset: EquipmentAsset): RentalAsset {
  const normalizedImages = (asset.images ?? []).map((image) => (
    typeof image === 'string'
      ? { url: image, alt: asset.name }
      : image
  ));

  return rentalAssetSchema.parse({
    id: asset.id,
    slug: asset.slug,
    name: asset.name,
    category: asset.category,
    description: asset.description,
    specifications: asset.specifications ?? [],
    dailyRate: asset.dailyRate,
    weeklyRate: asset.weeklyRate,
    depositRequired: asset.depositRequired,
    deliveryFee: asset.deliveryFee ?? 0,
    status: asset.status,
    maintenanceFlag: asset.status === 'maintenance',
    images: normalizedImages,
    deliveryNotes: asset.deliveryNotes,
    operatingRequirements: asset.operatingRequirements ?? [],
    insuranceRequired: asset.insuranceRequired ?? false,
    featured: asset.featured ?? false,
  });
}

export async function listRentalAssets(): Promise<RentalAsset[]> {
  const assets = await listEquipmentAssets();
  return assets.map(mapEquipmentToRentalAsset).sort((left, right) => left.name.localeCompare(right.name));
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

export async function checkAssetAvailability(
  assetId: string,
  startDate: string,
  endDate: string
): Promise<{ available: boolean; reason?: string }> {
  const asset = await getRentalAssetById(assetId);

  if (!asset) {
    return { available: false, reason: 'Asset not found' };
  }

  if (!startDate || !endDate) {
    return { available: false, reason: 'Start and end dates are required' };
  }

  if (asset.status !== 'available') {
    return { available: false, reason: `Asset is currently ${asset.status}` };
  }

  if (asset.maintenanceFlag) {
    return { available: false, reason: 'Asset is under maintenance' };
  }

  return { available: true };
}
