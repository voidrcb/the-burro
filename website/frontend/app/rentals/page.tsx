import Link from 'next/link';

import { Card } from '@/components/Card';
import { ContentSection } from '@/components/ContentSection';
import { Hero } from '@/components/Hero';
import { StoryBlock } from '@/components/StoryBlock';
import { ComingSoonBadge } from '@/components/ui/ComingSoonBadge';

const equipment = [
  {
    name: 'Kubota KX040-4 Mini Excavator',
    category: 'Excavator',
    description: 'Versatile mini excavator for ranch work, water projects, and land clearing. 40 HP, 9,000 lb operating weight.',
    specs: ['Max digging depth: 11 ft 2 in', 'Max reach: 18 ft 7 in', 'Track width: 12.6 in'],
    dailyRate: 450,
    weeklyRate: 2250,
    deposit: 2500,
    status: 'available',
  },
  {
    name: 'Sony A7R Night Photography Kit',
    category: 'Camera',
    description: 'Full-frame mirrorless camera optimized for dark sky photography. Includes wide-angle lens and tripod.',
    specs: ['42.4 MP sensor', '14mm f/2.8 lens', 'Carbon fiber tripod'],
    dailyRate: 95,
    weeklyRate: null,
    deposit: 250,
    status: 'available',
  },
  {
    name: 'Star Tracker Mount',
    category: 'Camera',
    description: 'Motorized tracking mount for long-exposure astrophotography. Compensates for Earth rotation.',
    specs: ['Payload capacity: 11 lbs', 'Battery powered', 'Polar alignment scope'],
    dailyRate: 45,
    weeklyRate: null,
    deposit: 150,
    status: 'available',
  },
  {
    name: 'Tile Workshop Tool Pack',
    category: 'Workshop',
    description: 'Complete tool set for ceramic tile making. Includes cutters, stamps, glazing tools.',
    specs: ['Professional grade tools', 'Protective cases', 'Instruction guide'],
    dailyRate: 35,
    weeklyRate: null,
    deposit: 100,
    status: 'coming-soon',
  },
];

export default function RentalsPage() {
  return (
    <>
      <Hero
        eyebrow="Equipment Rental"
        title="Construction and photography equipment for Big Bend projects"
        body="Heavy equipment for remote property work and specialty gear for dark sky photography. Delivery available throughout Brewster County."
        primaryAction={{ href: '/contact', label: 'Request a quote' }}
        secondaryAction={{ href: '/steel-buildings', label: 'Steel buildings' }}
      />

      <StoryBlock
        eyebrow="Why we do this"
        title="Remote property work requires the right tools"
        body="Building and maintaining property 16 miles off pavement presents unique challenges. We've invested in quality equipment that handles Big Bend conditions, and we make it available to neighbors and contractors who need it. Whether you're digging a water line or capturing the Milky Way, we can help."
      />

      <ContentSection
        kicker="Available equipment"
        title="Current rental inventory"
        body="Equipment is rented with delivery available within 50 miles of Terlingua. Safety orientation included."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {equipment.map((item) => (
            <article
              key={item.name}
              className="relative rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft"
            >
              {item.status === 'coming-soon' && (
                <div className="absolute top-4 right-4">
                  <ComingSoonBadge variant="inline" />
                </div>
              )}
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">
                {item.category}
              </p>
              <h3 className="mt-2 font-display text-xl text-text-strong">{item.name}</h3>
              <p className="mt-3 text-sm leading-7 text-text-muted">{item.description}</p>
              <ul className="mt-4 space-y-1">
                {item.specs.map((spec) => (
                  <li key={spec} className="text-sm text-text-muted">
                    • {spec}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-text-strong/10 pt-4">
                <div>
                  <p className="text-xs text-text-muted">Daily</p>
                  <p className="font-display text-xl text-text-strong">${item.dailyRate}</p>
                </div>
                {item.weeklyRate && (
                  <div>
                    <p className="text-xs text-text-muted">Weekly</p>
                    <p className="font-display text-xl text-text-strong">${item.weeklyRate}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-text-muted">Deposit</p>
                  <p className="font-display text-xl text-text-strong">${item.deposit}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        kicker="Rental process"
        title="How it works"
        body="Simple, straightforward rental with no surprises."
      >
        <div className="grid gap-5 md:grid-cols-4">
          <Card
            title="1. Contact us"
            description="Tell us what you need, when you need it, and where you're working. We'll confirm availability."
          />
          <Card
            title="2. Reserve"
            description="Provide deposit and sign the rental agreement. Insurance or proof of coverage required for heavy equipment."
          />
          <Card
            title="3. Delivery"
            description="We deliver to your site and provide a safety orientation. Pickup also available at our property."
          />
          <Card
            title="4. Return"
            description="We pick up the equipment at the end of your rental period. Deposit returned upon inspection."
          />
        </div>
      </ContentSection>

      <ContentSection
        kicker="Requirements"
        title="What you need to rent"
        body="Requirements vary by equipment type."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Heavy Equipment</p>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>• Valid driver&apos;s license</li>
              <li>• Prior heavy equipment experience recommended</li>
              <li>• Proof of liability insurance or rental insurance purchase</li>
              <li>• Security deposit (refundable)</li>
              <li>• Completed safety orientation</li>
            </ul>
          </article>
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Photography Equipment</p>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>• Valid ID</li>
              <li>• Credit card for deposit hold</li>
              <li>• Basic camera knowledge</li>
              <li>• Workshop participants get priority</li>
            </ul>
          </article>
        </div>
      </ContentSection>

      <section className="rounded-panel border border-text-strong/10 bg-gradient-to-r from-[#faf7ef] to-[#f5efe3] p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Need a building too?</p>
            <h2 className="mt-2 font-display text-3xl text-text-strong">Steel Buildings for Big Bend</h2>
            <p className="mt-2 max-w-xl text-sm text-text-muted">
              Chuck helps ranchers and businesses with commercial steel buildings. From equipment storage to workshops,
              we can help you plan and source the right structure.
            </p>
          </div>
          <Link href="/steel-buildings" className="rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse no-underline transition-transform hover:scale-105">
            Learn about steel buildings
          </Link>
        </div>
      </section>
    </>
  );
}
