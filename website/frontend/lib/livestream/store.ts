import { readFile } from 'fs/promises';

import { appendJsonLine, getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';

import type {
  StreamConfig,
  StreamHealth,
  StreamHealthEvent,
  StreamState,
  StreamViewerInteraction,
} from './types';
import { VALID_STATE_TRANSITIONS } from './types';

// Generate unique IDs
export function generateStreamId(): string {
  return `stream_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function generateHealthEventId(): string {
  return `she_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function generateInteractionId(): string {
  return `svi_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// --- Stream Configuration ---

// Get stream configuration
export async function getStreamConfig(streamId: string): Promise<StreamConfig | null> {
  return readJsonFile<StreamConfig | null>(
    getDataPath('livestream', 'configs', `${streamId}.json`),
    null
  );
}

// List all stream configurations
export async function listStreamConfigs(): Promise<StreamConfig[]> {
  try {
    const { readdir } = await import('fs/promises');
    const files = await readdir(getDataPath('livestream', 'configs'));
    const configs: StreamConfig[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const config = await readJsonFile<StreamConfig | null>(
          getDataPath('livestream', 'configs', file),
          null
        );
        if (config) configs.push(config);
      }
    }

    return configs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

// Save stream configuration
export async function saveStreamConfig(config: StreamConfig): Promise<void> {
  await writeJsonFile(
    getDataPath('livestream', 'configs', `${config.id}.json`),
    config
  );
}

// Create new stream configuration per A-2.3.5 (single type MVP)
export async function createStreamConfig(
  params: Omit<StreamConfig, 'id' | 'createdAt' | 'updatedAt'>
): Promise<StreamConfig> {
  const now = new Date().toISOString();
  const config: StreamConfig = {
    ...params,
    id: generateStreamId(),
    createdAt: now,
    updatedAt: now,
  };

  await saveStreamConfig(config);
  return config;
}

// --- Stream Health State ---

// Get current stream health
export async function getStreamHealth(streamId: string): Promise<StreamHealth | null> {
  return readJsonFile<StreamHealth | null>(
    getDataPath('livestream', 'health', `${streamId}.json`),
    null
  );
}

// Update stream health state
export async function updateStreamHealth(health: StreamHealth): Promise<void> {
  await writeJsonFile(
    getDataPath('livestream', 'health', `${health.streamId}.json`),
    health
  );
}

// Validate state transition per A-2.3.3
export function isValidStateTransition(from: StreamState, to: StreamState): boolean {
  if (from === to) return true; // No-op is valid
  const validTargets = VALID_STATE_TRANSITIONS[from];
  return validTargets.includes(to);
}

// Transition stream state with logging per A-2.3.4
export async function transitionStreamState(
  streamId: string,
  newState: StreamState,
  options?: {
    failureReason?: string;
    bandwidthMbps?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  const currentHealth = await getStreamHealth(streamId);
  const currentState = currentHealth?.currentState ?? 'error_recovery';

  // Validate transition
  if (!isValidStateTransition(currentState, newState)) {
    return {
      success: false,
      error: `Invalid state transition from ${currentState} to ${newState}`,
    };
  }

  const now = new Date().toISOString();

  // Calculate duration in previous state
  let durationSeconds: number | undefined;
  if (currentHealth?.lastStateChange) {
    const lastChange = new Date(currentHealth.lastStateChange).getTime();
    durationSeconds = Math.floor((Date.now() - lastChange) / 1000);
  }

  // Log the state transition event per A-2.3.4
  const event: StreamHealthEvent = {
    eventId: generateHealthEventId(),
    streamId,
    eventType: getEventTypeForTransition(currentState, newState),
    stateFrom: currentState,
    stateTo: newState,
    durationSeconds,
    failureReason: options?.failureReason,
    bandwidthMbps: options?.bandwidthMbps,
    occurredAt: now,
  };

  await appendJsonLine(getDataPath('analytics', 'stream-health.jsonl'), event);

  // Update current health state
  const updatedHealth: StreamHealth = {
    streamId,
    currentState: newState,
    lastStateChange: now,
    bandwidthMbps: options?.bandwidthMbps,
    lastFrameTime: newState === 'live' ? now : currentHealth?.lastFrameTime,
    errorMessage: options?.failureReason,
    checkedAt: now,
  };

  await updateStreamHealth(updatedHealth);

  return { success: true };
}

// Determine event type for a state transition
function getEventTypeForTransition(
  from: StreamState,
  to: StreamState
): StreamHealthEvent['eventType'] {
  if (to === 'live' && from !== 'live') return 'recovery_completed';
  if (to === 'live' && from === 'scheduled_offline') return 'stream_start';
  if (to === 'scheduled_offline') return 'stream_stop';
  if (to === 'low_bandwidth') return 'bandwidth_degraded';
  if (to === 'static_fallback' || to === 'timelapse_fallback') return 'fallback_triggered';
  if (to === 'error_recovery') return 'error_occurred';
  return 'fallback_triggered';
}

// --- Stream Health Logs (A-2.3.4) ---

// List stream health events
export async function listStreamHealthEvents(options?: {
  streamId?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<StreamHealthEvent[]> {
  try {
    const raw = await readFile(getDataPath('analytics', 'stream-health.jsonl'), 'utf8');
    const lines = raw.trim().split('\n').filter(Boolean);
    let events: StreamHealthEvent[] = lines.map((line) => JSON.parse(line) as StreamHealthEvent);

    if (options?.streamId) {
      events = events.filter((e) => e.streamId === options.streamId);
    }
    if (options?.fromDate) {
      events = events.filter((e) => e.occurredAt >= options.fromDate!);
    }
    if (options?.toDate) {
      events = events.filter((e) => e.occurredAt <= options.toDate!);
    }

    return events;
  } catch {
    return [];
  }
}

// Calculate stream uptime percentage for Tier 2 metrics
export async function getStreamUptimePercentage(
  fromDate: string,
  toDate: string,
  streamId?: string
): Promise<number> {
  const events = await listStreamHealthEvents({ streamId, fromDate, toDate });

  if (events.length === 0) return 0;

  // Calculate time spent in each state
  let liveTime = 0;
  let totalTime = 0;

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const duration = event.durationSeconds ?? 0;
    totalTime += duration;

    if (event.stateFrom === 'live') {
      liveTime += duration;
    }
  }

  // Include time from last event to now (or toDate)
  if (events.length > 0) {
    const lastEvent = events[events.length - 1];
    const lastEventTime = new Date(lastEvent.occurredAt).getTime();
    const endTime = new Date(toDate).getTime();
    const remainingSeconds = Math.floor((endTime - lastEventTime) / 1000);

    if (remainingSeconds > 0) {
      totalTime += remainingSeconds;
      if (lastEvent.stateTo === 'live') {
        liveTime += remainingSeconds;
      }
    }
  }

  return totalTime > 0 ? (liveTime / totalTime) * 100 : 0;
}

// --- Viewer Interactions (A-2.3.6 compliant - no monetization) ---

// Log viewer interaction
export async function logViewerInteraction(
  interaction: Omit<StreamViewerInteraction, 'interactionId'>
): Promise<void> {
  const event: StreamViewerInteraction = {
    ...interaction,
    interactionId: generateInteractionId(),
  };

  await appendJsonLine(getDataPath('livestream', 'interactions.jsonl'), event);
}

// List viewer interactions
export async function listViewerInteractions(options?: {
  streamId?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<StreamViewerInteraction[]> {
  try {
    const raw = await readFile(getDataPath('livestream', 'interactions.jsonl'), 'utf8');
    const lines = raw.trim().split('\n').filter(Boolean);
    let interactions: StreamViewerInteraction[] = lines.map(
      (line) => JSON.parse(line) as StreamViewerInteraction
    );

    if (options?.streamId) {
      interactions = interactions.filter((e) => e.streamId === options.streamId);
    }
    if (options?.fromDate) {
      interactions = interactions.filter((e) => e.occurredAt >= options.fromDate!);
    }
    if (options?.toDate) {
      interactions = interactions.filter((e) => e.occurredAt <= options.toDate!);
    }

    return interactions;
  } catch {
    return [];
  }
}

// Get active stream for public display
export async function getActiveStream(): Promise<{
  config: StreamConfig;
  health: StreamHealth;
} | null> {
  const configs = await listStreamConfigs();
  const activeConfig = configs.find((c) => c.isActive);

  if (!activeConfig) return null;

  const health = await getStreamHealth(activeConfig.id);
  if (!health) {
    // Initialize health state if not exists
    const initialHealth: StreamHealth = {
      streamId: activeConfig.id,
      currentState: 'scheduled_offline',
      lastStateChange: new Date().toISOString(),
      checkedAt: new Date().toISOString(),
    };
    await updateStreamHealth(initialHealth);
    return { config: activeConfig, health: initialHealth };
  }

  return { config: activeConfig, health };
}
