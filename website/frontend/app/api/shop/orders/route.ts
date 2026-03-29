import { NextResponse } from 'next/server';
import { z } from 'zod';

import { captureShopOrder } from '@/lib/shop/store';

const shopOrderRequestSchema = z.object({
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  pickupWindow: z.string().optional(),
  notes: z.string().optional(),
  shippingAddress: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(2),
    zip: z.string().min(5),
  }).optional(),
  items: z.array(z.object({
    productSlug: z.string().min(1),
    quantity: z.number().int().positive(),
  })).min(1),
});

export async function POST(request: Request) {
  try {
    const payload = shopOrderRequestSchema.parse(await request.json());
    const order = await captureShopOrder(payload);
    return NextResponse.json({ orderId: order.id, status: order.status });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to capture shop order.' }, { status: 400 });
  }
}
