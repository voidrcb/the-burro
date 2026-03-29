'use client';

import Link from 'next/link';
import { useState } from 'react';

import { getShopCategoryLabel, getShopStatusLabel, getShippingProfileLabel } from '@/lib/shop/helpers';
import type { ShopCategory, ShopProduct } from '@/lib/shop/types';

const filters: Array<{ id: 'all' | ShopCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'prints', label: 'Prints' },
  { id: 'giftables', label: 'Giftables' },
  { id: 'tiles', label: 'Handmade Tiles' },
  { id: 'pottery', label: 'Pottery' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'print-on-demand', label: 'Print on Demand' },
];

export function ShopCatalog({ products }: { products: ShopProduct[] }) {
  const [activeFilter, setActiveFilter] = useState<'all' | ShopCategory>('all');
  const visibleProducts = products.filter((product) => activeFilter === 'all' || product.category === activeFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={activeFilter === filter.id ? 'rounded-full bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse' : 'rounded-full border border-text-strong/10 bg-white px-4 py-2 text-sm font-semibold text-text-strong'}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {visibleProducts.map((product) => (
          <article key={product.id} className="rounded-[24px] border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <div className="rounded-[20px] bg-gradient-to-br from-[#f5ead0] via-white to-[#d8e2df] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">{getShopCategoryLabel(product.category)}</p>
              <h3 className="mt-3 font-display text-2xl text-text-strong">{product.title}</h3>
              <p className="mt-3 text-sm leading-7 text-text-muted">{product.description}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              <span className="rounded-full bg-surface-base px-3 py-2">{getShippingProfileLabel(product.shippingProfile)}</span>
              <span className="rounded-full bg-surface-base px-3 py-2">{getShopStatusLabel(product.status)}</span>
            </div>
            <p className="mt-4 font-display text-3xl text-text-strong">${product.price.amount}</p>
            <p className="mt-2 text-sm leading-7 text-text-muted">{product.story}</p>
            <Link href={`/shop/${product.slug}`} className="mt-5 inline-flex rounded-full bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse no-underline">
              View product
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
