export function StoryBlock({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="grid gap-6 rounded-panel bg-surface-elevated p-8 shadow-soft md:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-accent-earth">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl text-text-strong">{title}</h2>
      </div>
      <p className="text-base leading-8 text-text-body">{body}</p>
    </section>
  );
}
