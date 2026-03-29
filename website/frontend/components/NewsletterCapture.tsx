export function NewsletterCapture() {
  return (
    <div className="rounded-panel bg-desert-glow p-6 text-text-inverse shadow-soft">
      <p className="text-sm uppercase tracking-[0.2em] text-nightSafe-glow/80">UI only</p>
      <h3 className="mt-3 font-display text-2xl">Newsletter capture stays inactive in Sprint 0.2</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-nightSafe-glow/90">
        This component exists to lock layout, spacing, and tone. No email provider integration or submission handling is active yet.
      </p>
      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <input disabled placeholder="operator-observe@example.com" className="rounded-pill px-4 py-3 text-text-strong" />
        <button disabled className="rounded-pill bg-text-strong px-5 py-3 font-semibold text-text-inverse opacity-80">Coming later</button>
      </div>
    </div>
  );
}
