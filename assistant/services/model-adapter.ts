import type { CompletionResult, RetrievalContext } from './types';

export interface ModelAdapter {
  complete(prompt: string, context: RetrievalContext): Promise<CompletionResult>;
  isConfigured(): boolean;
}

class StubModelAdapter implements ModelAdapter {
  isConfigured(): boolean {
    return Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);
  }

  async complete(_prompt: string, _context: RetrievalContext): Promise<CompletionResult> {
    if (this.isConfigured()) {
      return {
        status: 'configured',
        message: 'Provider credentials were detected, but Sprint 0.3 keeps Burro in scaffold mode until provider-backed activation is approved.',
      };
    }

    return {
      status: 'stub',
      message: 'Model not configured. Burro is operating in retrieval-backed scaffold mode until API credentials are provisioned.',
    };
  }
}

export function getModelAdapter(): ModelAdapter {
  return new StubModelAdapter();
}
