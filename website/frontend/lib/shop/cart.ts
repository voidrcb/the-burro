import type { ShippingProfile } from './types';

export type CartItem = {
  productId: string;
  quantity: number;
  shippingProfile: ShippingProfile;
};

export const shopCartStorageKey = 'burro-shop-cart';

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(shopCartStorageKey);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(shopCartStorageKey, JSON.stringify(items));
}

export function clearCart(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(shopCartStorageKey);
}
