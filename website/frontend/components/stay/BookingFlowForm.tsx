'use client';

import { useEffect, useState } from 'react';

import type { LodgingUnit } from '@/lib/content/stay-types';
import type { PriceQuote } from '@/lib/content/rates';

import { ComingSoonBadge } from '@/components/ui/ComingSoonBadge';
import { DatePicker } from './DatePicker';
import { GuestForm } from './GuestForm';
import { PriceDisplay } from './PriceDisplay';
import { WaiverAck } from './WaiverAck';

type BookingFlowFormProps = {
  unit: LodgingUnit;
  initialQuote: PriceQuote;
};

export function BookingFlowForm({ unit, initialQuote }: BookingFlowFormProps) {
  const [checkIn, setCheckIn] = useState(initialQuote.checkIn);
  const [checkOut, setCheckOut] = useState(initialQuote.checkOut);
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [guest, setGuest] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    adults: Math.max(1, unit.capacity.adults > 0 ? 1 : 0),
    children: 0,
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [quote, setQuote] = useState(initialQuote);

  const canSubmit = Boolean(checkIn && checkOut && guest.guestName && guest.guestEmail && waiverAccepted && !quote.isBlackout);

  useEffect(() => {
    async function refreshQuote() {
      if (!checkIn || !checkOut) {
        return;
      }

      const response = await fetch('/api/booking/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitSlug: unit.slug,
          checkIn,
          checkOut,
        }),
      });
      const body = (await response.json()) as PriceQuote | { error: string };

      if (!response.ok || 'error' in body) {
        setMessage('Unable to refresh pricing for the selected dates.');
        return;
      }

      setQuote(body);
      setMessage(null);
    }

    void refreshQuote();
  }, [checkIn, checkOut, unit.slug]);

  async function handleSubmit() {
    if (!canSubmit) {
      setMessage('Add dates, guest details, and waiver acknowledgement before continuing.');
      return;
    }

    setIsSubmitting(true);
    setMessage('Saving your waiver acknowledgement and preparing the Lodgify handoff...');

    try {
      const waiverResponse = await fetch('/api/booking/waiver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestEmail: guest.guestEmail,
          guestName: guest.guestName,
          unitId: unit.id,
          checkIn,
          checkOut,
          policyVersion: 'stay-mvp-v1',
        }),
      });
      const waiverBody = (await waiverResponse.json()) as { waiverId?: string; error?: string };
      if (!waiverResponse.ok || !waiverBody.waiverId) {
        throw new Error(waiverBody.error ?? 'Unable to store waiver acknowledgement.');
      }

      const intentResponse = await fetch('/api/booking/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitSlug: unit.slug,
          guestName: guest.guestName,
          guestEmail: guest.guestEmail,
          guestPhone: guest.guestPhone,
          checkIn,
          checkOut,
          partySize: {
            adults: guest.adults,
            children: guest.children,
          },
          specialRequests: guest.specialRequests,
          waiverId: waiverBody.waiverId,
          totalAmount: quote.totalEstimate,
        }),
      });
      const intentBody = (await intentResponse.json()) as { redirectUrl?: string; error?: string };
      if (!intentResponse.ok || !intentBody.redirectUrl) {
        throw new Error(intentBody.error ?? 'Unable to create booking intent.');
      }

      window.location.href = intentBody.redirectUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unexpected booking handoff error.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-panel border border-text-strong/10 bg-white/90 p-6 shadow-soft">
      <ComingSoonBadge variant="banner" message="Booking Preview Mode" className="mb-6" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Booking handoff</p>
          <h2 className="mt-2 font-display text-3xl text-text-strong">Acknowledge policies, then continue in Lodgify</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">
            Burro records your waiver and booking details here, then sends you to Lodgify to complete payment and confirm the reservation.
            <span className="mt-2 block font-semibold text-accent-earth">Online booking launching soon. Contact us directly to reserve.</span>
          </p>
        </div>
      </div>

      <div className="mt-6">
        <PriceDisplay
          nightly={quote.nightly}
          seasonName={quote.seasonName}
          totalEstimate={quote.totalEstimate}
          nights={quote.nights}
          cleaningFee={quote.cleaningFee}
          weeklyDiscount={quote.weeklyDiscount}
        />
      </div>

      <div className="mt-6 space-y-6">
        <DatePicker
          checkIn={checkIn}
          checkOut={checkOut}
          blackoutDates={quote.blackoutDates}
          minDate={new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)}
          disabled={isSubmitting}
          onChange={({ checkIn: nextCheckIn, checkOut: nextCheckOut }) => {
            setCheckIn(nextCheckIn);
            setCheckOut(nextCheckOut);
          }}
        />
        <GuestForm value={guest} disabled={isSubmitting} onChange={setGuest} />
        <WaiverAck checked={waiverAccepted} disabled={isSubmitting || quote.isBlackout} onChange={setWaiverAccepted} />
      </div>

      {quote.isBlackout ? <p className="mt-4 text-sm font-semibold text-accent-earth">The selected stay window is in a blackout period. Choose another date before continuing.</p> : null}
      {message ? <p className="mt-4 text-sm text-text-muted">{message}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!canSubmit || isSubmitting}
          onClick={() => void handleSubmit()}
          className="rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse disabled:opacity-60"
        >
          {isSubmitting ? 'Preparing Lodgify...' : 'Continue to Lodgify'}
        </button>
        <p className="max-w-xl text-xs leading-6 text-text-muted">
          A pending booking record is created only when you choose to continue. A confirmed booking is created when Lodgify calls the webhook back.
        </p>
      </div>
    </div>
  );
}
