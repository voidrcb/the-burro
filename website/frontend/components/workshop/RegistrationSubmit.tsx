'use client';

export function RegistrationSubmit({
  disabled,
  isSubmitting,
  sessionLabel,
  onSubmit,
}: {
  disabled: boolean;
  isSubmitting: boolean;
  sessionLabel: string;
  onSubmit: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={disabled || isSubmitting}
        onClick={onSubmit}
        className="rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse disabled:opacity-60"
      >
        {isSubmitting ? 'Saving registration...' : 'Confirm registration'}
      </button>
      <p className="text-sm text-text-muted">Current session state: {sessionLabel}</p>
    </div>
  );
}
