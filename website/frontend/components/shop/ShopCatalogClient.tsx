'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { getShippingProfileLabel, getShopStatusLabel, getShopCategoryLabel, isShopProductPurchasable } from '@/lib/shop/helpers';
import type { ShopCategory, ShopProduct } from '@/lib/shop/types';

export function ShopCatalogClient({
  products,
  categories,
}: {
  products: ShopProduct[];
  categories: ShopCategory[];
}) {
  const [category, setCategory] = useState<ShopCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (category === 'all') {
      return products;
    }
    return products.filter((product) => product.category === category);
  }, [category, products]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={category === 'all' ? 'rounded-full bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse' : 'rounded-full bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong'}
        >
          All products
        </button>
        {categories.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setCategory(entry)}
            className={category === entry ? 'rounded-full bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse' : 'rounded-full bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong'}
          >
            {getShopCategoryLabel(entry)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {filtered.map((product) => {
          const purchasable = isShopProductPurchasable(product);
          return (
            <article key={product.id} className="rounded-panel border border-text-strong/10 bg-white/90 p-5 shadow-soft">
              <ImageWithFallback
                src={product.images[0]?.url ?? ''}
                alt={product.images[0]?.alt ?? product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-48 rounded-[22px]"
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{getShopCategoryLabel(product.category)}</p>
                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-text-muted">
                  <span>{getShippingProfileLabel(product.shippingProfile)}</span>
                  <span>{getShopStatusLabel(product.status)}</span>
                </div>
              </div>
              <h3 className="mt-3 font-display text-2xl text-text-strong">{product.title}</h3>
              <p className="mt-3 text-sm leading-7 text-text-muted">{product.description}</p>
              <p className="mt-4 text-lg font-semibold text-text-strong">${product.price.amount.toFixed(2)}</p>
              {product.badge ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-primary">{product.badge}</p> : null}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <Link href={`/shop/${product.slug}`} className="text-sm font-semibold text-accent-primary no-underline">
                  View details
                </Link>
                <AddToCartButton productId={product.id} shippingProfile={product.shippingProfile} disabled={!purchasable} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
