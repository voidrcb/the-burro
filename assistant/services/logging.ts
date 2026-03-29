import { mkdir, appendFile } from 'fs/promises';
import path from 'path';

import { getRepoPath } from './repo-root';
import type { AssistantLogEntry } from './types';

async function appendJsonLine(targetPath: string, payload: unknown): Promise<void> {
  await mkdir(path.dirname(targetPath), { recursive: true });
  await appendFile(targetPath, `${JSON.stringify(payload)}\n`, 'utf8');
}

export async function logAssistantAction(entry: AssistantLogEntry): Promise<void> {
  await appendJsonLine(getRepoPath('data', 'assistant-logs', 'assistant-actions.jsonl'), entry);
}

export async function logWebhookEvent(provider: string, payload: unknown, meta: Record<string, unknown>): Promise<string> {
  const targetPath = getRepoPath('data', 'sandbox-events', `${provider}.jsonl`);
  await appendJsonLine(targetPath, {
    received_at: new Date().toISOString(),
    provider,
    meta,
    payload,
  });
  return targetPath;
}
