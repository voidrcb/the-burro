export function Card({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <article className="rounded-panel border border-text-strong/10 bg-white/80 p-card shadow-soft">
      <h3 className="font-display text-2xl text-text-strong">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-text-muted">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </article>
  );
}
