import { AvailabilityCalendar } from '@/components/equipment/AvailabilityCalendar';
import { MaintenanceNotes } from '@/components/equipment/MaintenanceNotes';
import { listEquipmentAssets } from '@/lib/content/equipment';
import { listEquipmentReservations } from '@/lib/equipment/store';

export default async function AssistantEquipmentPage() {
  const [assets, reservations] = await Promise.all([listEquipmentAssets(), listEquipmentReservations()]);

  return (
    <div className="space-y-6">
      <section className="rounded-panel border border-text-strong/10 bg-white/90 p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Internal equipment scheduler</p>
        <h1 className="mt-3 font-display text-4xl text-text-strong">Asset visibility and simple reservation tracking</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-text-body">
          Sprint 1.3 keeps the equipment surface internal. Operators can inspect assets, review active reservations, and read maintenance notes without exposing any public rental flow yet.
        </p>
      </section>

      <AvailabilityCalendar assets={assets} reservations={reservations} />
      <MaintenanceNotes assets={assets} />
    </div>
  );
}
