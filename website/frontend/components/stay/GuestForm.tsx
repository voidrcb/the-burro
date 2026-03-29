'use client';

type GuestFormValue = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  adults: number;
  children: number;
  specialRequests: string;
};

export function GuestForm({
  value,
  disabled,
  onChange,
}: {
  value: GuestFormValue;
  disabled?: boolean;
  onChange: (next: GuestFormValue) => void;
}) {
  return (
    <fieldset className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-semibold text-text-strong">
        Guest name
        <input
          type="text"
          value={value.guestName}
          disabled={disabled}
          onChange={(event) => onChange({ ...value, guestName: event.target.value })}
          className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong"
        />
      </label>
      <label className="text-sm font-semibold text-text-strong">
        Email
        <input
          type="email"
          value={value.guestEmail}
          disabled={disabled}
          onChange={(event) => onChange({ ...value, guestEmail: event.target.value })}
          className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong"
        />
      </label>
      <label className="text-sm font-semibold text-text-strong">
        Phone
        <input
          type="tel"
          value={value.guestPhone}
          disabled={disabled}
          onChange={(event) => onChange({ ...value, guestPhone: event.target.value })}
          className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm font-semibold text-text-strong">
          Adults
          <input
            type="number"
            min={1}
            value={value.adults}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, adults: Number(event.target.value) || 1 })}
            className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong"
          />
        </label>
        <label className="text-sm font-semibold text-text-strong">
          Children
          <input
            type="number"
            min={0}
            value={value.children}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, children: Number(event.target.value) || 0 })}
            className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong"
          />
        </label>
      </div>
      <label className="md:col-span-2 text-sm font-semibold text-text-strong">
        Special requests
        <textarea
          value={value.specialRequests}
          disabled={disabled}
          onChange={(event) => onChange({ ...value, specialRequests: event.target.value })}
          rows={4}
          className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-white px-4 py-3 text-sm text-text-strong"
        />
      </label>
    </fieldset>
  );
}
