import { describe, it, expect, vi } from 'vitest';
import { validateShopOrderInput } from './store';
import { listShopProducts } from '@/lib/content/shop';

// Mock the content module
vi.mock('@/lib/content/shop', () => ({
  listShopProducts: vi.fn(),
}));

describe('validateShopOrderInput', () => {
  it('should validate a valid order with single shipping profile', async () => {
    const mockProducts = [
      {
        id: 'p1',
        slug: 'product-1',
        title: 'Product 1',
        status: 'available',
        price: { amount: 100, currency: 'USD' },
        shippingProfile: 'parcel',
        inventory: { available: 10 },
      },
    ];
    vi.mocked(listShopProducts).mockResolvedValue(mockProducts as any);

    const input = {
      guestEmail: 'test@example.com',
      items: [{ productSlug: 'product-1', quantity: 1 }],
      shippingAddress: {
        line1: '123 Main St',
        city: 'Alpine',
        state: 'TX',
        zip: '79830',
      },
    };

    const result = await validateShopOrderInput(input);
    expect(result.shippingProfile).toBe('parcel');
    expect(result.lineItems).toHaveLength(1);
    expect(result.lineItems[0].product.id).toBe('p1');
    expect(result.shippingAddress?.city).toBe('Alpine');
  });

  it('should throw an error if items have multiple shipping profiles', async () => {
    const mockProducts = [
      {
        id: 'p1',
        slug: 'product-1',
        title: 'Product 1',
        status: 'available',
        price: { amount: 100, currency: 'USD' },
        shippingProfile: 'parcel',
      },
      {
        id: 'p2',
        slug: 'product-2',
        title: 'Product 2',
        status: 'available',
        price: { amount: 50, currency: 'USD' },
        shippingProfile: 'pickup-only',
      },
    ];
    vi.mocked(listShopProducts).mockResolvedValue(mockProducts as any);

    const input = {
      guestEmail: 'test@example.com',
      items: [
        { productSlug: 'product-1', quantity: 1 },
        { productSlug: 'product-2', quantity: 1 },
      ],
    };

    await expect(validateShopOrderInput(input)).rejects.toThrow(
      'Orders support only one shipping profile. Remove conflicting items before checkout.'
    );
  });

  it('should throw an error for unknown product slug', async () => {
    vi.mocked(listShopProducts).mockResolvedValue([]);

    const input = {
      guestEmail: 'test@example.com',
      items: [{ productSlug: 'unknown', quantity: 1 }],
    };

    await expect(validateShopOrderInput(input)).rejects.toThrow(
      'Unknown product slug: unknown'
    );
  });
});
