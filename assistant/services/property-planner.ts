import { getModelAdapter } from './model-adapter';
import { retrieveContext } from './retrieval';
import type { AssistantResponse } from './types';

function summarizePropertyQuery(query: string, contextSummary: string[]): string {
  const lowered = query.toLowerCase();

  if (lowered.includes('probate') || lowered.includes('lien') || lowered.includes('heir')) {
    return 'Current property blockers still center on probate closure and heir lien-release coordination. Treat title cleanup as the gating condition before any irreversible land or utility commitments.';
  }

  if (lowered.includes('task') || lowered.includes('next step') || lowered.includes('next action')) {
    return 'The most useful operator move is to work from the task tracker and issue register together: keep blocked probate items visible, advance the wrong-parcel documentation, and keep water-project assumptions separate from title-resolution tasks.';
  }

  if (lowered.includes('pilot') || lowered.includes('unit') || lowered.includes('cost') || lowered.includes('dome') || lowered.includes('tent')) {
    return 'The pilot model still favors a low-capex first unit and conservative utility assumptions. Use the provisional ranges as planning bounds, not purchase-ready budgets.';
  }

  return contextSummary.length
    ? 'Burro can ground this request in the current property tracker, DARQ register, and pilot model. The immediate pattern remains the same: unblock land certainty first, then sequence utilities and pilot-unit feasibility.'
    : 'unknown';
}

export async function planPropertyQuery(query: string): Promise<AssistantResponse> {
  const context = await retrieveContext('property', query);
  const adapter = getModelAdapter();
  const completion = await adapter.complete(query, context);
  const contextSummary = context.sources.map((source) => source.summary);
  const grounded = summarizePropertyQuery(query, contextSummary);

  return {
    mode: 'property',
    status: grounded === 'unknown' ? 'unknown' : 'grounded',
    message: grounded === 'unknown' ? 'unknown' : `${grounded} ${completion.message}`,
    citations: context.sources.map((source) => ({
      sourceId: source.sourceId,
      label: source.label,
      path: source.path,
      trustLevel: source.trustLevel,
    })),
    advisories: ['This response is scaffolded from approved sources and remains in assisted mode.'],
    contextSummary,
    toolActions: ['load_property_tracker', 'load_property_tasks', 'load_darq_register', 'lookup_feasibility_snapshot'],
  };
}
