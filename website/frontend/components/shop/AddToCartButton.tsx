'use client';

import { useState } from 'react';

import { readCart, writeCart } from '@/lib/shop/cart';
import type { ShippingProfile } from '@/lib/shop/types';

export function AddToCartButton({
  productId,
  shippingProfile,
  disabled,
}: {
  productId: string;
  shippingProfile: ShippingProfile;
  disabled?: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);

  function handleAdd() {
    if (disabled) {
      return;
    }

    const cart = readCart();
    const cartProfile = cart[0]?.shippingProfile;
    if (cartProfile && cartProfile !== shippingProfile) {
      setMessage('This cart already has a different shipping profile. Remove those items before adding this one.');
      return;
    }

    const next = [...cart];
    const existing = next.find((entry) => entry.productId === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      next.push({ productId, quantity: 1, shippingProfile });
    }

    writeCart(next);
    setMessage('Added to cart.');
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        onClick={handleAdd}
        className="rounded-pill bg-text-strong px-4 py-3 text-sm font-semibold text-text-inverse disabled:opacity-50"
      >
        {disabled ? 'Unavailable' : 'Add to cart'}
      </button>
      {message ? <p className="text-xs leading-6 text-text-muted">{message}</p> : null}
    </div>
  );
}
