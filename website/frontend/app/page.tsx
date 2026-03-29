import Link from 'next/link';

import { Card } from '@/components/Card';
import { ContentSection } from '@/components/ContentSection';
import { Hero } from '@/components/Hero';
import { SignupForm } from '@/components/newsletter/SignupForm';
import { HeroMedia } from '@/components/shared/HeroMedia';
import { StoryBlock } from '@/components/StoryBlock';
import { listBlogPosts } from '@/lib/content/blog';

export default async function HomePage() {
  const posts = await listBlogPosts();
  const featured = posts.filter((post) => post.featured).slice(0, 2);

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Hero
          eyebrow="Dark Sky Country"
          title="Where the Milky Way meets the desert and every stay supports this wild place"
          body="Big Bend Burro offers dark-sky lodging, hands-on workshops, and guided experiences in one of America's most remote and beautiful landscapes. We're building something real here."
          primaryAction={{ href: '/stay', label: 'View lodging' }}
          secondaryAction={{ href: '/about', label: 'Our story' }}
        />
        <HeroMedia
          label="Susan's photo palette"
          caption="The visual language of Burro comes from Susan's own Big Bend photographs: night air, desert gold, stone, and the quiet that makes the place worth protecting."
          imageSrc="/images/palette/kayak-canyon.jpg"
          imageAlt="Kayaking through Santa Elena Canyon on the Rio Grande"
          href="/shop?category=prints"
          linkLabel="Shop Susan's prints"
        />
      </section>

      <ContentSection
        kicker="What we offer"
        title="Desert stays, creative workshops, and authentic experiences"
        body="Everything here is intentional. From solar-powered cabins under the darkest skies in Texas to hands-on tile-making with Susan, we focus on quality over quantity."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Card
            title="Dark Sky Lodging"
            description="Solar cabins and desert retreats designed for stargazing, photography, and genuine rest. No light pollution, no distractions."
          >
            <Link href="/stay" className="text-sm font-semibold text-accent-primary transition-colors hover:text-accent-secondary">
              Explore stays
            </Link>
          </Card>
          <Card
            title="Creative Workshops"
            description="Learn desert tile-making with Susan or dark sky photography with Chuck. Small groups, expert guidance, unforgettable settings."
          >
            <Link href="/workshops" className="text-sm font-semibold text-accent-primary transition-colors hover:text-accent-secondary">
              Browse workshops
            </Link>
          </Card>
          <Card
            title="Guided Experiences"
            description="River trips, night sky tours, and cultural excursions to Boquillas. Let local experts show you the real Big Bend."
          >
            <Link href="/experiences" className="text-sm font-semibold text-accent-primary transition-colors hover:text-accent-secondary">
              See experiences
            </Link>
          </Card>
        </div>
      </ContentSection>

      <StoryBlock
        eyebrow="Why Big Bend"
        title="The largest dark sky reserve in the world is right here"
        body="Our property sits within the Greater Big Bend International Dark Sky Reserve - over 15,000 square miles of protected night sky. When the Milky Way rises over the Chisos Mountains, you understand why we're doing this. The desert punishes shortcuts, so we're building deliberately: water systems before glamping, conservation before commerce."
      />

      <ContentSection
        kicker="More than lodging"
        title="Services for Big Bend property owners"
        body="Chuck helps local ranchers and businesses with steel buildings and equipment. If you're building or maintaining property out here, we understand the challenges."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Card
            title="Steel Buildings"
            description="Commercial steel structures for ranches, equipment storage, and business facilities. Built for desert durability."
          >
            <Link href="/steel-buildings" className="text-sm font-semibold text-accent-primary transition-colors hover:text-accent-secondary">
              Talk to Chuck
            </Link>
          </Card>
          <Card
            title="Equipment Rental"
            description="Kubota excavators and construction equipment for remote property work. Delivery available throughout Brewster County."
          >
            <Link href="/rentals" className="text-sm font-semibold text-accent-primary transition-colors hover:text-accent-secondary">
              View rentals
            </Link>
          </Card>
        </div>
      </ContentSection>

      <ContentSection
        kicker="From the field journal"
        title="Updates from the build"
        body="We document everything: construction progress, desert discoveries, and the honest reality of building something remote. Follow along as it happens."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {featured.length > 0 ? (
            featured.map((post) => (
              <Card key={post.slug} title={post.title} description={post.summary}>
                <div className="flex items-center justify-between text-sm text-text-muted">
                  <span>{post.readingMinutes} min read</span>
                  <span>{post.publishedAt}</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-accent-primary transition-colors hover:text-accent-secondary"
                >
                  Read post
                </Link>
              </Card>
            ))
          ) : (
            <Card
              title="Field notes coming soon"
              description="We're documenting the build process and will share updates here. Check back soon for construction progress and desert discoveries."
            >
              <Link href="/blog" className="text-sm font-semibold text-accent-primary">
                Visit journal
              </Link>
            </Card>
          )}
        </div>
      </ContentSection>

      <ContentSection
        kicker="Conservation"
        title="Protecting what makes this place worth visiting"
        body="Big Bend Burro supports local conservation efforts and dark sky preservation. We believe tourism should give back to the landscape, not just extract from it."
      >
        <div className="rounded-panel border border-accent-sage/30 bg-accent-sage/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-accent-sage">Dark Sky Certification</p>
              <p className="mt-1 text-sm text-text-muted">
                We follow International Dark-Sky Association guidelines for all lighting and structures.
              </p>
            </div>
            <Link
              href="/activism"
              className="rounded-pill border border-accent-sage/40 px-4 py-2 text-sm font-semibold text-accent-sage no-underline transition-colors hover:bg-accent-sage/10"
            >
              See our advocacy
            </Link>
          </div>
        </div>
      </ContentSection>

      <ContentSection
        kicker="Stay connected"
        title="Quiet updates when something meaningful happens"
        body="Join our mailing list for occasional updates on construction progress, new workshop dates, seasonal availability, and stewardship milestones. No spam, just desert dispatches."
      >
        <div className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
          <SignupForm />
        </div>
      </ContentSection>
    </>
  );
}
