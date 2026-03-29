'use client';

export function WaiverAck({ checked, disabled, onChange }: { checked: boolean; disabled?: boolean; onChange: (next: boolean) => void }) {
  return (
    <label className="flex gap-3 rounded-[22px] border border-text-strong/10 bg-surface-base/80 p-4 text-sm leading-7 text-text-muted">
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4" />
      <span>
        I understand this is a remote-stay handoff. I have read the access, weather, and cancellation notes above, and I agree to store a timestamped waiver acknowledgement before I am redirected to Lodgify.
      </span>
    </label>
  );
}
