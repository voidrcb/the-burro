import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createInspectionEvidence,
  getRentalBooking,
  transitionBookingState,
} from '@/lib/rental/store';
import { canAcceptCheckoutInspection, canAcceptCheckinInspection } from '@/lib/rental/state-machine';
import { inspectionPhotoSchema } from '@/lib/rental/types';

const inspectionInputSchema = z.object({
  bookingId: z.string().min(1),
  type: z.enum(['checkout', 'checkin']),
  photos: z.array(inspectionPhotoSchema).min(5), // A-2.2.4: 4 exterior + 1 console minimum
  videoUrl: z.string().url().optional(),
  operatorNotes: z.string().optional(),
  damageNoted: z.boolean(),
  damageDescription: z.string().optional(),
  customerAcknowledged: z.boolean(),
  customerSignature: z.string().optional(),
  capturedBy: z.string().min(1),
  deviceInfo: z.string().optional(),
  offlineQueued: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = inspectionInputSchema.parse(body);

    // Get booking
    const booking = await getRentalBooking(input.bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Rental booking not found.' }, { status: 404 });
    }

    // Validate inspection can be submitted based on current state
    if (input.type === 'checkout') {
      if (!canAcceptCheckoutInspection(booking)) {
        return NextResponse.json(
          {
            error: `Cannot submit checkout inspection. Booking must be in 'delivered' state without existing checkout inspection. Current state: ${booking.state}`,
          },
          { status: 400 }
        );
      }
    } else {
      if (!canAcceptCheckinInspection(booking)) {
        return NextResponse.json(
          {
            error: `Cannot submit checkin inspection. Booking must be in 'returned' state without existing checkin inspection. Current state: ${booking.state}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate photo angles per A-2.2.4
    const requiredAngles = ['front', 'back', 'left', 'right', 'console'];
    const providedAngles = input.photos.map((p) => p.angle);
    const missingAngles = requiredAngles.filter((angle) => !providedAngles.includes(angle as typeof input.photos[0]['angle']));

    if (missingAngles.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required photo angles: ${missingAngles.join(', ')}. Required: 4 exterior angles (front, back, left, right) + 1 console photo.`,
        },
        { status: 400 }
      );
    }

    // Validate damage description if damage is noted
    if (input.damageNoted && !input.damageDescription) {
      return NextResponse.json(
        { error: 'Damage description is required when damage is noted.' },
        { status: 400 }
      );
    }

    // Create inspection evidence
    const evidence = await createInspectionEvidence({
      bookingId: input.bookingId,
      type: input.type,
      photos: input.photos,
      videoUrl: input.videoUrl,
      operatorNotes: input.operatorNotes,
      damageNoted: input.damageNoted,
      damageDescription: input.damageDescription,
      customerAcknowledged: input.customerAcknowledged,
      customerSignature: input.customerSignature,
      capturedBy: input.capturedBy,
      deviceInfo: input.deviceInfo,
      offlineQueued: input.offlineQueued ?? false,
    });

    // Auto-transition state based on inspection type
    let updatedBooking = booking;
    if (input.type === 'checkout') {
      // After checkout inspection, transition to 'active'
      updatedBooking = await transitionBookingState(
        booking.id,
        'active',
        input.capturedBy,
        'Equipment checked out with inspection evidence'
      );
    } else {
      // After checkin inspection, transition to 'inspected'
      updatedBooking = await transitionBookingState(
        booking.id,
        'inspected',
        input.capturedBy,
        `Equipment checked in. Damage noted: ${input.damageNoted ? 'Yes' : 'No'}`
      );
    }

    return NextResponse.json({
      success: true,
      inspectionId: evidence.id,
      evidence,
      booking: updatedBooking,
      message: `${input.type === 'checkout' ? 'Checkout' : 'Checkin'} inspection submitted successfully.`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid inspection data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to submit inspection.' },
      { status: 500 }
    );
  }
}
