import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  getRentalBooking,
  transitionBookingState,
  setMaintenanceFlag,
} from '@/lib/rental/store';
import { getValidNextStates, canToggleMaintenance } from '@/lib/rental/state-machine';
import { rentalBookingStateSchema } from '@/lib/rental/types';

const stateTransitionInputSchema = z.object({
  toState: rentalBookingStateSchema,
  operatorId: z.string().min(1),
  notes: z.string().optional(),
});

const maintenanceFlagInputSchema = z.object({
  action: z.literal('maintenance'),
  enable: z.boolean(),
  operatorId: z.string().min(1),
  reason: z.string().optional(),
});

const updateInputSchema = z.union([stateTransitionInputSchema, maintenanceFlagInputSchema]);

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;
    const body = await request.json();

    // Get booking
    const booking = await getRentalBooking(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Rental booking not found.' }, { status: 404 });
    }

    // Parse input to determine action type
    const input = updateInputSchema.parse(body);

    // Handle maintenance flag toggle
    if ('action' in input && input.action === 'maintenance') {
      if (!canToggleMaintenance(booking.state)) {
        return NextResponse.json(
          {
            error: `Cannot toggle maintenance flag in state '${booking.state}'. Valid states: returned, inspected`,
          },
          { status: 400 }
        );
      }

      const updatedBooking = await setMaintenanceFlag(
        bookingId,
        input.enable,
        input.operatorId,
        input.reason
      );

      return NextResponse.json({
        success: true,
        booking: updatedBooking,
        message: `Maintenance flag ${input.enable ? 'enabled' : 'disabled'}.`,
      });
    }

    // Handle state transition
    // TypeScript narrowing: at this point we know input has toState (not maintenance action)
    const transitionInput = input as { toState: typeof booking.state; operatorId: string; notes?: string };

    const validNextStates = getValidNextStates(booking.state);
    if (validNextStates.length === 0) {
      return NextResponse.json(
        { error: `Booking is in terminal state '${booking.state}'. No further transitions allowed.` },
        { status: 400 }
      );
    }

    const updatedBooking = await transitionBookingState(
      bookingId,
      transitionInput.toState,
      transitionInput.operatorId,
      transitionInput.notes
    );

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: `Booking transitioned from '${booking.state}' to '${transitionInput.toState}'.`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update booking state.' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;

    const booking = await getRentalBooking(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Rental booking not found.' }, { status: 404 });
    }

    const validNextStates = getValidNextStates(booking.state);
    const canSetMaintenance = canToggleMaintenance(booking.state);

    return NextResponse.json({
      booking,
      currentState: booking.state,
      validNextStates,
      canSetMaintenance,
      maintenanceFlag: booking.maintenanceFlag,
      stateHistory: booking.stateHistory,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to get booking state.' },
      { status: 500 }
    );
  }
}
