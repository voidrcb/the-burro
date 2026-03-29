import { appendJsonLine, getDataPath } from '@/lib/server/repo';

export type AnalyticsEvent = {
  event: 'page_view' | 'newsletter_subscribed' | 'newsletter_duplicate';
  path: string;
  occurredAt: string;
  metadata?: Record<string, string>;
};

export async function logAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  await appendJsonLine(getDataPath('analytics', 'page-events.jsonl'), event);
}
