import { NextRequest, NextResponse } from 'next/server';

import {
  createTaskRun,
  listTaskRuns,
  listActiveTaskRuns,
  listPendingApprovalTasks,
  getTaskRunSummaries,
  getTaskTemplates,
} from '@/lib/burro/orchestration-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const taskType = searchParams.get('taskType');
    const activeOnly = searchParams.get('active') === 'true';
    const pendingApproval = searchParams.get('pendingApproval') === 'true';
    const summaries = searchParams.get('summaries') === 'true';
    const templates = searchParams.get('templates') === 'true';

    if (templates) {
      const taskTemplates = getTaskTemplates();
      return NextResponse.json({ templates: taskTemplates });
    }

    if (summaries) {
      const taskSummaries = await getTaskRunSummaries();
      return NextResponse.json({ summaries: taskSummaries });
    }

    if (activeOnly) {
      const tasks = await listActiveTaskRuns();
      return NextResponse.json({ tasks });
    }

    if (pendingApproval) {
      const tasks = await listPendingApprovalTasks();
      return NextResponse.json({ tasks });
    }

    const tasks = await listTaskRuns({
      state: state as 'created' | 'pending_approval' | 'approved' | 'executing' | 'completed' | 'failed' | undefined,
      taskType: taskType as 'package_draft' | 'partner_coordination' | 'content_review' | 'followup_sequence' | undefined,
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error listing tasks:', error);
    return NextResponse.json(
      { error: 'Failed to list tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const task = await createTaskRun({
      taskType: body.taskType,
      title: body.title,
      description: body.description,
      context: body.context,
      initiatedBy: body.initiatedBy,
      templateId: body.templateId,
      customGates: body.customGates,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
