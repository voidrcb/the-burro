import { NextResponse } from 'next/server';
import { z } from 'zod';

import { approveBurroFollowUp } from '@/lib/burro/followups';

const approvalSchema = z.object({
  draftId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const payload = approvalSchema.parse(await request.json());
    const draft = await approveBurroFollowUp(payload.draftId);
    return NextResponse.json({ draft });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to approve follow-up draft.' }, { status: 400 });
  }
}
