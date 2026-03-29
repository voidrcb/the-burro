import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { getCmsPath } from '@/lib/server/repo';
import { shopProductSchema, type ShopCategory, type ShopProduct } from '@/lib/shop/types';

const shopDirectory = getCmsPath('shop');

async function readProductFile(fileName: string): Promise<ShopProduct> {
  const raw = await readFile(path.join(shopDirectory, fileName), 'utf8');
  return shopProductSchema.parse(JSON.parse(raw));
}

export async function listShopProducts(): Promise<ShopProduct[]> {
  const entries = await readdir(shopDirectory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json') && entry !== 'schema.json');
  const products = await Promise.all(files.map((fileName) => readProductFile(fileName)));

  return products.sort((left, right) => {
    if (Boolean(left.featured) === Boolean(right.featured)) {
      return left.title.localeCompare(right.title);
    }
    return left.featured ? -1 : 1;
  });
}

export async function listPublicShopProducts(): Promise<ShopProduct[]> {
  const products = await listShopProducts();
  return products.filter((product) => product.status !== 'private');
}

export async function getShopProductBySlug(slug: string): Promise<ShopProduct | null> {
  const products = await listShopProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getPublicShopProductBySlug(slug: string): Promise<ShopProduct | null> {
  const product = await getShopProductBySlug(slug);
  return product && product.status !== 'private' ? product : null;
}

export function listVisibleCategories(products: ShopProduct[]): ShopCategory[] {
  return [...new Set(products.map((product) => product.category))];
}

export function isPurchasableShopProduct(product: ShopProduct): boolean {
  return product.status === 'available';
}

export function getShopStatusLabel(status: ShopProduct['status']): string {
  switch (status) {
    case 'available':
      return 'Available';
    case 'sold-out':
      return 'Sold out';
    case 'coming-soon':
      return 'Coming soon';
    case 'private':
      return 'Private';
  }
}

export function getShopCategoryLabel(category: ShopCategory): string {
  switch (category) {
    case 'prints':
      return 'Prints';
    case 'giftables':
      return 'Giftables';
    case 'print-on-demand':
      return 'Print on demand';
  }
}

export function getShippingProfileLabel(profile: ShopProduct['shippingProfile']): string {
  switch (profile) {
    case 'pickup-only':
      return 'Pickup only';
    case 'parcel':
      return 'Parcel shipping';
    case 'print-on-demand':
      return 'Print-on-demand shipping';
  }
}
