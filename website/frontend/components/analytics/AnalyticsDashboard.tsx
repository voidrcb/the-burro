'use client';

import { useState } from 'react';

import type { MonthlyReport } from '@/lib/analytics/types';

type AnalyticsDashboardProps = {
  initialReport: MonthlyReport | null;
  availableReports: string[];
};

// Format numbers for display
function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n);
}

export function AnalyticsDashboard({
  initialReport,
  availableReports,
}: AnalyticsDashboardProps) {
  const [report, setReport] = useState(initialReport);
  const [selectedReport, setSelectedReport] = useState(
    initialReport?.reportId ?? availableReports[0] ?? ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load a different report
  async function loadReport(reportId: string) {
    const [year, month] = reportId.replace('report_', '').split('_');
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analytics/report?year=${year}&month=${month}`);
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
        setSelectedReport(reportId);
      }
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  }

  // Generate report for current month
  async function generateCurrentReport() {
    const now = new Date();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/analytics/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: now.getFullYear(),
          month: now.getMonth() + 1,
        }),
      });
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
        setSelectedReport(data.report.reportId);
      }
    } catch {
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-text-strong">Analytics Dashboard</h2>
          <p className="mt-1 text-sm text-text-muted">
            Monthly business metrics per HF-908 cadence
          </p>
        </div>
        <div className="flex gap-3">
          {availableReports.length > 0 && (
            <select
              value={selectedReport}
              onChange={(e) => loadReport(e.target.value)}
              disabled={isLoading}
              className="rounded-lg border border-text-strong/15 bg-white px-4 py-2 text-sm text-text-strong"
            >
              {availableReports.map((r) => (
                <option key={r} value={r}>
                  {r.replace('report_', '').replace('_', '/')}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={generateCurrentReport}
            disabled={isGenerating}
            className="rounded-full bg-accent-earth px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isGenerating ? 'Generating...' : 'Generate Current'}
          </button>
        </div>
      </div>

      {!report ? (
        <div className="rounded-[24px] border border-text-strong/10 bg-surface-base p-8 text-center">
          <p className="text-text-muted">
            No report available. Generate a report to see analytics.
          </p>
        </div>
      ) : (
        <>
          {/* Tier 1 Metrics - Non-negotiable per A-2.3.2 */}
          <div className="rounded-[24px] border border-text-strong/10 bg-white p-6 shadow-soft">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-earth">
              Tier 1 Metrics (Non-Negotiable)
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <MetricCard
                label="Unique Visitors"
                value={formatNumber(report.tier1Metrics.uniqueVisitors)}
                description="Distinct visitors this period"
              />
              <MetricCard
                label="Booking Conversion"
                value={formatPercent(report.tier1Metrics.bookingConversionRate)}
                description="Booking intents to confirmations"
              />
              <MetricCard
                label="Workshop Registrations"
                value={report.tier1Metrics.workshopRegistrationCount.toString()}
                description="Total workshop signups"
              />
              <MetricCard
                label="Shop Revenue"
                value={formatCurrency(report.tier1Metrics.shopRevenueUsd)}
                description="Total shop order value"
              />
              <MetricCard
                label="Newsletter Rate"
                value={formatPercent(report.tier1Metrics.newsletterSignupRate)}
                description="Page views to signups"
              />
            </div>
          </div>

          {/* Tier 2 Metrics - Useful context per A-2.3.2 */}
          <div className="rounded-[24px] border border-text-strong/10 bg-surface-base/60 p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Tier 2 Metrics (Context)
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Rental Quotes"
                value={report.tier2Metrics.rentalQuotes.toString()}
                description="Quote requests received"
                variant="secondary"
              />
              <MetricCard
                label="Assistant Interactions"
                value={report.tier2Metrics.assistantInteractions.toString()}
                description="Burro assistant queries"
                variant="secondary"
              />
              <MetricCard
                label="Donation Total"
                value={formatCurrency(report.tier2Metrics.donationTotal)}
                description="Total donations received"
                variant="secondary"
              />
              <MetricCard
                label="Stream Uptime"
                value={`${report.tier2Metrics.streamUptimePct.toFixed(1)}%`}
                description="Livestream availability"
                variant="secondary"
              />
            </div>
          </div>

          {/* Event Counts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[24px] border border-text-strong/10 bg-white p-6 shadow-soft">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-earth">
                Event Breakdown
              </h3>
              <div className="mt-5 space-y-3">
                {Object.entries(report.eventCounts)
                  .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
                  .map(([eventType, count]) => (
                    <div
                      key={eventType}
                      className="flex items-center justify-between border-b border-text-strong/5 pb-2 last:border-0"
                    >
                      <span className="text-sm text-text-muted capitalize">
                        {eventType.replace(/_/g, ' ')}
                      </span>
                      <span className="font-semibold text-text-strong">
                        {formatNumber(count ?? 0)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Paths */}
            <div className="rounded-[24px] border border-text-strong/10 bg-white p-6 shadow-soft">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-earth">
                Top Pages
              </h3>
              <div className="mt-5 space-y-3">
                {report.topPaths.slice(0, 10).map((item, idx) => (
                  <div
                    key={item.path}
                    className="flex items-center justify-between border-b border-text-strong/5 pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-elevated text-xs font-semibold text-text-muted">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-text-strong font-mono">
                        {item.path}
                      </span>
                    </div>
                    <span className="text-sm text-text-muted">
                      {formatNumber(item.views)} views
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report metadata */}
          <div className="text-center text-xs text-text-muted">
            <p>
              Report: {report.reportId} | Period: {report.periodStart} to {report.periodEnd}
            </p>
            <p>Generated: {new Date(report.generatedAt).toLocaleString()}</p>
          </div>
        </>
      )}
    </div>
  );
}

// Metric card component
function MetricCard({
  label,
  value,
  description,
  variant = 'primary',
}: {
  label: string;
  value: string;
  description: string;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <div
      className={`rounded-[18px] p-4 ${
        variant === 'primary'
          ? 'bg-surface-base/80'
          : 'bg-white border border-text-strong/10'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl text-text-strong">{value}</p>
      <p className="mt-1 text-xs text-text-muted">{description}</p>
    </div>
  );
}
