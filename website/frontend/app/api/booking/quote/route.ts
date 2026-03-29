import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getNightCount, getPriceQuote } from '@/lib/content/rates';
import { getPublicUnitBySlug } from '@/lib/content/units';

const quoteSchema = z.object({
  unitSlug: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(request: Request) {
  try {
    const payload = quoteSchema.parse(await request.json());
    const unit = await getPublicUnitBySlug(payload.unitSlug);

    if (!unit || unit.status !== 'available') {
      return NextResponse.json({ error: 'Unit is not available for booking.' }, { status: 404 });
    }

    if (getNightCount(payload.checkIn, payload.checkOut) < 1) {
      return NextResponse.json({ error: 'Checkout must be after check-in.' }, { status: 400 });
    }

    const quote = await getPriceQuote(unit, payload.checkIn, payload.checkOut);
    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to calculate quote.' }, { status: 400 });
  }
}
