'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import type { RentalAsset } from '@/lib/rental/types';

interface QuoteFormProps {
  assets: RentalAsset[];
}

interface QuoteResponse {
  quoteRequestId: string;
  quote: {
    assetName: string;
    totalDays: number;
    dailyRate: number;
    subtotal: number;
    deliveryFee: number;
    taxEstimate: number;
    depositRequired: number;
    totalEstimate: number;
    validUntil: string;
  };
  message: string;
}

export function RentalQuoteForm({ assets }: QuoteFormProps) {
  const searchParams = useSearchParams();
  const preselectedAsset = searchParams.get('asset') ?? '';

  const defaultAsset = assets.find((a) => a.slug === preselectedAsset) ?? assets[0];

  const [assetId, setAssetId] = useState(defaultAsset?.id ?? '');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deliveryRequired, setDeliveryRequired] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [intendedUse, setIntendedUse] = useState('');
  const [previousExperience, setPreviousExperience] = useState(false);
  const [insuranceConfirmed, setInsuranceConfirmed] = useState(false);
  const [policyAcknowledged, setPolicyAcknowledged] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteResult, setQuoteResult] = useState<QuoteResponse | null>(null);

  const selectedAsset = assets.find((a) => a.id === assetId);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/rentals/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId,
          customerName,
          customerEmail,
          customerPhone,
          requestedStartDate: startDate,
          requestedEndDate: endDate,
          deliveryRequired,
          deliveryAddress: deliveryRequired ? deliveryAddress : undefined,
          intendedUse,
          previousRentalExperience: previousExperience,
          insuranceConfirmed,
          policyAcknowledged,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit quote request.');
      }

      setQuoteResult(data as QuoteResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit quote request.');
    } finally {
      setSubmitting(false);
    }
  }

  // Show success state
  if (quoteResult) {
    return (
      <div className="rounded-[28px] border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-4 font-display text-2xl text-text-strong">Quote Request Submitted</h2>
        <p className="mt-2 text-text-body">{quoteResult.message}</p>

        <div className="mt-6 rounded-[20px] bg-white p-6 text-left">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-earth">
            Quote Summary
          </h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Equipment</span>
              <span className="text-text-strong">{quoteResult.quote.assetName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Duration</span>
              <span className="text-text-strong">{quoteResult.quote.totalDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Daily Rate</span>
              <span className="text-text-strong">${quoteResult.quote.dailyRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text-strong">${quoteResult.quote.subtotal}</span>
            </div>
            {quoteResult.quote.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-text-muted">Delivery Fee</span>
                <span className="text-text-strong">${quoteResult.quote.deliveryFee}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-muted">Tax Estimate</span>
              <span className="text-text-strong">${quoteResult.quote.taxEstimate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-text-strong/10 pt-2 font-semibold">
              <span className="text-text-strong">Total Estimate</span>
              <span className="text-text-strong">${quoteResult.quote.totalEstimate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-text-muted">Security Deposit</span>
              <span className="text-text-strong">${quoteResult.quote.depositRequired.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-text-muted">
          Reference: {quoteResult.quoteRequestId}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-text-strong/10 bg-white/90 p-8 shadow-soft"
    >
      {/* Equipment Selection */}
      <div>
        <label className="block text-sm font-semibold text-text-strong">
          Equipment <span className="text-accent-earth">*</span>
        </label>
        <select
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          required
          className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong focus:border-accent-earth focus:outline-none focus:ring-1 focus:ring-accent-earth"
        >
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name} - ${asset.dailyRate}/day
            </option>
          ))}
        </select>
      </div>

      {/* Contact Information */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-text-strong">
            Your Name <span className="text-accent-earth">*</span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong focus:border-accent-earth focus:outline-none focus:ring-1 focus:ring-accent-earth"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-strong">
            Email <span className="text-accent-earth">*</span>
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
            className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong focus:border-accent-earth focus:outline-none focus:ring-1 focus:ring-accent-earth"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold text-text-strong">
          Phone <span className="text-accent-earth">*</span>
        </label>
        <input
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
          className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong focus:border-accent-earth focus:outline-none focus:ring-1 focus:ring-accent-earth"
        />
      </div>

      {/* Dates */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-text-strong">
            Start Date <span className="text-accent-earth">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
            className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong focus:border-accent-earth focus:outline-none focus:ring-1 focus:ring-accent-earth"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-strong">
            End Date <span className="text-accent-earth">*</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            min={startDate || new Date().toISOString().split('T')[0]}
            className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong focus:border-accent-earth focus:outline-none focus:ring-1 focus:ring-accent-earth"
          />
        </div>
      </div>

      {/* Delivery */}
      <div className="mt-6">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={deliveryRequired}
            onChange={(e) => setDeliveryRequired(e.target.checked)}
            className="h-5 w-5 rounded border-text-strong/20 text-accent-earth focus:ring-accent-earth"
          />
          <span className="text-sm text-text-strong">
            I need delivery to my location (+${selectedAsset?.deliveryFee ?? 0})
          </span>
        </label>
      </div>

      {deliveryRequired && (
        <div className="mt-4">
          <label className="block text-sm font-semibold text-text-strong">
            Delivery Address <span className="text-accent-earth">*</span>
          </label>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required={deliveryRequired}
            placeholder="Street address or property description"
            className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong focus:border-accent-earth focus:outline-none focus:ring-1 focus:ring-accent-earth"
          />
          <p className="mt-1 text-xs text-text-muted">
            Must be within 50 miles of Terlingua with trailer-accessible road
          </p>
        </div>
      )}

      {/* Intended Use */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-text-strong">
          What will you use this equipment for? <span className="text-accent-earth">*</span>
        </label>
        <textarea
          value={intendedUse}
          onChange={(e) => setIntendedUse(e.target.value)}
          required
          rows={3}
          placeholder="Describe your project (e.g., digging pond, clearing brush, trenching for water line)"
          className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong focus:border-accent-earth focus:outline-none focus:ring-1 focus:ring-accent-earth"
        />
      </div>

      {/* Experience */}
      <div className="mt-6">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={previousExperience}
            onChange={(e) => setPreviousExperience(e.target.checked)}
            className="h-5 w-5 rounded border-text-strong/20 text-accent-earth focus:ring-accent-earth"
          />
          <span className="text-sm text-text-strong">
            I have previous experience operating similar equipment
          </span>
        </label>
      </div>

      {/* Acknowledgements */}
      <div className="mt-8 space-y-4 rounded-[20px] border border-text-strong/10 bg-surface-base/50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
          Required Acknowledgements
        </p>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={insuranceConfirmed}
            onChange={(e) => setInsuranceConfirmed(e.target.checked)}
            required
            className="mt-0.5 h-5 w-5 rounded border-text-strong/20 text-accent-earth focus:ring-accent-earth"
          />
          <span className="text-sm text-text-body">
            I confirm I have liability insurance or will purchase rental equipment insurance before operation. <span className="text-accent-earth">*</span>
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={policyAcknowledged}
            onChange={(e) => setPolicyAcknowledged(e.target.checked)}
            required
            className="mt-0.5 h-5 w-5 rounded border-text-strong/20 text-accent-earth focus:ring-accent-earth"
          />
          <span className="text-sm text-text-body">
            I understand that a security deposit is required and may be forfeited for damage, misuse, or late return. I will complete the inspection process at checkout and checkin. <span className="text-accent-earth">*</span>
          </span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-[18px] bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !insuranceConfirmed || !policyAcknowledged}
        className="mt-8 w-full rounded-full bg-text-strong py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-text-strong/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Submitting...' : 'Submit Quote Request'}
      </button>

      <p className="mt-4 text-center text-xs text-text-muted">
        We review all requests personally. Expect a response within 24 hours.
      </p>
    </form>
  );
}
