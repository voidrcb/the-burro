import Link from 'next/link';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-text-strong/10 bg-surface-night text-text-inverse">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Branding */}
          <div className="flex flex-col gap-2">
            <p className="font-display text-xl">Big Bend Burro</p>
            <p className="max-w-xs text-sm text-nightSafe-haze">
              Stewardship-first stays, workshops, and desert hospitality in the Big Bend region.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-nightSafe-haze">Explore</p>
            <nav className="flex flex-col gap-1 text-sm">
              <Link href="/stay" className="hover:text-accent-secondary transition-colors">Stay</Link>
              <Link href="/workshops" className="hover:text-accent-secondary transition-colors">Workshops</Link>
              <Link href="/experiences" className="hover:text-accent-secondary transition-colors">Experiences</Link>
              <Link href="/steel-buildings" className="hover:text-accent-secondary transition-colors">Steel Buildings</Link>
              <Link href="/shop" className="hover:text-accent-secondary transition-colors">Shop</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-nightSafe-haze">Connect</p>
            <nav className="flex flex-col gap-1 text-sm">
              <Link href="/contact" className="hover:text-accent-secondary transition-colors">Contact Us</Link>
              <Link href="/blog" className="hover:text-accent-secondary transition-colors">Journal</Link>
              <span className="text-nightSafe-haze">Newsletter coming soon</span>
            </nav>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-nightSafe-haze">Legal</p>
            <nav className="flex flex-col gap-1 text-sm text-nightSafe-haze">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-nightSafe-haze/20 pt-6">
          <p className="text-center text-sm text-nightSafe-haze">
            &copy; {currentYear} Big Bend Burro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
