import { Metadata } from 'next';
import Link from 'next/link';

import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { getMonthlyReport, listAvailableReports } from '@/lib/analytics/store';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Big Bend Burro Assistant',
  description:
    'View business metrics, conversion rates, and site analytics for Big Bend Burro.',
};

export default async function AnalyticsPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [currentReport, availableReports] = await Promise.all([
    getMonthlyReport(currentYear, currentMonth),
    listAvailableReports(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/assistant" className="hover:text-accent-earth">
              Assistant
            </Link>
            <span>/</span>
            <span className="text-text-strong">Analytics</span>
          </nav>
          <h1 className="mt-2 font-display text-4xl text-text-strong">
            Business Analytics
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Monthly reporting with Tier 1 and Tier 2 metrics per A-2.3.2
          </p>
        </div>
        <div className="rounded-full border border-accent-earth/25 bg-accent-secondary/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-earth">
          Sprint 2.3
        </div>
      </div>

      {/* Dashboard component */}
      <AnalyticsDashboard
        initialReport={currentReport}
        availableReports={availableReports}
      />

      {/* Quick links back to assistant */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/assistant"
          className="rounded-pill border border-text-strong/15 bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong no-underline hover:bg-surface-base"
        >
          Back to Assistant
        </Link>
        <Link
          href="/assistant/rentals"
          className="rounded-pill border border-text-strong/15 bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong no-underline hover:bg-surface-base"
        >
          Rentals Dashboard
        </Link>
        <Link
          href="/assistant/itinerary"
          className="rounded-pill border border-text-strong/15 bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-strong no-underline hover:bg-surface-base"
        >
          Itinerary Composer
        </Link>
      </div>

      {/* Documentation note */}
      <div className="mt-8 rounded-[20px] border border-text-strong/10 bg-surface-base/60 p-5">
        <h3 className="text-sm font-semibold text-text-strong">About This Dashboard</h3>
        <div className="mt-3 grid gap-4 text-sm text-text-muted md:grid-cols-2">
          <div>
            <p className="font-medium text-text-strong">Tier 1 Metrics (Non-Negotiable)</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Unique visitors</li>
              <li>Booking conversion rate</li>
              <li>Workshop registration count</li>
              <li>Shop revenue USD</li>
              <li>Newsletter signup rate</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-text-strong">Tier 2 Metrics (Context)</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Rental quotes</li>
              <li>Assistant interactions</li>
              <li>Donation total</li>
              <li>Stream uptime percentage</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-xs text-text-muted">
          Reports are generated monthly per HF-908 cadence. Server-side event tracking
          ensures durability per HF-907.
        </p>
      </div>
    </div>
  );
}
