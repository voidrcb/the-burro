/**
 * Payment State Machine for Big Bend Burro Commerce
 *
 * This file defines the payment lifecycle for all commerce flows:
 * - Shop orders
 * - Workshop registrations
 * - Lodging deposits
 *
 * Current Mode: SCAFFOLD (manual payment handoff)
 * Activation: See Sprints/Reviews/ENH-002_PAYMENT_ACTIVATION.md
 */

export type PaymentState =
  | 'draft'           // Order created, not submitted
  | 'pending'         // Submitted, awaiting payment
  | 'deposit_received' // Partial payment (deposits)
  | 'paid'            // Full payment received
  | 'refunded'        // Full refund processed
  | 'partial_refund'  // Partial refund processed
  | 'cancelled'       // Order cancelled before payment
  | 'failed';         // Payment attempted but failed

export type PaymentMethod =
  | 'stripe'          // Credit card via Stripe
  | 'paypal'          // PayPal (future)
  | 'venmo'           // Venmo manual transfer
  | 'zelle'           // Zelle manual transfer
  | 'cash'            // Cash at pickup
  | 'manual';         // Other manual arrangement

export interface PaymentRecord {
  orderId: string;
  state: PaymentState;
  method: PaymentMethod | null;
  amountDue: number;
  amountPaid: number;
  currency: 'USD';
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
  notes?: string;
}

/**
 * State Transition Rules
 *
 * draft -> pending (on submit)
 * pending -> paid (on payment confirmation)
 * pending -> deposit_received (on partial payment)
 * pending -> cancelled (on cancellation)
 * pending -> failed (on payment failure)
 * deposit_received -> paid (on remaining payment)
 * deposit_received -> partial_refund (on deposit refund)
 * paid -> refunded (on full refund)
 * paid -> partial_refund (on partial refund)
 */

export const VALID_TRANSITIONS: Record<PaymentState, PaymentState[]> = {
  draft: ['pending', 'cancelled'],
  pending: ['paid', 'deposit_received', 'cancelled', 'failed'],
  deposit_received: ['paid', 'partial_refund', 'refunded', 'cancelled'],
  paid: ['refunded', 'partial_refund'],
  refunded: [], // Terminal state
  partial_refund: ['refunded'],
  cancelled: [], // Terminal state
  failed: ['pending'], // Can retry
};

export function canTransition(from: PaymentState, to: PaymentState): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

export function getPaymentStateLabel(state: PaymentState): string {
  switch (state) {
    case 'draft':
      return 'Draft';
    case 'pending':
      return 'Awaiting Payment';
    case 'deposit_received':
      return 'Deposit Received';
    case 'paid':
      return 'Paid';
    case 'refunded':
      return 'Refunded';
    case 'partial_refund':
      return 'Partially Refunded';
    case 'cancelled':
      return 'Cancelled';
    case 'failed':
      return 'Payment Failed';
  }
}

/**
 * Deposit Configuration
 *
 * Used for workshops and lodging where deposits are required
 */
export interface DepositConfig {
  enabled: boolean;
  percentage?: number;      // e.g., 0.25 for 25%
  flatAmount?: number;      // OR flat amount
  dueByDate?: string;       // When deposit is due
  balanceDueBy?: string;    // When balance is due
  refundPolicy?: string;    // Human-readable policy
}

export const DEFAULT_WORKSHOP_DEPOSIT: DepositConfig = {
  enabled: true,
  flatAmount: 80,
  refundPolicy: 'Deposit refundable up to 7 days before workshop.',
};

export const DEFAULT_LODGING_DEPOSIT: DepositConfig = {
  enabled: true,
  percentage: 0.25,
  refundPolicy: 'Full refund with 14 days notice; weather exceptions handled manually.',
};
