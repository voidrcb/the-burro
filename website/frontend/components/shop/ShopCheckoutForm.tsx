'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { clearCart, readCart, writeCart, type CartItem } from '@/lib/shop/cart';
import { getShippingProfileLabel } from '@/lib/shop/helpers';
import type { ShopProduct } from '@/lib/shop/types';
import { ComingSoonBadge } from '@/components/ui/ComingSoonBadge';
import { PaymentMethodStub } from '@/components/ui/PaymentMethodStub';

type CheckoutProduct = Pick<ShopProduct, 'id' | 'slug' | 'title' | 'price' | 'shippingProfile' | 'status'>;

export function ShopCheckoutForm({ products }: { products: CheckoutProduct[] }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('TX');
  const [zip, setZip] = useState('');
  const [pickupWindow, setPickupWindow] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCart(readCart());
  }, []);

  const cartRows = useMemo(() => {
    const productMap = new Map(products.map((product) => [product.id, product]));
    return cart.map((item) => ({ item, product: productMap.get(item.productId) ?? null })).filter((entry) => entry.product);
  }, [cart, products]);

  const shippingProfiles = [...new Set(cart.map((item) => item.shippingProfile))];
  const shippingProfile = shippingProfiles[0] ?? null;
  const mixedProfiles = shippingProfiles.length > 1;
  const requiresShippingAddress = shippingProfile === 'parcel' || shippingProfile === 'print-on-demand';
  const subtotal = cartRows.reduce((sum, entry) => sum + ((entry.product?.price.amount ?? 0) * entry.item.quantity), 0);

  function sync(nextCart: CartItem[]) {
    setCart(nextCart);
    writeCart(nextCart);
  }

  function updateQuantity(productId: string, quantity: number) {
    const next = cart
      .map((entry) => entry.productId === productId ? { ...entry, quantity } : entry)
      .filter((entry) => entry.quantity > 0);
    sync(next);
  }

  async function handleSubmit() {
    if (!cartRows.length) {
      setMessage('Your cart is empty.');
      return;
    }
    if (mixedProfiles) {
      setMessage('Checkout supports only one shipping profile per order.');
      return;
    }
    if (!guestName || !guestEmail) {
      setMessage('Add your name and email before sending the order request.');
      return;
    }
    if (requiresShippingAddress && (!line1 || !city || !state || !zip)) {
      setMessage('Add the shipping address required for this order profile.');
      return;
    }

    setIsSubmitting(true);
    setMessage('Sending your order request...');

    try {
      const response = await fetch('/api/shop/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          guestEmail,
          pickupWindow: pickupWindow || undefined,
          notes: notes || undefined,
          shippingAddress: requiresShippingAddress ? { line1, line2: line2 || undefined, city, state, zip } : undefined,
          items: cartRows.map((entry) => ({ productSlug: entry.product?.slug, quantity: entry.item.quantity })),
        }),
      });
      const payload = (await response.json()) as { orderId?: string; error?: string };
      if (!response.ok || !payload.orderId) {
        throw new Error(payload.error ?? 'Unable to capture shop order.');
      }

      clearCart();
      router.push(`/shop/checkout/confirmation?orderId=${payload.orderId}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to capture shop order.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
        <ComingSoonBadge variant="banner" message="Online Payments Coming Soon" className="mb-6" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Checkout</p>
        <h1 className="mt-2 font-display text-4xl text-text-strong">Send your order request</h1>
        <p className="mt-3 text-sm leading-7 text-text-muted">
          Submit your order details here. The Burro team will confirm availability, arrange payment, and coordinate shipping or pickup.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-text-strong">
            Full name
            <input value={guestName} onChange={(event) => setGuestName(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
          </label>
          <label className="text-sm font-semibold text-text-strong">
            Email
            <input type="email" value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
          </label>
        </div>

        {requiresShippingAddress ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2 text-sm font-semibold text-text-strong">
              Address line 1
              <input value={line1} onChange={(event) => setLine1(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
            </label>
            <label className="md:col-span-2 text-sm font-semibold text-text-strong">
              Address line 2
              <input value={line2} onChange={(event) => setLine2(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
            </label>
            <label className="text-sm font-semibold text-text-strong">
              City
              <input value={city} onChange={(event) => setCity(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
            </label>
            <label className="text-sm font-semibold text-text-strong">
              State
              <input value={state} onChange={(event) => setState(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
            </label>
            <label className="text-sm font-semibold text-text-strong">
              ZIP
              <input value={zip} onChange={(event) => setZip(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
            </label>
          </div>
        ) : (
          <label className="mt-6 block text-sm font-semibold text-text-strong">
            Preferred pickup window
            <input value={pickupWindow} onChange={(event) => setPickupWindow(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" placeholder="Example: Friday workshop pickup" />
          </label>
        )}

        <label className="mt-6 block text-sm font-semibold text-text-strong">
          Order notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
        </label>

        {message ? <p className="mt-4 text-sm text-text-muted">{message}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => void handleSubmit()} disabled={isSubmitting || !cartRows.length} className="rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse disabled:opacity-60">
            {isSubmitting ? 'Sending order...' : 'Submit order request'}
          </button>
          <Link href="/shop" className="rounded-pill border border-text-strong/10 px-5 py-3 text-sm font-semibold text-text-strong no-underline">
            Back to catalog
          </Link>
        </div>

        <div className="mt-8 border-t border-text-strong/10 pt-6">
          <PaymentMethodStub />
        </div>
      </section>

      <section className="rounded-panel border border-text-strong/10 bg-[#faf7ef] p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Cart summary</p>
            <h2 className="mt-2 font-display text-3xl text-text-strong">{shippingProfile ? getShippingProfileLabel(shippingProfile) : 'No items yet'}</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-accent-primary no-underline">Continue browsing</Link>
        </div>

        {mixedProfiles ? <p className="mt-4 text-sm font-semibold text-[#8a3928]">Mixed shipping profiles are not supported in a single order.</p> : null}

        <div className="mt-5 space-y-4">
          {cartRows.length ? cartRows.map((entry) => (
            <article key={entry.item.productId} className="rounded-[20px] border border-text-strong/10 bg-white/85 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text-strong">{entry.product?.title}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{entry.product?.shippingProfile}</p>
                </div>
                <p className="text-sm font-semibold text-text-strong">${((entry.product?.price.amount ?? 0) * entry.item.quantity).toFixed(2)}</p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button type="button" onClick={() => updateQuantity(entry.item.productId, entry.item.quantity - 1)} className="rounded-full border border-text-strong/10 px-3 py-1 text-sm text-text-strong">-</button>
                <span className="text-sm font-medium text-text-strong">{entry.item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(entry.item.productId, entry.item.quantity + 1)} className="rounded-full border border-text-strong/10 px-3 py-1 text-sm text-text-strong">+</button>
              </div>
            </article>
          )) : <p className="text-sm leading-7 text-text-muted">Your shop cart is empty.</p>}
        </div>

        <div className="mt-6 rounded-[20px] border border-text-strong/10 bg-white/85 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Subtotal</p>
          <p className="mt-2 font-display text-3xl text-text-strong">${subtotal.toFixed(2)}</p>
          <p className="mt-2 text-sm leading-7 text-text-muted">No live charge is taken here. After you submit, the team will follow up to finalize payment and fulfillment.</p>
        </div>
      </section>
    </div>
  );
}
