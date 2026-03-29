export type AssistantMode = 'property' | 'artisan';

export type Citation = {
  sourceId: string;
  label: string;
  path: string;
  trustLevel: string;
};

export type RetrievalSource = {
  sourceId: string;
  label: string;
  path: string;
  format: 'json' | 'markdown';
  trustLevel: string;
  summary: string;
  domains: string[];
  views: string[];
};

export type RetrievalExcerpt = {
  sourceId: string;
  label: string;
  path: string;
  trustLevel: string;
  summary: string;
  excerpt: string;
  score: number;
};

export type RetrievalContext = {
  mode: AssistantMode;
  query: string;
  views: string[];
  sources: RetrievalExcerpt[];
};

export type CompletionResult = {
  status: 'configured' | 'stub';
  message: string;
};

export type AssistantResponse = {
  mode: AssistantMode;
  status: 'grounded' | 'unknown' | 'stub';
  message: string;
  citations: Citation[];
  advisories: string[];
  contextSummary: string[];
  toolActions: string[];
};

export type AssistantLogEntry = {
  timestamp: string;
  mode: AssistantMode;
  query: string;
  status: AssistantResponse['status'];
  citations: string[];
};

export type FeasibilityCard = {
  id: string;
  title: string;
  value: string;
  note: string;
};
