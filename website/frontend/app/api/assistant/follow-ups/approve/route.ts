import { NextResponse } from 'next/server';

import { approveFollowUpDraft } from '@/lib/burro/follow-ups';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const followUp = await approveFollowUpDraft(payload);
    return NextResponse.json({ followUp });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to approve follow-up draft.' },
      { status: 400 },
    );
  }
}
