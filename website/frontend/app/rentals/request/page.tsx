import { Suspense } from 'react';

import { RentalQuoteForm } from '@/components/rental/RentalQuoteForm';
import { listAvailableRentalAssets } from '@/lib/content/rentals';

export const metadata = {
  title: 'Request Equipment Quote | Big Bend Burro',
  description: 'Request a quote for heavy equipment rental in Big Bend. Excavators, tractors, and utility vehicles with local delivery.',
};

export default async function RentalRequestPage() {
  const assets = await listAvailableRentalAssets();

  return (
    <main className="min-h-screen bg-surface-base">
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">
              Equipment Rental
            </p>
            <h1 className="mt-3 font-display text-3xl text-text-strong md:text-4xl">
              Request a Quote
            </h1>
            <p className="mt-4 text-text-body">
              Tell us about your project and we will confirm availability within 24 hours.
              All requests are reviewed personally.
            </p>
          </div>

          <div className="mt-10">
            <Suspense fallback={<QuoteFormSkeleton />}>
              <RentalQuoteForm assets={assets} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuoteFormSkeleton() {
  return (
    <div className="animate-pulse rounded-[28px] border border-text-strong/10 bg-white/90 p-8">
      <div className="space-y-6">
        <div className="h-10 rounded-[18px] bg-text-strong/10" />
        <div className="h-10 rounded-[18px] bg-text-strong/10" />
        <div className="h-10 rounded-[18px] bg-text-strong/10" />
        <div className="h-24 rounded-[18px] bg-text-strong/10" />
        <div className="h-12 rounded-full bg-text-strong/10" />
      </div>
    </div>
  );
}
