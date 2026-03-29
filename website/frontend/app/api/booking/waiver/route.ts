import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createWaiverAcknowledgement } from '@/lib/booking/store';

const waiverSchema = z.object({
  guestEmail: z.string().email(),
  guestName: z.string().min(1),
  unitId: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  policyVersion: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const payload = waiverSchema.parse(await request.json());
    const waiver = await createWaiverAcknowledgement(payload);
    return NextResponse.json({ waiverId: waiver.id, acknowledgedAt: waiver.acknowledgedAt });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to store waiver acknowledgement.' }, { status: 400 });
  }
}
