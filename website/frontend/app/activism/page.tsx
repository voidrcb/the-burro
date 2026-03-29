import { ActionCenter } from '@/components/activism/ActionCenter';
import { StatusFeed } from '@/components/activism/StatusFeed';
import { ContentSection } from '@/components/ContentSection';
import { listActivismActionItems, loadActivismUpdates } from '@/lib/content/activism';

export default async function ActivismPage() {
  const [updates, actions] = await Promise.all([
    loadActivismUpdates(),
    listActivismActionItems(),
  ]);

  return (
    <>
      <ContentSection
        kicker="Activism hub"
        title="A public record of why stewardship belongs inside the business"
        body="Burro treats conservation and borderland stewardship as operating reality, not side-copy. This section stays source-backed, specific, and useful instead of trying to become a generic outrage feed."
      >
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-panel border border-text-strong/10 bg-white/85 p-6 shadow-soft">
            <h3 className="font-display text-2xl text-text-strong">How this page is used</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">Visitors can understand the stakes, operators can publish updates without rewriting the page, and future preservation calls to action can evolve without changing the route structure.</p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-text-muted">
              <li>- Source-backed updates only</li>
              <li>- Practical calls to action when appropriate</li>
              <li>- No fake neutrality about the value of the landscape</li>
            </ul>
          </article>
          <StatusFeed updates={updates} />
        </div>
      </ContentSection>

      <ActionCenter actions={actions} />
    </>
  );
}
