'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { ShopCartItem, ShopOrder } from '@/lib/shop/types';

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

export function CheckoutClient() {
  const [items, setItems] = useState<ShopCartItem[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ShopOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const shippingProfile = items[0]?.shippingProfile;
  const total = items.reduce((sum, item) => sum + item.priceAtOrder * item.quantity, 0);
  const mixedProfiles = new Set(items.map((item) => item.shippingProfile)).size > 1;
  const requiresAddress = shippingProfile && shippingProfile !== 'pickup-only';

  async function submitOrder() {
    if (!items.length) {
      setError('Cart is empty.');
      return;
    }
    if (mixedProfiles || !shippingProfile) {
      setError('Checkout requires a single shipping profile per order.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await fetch('/api/shop/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guestName,
        guestEmail,
        notes: orderNote,
        items: items.map((item) => ({ productSlug: item.slug, quantity: item.quantity })),
        shippingAddress: requiresAddress
          ? {
              line1,
              city,
              state,
              zip,
            }
          : undefined,
      }),
    });

    const body = (await result.json()) as { orderId?: string; error?: string };
    if (!result.ok || !body.orderId) {
      setError(body.error ?? 'Order capture failed.');
      setIsSubmitting(false);
      return;
    }

    setConfirmation({
      id: body.orderId,
      guestName,
      guestEmail,
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity, priceAtOrder: item.priceAtOrder })),
      shippingProfile,
      shippingAddress: requiresAddress ? { line1, city, state, zip } : undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      subtotalAmount: total,
    });
    setItems([]);
    writeCart([]);
    setIsSubmitting(false);
  }

  function updateQuantity(productId: string, direction: 'up' | 'down') {
    const next = items
      .map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: direction === 'up' ? item.quantity + 1 : item.quantity - 1,
            }
          : item,
      )
      .filter((item) => item.quantity > 0);
    setItems(next);
    writeCart(next);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[28px] border border-text-strong/10 bg-white/90 p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Cart summary</p>
            <h2 className="mt-2 font-display text-3xl text-text-strong">Your order</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-accent-primary no-underline">
            Back to catalog
          </Link>
        </div>
        <div className="mt-5 space-y-4">
          {items.length ? items.map((item) => (
            <article key={item.productId} className="rounded-[22px] border border-text-strong/10 bg-surface-base/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text-strong">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-text-muted">{item.shippingProfile}</p>
                </div>
                <p className="font-display text-2xl text-text-strong">${item.priceAtOrder * item.quantity}</p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button type="button" onClick={() => updateQuantity(item.productId, 'down')} className="rounded-full border border-text-strong/10 px-3 py-1 text-sm font-semibold text-text-strong">-</button>
                <span className="text-sm font-semibold text-text-strong">{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.productId, 'up')} className="rounded-full border border-text-strong/10 px-3 py-1 text-sm font-semibold text-text-strong">+</button>
              </div>
            </article>
          )) : <p className="text-sm leading-7 text-text-muted">No items in cart yet.</p>}
        </div>
        <div className="mt-6 rounded-[20px] bg-[#faf7ef] p-4">
          <p className="text-sm text-text-muted">Order confirmation means your request was captured. We will contact you to arrange payment and fulfillment.</p>
          <p className="mt-3 font-display text-3xl text-text-strong">${total}</p>
          {mixedProfiles ? <p className="mt-2 text-sm text-accent-earth">Mixed shipping profiles detected. Remove conflicting items before checkout.</p> : null}
        </div>
      </section>

      <section className="rounded-[28px] border border-text-strong/10 bg-white/90 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Checkout</p>
        <h2 className="mt-2 font-display text-3xl text-text-strong">Guest information</h2>
        <div className="mt-5 grid gap-4">
          <input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Guest name" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3 text-sm text-text-strong outline-none focus:border-accent-primary" />
          <input value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} placeholder="Guest email" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3 text-sm text-text-strong outline-none focus:border-accent-primary" />
          {requiresAddress ? (
            <>
              <input value={line1} onChange={(event) => setLine1(event.target.value)} placeholder="Shipping address" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3 text-sm text-text-strong outline-none focus:border-accent-primary" />
              <div className="grid gap-4 md:grid-cols-3">
                <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3 text-sm text-text-strong outline-none focus:border-accent-primary" />
                <input value={state} onChange={(event) => setState(event.target.value)} placeholder="State" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3 text-sm text-text-strong outline-none focus:border-accent-primary" />
                <input value={zip} onChange={(event) => setZip(event.target.value)} placeholder="ZIP" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3 text-sm text-text-strong outline-none focus:border-accent-primary" />
              </div>
            </>
          ) : (
            <p className="rounded-[18px] bg-surface-base px-4 py-3 text-sm text-text-muted">Pickup-only orders skip shipping address capture.</p>
          )}
          <textarea value={orderNote} onChange={(event) => setOrderNote(event.target.value)} rows={4} placeholder="Order note or pickup preference" className="rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3 text-sm text-text-strong outline-none focus:border-accent-primary" />
          <button type="button" onClick={submitOrder} disabled={isSubmitting || !items.length} className="rounded-full bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse disabled:opacity-50">
            {isSubmitting ? 'Placing order...' : 'Place order'}
          </button>
          {error ? <p className="text-sm text-accent-earth">{error}</p> : null}
          {confirmation ? (
            <div className="rounded-[22px] border border-accent-earth/25 bg-[#faf7ef] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-earth">Order confirmed</p>
              <p className="mt-2 text-sm text-text-muted">Order ID: {confirmation.id}</p>
              <p className="mt-1 text-sm text-text-muted">Status: {confirmation.status}</p>
              <p className="mt-1 text-sm text-text-muted">Guest: {confirmation.guestEmail}</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
