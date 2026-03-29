/**
 * Rental Booking State Machine per A-2.2.5
 *
 * States: quoted -> reserved -> delivered -> active -> returned -> inspected -> closed
 *
 * Maintenance is a parallel flag (A-2.2.6), not a sequential state.
 * Maintenance flag can be set from: returned, inspected
 */

import type { RentalBooking, RentalBookingState, StateTransition } from './types';

// Define valid state transitions
const VALID_TRANSITIONS: Record<RentalBookingState, RentalBookingState[]> = {
  quoted: ['reserved'],
  reserved: ['delivered', 'quoted'], // Can revert to quoted if cancelled
  delivered: ['active'],
  active: ['returned'],
  returned: ['inspected'],
  inspected: ['closed'],
  closed: [], // Terminal state
};

// States from which maintenance flag can be toggled (A-2.2.6)
const MAINTENANCE_ELIGIBLE_STATES: RentalBookingState[] = ['returned', 'inspected'];

export interface TransitionResult {
  success: boolean;
  error?: string;
  booking?: RentalBooking;
}

/**
 * Validate if a state transition is allowed
 */
export function canTransition(fromState: RentalBookingState, toState: RentalBookingState): boolean {
  return VALID_TRANSITIONS[fromState].includes(toState);
}

/**
 * Get all valid next states from current state
 */
export function getValidNextStates(currentState: RentalBookingState): RentalBookingState[] {
  return VALID_TRANSITIONS[currentState];
}

/**
 * Check if maintenance flag can be toggled in current state
 */
export function canToggleMaintenance(state: RentalBookingState): boolean {
  return MAINTENANCE_ELIGIBLE_STATES.includes(state);
}

/**
 * Create a state transition record with timestamp
 */
export function createTransition(
  fromState: RentalBookingState | null,
  toState: RentalBookingState,
  transitionedBy: string,
  notes?: string
): StateTransition {
  return {
    fromState,
    toState,
    transitionedAt: new Date().toISOString(),
    transitionedBy,
    notes,
  };
}

/**
 * Apply a state transition to a booking
 */
export function applyTransition(
  booking: RentalBooking,
  toState: RentalBookingState,
  transitionedBy: string,
  notes?: string
): TransitionResult {
  // Validate transition
  if (!canTransition(booking.state, toState)) {
    return {
      success: false,
      error: `Invalid transition from '${booking.state}' to '${toState}'. Valid next states: ${getValidNextStates(booking.state).join(', ') || 'none (terminal state)'}`,
    };
  }

  const now = new Date().toISOString();
  const transition = createTransition(booking.state, toState, transitionedBy, notes);

  // Build timestamp updates based on target state
  const timestampUpdates: Partial<RentalBooking> = {
    updatedAt: now,
  };

  switch (toState) {
    case 'reserved':
      timestampUpdates.reservedAt = now;
      break;
    case 'delivered':
      timestampUpdates.deliveredAt = now;
      break;
    case 'active':
      timestampUpdates.activatedAt = now;
      break;
    case 'returned':
      timestampUpdates.returnedAt = now;
      break;
    case 'inspected':
      timestampUpdates.inspectedAt = now;
      break;
    case 'closed':
      timestampUpdates.closedAt = now;
      break;
  }

  const updatedBooking: RentalBooking = {
    ...booking,
    ...timestampUpdates,
    state: toState,
    stateHistory: [...booking.stateHistory, transition],
  };

  return {
    success: true,
    booking: updatedBooking,
  };
}

/**
 * Toggle maintenance flag on a booking (A-2.2.6)
 */
export function toggleMaintenance(
  booking: RentalBooking,
  enable: boolean,
  operatorId: string,
  reason?: string
): TransitionResult {
  if (!canToggleMaintenance(booking.state)) {
    return {
      success: false,
      error: `Maintenance flag cannot be toggled in state '${booking.state}'. Valid states: ${MAINTENANCE_ELIGIBLE_STATES.join(', ')}`,
    };
  }

  const now = new Date().toISOString();
  const note = enable
    ? `Maintenance flag enabled: ${reason || 'No reason provided'}`
    : `Maintenance flag cleared by ${operatorId}`;

  // Maintenance toggle is recorded in state history as a parallel event
  const transition: StateTransition = {
    fromState: booking.state,
    toState: booking.state, // Same state - parallel flag change
    transitionedAt: now,
    transitionedBy: operatorId,
    notes: note,
  };

  const updatedBooking: RentalBooking = {
    ...booking,
    maintenanceFlag: enable,
    updatedAt: now,
    stateHistory: [...booking.stateHistory, transition],
  };

  return {
    success: true,
    booking: updatedBooking,
  };
}

/**
 * Validate booking is in expected state before an operation
 */
export function assertState(booking: RentalBooking, expectedStates: RentalBookingState[]): void {
  if (!expectedStates.includes(booking.state)) {
    throw new Error(
      `Operation requires booking to be in state(s): ${expectedStates.join(', ')}. Current state: ${booking.state}`
    );
  }
}

/**
 * Check if booking can accept checkout inspection
 */
export function canAcceptCheckoutInspection(booking: RentalBooking): boolean {
  return booking.state === 'delivered' && !booking.checkoutInspectionId;
}

/**
 * Check if booking can accept checkin inspection
 */
export function canAcceptCheckinInspection(booking: RentalBooking): boolean {
  return booking.state === 'returned' && !booking.checkinInspectionId;
}

/**
 * Get state machine summary for UI display
 */
export function getStateMachineSummary(): {
  states: RentalBookingState[];
  transitions: Record<RentalBookingState, RentalBookingState[]>;
  maintenanceEligible: RentalBookingState[];
} {
  return {
    states: ['quoted', 'reserved', 'delivered', 'active', 'returned', 'inspected', 'closed'],
    transitions: VALID_TRANSITIONS,
    maintenanceEligible: MAINTENANCE_ELIGIBLE_STATES,
  };
}
