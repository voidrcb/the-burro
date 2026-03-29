import Link from 'next/link';

import { getShopProductsByOrder, readShopOrderById } from '@/lib/shop/store';
import { getShippingProfileLabel } from '@/lib/shop/helpers';

export default async function ShopConfirmationPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const orderId = searchParams.orderId;
  const order = orderId ? await readShopOrderById(orderId) : null;

  if (!order) {
    return (
      <section className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
        <h1 className="font-display text-4xl text-text-strong">Order not found</h1>
        <p className="mt-4 text-sm leading-7 text-text-muted">The shop confirmation record could not be found. Return to the catalog and capture a new local order.</p>
        <Link href="/shop" className="mt-6 inline-flex rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse no-underline">
          Back to shop
        </Link>
      </section>
    );
  }

  const lines = await getShopProductsByOrder(order);

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Shop confirmation</p>
        <h1 className="mt-2 font-display text-4xl text-text-strong">Local order captured for review</h1>
        <p className="mt-3 text-sm leading-7 text-text-muted">
          Your order has been received. We will follow up with payment details and shipping confirmation.
        </p>

        <div className="mt-6 rounded-[24px] border border-text-strong/10 bg-[#faf7ef] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Order ID</p>
          <p className="mt-2 font-mono text-sm text-text-strong">{order.id}</p>
          <p className="mt-4 text-sm text-text-muted">{order.guestName} • {order.guestEmail}</p>
          <p className="mt-2 text-sm text-text-muted">Shipping profile: {getShippingProfileLabel(order.shippingProfile)}</p>
        </div>

        <div className="mt-6 space-y-4">
          {lines.map((line) => (
            <article key={line.item.productId} className="rounded-[20px] border border-text-strong/10 bg-white/85 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-text-strong">{line.product?.title ?? line.item.productId}</p>
                <p className="text-sm font-semibold text-text-strong">${(line.item.priceAtOrder * line.item.quantity).toFixed(2)}</p>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-muted">Qty {line.item.quantity}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
        <h2 className="font-display text-3xl text-text-strong">What happens next</h2>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-text-muted">
          <li>- A local confirmation artifact is stored for operator review.</li>
          <li>- Pickup-only orders stay local until a human confirms the handoff details.</li>
          <li>- Parcel and print-on-demand orders will include shipping details in our follow-up.</li>
        </ul>
        <p className="mt-6 font-display text-3xl text-text-strong">${order.subtotalAmount.toFixed(2)}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/shop" className="rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse no-underline">
            Continue browsing
          </Link>
          <Link href="/contact" className="rounded-pill border border-text-strong/10 px-5 py-3 text-sm font-semibold text-text-strong no-underline">
            Contact Chuck and Susan
          </Link>
        </div>
      </div>
    </section>
  );
}
