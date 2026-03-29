import Link from 'next/link';

import { RentalOperationsDashboard } from '@/components/rental/RentalOperationsDashboard';
import { listRentalAssets } from '@/lib/content/rentals';
import { listQuoteRequests, listActiveRentalBookings } from '@/lib/rental/store';

export const dynamic = 'force-dynamic';

export default async function AssistantRentalsPage() {
  const [assets, quoteRequests, bookings] = await Promise.all([
    listRentalAssets(),
    listQuoteRequests(),
    listActiveRentalBookings(),
  ]);

  // Filter pending quotes
  const pendingQuotes = quoteRequests.filter((q) => q.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[28px] border border-text-strong/10 bg-white/90 p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">
          Sprint 2.2 Equipment Rental
        </p>
        <h1 className="mt-3 font-display text-4xl text-text-strong">
          Rental Operations Dashboard
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-text-body">
          Manage equipment rental lifecycle: review quote requests, approve bookings,
          conduct inspections, and track state transitions. All rentals use operator-approval flow.
        </p>

        {/* Quick stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-[18px] bg-surface-base p-4">
            <p className="text-2xl font-bold text-text-strong">{pendingQuotes.length}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Pending Quotes</p>
          </div>
          <div className="rounded-[18px] bg-surface-base p-4">
            <p className="text-2xl font-bold text-text-strong">{bookings.length}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Active Bookings</p>
          </div>
          <div className="rounded-[18px] bg-surface-base p-4">
            <p className="text-2xl font-bold text-text-strong">
              {assets.filter((a) => a.status === 'available' && !a.maintenanceFlag).length}
            </p>
            <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Available Assets</p>
          </div>
          <div className="rounded-[18px] bg-surface-base p-4">
            <p className="text-2xl font-bold text-text-strong">
              {bookings.filter((b) => b.maintenanceFlag).length}
            </p>
            <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Maintenance Flags</p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/assistant/rentals/inspect"
          className="rounded-full bg-accent-earth px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-earth/90"
        >
          Mobile Inspection
        </Link>
        <Link
          href="/rentals"
          className="rounded-full border border-text-strong/20 px-5 py-2.5 text-sm font-semibold text-text-strong transition-colors hover:bg-text-strong/5"
        >
          View Public Catalog
        </Link>
      </div>

      {/* Dashboard */}
      <RentalOperationsDashboard
        assets={assets}
        quoteRequests={quoteRequests}
        bookings={bookings}
      />
    </div>
  );
}
