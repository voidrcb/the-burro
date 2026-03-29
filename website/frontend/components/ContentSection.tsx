export function ContentSection({
  id,
  kicker,
  title,
  body,
  children,
}: {
  id?: string;
  kicker: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-6">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-accent-sage">{kicker}</p>
        <h2 className="font-display text-3xl text-text-strong">{title}</h2>
        <p className="leading-8 text-text-body">{body}</p>
      </div>
      {children}
    </section>
  );
}
