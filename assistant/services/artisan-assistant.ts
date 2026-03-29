import { getModelAdapter } from './model-adapter';
import { retrieveContext } from './retrieval';
import type { AssistantResponse } from './types';

function summarizeArtisanQuery(query: string, contextSummary: string[]): string {
  const lowered = query.toLowerCase();

  if (lowered.includes('workshop') || lowered.includes('class')) {
    return 'The research set supports workshop-led offers as the safest early artisan path. Lead with guided experiences and follow-up sales rather than assuming product-only demand.';
  }

  if (lowered.includes('tile') || lowered.includes('pottery') || lowered.includes('shipping')) {
    return 'Fragile artisan goods should stay pickup-friendly or workshop-adjacent until packing, freight, and breakage economics are proven. That keeps Sprint 0.3 aligned with practical operator bandwidth.';
  }

  if (lowered.includes('photo') || lowered.includes('dark sky') || lowered.includes('photography')) {
    return 'Dark-sky positioning is best treated as a premium experience layer. The current research supports using workshops as the revenue engine and prints or merchandise as secondary support.';
  }

  return contextSummary.length
    ? 'The current research corpus points toward experience-led artisan offers, conservative shipping assumptions, and grounded premium positioning rather than broad ecommerce expansion.'
    : 'unknown';
}

export async function planArtisanQuery(query: string): Promise<AssistantResponse> {
  const context = await retrieveContext('artisan', query);
  const adapter = getModelAdapter();
  const completion = await adapter.complete(query, context);
  const contextSummary = context.sources.map((source) => source.summary);
  const grounded = summarizeArtisanQuery(query, contextSummary);

  return {
    mode: 'artisan',
    status: grounded === 'unknown' ? 'unknown' : 'grounded',
    message: grounded === 'unknown' ? 'unknown' : `${grounded} ${completion.message}`,
    citations: context.sources.map((source) => ({
      sourceId: source.sourceId,
      label: source.label,
      path: source.path,
      trustLevel: source.trustLevel,
    })),
    advisories: ['This assistant module cites approved research packs and remains non-autonomous.'],
    contextSummary,
    toolActions: ['load_research_source', 'draft_operator_email'],
  };
}
