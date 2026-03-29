import { ContentSection } from '@/components/ContentSection';
import { SignupForm } from '@/components/newsletter/SignupForm';

export default function ContactPage() {
  return (
    <ContentSection
      kicker="Contact"
      title="Reach out without needing a full booking system yet"
      body="We keep contact intentionally simple. Use the newsletter for quiet updates or email directly for thoughtful questions about the project, workshops, and future stays."
    >
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
          <h3 className="font-display text-2xl text-text-strong">Best current path</h3>
          <p className="mt-3 text-sm leading-7 text-text-muted">For now, the best contact path is email while the operational systems remain intentionally small.</p>
          <div className="mt-5 space-y-3 text-sm text-text-muted">
            <p><span className="font-semibold text-text-strong">Email:</span> hello@bigbendburro.com</p>
            <p><span className="font-semibold text-text-strong">Focus:</span> stewardship updates, workshop interest, future stay interest, local partnership conversations</p>
            <p><span className="font-semibold text-text-strong">Expectation:</span> thoughtful replies rather than instant automation</p>
          </div>
        </article>
        <article className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
          <SignupForm />
        </article>
      </div>
    </ContentSection>
  );
}
