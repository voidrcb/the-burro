import Link from 'next/link';

export default function WorkshopRegistrationConfirmationPage({
  searchParams,
}: {
  searchParams?: { registrationId?: string };
}) {
  return (
    <section className="rounded-panel border border-text-strong/10 bg-white/90 p-8 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Workshop confirmation</p>
      <h1 className="mt-3 font-display text-4xl text-text-strong">Registration received</h1>
      <p className="mt-4 max-w-2xl text-base leading-8 text-text-body">
        Your workshop registration has been received. We will follow up with payment details and session preparation information.
      </p>
      <p className="mt-4 text-sm text-text-muted">Registration ID: {searchParams?.registrationId ?? 'pending'}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/workshops" className="rounded-pill bg-text-strong px-4 py-3 text-sm font-semibold text-text-inverse no-underline">Back to workshops</Link>
        <Link href="/contact" className="rounded-pill border border-text-strong/15 bg-surface-elevated px-4 py-3 text-sm font-semibold text-text-strong no-underline">Contact the operators</Link>
      </div>
    </section>
  );
}
