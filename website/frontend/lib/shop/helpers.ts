import type { ShopCategory, ShopProduct } from '@/lib/shop/types';

export function isShopProductPurchasable(product: ShopProduct): boolean {
  return product.status === 'available' && (product.inventory?.available ?? 1) > 0;
}

export function getShopStatusLabel(status: ShopProduct['status']): string {
  switch (status) {
    case 'available':
      return 'Available now';
    case 'sold-out':
      return 'Sold out';
    case 'coming-soon':
      return 'Coming soon';
    case 'private':
      return 'Private';
    default:
      return status;
  }
}

export function getShippingProfileLabel(profile: ShopProduct['shippingProfile']): string {
  switch (profile) {
    case 'pickup-only':
      return 'Pickup only';
    case 'parcel':
      return 'Parcel shipping';
    case 'print-on-demand':
      return 'Print-on-demand';
    default:
      return profile;
  }
}

export function getShopCategoryLabel(category: ShopCategory): string {
  switch (category) {
    case 'tiles':
      return 'Handmade Tiles';
    case 'pottery':
      return 'Pottery';
    case 'apparel':
      return 'Apparel';
    case 'print-on-demand':
      return 'Print on demand';
    case 'giftables':
      return 'Giftables';
    case 'prints':
      return 'Prints';
    default:
      return category;
  }
}
