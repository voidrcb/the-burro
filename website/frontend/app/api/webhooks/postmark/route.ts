import { NextResponse, type NextRequest } from 'next/server';

import { handleWebhook } from '../../../../../../assistant/services/webhooks';

export async function POST(request: NextRequest) {
  const result = await handleWebhook('postmark', request);
  return NextResponse.json({ ok: true, provider: 'postmark', logPath: result.logPath });
}

