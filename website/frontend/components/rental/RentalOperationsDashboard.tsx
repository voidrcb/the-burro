'use client';

import { useState } from 'react';

import type { RentalAsset, QuoteRequest, RentalBooking } from '@/lib/rental/types';

interface DashboardProps {
  assets: RentalAsset[];
  quoteRequests: QuoteRequest[];
  bookings: RentalBooking[];
}

type TabId = 'quotes' | 'bookings' | 'assets';

export function RentalOperationsDashboard({ assets, quoteRequests, bookings }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('quotes');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pendingQuotes = quoteRequests.filter((q) => q.status === 'pending');
  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'quotes', label: 'Quote Requests', count: pendingQuotes.length },
    { id: 'bookings', label: 'Active Bookings', count: bookings.length },
    { id: 'assets', label: 'Assets', count: assets.length },
  ];

  async function handleApproveQuote(quoteId: string) {
    setError(null);
    setProcessingId(quoteId);

    try {
      const response = await fetch('/api/rentals/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteRequestId: quoteId,
          operatorId: 'operator_console', // In production, get from auth
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve quote');
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve quote');
      setProcessingId(null);
    }
  }

  async function handleTransitionState(bookingId: string, toState: string) {
    setError(null);
    setProcessingId(bookingId);

    try {
      const response = await fetch(`/api/rentals/${bookingId}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toState,
          operatorId: 'operator_console',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to transition state');
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transition state');
      setProcessingId(null);
    }
  }

  async function handleToggleMaintenance(bookingId: string, enable: boolean) {
    setError(null);
    setProcessingId(bookingId);

    try {
      const response = await fetch(`/api/rentals/${bookingId}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'maintenance',
          enable,
          operatorId: 'operator_console',
          reason: enable ? 'Flagged for maintenance review' : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle maintenance');
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle maintenance');
      setProcessingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-text-strong/10 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-text-strong text-text-inverse'
                : 'text-text-muted hover:bg-text-strong/5 hover:text-text-strong'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-[18px] bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Quote Requests Tab */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          {pendingQuotes.length === 0 ? (
            <div className="rounded-[28px] border border-text-strong/10 bg-white/90 p-8 text-center">
              <p className="text-text-muted">No pending quote requests.</p>
            </div>
          ) : (
            pendingQuotes.map((quote) => {
              const asset = assets.find((a) => a.id === quote.assetId);
              return (
                <article
                  key={quote.id}
                  className="rounded-[28px] border border-text-strong/10 bg-white/90 p-6 shadow-soft"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-accent-earth">
                        {quote.status} quote request
                      </p>
                      <h3 className="mt-1 font-display text-xl text-text-strong">
                        {asset?.name ?? quote.assetId}
                      </h3>
                      <p className="mt-1 text-sm text-text-muted">
                        {quote.customerName} &bull; {quote.customerEmail}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-text-strong">
                        {quote.requestedStartDate} to {quote.requestedEndDate}
                      </p>
                      <p className="text-text-muted">
                        {quote.deliveryRequired ? 'Delivery required' : 'Customer pickup'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[18px] bg-surface-base p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                      Intended Use
                    </p>
                    <p className="mt-1 text-sm text-text-body">{quote.intendedUse}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                    <span
                      className={`rounded-full px-2 py-1 ${
                        quote.previousRentalExperience
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {quote.previousRentalExperience ? 'Has experience' : 'No prior experience'}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800">
                      Insurance confirmed
                    </span>
                    <span className="text-text-muted">
                      Submitted {new Date(quote.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleApproveQuote(quote.id)}
                      disabled={processingId === quote.id}
                      className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
                    >
                      {processingId === quote.id ? 'Processing...' : 'Approve Quote'}
                    </button>
                    <button
                      disabled
                      className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 opacity-60"
                    >
                      Reject (coming soon)
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="rounded-[28px] border border-text-strong/10 bg-white/90 p-8 text-center">
              <p className="text-text-muted">No active bookings.</p>
            </div>
          ) : (
            bookings.map((booking) => {
              const stateColors: Record<string, string> = {
                quoted: 'bg-gray-100 text-gray-800',
                reserved: 'bg-blue-100 text-blue-800',
                delivered: 'bg-purple-100 text-purple-800',
                active: 'bg-green-100 text-green-800',
                returned: 'bg-amber-100 text-amber-800',
                inspected: 'bg-teal-100 text-teal-800',
                closed: 'bg-gray-200 text-gray-600',
              };

              const nextStates: Record<string, string[]> = {
                quoted: ['reserved'],
                reserved: ['delivered'],
                delivered: [], // Requires inspection
                active: ['returned'],
                returned: [], // Requires inspection
                inspected: ['closed'],
                closed: [],
              };

              return (
                <article
                  key={booking.id}
                  className="rounded-[28px] border border-text-strong/10 bg-white/90 p-6 shadow-soft"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${stateColors[booking.state]}`}
                        >
                          {booking.state}
                        </span>
                        {booking.maintenanceFlag && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold uppercase text-red-800">
                            Maintenance
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 font-display text-xl text-text-strong">
                        {booking.assetName}
                      </h3>
                      <p className="mt-1 text-sm text-text-muted">
                        {booking.customerName} &bull; {booking.customerPhone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg text-text-strong">
                        ${booking.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-text-muted">
                        {booking.startDate} to {booking.endDate}
                      </p>
                    </div>
                  </div>

                  {/* State history preview */}
                  <div className="mt-4 text-xs text-text-muted">
                    Last updated: {new Date(booking.updatedAt).toLocaleString()}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {/* State transitions */}
                    {nextStates[booking.state]?.map((state) => (
                      <button
                        key={state}
                        onClick={() => handleTransitionState(booking.id, state)}
                        disabled={processingId === booking.id}
                        className="rounded-full bg-text-strong px-4 py-2 text-sm font-semibold text-text-inverse transition-colors hover:bg-text-strong/90 disabled:opacity-60"
                      >
                        Transition to {state}
                      </button>
                    ))}

                    {/* Inspection prompts */}
                    {booking.state === 'delivered' && !booking.checkoutInspectionId && (
                      <span className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-800">
                        Checkout inspection required
                      </span>
                    )}
                    {booking.state === 'returned' && !booking.checkinInspectionId && (
                      <span className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-800">
                        Checkin inspection required
                      </span>
                    )}

                    {/* Maintenance toggle */}
                    {['returned', 'inspected'].includes(booking.state) && (
                      <button
                        onClick={() => handleToggleMaintenance(booking.id, !booking.maintenanceFlag)}
                        disabled={processingId === booking.id}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
                          booking.maintenanceFlag
                            ? 'border-green-200 text-green-700 hover:bg-green-50'
                            : 'border-red-200 text-red-700 hover:bg-red-50'
                        }`}
                      >
                        {booking.maintenanceFlag ? 'Clear Maintenance' : 'Flag for Maintenance'}
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="grid gap-4 md:grid-cols-2">
          {assets.map((asset) => {
            const statusColors: Record<string, string> = {
              available: 'bg-green-100 text-green-800',
              reserved: 'bg-blue-100 text-blue-800',
              rented: 'bg-purple-100 text-purple-800',
              maintenance: 'bg-amber-100 text-amber-800',
              retired: 'bg-gray-100 text-gray-600',
            };

            return (
              <article
                key={asset.id}
                className="rounded-[28px] border border-text-strong/10 bg-white/90 p-6 shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-accent-earth">
                      {asset.category}
                    </p>
                    <h3 className="mt-1 font-display text-lg text-text-strong">
                      {asset.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${statusColors[asset.status]}`}
                    >
                      {asset.status}
                    </span>
                    {asset.maintenanceFlag && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold uppercase text-red-800">
                        Maint.
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-text-muted">Daily:</span>{' '}
                    <span className="text-text-strong">${asset.dailyRate}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Deposit:</span>{' '}
                    <span className="text-text-strong">${asset.depositRequired.toLocaleString()}</span>
                  </div>
                </div>

                {asset.featured && (
                  <span className="mt-3 inline-block rounded-full bg-accent-earth/10 px-2 py-1 text-xs text-accent-earth">
                    Featured
                  </span>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
