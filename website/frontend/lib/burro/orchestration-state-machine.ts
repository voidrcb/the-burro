/**
 * Burro Task Orchestration State Machine per A-2.4.3 (DEC-048)
 *
 * 5-state machine with approval gates:
 * created -> pending_approval -> approved -> executing -> completed
 *                             -> failed (from executing)
 */

import type {
  ApprovalGate,
  BurroTaskRun,
  BurroTaskState,
  TaskStateTransition,
} from './orchestration-types';

// Define valid state transitions
const VALID_TRANSITIONS: Record<BurroTaskState, BurroTaskState[]> = {
  created: ['pending_approval'],
  pending_approval: ['approved', 'created'], // Can return to created if gates rejected
  approved: ['executing'],
  executing: ['completed', 'failed'],
  completed: [], // Terminal state
  failed: ['created'], // Can retry by returning to created
};

export interface OrchestrationTransitionResult {
  success: boolean;
  error?: string;
  taskRun?: BurroTaskRun;
}

/**
 * Validate if a state transition is allowed
 */
export function canTransition(
  fromState: BurroTaskState,
  toState: BurroTaskState
): boolean {
  return VALID_TRANSITIONS[fromState].includes(toState);
}

/**
 * Get all valid next states from current state
 */
export function getValidNextStates(currentState: BurroTaskState): BurroTaskState[] {
  return VALID_TRANSITIONS[currentState];
}

/**
 * Check if all approval gates are approved
 */
export function allGatesApproved(gates: ApprovalGate[]): boolean {
  return gates.length > 0 && gates.every((gate) => gate.status === 'approved');
}

/**
 * Check if any approval gate is rejected
 */
export function anyGateRejected(gates: ApprovalGate[]): boolean {
  return gates.some((gate) => gate.status === 'rejected');
}

/**
 * Get pending approval gates
 */
export function getPendingGates(gates: ApprovalGate[]): ApprovalGate[] {
  return gates.filter((gate) => gate.status === 'pending');
}

/**
 * Create a state transition record
 */
export function createTransition(
  fromState: BurroTaskState | null,
  toState: BurroTaskState,
  transitionedBy: string,
  notes?: string
): TaskStateTransition {
  return {
    fromState,
    toState,
    transitionedAt: new Date().toISOString(),
    transitionedBy,
    notes,
  };
}

/**
 * Apply a state transition to a task run
 */
export function applyTransition(
  taskRun: BurroTaskRun,
  toState: BurroTaskState,
  transitionedBy: string,
  notes?: string
): OrchestrationTransitionResult {
  // Validate transition
  if (!canTransition(taskRun.state, toState)) {
    return {
      success: false,
      error: `Invalid transition from '${taskRun.state}' to '${toState}'. Valid next states: ${getValidNextStates(taskRun.state).join(', ') || 'none (terminal state)'}`,
    };
  }

  // Special validation: pending_approval -> approved requires all gates approved
  if (taskRun.state === 'pending_approval' && toState === 'approved') {
    if (!allGatesApproved(taskRun.approvalGates)) {
      const pending = getPendingGates(taskRun.approvalGates);
      return {
        success: false,
        error: `Cannot transition to approved: ${pending.length} approval gate(s) still pending`,
      };
    }
  }

  const now = new Date().toISOString();
  const transition = createTransition(taskRun.state, toState, transitionedBy, notes);

  // Build timestamp updates based on target state
  const updates: Partial<BurroTaskRun> = {
    updatedAt: now,
  };

  if (toState === 'executing') {
    updates.executionStartedAt = now;
  }

  if (toState === 'completed') {
    updates.executionCompletedAt = now;
  }

  const updatedTaskRun: BurroTaskRun = {
    ...taskRun,
    ...updates,
    state: toState,
    stateHistory: [...taskRun.stateHistory, transition],
  };

  return {
    success: true,
    taskRun: updatedTaskRun,
  };
}

/**
 * Submit task for approval (created -> pending_approval)
 */
export function submitForApproval(
  taskRun: BurroTaskRun,
  submittedBy: string,
  notes?: string
): OrchestrationTransitionResult {
  return applyTransition(taskRun, 'pending_approval', submittedBy, notes);
}

/**
 * Approve a specific gate
 */
