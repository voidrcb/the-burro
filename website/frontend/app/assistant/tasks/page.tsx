'use client';

import { useEffect, useState } from 'react';

import type { BurroTaskRun, TaskRunSummary, TaskTemplate } from '@/lib/burro/orchestration-types';

type TaskState = BurroTaskRun['state'];
type TaskType = BurroTaskRun['taskType'];

const STATE_LABELS: Record<TaskState, string> = {
  created: 'Created',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  executing: 'Executing',
  completed: 'Completed',
  failed: 'Failed',
};

const STATE_COLORS: Record<TaskState, string> = {
  created: 'bg-gray-100 text-gray-800',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  executing: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

const TYPE_LABELS: Record<TaskType, string> = {
  package_draft: 'Package Draft',
  partner_coordination: 'Partner Coordination',
  content_review: 'Content Review',
  followup_sequence: 'Follow-up Sequence',
};

export default function TasksPage() {
  const [summaries, setSummaries] = useState<TaskRunSummary[]>([]);
  const [selectedTask, setSelectedTask] = useState<BurroTaskRun | null>(null);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<TaskState | 'all'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [tasksRes, templatesRes] = await Promise.all([
          fetch('/api/burro/tasks?summaries=true'),
          fetch('/api/burro/tasks?templates=true'),
        ]);

        if (!tasksRes.ok || !templatesRes.ok) {
          throw new Error('Failed to load data');
        }

        const tasksData = await tasksRes.json();
        const templatesData = await templatesRes.json();

        setSummaries(tasksData.summaries);
        setTemplates(templatesData.templates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function loadTaskDetails(taskId: string) {
    try {
      const response = await fetch(`/api/burro/tasks/${taskId}`);
      if (!response.ok) throw new Error('Failed to load task');
      const data = await response.json();
      setSelectedTask(data.task);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task');
    }
  }

  async function handleAction(taskId: string, action: string, extras?: Record<string, unknown>) {
    try {
      const response = await fetch(`/api/burro/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          operatorId: 'operator',
          ...extras,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Action failed');
      }

      const data = await response.json();
      setSelectedTask(data.task);

      // Refresh summaries
      const summariesRes = await fetch('/api/burro/tasks?summaries=true');
      const summariesData = await summariesRes.json();
      setSummaries(summariesData.summaries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    }
  }

  const filteredSummaries =
    filterState === 'all'
      ? summaries
      : summaries.filter((s) => s.state === filterState);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Task Orchestration</h1>
        <div className="animate-pulse">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Task Orchestration</h1>
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={() => setError(null)}
          className="text-sm text-blue-600 hover:underline"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Orchestration</h1>
        <span className="text-sm text-gray-500">
          {summaries.length} task{summaries.length !== 1 ? 's' : ''} |{' '}
          {summaries.filter((s) => s.pendingApprovals > 0).length} pending approval
        </span>
      </div>

      {/* State Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filter by State
        </label>
        <select
          value={filterState}
          onChange={(e) => setFilterState(e.target.value as TaskState | 'all')}
          className="border rounded px-3 py-2"
        >
          <option value="all">All States</option>
          {Object.entries(STATE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Tasks</h2>
          {filteredSummaries.length === 0 ? (
            <div className="text-gray-500 text-center py-8 border rounded">
              No tasks found.
            </div>
          ) : (
            filteredSummaries.map((summary) => (
              <div
                key={summary.id}
                onClick={() => loadTaskDetails(summary.id)}
                className={`border rounded-lg p-3 cursor-pointer hover:bg-gray-50 ${
                  selectedTask?.id === summary.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{summary.title}</h3>
                    <p className="text-sm text-gray-500">{summary.contextLabel}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded ${STATE_COLORS[summary.state]}`}
                    >
                      {STATE_LABELS[summary.state]}
                    </span>
                    {summary.pendingApprovals > 0 && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {summary.pendingApprovals} pending
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-gray-400">
                    {TYPE_LABELS[summary.taskType]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(summary.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Task Details */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Task Details</h2>
          {selectedTask ? (
            <div className="border rounded-lg p-4 space-y-4">
              <div>
                <h3 className="text-xl font-bold">{selectedTask.title}</h3>
                {selectedTask.description && (
                  <p className="text-gray-600 mt-1">{selectedTask.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <span className={`text-sm px-2 py-1 rounded ${STATE_COLORS[selectedTask.state]}`}>
                  {STATE_LABELS[selectedTask.state]}
                </span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {TYPE_LABELS[selectedTask.taskType]}
                </span>
              </div>

              {/* Approval Gates */}
              <div>
                <h4 className="font-medium mb-2">Approval Gates</h4>
                <div className="space-y-2">
                  {selectedTask.approvalGates.map((gate) => (
                    <div
                      key={gate.gateId}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-medium">{gate.gateName}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({gate.requiredApproverRole})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {gate.status === 'pending' && selectedTask.state === 'pending_approval' && (
                          <>
                            <button
                              onClick={() =>
                                handleAction(selectedTask.id, 'approve_gate', {
                                  gateId: gate.gateId,
                                })
                              }
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason:');
                                if (reason) {
                                  handleAction(selectedTask.id, 'reject_gate', {
                                    gateId: gate.gateId,
                                    reason,
                                  });
                                }
                              }}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {gate.status === 'approved' && (
                          <span className="text-xs text-green-600">
                            Approved by {gate.approvedBy}
                          </span>
                        )}
                        {gate.status === 'rejected' && (
                          <span className="text-xs text-red-600">
                            Rejected: {gate.rejectionReason}
                          </span>
                        )}
                        {gate.status === 'pending' && selectedTask.state !== 'pending_approval' && (
                          <span className="text-xs text-gray-500">Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Actions</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedTask.state === 'created' && (
                    <button
                      onClick={() => handleAction(selectedTask.id, 'submit_for_approval')}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Submit for Approval
                    </button>
                  )}
                  {selectedTask.state === 'approved' && (
                    <button
                      onClick={() => handleAction(selectedTask.id, 'start_execution')}
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Start Execution
                    </button>
                  )}
                  {selectedTask.state === 'executing' && (
                    <>
                      <button
                        onClick={() =>
                          handleAction(selectedTask.id, 'complete_execution', {
                            outputs: [
                              {
                                outputType: 'draft_message',
                                outputRef: 'manual_completion',
                                outputLabel: 'Manual completion',
                              },
                            ],
                          })
                        }
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => {
                          const errorMessage = prompt('Error message:');
                          if (errorMessage) {
                            handleAction(selectedTask.id, 'fail_execution', {
                              errorMessage,
                            });
                          }
                        }}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Mark Failed
                      </button>
                    </>
                  )}
                  {selectedTask.state === 'failed' && (
                    <button
                      onClick={() => handleAction(selectedTask.id, 'retry')}
                      className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                    >
                      Retry Task
                    </button>
                  )}
                </div>
              </div>

              {/* Context */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Context</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Type:</span>{' '}
                    {selectedTask.context.contextType}
                  </p>
                  <p>
                    <span className="font-medium">ID:</span>{' '}
                    {selectedTask.context.contextId}
                  </p>
                  {selectedTask.context.contextLabel && (
                    <p>
                      <span className="font-medium">Label:</span>{' '}
                      {selectedTask.context.contextLabel}
                    </p>
                  )}
                </div>
              </div>

              {/* Outputs */}
              {selectedTask.outputs.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Outputs</h4>
                  <div className="space-y-2">
                    {selectedTask.outputs.map((output, idx) => (
                      <div key={idx} className="text-sm p-2 bg-gray-50 rounded">
                        <span className="font-medium">{output.outputType}</span>:{' '}
                        {output.outputLabel ?? output.outputRef}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {selectedTask.executionError && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2 text-red-600">Execution Error</h4>
                  <p className="text-sm text-red-600">{selectedTask.executionError}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8 border rounded">
              Select a task to view details
            </div>
          )}
        </div>
      </div>

      {/* Templates Reference */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Available Task Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="border rounded p-3 bg-gray-50">
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{template.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                {template.defaultGates.length} approval gate(s)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
