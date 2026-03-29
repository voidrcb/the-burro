import { NextResponse } from 'next/server';

import { createWorkshopWaiverAcknowledgement } from '@/lib/workshop/store';

export async function POST(request: Request) {
  try {
    const waiver = await createWorkshopWaiverAcknowledgement(await request.json());
    return NextResponse.json({ waiverId: waiver.id, acknowledgedAt: waiver.acknowledgedAt });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to store workshop waiver.' }, { status: 400 });
  }
}
