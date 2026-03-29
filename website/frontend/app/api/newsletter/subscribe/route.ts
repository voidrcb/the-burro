import { NextResponse } from 'next/server';
import { z } from 'zod';

import { logAnalyticsEvent } from '@/lib/analytics/events';
import { newsletterSubscriberSchema } from '@/lib/content/types';
import { getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';

const subscribeSchema = z.object({
  email: z.string().email(),
});

type NewsletterStore = {
  subscribers: Array<z.infer<typeof newsletterSubscriberSchema>>;
};

export async function POST(request: Request) {
  const body = subscribeSchema.parse(await request.json());
  const targetPath = getDataPath('analytics', 'newsletter-subscribers.json');
  const store = await readJsonFile<NewsletterStore>(targetPath, { subscribers: [] });
  const normalized = body.email.trim().toLowerCase();
  const existing = store.subscribers.find((entry) => entry.email === normalized);

  if (existing) {
    await logAnalyticsEvent({
      event: 'newsletter_duplicate',
      path: '/api/newsletter/subscribe',
      occurredAt: new Date().toISOString(),
      metadata: { email: normalized },
    });

    return NextResponse.json({
      status: 'duplicate',
      message: 'You are already on the list. We will only send updates when there is something real to share.',
    });
  }

  const subscriber = newsletterSubscriberSchema.parse({
    email: normalized,
    source: 'public_site',
    subscribedAt: new Date().toISOString(),
    status: 'pending_postmark',
  });

  store.subscribers.push(subscriber);
  await writeJsonFile(targetPath, store);
  await logAnalyticsEvent({
    event: 'newsletter_subscribed',
    path: '/api/newsletter/subscribe',
    occurredAt: subscriber.subscribedAt,
    metadata: { email: normalized },
  });

  return NextResponse.json({
    status: 'subscribed',
    message: 'Saved locally. Delivery remains in scaffold mode until Postmark credentials are activated.',
  });
}
