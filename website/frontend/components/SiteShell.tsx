import { PrimaryNav } from '@/components/nav/PrimaryNav';
import { SiteFooter } from '@/components/shared/SiteFooter';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-text-strong/10 bg-surface-base/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="font-display text-2xl text-text-strong">Big Bend Burro</p>
            <p className="text-sm text-text-muted">Stewardship-first field notes, workshops, and desert hospitality in the making.</p>
          </div>
          <PrimaryNav />
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-section px-6 py-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
