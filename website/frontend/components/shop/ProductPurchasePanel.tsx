'use client';

import Link from 'next/link';
import { useState } from 'react';

import { getShippingProfileLabel, getShopStatusLabel } from '@/lib/shop/helpers';
import type { ShopCartItem, ShopProduct } from '@/lib/shop/types';

const cartStorageKey = 'burro-shop-cart';

function readCart(): ShopCartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(cartStorageKey) ?? '[]') as ShopCartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: ShopCartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
}

export function ProductPurchasePanel({ product }: { product: ShopProduct }) {
  const [message, setMessage] = useState<string | null>(null);

  function addToCart() {
    const existing = readCart();
    const profiles = new Set(existing.map((item) => item.shippingProfile));
    if (profiles.size > 0 && !profiles.has(product.shippingProfile)) {
      setMessage('Only one shipping profile is allowed per order. Remove conflicting items before adding this product.');
      return;
    }

    const next = [...existing];
    const current = next.find((item) => item.productId === product.id);
    if (current) {
      current.quantity += 1;
    } else {
      next.push({
        productId: product.id,
        slug: product.slug,
        title: product.title,
        quantity: 1,
        priceAtOrder: product.price.amount,
        shippingProfile: product.shippingProfile,
        status: product.status,
      });
    }
    writeCart(next);
    setMessage(`${product.title} added to cart.`);
  }

  const purchasable = product.status === 'available';

  return (
    <div className="rounded-[24px] border border-text-strong/10 bg-white/90 p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{getShippingProfileLabel(product.shippingProfile)}</p>
      <p className="mt-2 font-display text-4xl text-text-strong">${product.price.amount}</p>
      <p className="mt-3 text-sm leading-7 text-text-muted">Status: {getShopStatusLabel(product.status)}</p>
      <div className="mt-4 space-y-3 text-sm text-text-muted">
        <p>Checkout sends your order request to the team first. Payment is arranged after availability is confirmed.</p>
        {product.highlights?.length ? (
          <ul className="space-y-2">
            {product.highlights.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addToCart}
          disabled={!purchasable}
          className="rounded-full bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse disabled:cursor-not-allowed disabled:opacity-50"
        >
          {purchasable ? 'Add to cart' : 'Not purchasable'}
        </button>
        <Link href="/shop/checkout" className="rounded-full border border-text-strong/10 bg-surface-base px-4 py-2 text-sm font-semibold text-text-strong no-underline">
          Open checkout
        </Link>
      </div>
      {message ? <p className="mt-4 text-sm leading-6 text-accent-earth">{message}</p> : null}
    </div>
  );
}
