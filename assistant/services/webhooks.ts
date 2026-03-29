import { logWebhookEvent } from './logging';

export type WebhookProvider = 'lodgify' | 'stripe' | 'postmark';

type WebhookLikeRequest = {
  json(): Promise<unknown>;
  headers: {
    get(name: string): string | null;
  };
};

export async function handleWebhook(provider: WebhookProvider, request: WebhookLikeRequest): Promise<{ logPath: string }> {
  const payload = await request.json();
  const fixtureName = request.headers.get('x-burro-fixture') ?? 'direct-request';
  const logPath = await logWebhookEvent(provider, payload, {
    fixture: fixtureName,
    userAgent: request.headers.get('user-agent'),
  });

  return { logPath };
}
