import type { EquipmentAsset } from '@/lib/content/equipment';

export function MaintenanceNotes({ assets }: { assets: EquipmentAsset[] }) {
  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <article key={asset.id} className="rounded-[22px] border border-text-strong/10 bg-white/85 p-4 shadow-soft">
          <p className="text-sm font-semibold text-text-strong">{asset.name}</p>
          <div className="mt-3 space-y-2 text-sm text-text-muted">
            {asset.maintenanceLog.length ? asset.maintenanceLog.map((entry) => (
              <p key={`${asset.id}-${entry.date}-${entry.description}`}>{entry.date} • {entry.description}{entry.resolvedAt ? ` • resolved ${entry.resolvedAt}` : ''}</p>
            )) : <p>No maintenance notes recorded.</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
