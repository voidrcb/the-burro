import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { getPublicShopProductBySlug } from '@/lib/content/shop';
import { getShippingProfileLabel, getShopStatusLabel, isShopProductPurchasable } from '@/lib/shop/helpers';

export default async function ShopProductPage({ params }: { params: { slug: string } }) {
  const product = await getPublicShopProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const purchasable = isShopProductPurchasable(product);

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
        <div className="rounded-[28px] bg-[#f1ebdd] px-8 py-24 text-center text-sm font-medium text-text-muted">
          {product.images[0]?.alt ?? product.title}
        </div>
      </div>

      <div className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">
          <span>{product.category}</span>
          <span>{getShippingProfileLabel(product.shippingProfile)}</span>
          <span>{getShopStatusLabel(product.status)}</span>
        </div>
        <h1 className="mt-4 font-display text-5xl text-text-strong">{product.title}</h1>
        <p className="mt-4 text-lg text-text-muted">{product.description}</p>
        <p className="mt-6 font-display text-4xl text-text-strong">${product.price.amount.toFixed(2)}</p>
        {product.leadTimeNote ? <p className="mt-3 text-sm leading-7 text-text-muted">{product.leadTimeNote}</p> : null}

        <div className="mt-8 rounded-[24px] border border-text-strong/10 bg-[#faf7ef] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Story</p>
          <p className="mt-3 text-sm leading-7 text-text-muted">{product.story}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <AddToCartButton productId={product.id} shippingProfile={product.shippingProfile} disabled={!purchasable} />
          <Link href="/shop/checkout" className="rounded-pill border border-text-strong/10 px-5 py-3 text-sm font-semibold text-text-strong no-underline">
            Go to checkout
          </Link>
          <Link href="/shop" className="rounded-pill border border-text-strong/10 px-5 py-3 text-sm font-semibold text-text-strong no-underline">
            Back to catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
