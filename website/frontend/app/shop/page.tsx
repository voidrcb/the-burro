import Link from 'next/link';

import { ContentSection } from '@/components/ContentSection';
import { Hero } from '@/components/Hero';
import { StoryBlock } from '@/components/StoryBlock';
import { ShopCatalogClient } from '@/components/shop/ShopCatalogClient';
import { ComingSoonBadge } from '@/components/ui/ComingSoonBadge';
import { listPublicShopProducts, listVisibleCategories } from '@/lib/content/shop';

export default async function ShopPage() {
  const products = await listPublicShopProducts();
  const categories = listVisibleCategories(products);

  return (
    <>
      <Hero
        eyebrow="Artisan Shop"
        title="Prints, crafts, and desert mementos from Big Bend"
        body="Limited-edition photography prints by Susan, handmade tiles from our desert workshops, and curated giftables. Each piece carries the visual language of this landscape."
        primaryAction={{ href: '#catalog', label: 'Browse collection' }}
        secondaryAction={{ href: '/shop/checkout', label: 'View cart' }}
      />

      <StoryBlock
        eyebrow="Susan's collection"
        title="Photography that captures the quiet"
        body="Susan's prints aren't postcards. They're invitations to remember why Big Bend feels different - the way light moves through Santa Elena Canyon, the stars wheeling over the desert, the colors that only exist here. Each archival print is signed and printed on museum-quality cotton rag paper."
      />

      <ContentSection
        kicker="What we offer"
        title="Three ways to take Big Bend home"
        body="Everything in our shop connects to this place. No generic merch, no mass production - just authentic pieces that mean something."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft transition-transform hover:scale-[1.02]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Limited Prints</p>
            <h3 className="mt-2 font-display text-xl text-text-strong">Archival photography</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Signed prints on cotton rag paper. Small editions, numbered and certified. Shipped flat in protective packaging.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft transition-transform hover:scale-[1.02]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Workshop Crafts</p>
            <h3 className="mt-2 font-display text-xl text-text-strong">Handmade tiles</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Desert-fired tiles from our workshops. Each piece is unique, made with local materials and traditional techniques.
            </p>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft transition-transform hover:scale-[1.02]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Giftables</p>
            <h3 className="mt-2 font-display text-xl text-text-strong">Field notes & more</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Postcards, field journals, and small items that capture the Big Bend spirit. Perfect for gifts or personal mementos.
            </p>
          </article>
        </div>
      </ContentSection>

      <section id="catalog" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-sage">Current collection</p>
            <h2 className="mt-3 font-display text-4xl text-text-strong">Shop the catalog</h2>
          </div>
          <div className="flex items-center gap-3">
            <ComingSoonBadge variant="inline" message="Online checkout soon" />
            <Link href="/shop/checkout" className="rounded-pill border border-text-strong/10 px-4 py-3 text-sm font-semibold text-text-strong no-underline transition-colors hover:bg-surface-elevated">
              View cart
            </Link>
          </div>
        </div>
        <ShopCatalogClient products={products} categories={categories} />
      </section>

      <section className="rounded-panel border border-text-strong/10 bg-gradient-to-r from-[#faf7ef] to-[#f5efe3] p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">How ordering works</p>
            <h2 className="mt-2 font-display text-2xl text-text-strong">Add to cart, we follow up</h2>
            <p className="mt-2 max-w-xl text-sm text-text-muted">
              Add items to your cart and submit your order request. We&apos;ll confirm availability and arrange payment directly.
              Online checkout with PayPal, Venmo, Zelle, and credit cards coming soon.
            </p>
          </div>
          <Link href="/contact" className="rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse no-underline transition-transform hover:scale-105">
            Questions? Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
