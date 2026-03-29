import { NextRequest, NextResponse } from 'next/server';

import {
  getTaskRun,
  submitTaskForApproval,
  approveTaskGate,
  rejectTaskGate,
  startTaskExecution,
  completeTaskExecution,
  failTaskExecution,
  retryFailedTask,
} from '@/lib/burro/orchestration-store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await getTaskRun(id);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error getting task:', error);
    return NextResponse.json(
      { error: 'Failed to get task' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, operatorId } = body;

    if (!action || !operatorId) {
      return NextResponse.json(
        { error: 'action and operatorId are required' },
        { status: 400 }
      );
    }

    let task;

    switch (action) {
      case 'submit_for_approval':
        task = await submitTaskForApproval(id, operatorId, body.notes);
        break;

      case 'approve_gate':
        if (!body.gateId) {
          return NextResponse.json({ error: 'gateId required' }, { status: 400 });
        }
        task = await approveTaskGate(id, body.gateId, operatorId, body.notes);
        break;

      case 'reject_gate':
        if (!body.gateId || !body.reason) {
          return NextResponse.json(
            { error: 'gateId and reason required' },
            { status: 400 }
          );
        }
        task = await rejectTaskGate(id, body.gateId, operatorId, body.reason);
        break;

      case 'start_execution':
        task = await startTaskExecution(id, operatorId, body.notes);
        break;

      case 'complete_execution':
        if (!body.outputs) {
          return NextResponse.json({ error: 'outputs required' }, { status: 400 });
        }
        task = await completeTaskExecution(id, operatorId, body.outputs, body.notes);
        break;

      case 'fail_execution':
        if (!body.errorMessage) {
          return NextResponse.json({ error: 'errorMessage required' }, { status: 400 });
        }
        task = await failTaskExecution(id, operatorId, body.errorMessage);
        break;

      case 'retry':
        task = await retryFailedTask(id, operatorId, body.notes);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    const message = error instanceof Error ? error.message : 'Failed to update task';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
