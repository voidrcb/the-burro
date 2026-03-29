/**
 * Partner Marketplace State Machine per A-2.4.4 (DEC-049)
 *
 * 6-state publication workflow with transition rules and reviewer requirements.
 * States: draft -> pending_review -> approved -> published -> suspended -> archived
 */

import type {
  MarketplaceItem,
  MarketplacePublicationState,
  MarketplaceStateTransition,
} from './types';

// Define valid state transitions per A-2.4.4
const VALID_TRANSITIONS: Record<MarketplacePublicationState, MarketplacePublicationState[]> = {
  draft: ['pending_review'],
  pending_review: ['approved', 'draft'], // Can return to draft for revisions
  approved: ['published', 'draft'], // Can go back to draft if changes needed
  published: ['suspended', 'archived'],
  suspended: ['published', 'archived'], // Can be reinstated or archived
  archived: [], // Terminal state
};

// States that require reviewer action
const REVIEWER_REQUIRED_STATES: MarketplacePublicationState[] = ['pending_review'];

// States that allow public visibility
const PUBLICLY_VISIBLE_STATES: MarketplacePublicationState[] = ['published'];

export interface MarketplaceTransitionResult {
  success: boolean;
  error?: string;
  item?: MarketplaceItem;
}

/**
 * Validate if a state transition is allowed
 */
export function canTransition(
  fromState: MarketplacePublicationState,
  toState: MarketplacePublicationState
): boolean {
  return VALID_TRANSITIONS[fromState].includes(toState);
}

/**
 * Get all valid next states from current state
 */
export function getValidNextStates(
  currentState: MarketplacePublicationState
): MarketplacePublicationState[] {
  return VALID_TRANSITIONS[currentState];
}

/**
 * Check if current state requires reviewer action
 */
export function requiresReviewer(state: MarketplacePublicationState): boolean {
  return REVIEWER_REQUIRED_STATES.includes(state);
}

/**
 * Check if item is publicly visible
 */
export function isPubliclyVisible(state: MarketplacePublicationState): boolean {
  return PUBLICLY_VISIBLE_STATES.includes(state);
}

/**
 * Create a state transition record with timestamp
 */
export function createTransition(
  fromState: MarketplacePublicationState | null,
  toState: MarketplacePublicationState,
  transitionedBy: string,
  notes?: string
): MarketplaceStateTransition {
  return {
    fromState,
    toState,
    transitionedAt: new Date().toISOString(),
    transitionedBy,
    notes,
  };
}

/**
 * Apply a state transition to a marketplace item
 */
export function applyTransition(
  item: MarketplaceItem,
  toState: MarketplacePublicationState,
  transitionedBy: string,
  notes?: string
): MarketplaceTransitionResult {
  // Validate transition
  if (!canTransition(item.publicationState, toState)) {
    return {
      success: false,
      error: `Invalid transition from '${item.publicationState}' to '${toState}'. Valid next states: ${getValidNextStates(item.publicationState).join(', ') || 'none (terminal state)'}`,
    };
  }

  const now = new Date().toISOString();
  const transition = createTransition(item.publicationState, toState, transitionedBy, notes);

  // Build updates based on target state
  const updates: Partial<MarketplaceItem> = {
    updatedAt: now,
  };

  // Track reviewer info when moving through review
  if (item.publicationState === 'pending_review' && toState === 'approved') {
    updates.lastReviewedBy = transitionedBy;
    updates.lastReviewedAt = now;
  }

  // Track publication timestamp
  if (toState === 'published') {
    updates.publishedAt = now;
  }

  const updatedItem: MarketplaceItem = {
    ...item,
    ...updates,
    publicationState: toState,
    stateHistory: [...item.stateHistory, transition],
  };

  return {
    success: true,
    item: updatedItem,
  };
}

/**
 * Submit item for review (draft -> pending_review)
 */
export function submitForReview(
  item: MarketplaceItem,
  submittedBy: string,
  notes?: string
): MarketplaceTransitionResult {
  return applyTransition(item, 'pending_review', submittedBy, notes);
}

/**
 * Approve reviewed item (pending_review -> approved)
 */
export function approveItem(
  item: MarketplaceItem,
  reviewerId: string,
  notes?: string
): MarketplaceTransitionResult {
  return applyTransition(item, 'approved', reviewerId, notes);
}

/**
 * Publish approved item (approved -> published)
 */
export function publishItem(
  item: MarketplaceItem,
  publisherId: string,
  notes?: string
): MarketplaceTransitionResult {
  return applyTransition(item, 'published', publisherId, notes);
}

/**
 * Suspend published item (published -> suspended)
 */
export function suspendItem(
  item: MarketplaceItem,
  operatorId: string,
  reason: string
): MarketplaceTransitionResult {
  return applyTransition(item, 'suspended', operatorId, `Suspended: ${reason}`);
}

/**
 * Archive item (published/suspended -> archived)
 */
export function archiveItem(
  item: MarketplaceItem,
  operatorId: string,
  reason?: string
): MarketplaceTransitionResult {
  return applyTransition(item, 'archived', operatorId, reason);
}

/**
 * Return item to draft for revisions (pending_review/approved -> draft)
 */
export function returnToDraft(
  item: MarketplaceItem,
  reviewerId: string,
  reason: string
): MarketplaceTransitionResult {
  return applyTransition(item, 'draft', reviewerId, `Returned for revision: ${reason}`);
}

/**
 * Reinstate suspended item (suspended -> published)
 */
export function reinstateItem(
  item: MarketplaceItem,
  operatorId: string,
  notes?: string
): MarketplaceTransitionResult {
  return applyTransition(item, 'published', operatorId, notes ?? 'Suspension lifted');
}

/**
 * Get state machine summary for UI display
 */
export function getStateMachineSummary(): {
  states: MarketplacePublicationState[];
  transitions: Record<MarketplacePublicationState, MarketplacePublicationState[]>;
  reviewerRequired: MarketplacePublicationState[];
  publiclyVisible: MarketplacePublicationState[];
} {
  return {
    states: ['draft', 'pending_review', 'approved', 'published', 'suspended', 'archived'],
    transitions: VALID_TRANSITIONS,
    reviewerRequired: REVIEWER_REQUIRED_STATES,
    publiclyVisible: PUBLICLY_VISIBLE_STATES,
  };
}
