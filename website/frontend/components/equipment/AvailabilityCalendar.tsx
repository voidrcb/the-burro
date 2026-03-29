import type { EquipmentAsset } from '@/lib/content/equipment';
import type { EquipmentReservation } from '@/lib/equipment/types';

export function AvailabilityCalendar({
  assets,
  reservations,
}: {
  assets: EquipmentAsset[];
  reservations: EquipmentReservation[];
}) {
  return (
    <div className="space-y-4">
      {assets.map((asset) => {
        const assetReservations = reservations.filter((reservation) => reservation.assetId === asset.id && reservation.status !== 'cancelled');
        return (
          <article key={asset.id} className="rounded-[22px] border border-text-strong/10 bg-white/85 p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text-strong">{asset.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-text-muted">{asset.status}</p>
              </div>
              <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{assetReservations.length} active reservations</span>
            </div>
            <div className="mt-3 space-y-2 text-sm text-text-muted">
              {assetReservations.length ? assetReservations.map((reservation) => (
                <p key={reservation.id}>{reservation.startDate} to {reservation.endDate} • {reservation.reservedBy}</p>
              )) : <p>No active reservations.</p>}
            </div>
          </article>
        );
      })}
    </div>
  );
}
