import { Card } from '@/components/Card';
import { ContentSection } from '@/components/ContentSection';
import { FAQ } from '@/components/FAQ';
import { NewsletterCapture } from '@/components/NewsletterCapture';
import { routeSpecs, type RouteKey } from '@/lib/route-specs';

export function RouteStub({ route }: { route: RouteKey }) {
  const spec = routeSpecs[route];

  return (
    <ContentSection
      kicker={`Route stub ${route}`}
      title={spec.purpose}
      body="This page is intentionally skeletal. It establishes structure, design-token application, and blueprint alignment without pretending live content exists yet."
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card
          title="What belongs here"
          description="Use this route for blueprint-aligned structure only. No placeholder copy should be mistaken for launch-ready marketing or operational promises."
        >
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-text-muted">
            <li>Purpose: {spec.purpose}</li>
            <li>See blueprint JSON entry: systems.website.routes[{spec.blueprintIndex}]</li>
            <li>Operator mode remains R0_OBSERVE during Sprint 0.2.</li>
          </ul>
        </Card>
        <NewsletterCapture />
      </div>
      <FAQ />
    </ContentSection>
  );
}

