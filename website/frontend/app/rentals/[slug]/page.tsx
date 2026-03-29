import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getRentalAssetBySlug, listRentalAssets } from '@/lib/content/rentals';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const assets = await listRentalAssets();
  return assets.map((asset) => ({ slug: asset.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const asset = await getRentalAssetBySlug(slug);

  if (!asset) {
    return { title: 'Equipment Not Found | Big Bend Burro' };
  }

  return {
    title: `${asset.name} Rental | Big Bend Burro`,
    description: asset.description,
  };
}

export default async function RentalAssetPage({ params }: PageProps) {
  const { slug } = await params;
  const asset = await getRentalAssetBySlug(slug);

  if (!asset) {
    notFound();
  }

  const isAvailable = asset.status === 'available' && !asset.maintenanceFlag;

  return (
    <main className="min-h-screen bg-surface-base">
      {/* Breadcrumb */}
      <div className="border-b border-text-strong/10 bg-white/80 px-6 py-4">
        <div className="mx-auto max-w-5xl">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/rentals" className="hover:text-text-strong">
              Equipment Rental
            </Link>
            <span>/</span>
            <span className="text-text-strong">{asset.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Left: Image & Description */}
            <div>
              {/* Image placeholder */}
              <div className="aspect-[16/10] overflow-hidden rounded-[28px] bg-gradient-to-br from-accent-earth/20 to-accent-earth/5">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center p-8">
                    <p className="text-xs uppercase tracking-[0.16em] text-accent-earth">
                      {asset.category}
                    </p>
                    <p className="mt-4 font-display text-2xl text-text-strong">
                      {asset.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status badge */}
              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isAvailable ? 'Available' : asset.maintenanceFlag ? 'Under Maintenance' : asset.status}
                </span>
                <span className="text-xs uppercase tracking-[0.16em] text-text-muted">
                  {asset.category}
                </span>
              </div>

              <h1 className="mt-4 font-display text-3xl text-text-strong md:text-4xl">
                {asset.name}
              </h1>

              <p className="mt-6 text-base leading-7 text-text-body">
                {asset.description}
              </p>

              {/* Specifications */}
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-strong">
                  Specifications
                </h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {asset.specifications.map((spec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-text-body"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-earth" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Operating Requirements */}
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-strong">
                  Operating Requirements
                </h2>
                <ul className="mt-4 space-y-2">
                  {asset.operatingRequirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-text-body"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-text-muted" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery Notes */}
              {asset.deliveryNotes ? (
                <div className="mt-8 rounded-[20px] border border-text-strong/10 bg-white/80 p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-strong">
                    Delivery Information
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-text-body">
                    {asset.deliveryNotes}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Right: Pricing Card */}
            <div>
              <div className="sticky top-6 rounded-[28px] border border-text-strong/10 bg-white shadow-soft">
                <div className="p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-earth">
                    Rental Rates
                  </h2>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-text-body">Daily Rate</span>
                      <span className="font-display text-2xl text-text-strong">
                        ${asset.dailyRate}
                      </span>
                    </div>
                    {asset.weeklyRate ? (
                      <div className="flex items-baseline justify-between">
                        <span className="text-text-body">Weekly Rate</span>
                        <span className="font-display text-xl text-text-strong">
                          ${asset.weeklyRate}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex items-baseline justify-between border-t border-text-strong/10 pt-3">
                      <span className="text-text-body">Delivery Fee</span>
                      <span className="text-text-strong">
                        ${asset.deliveryFee}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-text-body">Security Deposit</span>
                      <span className="text-text-strong">
                        ${asset.depositRequired.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {asset.insuranceRequired ? (
                    <p className="mt-4 text-xs text-text-muted">
                      * Proof of liability insurance or rental insurance required
                    </p>
                  ) : null}
                </div>

                <div className="border-t border-text-strong/10 p-6">
                  {isAvailable ? (
                    <Link
                      href={`/rentals/request?asset=${asset.slug}`}
                      className="block w-full rounded-full bg-text-strong py-3 text-center text-sm font-semibold text-text-inverse transition-colors hover:bg-text-strong/90"
                    >
                      Request Quote
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="block w-full cursor-not-allowed rounded-full bg-text-muted/30 py-3 text-center text-sm font-semibold text-text-muted"
                    >
                      Currently Unavailable
                    </button>
                  )}
                  <p className="mt-3 text-center text-xs text-text-muted">
                    We review all requests personally within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to catalog */}
      <section className="border-t border-text-strong/10 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/rentals"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent-earth hover:underline"
          >
            <span>&larr;</span>
            <span>Back to Equipment Catalog</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
