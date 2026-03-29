import { readFile } from 'fs/promises';

import { getRepoPath } from './repo-root';
import type { AssistantMode, RetrievalContext, RetrievalExcerpt, RetrievalSource } from './types';

type RawRetrievalSource = {
  source_id: string;
  label: string;
  path: string;
  format: 'json' | 'markdown';
  trust_level: string;
  summary: string;
  domains: string[];
  views: string[];
};

type RetrievalConfig = {
  views: Record<string, string[]>;
  sources: RawRetrievalSource[];
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
}

function tokenize(query: string): string[] {
  return Array.from(new Set(normalize(query).split(/\s+/).filter((token) => token.length > 2)));
}

function scoreSource(queryTokens: string[], source: RetrievalSource): number {
  const haystack = normalize(`${source.label} ${source.summary} ${source.domains.join(' ')}`);
  return queryTokens.reduce((score, token) => score + (haystack.includes(token) ? 2 : 0), 0);
}

function selectViews(mode: AssistantMode): string[] {
  if (mode === 'property') {
    return ['summary', 'darq', 'property_ops', 'pilot'];
  }

  return ['summary', 'research', 'high_trust'];
}

async function loadRetrievalConfig(): Promise<{ views: Record<string, string[]>; sources: RetrievalSource[] }> {
  const raw = await readFile(getRepoPath('assistant', 'config', 'retrieval.json'), 'utf8');
  const parsed = JSON.parse(raw) as RetrievalConfig;

  return {
    views: parsed.views,
    sources: parsed.sources.map((source) => ({
      sourceId: source.source_id,
      label: source.label,
      path: source.path,
      format: source.format,
      trustLevel: source.trust_level,
      summary: source.summary,
      domains: source.domains,
      views: source.views,
    })),
  };
}

async function buildExcerpt(source: RetrievalSource): Promise<string> {
  const raw = await readFile(getRepoPath(...source.path.split('/')), 'utf8');
  if (source.format === 'json') {
    return raw.slice(0, 520).replace(/\s+/g, ' ').trim();
  }

  return raw.replace(/[#>*_`-]/g, ' ').replace(/\s+/g, ' ').slice(0, 520).trim();
}

export async function retrieveContext(mode: AssistantMode, query: string): Promise<RetrievalContext> {
  const config = await loadRetrievalConfig();
  const activeViews = selectViews(mode);
  const tokens = tokenize(query);
  const eligibleSources = config.sources.filter((source) => source.views.some((view) => activeViews.includes(view)));

  const ranked = await Promise.all(
    eligibleSources.map(async (source) => {
      const excerpt = await buildExcerpt(source);
      const score = scoreSource(tokens, source);
      return {
        sourceId: source.sourceId,
        label: source.label,
        path: source.path,
        trustLevel: source.trustLevel,
        summary: source.summary,
        excerpt,
        score,
      } satisfies RetrievalExcerpt;
    }),
  );

  const selected = ranked
    .sort((left, right) => right.score - left.score)
    .filter((item, index) => item.score > 0 || index < 3)
    .slice(0, 4);

  return {
    mode,
    query,
    views: activeViews,
    sources: selected,
  };
}
