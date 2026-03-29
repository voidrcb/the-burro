'use client';

import { useState } from 'react';

import type { EquipmentAsset } from '@/lib/content/types';
import type { EquipmentReservation } from '@/lib/equipment/types';

export function EquipmentReservationManager({
  assets,
  reservations,
}: {
  assets: EquipmentAsset[];
  reservations: EquipmentReservation[];
}) {
  const [assetId, setAssetId] = useState(assets[0]?.id ?? '');
  const [reservedBy, setReservedBy] = useState('internal');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusyId('create');

    try {
      const response = await fetch('/api/equipment/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, reservedBy, startDate, endDate, purpose, notes: notes || undefined }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to create reservation.');
      }

      window.location.reload();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to create reservation.');
      setBusyId(null);
    }
  }

  async function handleCancel(reservationId: string) {
    setError(null);
    setBusyId(reservationId);

    try {
      const response = await fetch('/api/equipment/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to cancel reservation.');
      }

      window.location.reload();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to cancel reservation.');
      setBusyId(null);
    }
  }

  return (
    <section className="rounded-[28px] border border-text-strong/10 bg-white/90 p-6 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Simple reservation CRUD</p>
      <h2 className="mt-2 font-display text-3xl text-text-strong">Create or cancel equipment holds</h2>

      <form onSubmit={handleCreate} className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-text-strong">Asset</span>
          <select value={assetId} onChange={(event) => setAssetId(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong">
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-text-strong">Reserved by</span>
          <input value={reservedBy} onChange={(event) => setReservedBy(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-text-strong">Start date</span>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-text-strong">End date</span>
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-semibold text-text-strong">Purpose</span>
          <input value={purpose} onChange={(event) => setPurpose(event.target.value)} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-semibold text-text-strong">Notes</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong" />
        </label>
        <div className="md:col-span-2">
          <button type="submit" disabled={busyId === 'create'} className="rounded-full bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse disabled:opacity-60">
            {busyId === 'create' ? 'Saving...' : 'Create reservation'}
          </button>
        </div>
      </form>

      {error ? <p className="mt-4 text-sm font-medium text-[#8a3928]">{error}</p> : null}

      <div className="mt-6 space-y-3">
        {reservations.length ? (
          reservations.map((reservation) => (
            <article key={reservation.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-text-strong/10 bg-surface-base/80 p-4">
              <div>
                <p className="text-sm font-semibold text-text-strong">{reservation.purpose}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
                  {reservation.assetId} • {reservation.startDate} to {reservation.endDate} • {reservation.status}
                </p>
              </div>
              <button
                type="button"
                disabled={reservation.status === 'cancelled' || busyId === reservation.id}
                onClick={() => handleCancel(reservation.id)}
                className="rounded-full border border-text-strong/10 px-4 py-2 text-sm font-semibold text-text-strong disabled:opacity-50"
              >
                {reservation.status === 'cancelled' ? 'Cancelled' : busyId === reservation.id ? 'Cancelling...' : 'Cancel'}
              </button>
            </article>
          ))
        ) : (
          <p className="text-sm leading-7 text-text-muted">No equipment reservations recorded yet.</p>
        )}
      </div>
    </section>
  );
}
