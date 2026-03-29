import { randomUUID } from 'crypto';
import { readdir } from 'fs/promises';
import path from 'path';

import { getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';
import { logAnalyticsEvent } from '@/lib/analytics/store';

import {
  approveGate,
  rejectGate,
  submitForApproval,
  startExecution,
  completeExecution,
  failExecution,
  retryTask,
  createTransition,
} from './orchestration-state-machine';
import {
  burroTaskRunSchema,
  TASK_TEMPLATES,
  type ApprovalGate,
  type BurroTaskRun,
  type BurroTaskState,
  type BurroTaskType,
  type TaskContext,
  type TaskOutput,
  type TaskRunSummary,
  type TaskTemplate,
} from './orchestration-types';

// Path helpers
function getTaskRunPath(id: string): string {
  return getDataPath('burro-tasks', `${id}.json`);
}

// ID generators
function generateTaskRunId(): string {
  return `task_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateGateId(): string {
  return `gate_${randomUUID().slice(0, 8)}`;
}

// Task Run Operations

export async function createTaskRun(payload: {
  taskType: BurroTaskType;
  title: string;
  description?: string;
  context: TaskContext;
  initiatedBy: string;
  templateId?: string;
  customGates?: Array<{ gateName: string; requiredApproverRole: 'operator' | 'reviewer' | 'admin' }>;
}): Promise<BurroTaskRun> {
  const now = new Date().toISOString();
  const initialTransition = createTransition(null, 'created', payload.initiatedBy, 'Task created');

  // Get gates from template or custom gates
  let gates: ApprovalGate[];
  if (payload.templateId) {
    const template = TASK_TEMPLATES.find((t) => t.id === payload.templateId);
    if (!template) {
      throw new Error(`Template not found: ${payload.templateId}`);
    }
    gates = template.defaultGates.map((g) => ({
      gateId: generateGateId(),
      gateName: g.gateName,
      requiredApproverRole: g.requiredApproverRole,
      status: 'pending' as const,
    }));
  } else if (payload.customGates) {
    gates = payload.customGates.map((g) => ({
      gateId: generateGateId(),
      gateName: g.gateName,
      requiredApproverRole: g.requiredApproverRole,
      status: 'pending' as const,
    }));
  } else {
    // Default single operator gate
    gates = [
      {
        gateId: generateGateId(),
        gateName: 'Operator Approval',
        requiredApproverRole: 'operator',
        status: 'pending',
      },
    ];
  }

  const taskRun = burroTaskRunSchema.parse({
    id: generateTaskRunId(),
    taskType: payload.taskType,
    title: payload.title,
    description: payload.description,
    context: payload.context,
    state: 'created',
    stateHistory: [initialTransition],
    approvalGates: gates,
    outputs: [],
    operatorOnly: true, // Per A-2.4.7
    initiatedBy: payload.initiatedBy,
    createdAt: now,
    updatedAt: now,
  });

  await writeJsonFile(getTaskRunPath(taskRun.id), taskRun);

  // Log analytics event
  await logAnalyticsEvent('assistant_interaction', '/api/burro/tasks', {
    metadata: {
      action: 'task_created',
      taskId: taskRun.id,
      taskType: taskRun.taskType,
    },
  });

  return taskRun;
}

export async function getTaskRun(id: string): Promise<BurroTaskRun | null> {
  const data = await readJsonFile<unknown>(getTaskRunPath(id), null);
  if (!data) return null;

  const parsed = burroTaskRunSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function listTaskRuns(filter?: {
  state?: BurroTaskState;
  taskType?: BurroTaskType;
  initiatedBy?: string;
}): Promise<BurroTaskRun[]> {
  const directory = getDataPath('burro-tasks');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: BurroTaskRun[] = [];

  for (const fileName of files) {
    const data = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = burroTaskRunSchema.safeParse(data);
    if (parsed.success) {
      let include = true;
      if (filter?.state && parsed.data.state !== filter.state) {
        include = false;
      }
      if (filter?.taskType && parsed.data.taskType !== filter.taskType) {
        include = false;
      }
      if (filter?.initiatedBy && parsed.data.initiatedBy !== filter.initiatedBy) {
        include = false;
      }
      if (include) {
        records.push(parsed.data);
      }
    }
  }

  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listActiveTaskRuns(): Promise<BurroTaskRun[]> {
  const all = await listTaskRuns();
  const activeStates: BurroTaskState[] = ['created', 'pending_approval', 'approved', 'executing'];
  return all.filter((t) => activeStates.includes(t.state));
}

export async function listPendingApprovalTasks(): Promise<BurroTaskRun[]> {
  return listTaskRuns({ state: 'pending_approval' });
}

// State Transition Operations

export async function submitTaskForApproval(
  id: string,
  submittedBy: string,
  notes?: string
): Promise<BurroTaskRun> {
  const taskRun = await getTaskRun(id);
  if (!taskRun) {
    throw new Error(`Task not found: ${id}`);
  }

  const result = submitForApproval(taskRun, submittedBy, notes);
  if (!result.success || !result.taskRun) {
    throw new Error(result.error ?? 'State transition failed');
  }

  await writeJsonFile(getTaskRunPath(id), result.taskRun);
  return result.taskRun;
}

export async function approveTaskGate(
  taskId: string,
  gateId: string,
  approverId: string,
  notes?: string
): Promise<BurroTaskRun> {
  const taskRun = await getTaskRun(taskId);
  if (!taskRun) {
    throw new Error(`Task not found: ${taskId}`);
  }

  const result = approveGate(taskRun, gateId, approverId, notes);
  if (!result.success || !result.taskRun) {
    throw new Error(result.error ?? 'Gate approval failed');
  }

  await writeJsonFile(getTaskRunPath(taskId), result.taskRun);
  return result.taskRun;
}

export async function rejectTaskGate(
  taskId: string,
  gateId: string,
  rejecterId: string,
  reason: string
): Promise<BurroTaskRun> {
  const taskRun = await getTaskRun(taskId);
  if (!taskRun) {
    throw new Error(`Task not found: ${taskId}`);
  }

  const result = rejectGate(taskRun, gateId, rejecterId, reason);
  if (!result.success || !result.taskRun) {
    throw new Error(result.error ?? 'Gate rejection failed');
  }

  await writeJsonFile(getTaskRunPath(taskId), result.taskRun);
  return result.taskRun;
}

export async function startTaskExecution(
  id: string,
  executorId: string,
  notes?: string
): Promise<BurroTaskRun> {
  const taskRun = await getTaskRun(id);
  if (!taskRun) {
    throw new Error(`Task not found: ${id}`);
  }

  const result = startExecution(taskRun, executorId, notes);
  if (!result.success || !result.taskRun) {
    throw new Error(result.error ?? 'Start execution failed');
  }

  await writeJsonFile(getTaskRunPath(id), result.taskRun);
  return result.taskRun;
}

export async function completeTaskExecution(
  id: string,
  executorId: string,
  outputs: TaskOutput[],
  notes?: string
): Promise<BurroTaskRun> {
  const taskRun = await getTaskRun(id);
  if (!taskRun) {
    throw new Error(`Task not found: ${id}`);
  }

  // Add outputs before completing
  const taskWithOutputs: BurroTaskRun = {
    ...taskRun,
    outputs,
  };

  const result = completeExecution(taskWithOutputs, executorId, notes);
  if (!result.success || !result.taskRun) {
    throw new Error(result.error ?? 'Complete execution failed');
  }

  await writeJsonFile(getTaskRunPath(id), result.taskRun);

  // Log analytics event for completion
  await logAnalyticsEvent('assistant_interaction', '/api/burro/tasks', {
    metadata: {
      action: 'task_completed',
      taskId: id,
      taskType: result.taskRun.taskType,
      outputCount: outputs.length,
    },
  });

  return result.taskRun;
}

export async function failTaskExecution(
  id: string,
  executorId: string,
  errorMessage: string
): Promise<BurroTaskRun> {
  const taskRun = await getTaskRun(id);
  if (!taskRun) {
    throw new Error(`Task not found: ${id}`);
  }

  const result = failExecution(taskRun, executorId, errorMessage);
  if (!result.success || !result.taskRun) {
    throw new Error(result.error ?? 'Fail execution failed');
  }

  await writeJsonFile(getTaskRunPath(id), result.taskRun);
  return result.taskRun;
}

export async function retryFailedTask(
  id: string,
  operatorId: string,
  notes?: string
): Promise<BurroTaskRun> {
  const taskRun = await getTaskRun(id);
  if (!taskRun) {
    throw new Error(`Task not found: ${id}`);
  }

  const result = retryTask(taskRun, operatorId, notes);
  if (!result.success || !result.taskRun) {
    throw new Error(result.error ?? 'Retry failed');
  }

  await writeJsonFile(getTaskRunPath(id), result.taskRun);
  return result.taskRun;
}

// Utility Functions

export async function getTaskRunSummaries(): Promise<TaskRunSummary[]> {
  const tasks = await listTaskRuns();

  return tasks.map((task) => ({
    id: task.id,
    taskType: task.taskType,
    title: task.title,
    state: task.state,
    pendingApprovals: task.approvalGates.filter((g) => g.status === 'pending').length,
    contextLabel: task.context.contextLabel ?? task.context.contextId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));
}

export function getTaskTemplates(): TaskTemplate[] {
  return TASK_TEMPLATES;
}

export function getTaskTemplate(id: string): TaskTemplate | undefined {
  return TASK_TEMPLATES.find((t) => t.id === id);
}

// Integration with existing follow-up system per HF-2407
export async function createFollowUpTask(
  guestEmail: string,
  contextRef: { type: 'booking' | 'registration'; id: string },
  initiatedBy: string
): Promise<BurroTaskRun> {
  return createTaskRun({
    taskType: 'followup_sequence',
    title: `Follow-up for ${guestEmail}`,
    description: `Create follow-up communication for ${contextRef.type} ${contextRef.id}`,
    context: {
      contextType: 'guest',
      contextId: guestEmail,
      contextLabel: guestEmail,
      relatedRefs: [{ type: contextRef.type, id: contextRef.id }],
    },
    initiatedBy,
    templateId: 'tmpl_followup_sequence',
  });
}

export async function createPartnerCoordinationTask(
  partnerId: string,
  partnerName: string,
  purpose: string,
  initiatedBy: string
): Promise<BurroTaskRun> {
  return createTaskRun({
    taskType: 'partner_coordination',
    title: `Coordinate with ${partnerName}`,
    description: purpose,
    context: {
      contextType: 'partner',
      contextId: partnerId,
      contextLabel: partnerName,
    },
    initiatedBy,
    templateId: 'tmpl_partner_coordination',
  });
}

export async function createPackageDraftTask(
  itineraryId: string,
  itineraryLabel: string,
  initiatedBy: string
): Promise<BurroTaskRun> {
  return createTaskRun({
    taskType: 'package_draft',
    title: `Package draft: ${itineraryLabel}`,
    description: 'Assemble multi-experience package for guest review',
    context: {
      contextType: 'itinerary',
      contextId: itineraryId,
      contextLabel: itineraryLabel,
    },
    initiatedBy,
    templateId: 'tmpl_package_draft',
  });
}