export function approveGate(
  taskRun: BurroTaskRun,
  gateId: string,
  approverId: string,
  notes?: string
): OrchestrationTransitionResult {
  const gateIndex = taskRun.approvalGates.findIndex((g) => g.gateId === gateId);
  if (gateIndex === -1) {
    return {
      success: false,
      error: `Gate not found: ${gateId}`,
    };
  }

  const gate = taskRun.approvalGates[gateIndex];
  if (gate.status !== 'pending') {
    return {
      success: false,
      error: `Gate '${gate.gateName}' is not pending (current status: ${gate.status})`,
    };
  }

  const now = new Date().toISOString();
  const updatedGate: ApprovalGate = {
    ...gate,
    status: 'approved',
    approvedBy: approverId,
    approvedAt: now,
  };

  const updatedGates = [...taskRun.approvalGates];
  updatedGates[gateIndex] = updatedGate;

  const updatedTaskRun: BurroTaskRun = {
    ...taskRun,
    approvalGates: updatedGates,
    updatedAt: now,
  };

  // If all gates now approved and in pending_approval state, auto-transition to approved
  if (taskRun.state === 'pending_approval' && allGatesApproved(updatedGates)) {
    return applyTransition(
      updatedTaskRun,
      'approved',
      'system',
      `All gates approved. Last gate approved by ${approverId}: ${notes ?? 'no notes'}`
    );
  }

  return {
    success: true,
    taskRun: updatedTaskRun,
  };
}

/**
 * Reject a specific gate
 */
export function rejectGate(
  taskRun: BurroTaskRun,
  gateId: string,
  rejecterId: string,
  reason: string
): OrchestrationTransitionResult {
  const gateIndex = taskRun.approvalGates.findIndex((g) => g.gateId === gateId);
  if (gateIndex === -1) {
    return {
      success: false,
      error: `Gate not found: ${gateId}`,
    };
  }

  const gate = taskRun.approvalGates[gateIndex];
  if (gate.status !== 'pending') {
    return {
      success: false,
      error: `Gate '${gate.gateName}' is not pending (current status: ${gate.status})`,
    };
  }

  const now = new Date().toISOString();
  const updatedGate: ApprovalGate = {
    ...gate,
    status: 'rejected',
    rejectedBy: rejecterId,
    rejectedAt: now,
    rejectionReason: reason,
  };

  const updatedGates = [...taskRun.approvalGates];
  updatedGates[gateIndex] = updatedGate;

  const updatedTaskRun: BurroTaskRun = {
    ...taskRun,
    approvalGates: updatedGates,
    updatedAt: now,
  };

  // Auto-return to created state on gate rejection
  if (taskRun.state === 'pending_approval') {
    return applyTransition(
      updatedTaskRun,
      'created',
      'system',
      `Gate '${gate.gateName}' rejected by ${rejecterId}: ${reason}`
    );
  }

  return {
    success: true,
    taskRun: updatedTaskRun,
  };
}

/**
 * Start execution (approved -> executing)
 */
export function startExecution(
  taskRun: BurroTaskRun,
  executorId: string,
  notes?: string
): OrchestrationTransitionResult {
  return applyTransition(taskRun, 'executing', executorId, notes);
}

/**
 * Complete execution (executing -> completed)
 */
export function completeExecution(
  taskRun: BurroTaskRun,
  executorId: string,
  notes?: string
): OrchestrationTransitionResult {
  return applyTransition(taskRun, 'completed', executorId, notes);
}

/**
 * Mark execution as failed (executing -> failed)
 */
export function failExecution(
  taskRun: BurroTaskRun,
  executorId: string,
  errorMessage: string
): OrchestrationTransitionResult {
  const now = new Date().toISOString();

  const failedTaskRun: BurroTaskRun = {
    ...taskRun,
    executionError: errorMessage,
    updatedAt: now,
  };

  return applyTransition(failedTaskRun, 'failed', executorId, `Execution failed: ${errorMessage}`);
}

/**
 * Retry failed task (failed -> created)
 */
export function retryTask(
  taskRun: BurroTaskRun,
  operatorId: string,
  notes?: string
): OrchestrationTransitionResult {
  // Reset gates to pending for retry
  const resetGates = taskRun.approvalGates.map((gate) => ({
    ...gate,
    status: 'pending' as const,
    approvedBy: undefined,
    approvedAt: undefined,
    rejectedBy: undefined,
    rejectedAt: undefined,
    rejectionReason: undefined,
  }));

  const resetTaskRun: BurroTaskRun = {
    ...taskRun,
    approvalGates: resetGates,
    executionError: undefined,
    executionStartedAt: undefined,
    executionCompletedAt: undefined,
  };

  return applyTransition(resetTaskRun, 'created', operatorId, notes ?? 'Retrying failed task');
}

/**
 * Get state machine summary for UI display
 */
export function getStateMachineSummary(): {
  states: BurroTaskState[];
  transitions: Record<BurroTaskState, BurroTaskState[]>;
  terminalStates: BurroTaskState[];
} {
  return {
    states: ['created', 'pending_approval', 'approved', 'executing', 'completed', 'failed'],
    transitions: VALID_TRANSITIONS,
    terminalStates: ['completed'],
  };
}
