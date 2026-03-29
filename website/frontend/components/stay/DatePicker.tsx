'use client';

type DatePickerProps = {
  checkIn: string;
  checkOut: string;
  blackoutDates: string[];
  minDate?: string;
  disabled?: boolean;
  onChange: (next: { checkIn: string; checkOut: string }) => void;
};

export function DatePicker({ checkIn, checkOut, blackoutDates, minDate, disabled, onChange }: DatePickerProps) {
  return (
    <fieldset className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-semibold text-text-strong">
        Check-in
        <input
          type="date"
          value={checkIn}
          min={minDate}
          disabled={disabled}
          onChange={(event) => onChange({ checkIn: event.target.value, checkOut })}
          className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong"
        />
      </label>
      <label className="text-sm font-semibold text-text-strong">
        Check-out
        <input
          type="date"
          value={checkOut}
          min={checkIn || minDate}
          disabled={disabled}
          onChange={(event) => onChange({ checkIn, checkOut: event.target.value })}
          className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong"
        />
      </label>
      {blackoutDates.length ? <p className="md:col-span-2 text-xs text-text-muted">Blackout hints: {blackoutDates.join(', ')}</p> : null}
    </fieldset>
  );
}
