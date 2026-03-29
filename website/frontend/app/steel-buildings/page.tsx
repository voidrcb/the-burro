import Link from 'next/link';

import { Card } from '@/components/Card';
import { ContentSection } from '@/components/ContentSection';
import { Hero } from '@/components/Hero';
import { StoryBlock } from '@/components/StoryBlock';

const applications = [
  {
    title: 'Ranch Workshops',
    description: 'Durable workspace for equipment maintenance, welding, and ranch operations. Built to handle Big Bend heat and wind.',
  },
  {
    title: 'Equipment Storage',
    description: 'Protect your machinery, vehicles, and tools from the elements. Clear-span designs maximize usable space.',
  },
  {
    title: 'Agricultural Buildings',
    description: 'Hay barns, livestock shelters, and processing facilities designed for remote property requirements.',
  },
  {
    title: 'Commercial Facilities',
    description: 'Retail spaces, offices, and mixed-use buildings for Terlingua and Big Bend area businesses.',
  },
  {
    title: 'Residential Garages',
    description: 'Oversized garages and hobby shops that complement your homestead and provide secure storage.',
  },
  {
    title: 'Event Spaces',
    description: 'Covered venues for gatherings, markets, and community events with flexible layouts.',
  },
];

const benefits = [
  {
    title: 'Desert Durability',
    description: 'Engineered to withstand extreme heat, UV exposure, and the occasional Big Bend dust storm.',
  },
  {
    title: 'Wind Resistance',
    description: 'Rated for high wind loads common in open West Texas terrain. Peace of mind when weather moves in.',
  },
  {
    title: 'Low Maintenance',
    description: 'No rotting, warping, or termites. Steel structures require minimal upkeep compared to wood construction.',
  },
  {
    title: 'Fast Construction',
    description: 'Pre-engineered components mean faster erection times and reduced labor costs on remote sites.',
  },
];

export default function SteelBuildingsPage() {
  return (
    <>
      <Hero
        eyebrow="Commercial Steel Buildings"
        title="Durable structures for Big Bend country"
        body="Ranchers, property owners, and businesses trust Chuck to find the right steel building for their needs. From equipment barns to commercial facilities, we help you plan, quote, and coordinate construction in the Terlingua and Big Bend region."
        primaryAction={{ href: '/contact', label: 'Talk to Chuck' }}
        secondaryAction={{ href: '#applications', label: 'See applications' }}
      />

      <ContentSection
        kicker="Why steel"
        title="Built for the desert"
        body="Steel buildings offer the durability and low maintenance that remote West Texas properties demand. When you're 16 miles off pavement, your building needs to handle whatever the desert throws at it."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {benefits.map((benefit) => (
            <Card key={benefit.title} title={benefit.title} description={benefit.description} />
          ))}
        </div>
      </ContentSection>

      <StoryBlock
        eyebrow="Local expertise"
        title="Chuck knows this country"
        body="After years of building and maintaining property in the Big Bend region, Chuck understands the practical challenges of remote construction. He works with reputable manufacturers to find buildings that match your site conditions, budget, and timeline. No pressure sales, just honest guidance from someone who builds out here too."
      />

      <ContentSection
        id="applications"
        kicker="Applications"
        title="Steel buildings for every need"
        body="From small equipment shelters to large commercial facilities, steel construction adapts to your requirements. Here are some of the most common applications we help with."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <Card key={app.title} title={app.title} description={app.description} />
          ))}
        </div>
      </ContentSection>

      <ContentSection
        kicker="The process"
        title="From concept to completion"
        body="Getting a steel building on your property doesn't have to be complicated. Here's how it typically works."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card title="1. Consultation" description="Tell us about your property, needs, and budget. We'll discuss options and answer your questions." />
          <Card title="2. Site Assessment" description="We review your location, access, foundation requirements, and any permitting considerations." />
          <Card title="3. Quote & Design" description="Work with manufacturers to get competitive pricing on buildings that fit your specifications." />
          <Card title="4. Delivery & Build" description="Coordinate delivery logistics and connect you with qualified erectors for installation." />
        </div>
      </ContentSection>

      <ContentSection
        kicker="Ready to start"
        title="Let's talk about your project"
        body="Whether you're in the planning stages or ready to move forward, Chuck is happy to discuss your steel building needs. No obligation, just practical advice from someone who understands Big Bend construction."
      >
        <div className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Contact Chuck</p>
              <p className="mt-3 text-sm leading-7 text-text-muted">
                Reach out via the contact form or give us a call. We typically respond within 24 hours during business days.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/contact" className="rounded-pill bg-text-strong px-5 py-3 text-sm font-semibold text-text-inverse no-underline">
                  Contact form
                </Link>
                <Link href="mailto:hello@bigbendburro.com" className="rounded-pill border border-text-strong/10 px-5 py-3 text-sm font-semibold text-text-strong no-underline">
                  Email directly
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">Service Area</p>
              <p className="mt-3 text-sm leading-7 text-text-muted">
                We primarily serve Brewster County and the greater Big Bend region, including Terlingua, Study Butte, Alpine, Marathon, and surrounding ranch properties.
              </p>
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
