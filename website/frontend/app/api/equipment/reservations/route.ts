import { NextResponse } from 'next/server';
import { z } from 'zod';

import { cancelEquipmentReservation, createEquipmentReservation } from '@/lib/equipment/store';

const createReservationSchema = z.object({
  assetId: z.string().min(1),
  reservedBy: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  purpose: z.string().min(1),
  notes: z.string().optional(),
});

const cancelReservationSchema = z.object({
  reservationId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const payload = createReservationSchema.parse(await request.json());
    const reservation = await createEquipmentReservation({
      ...payload,
      status: 'confirmed',
    });

    return NextResponse.json({ reservationId: reservation.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create equipment reservation.' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = cancelReservationSchema.parse(await request.json());
    const reservation = await cancelEquipmentReservation(payload.reservationId);
    if (!reservation) {
      return NextResponse.json({ error: 'Equipment reservation not found.' }, { status: 404 });
    }

    return NextResponse.json({ reservationId: reservation.id, status: reservation.status });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to cancel equipment reservation.' }, { status: 400 });
  }
}
