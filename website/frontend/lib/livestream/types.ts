import { z } from 'zod';

// A-2.3.3: Streaming fallback state machine with 6 states
export const streamStateSchema = z.enum([
  'live',
  'low_bandwidth',
  'static_fallback',
  'timelapse_fallback',
  'scheduled_offline',
  'error_recovery',
]);

export type StreamState = z.infer<typeof streamStateSchema>;

// A-2.3.5: Single stream type for Sprint 2.3 (operator chooses day vs. night)
export const streamTypeSchema = z.enum([
  'scenic_daytime',
  'night_sky',
]);

export type StreamType = z.infer<typeof streamTypeSchema>;

// Stream state metadata per A-2.3.3
export const streamStateMetaSchema = z.object({
  state: streamStateSchema,
  publicMessage: z.string(),
  visualIndicator: z.enum(['green', 'yellow', 'orange', 'red', 'gray']),
  recoveryCondition: z.string(),
});

export type StreamStateMeta = z.infer<typeof streamStateMetaSchema>;

// Define state machine metadata
export const STREAM_STATE_META: Record<StreamState, StreamStateMeta> = {
  live: {
    state: 'live',
    publicMessage: 'Live from Big Bend',
    visualIndicator: 'green',
    recoveryCondition: 'N/A - normal operation',
  },
  low_bandwidth: {
    state: 'low_bandwidth',
    publicMessage: 'Stream quality reduced due to connectivity',
    visualIndicator: 'yellow',
    recoveryCondition: 'Bandwidth returns to >= 2 Mbps for 30 seconds',
  },
  static_fallback: {
    state: 'static_fallback',
    publicMessage: 'Showing recent capture while connection restores',
    visualIndicator: 'orange',
    recoveryCondition: 'Stable connection for 60 seconds',
  },
  timelapse_fallback: {
    state: 'timelapse_fallback',
    publicMessage: 'Enjoying a time-lapse while we reconnect',
    visualIndicator: 'orange',
    recoveryCondition: 'Stable connection for 60 seconds',
  },
  scheduled_offline: {
    state: 'scheduled_offline',
    publicMessage: 'Stream offline for scheduled maintenance',
    visualIndicator: 'gray',
    recoveryCondition: 'Maintenance window ends',
  },
  error_recovery: {
    state: 'error_recovery',
    publicMessage: 'Reconnecting to Big Bend',
    visualIndicator: 'red',
    recoveryCondition: 'Successful connection re-established',
  },
};

// Valid state transitions
export const VALID_STATE_TRANSITIONS: Record<StreamState, StreamState[]> = {
  live: ['low_bandwidth', 'static_fallback', 'scheduled_offline', 'error_recovery'],
  low_bandwidth: ['live', 'static_fallback', 'timelapse_fallback', 'error_recovery'],
  static_fallback: ['live', 'low_bandwidth', 'timelapse_fallback', 'error_recovery'],
  timelapse_fallback: ['live', 'low_bandwidth', 'static_fallback', 'error_recovery'],
  scheduled_offline: ['live', 'error_recovery'],
  error_recovery: ['live', 'low_bandwidth', 'static_fallback', 'timelapse_fallback', 'scheduled_offline'],
};

// Stream configuration
export const streamConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: streamTypeSchema,
  description: z.string(),
  embedUrl: z.string().url().optional(),
  hlsUrl: z.string().url().optional(),
  staticFallbackUrl: z.string().url(),
  timelapseFallbackUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  scheduledOfflineStart: z.string().optional(), // ISO 8601
  scheduledOfflineEnd: z.string().optional(), // ISO 8601
  scheduledOfflineMessage: z.string().optional(),
  isActive: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type StreamConfig = z.infer<typeof streamConfigSchema>;

// Current stream health state
export const streamHealthSchema = z.object({
  streamId: z.string(),
  currentState: streamStateSchema,
  lastStateChange: z.string(), // ISO 8601
  bandwidthMbps: z.number().optional(),
  lastFrameTime: z.string().optional(), // ISO 8601
  errorMessage: z.string().optional(),
  checkedAt: z.string(), // ISO 8601
});

export type StreamHealth = z.infer<typeof streamHealthSchema>;

// A-2.3.4: Stream health log events
export const streamHealthEventTypeSchema = z.enum([
  'stream_start',
  'stream_stop',
  'bandwidth_degraded',
  'fallback_triggered',
  'recovery_completed',
  'error_occurred',
]);

export type StreamHealthEventType = z.infer<typeof streamHealthEventTypeSchema>;

export const streamHealthEventSchema = z.object({
  eventId: z.string(),
  streamId: z.string(),
  eventType: streamHealthEventTypeSchema,
  stateFrom: streamStateSchema.nullable(),
  stateTo: streamStateSchema,
  durationSeconds: z.number().nonnegative().optional(),
  failureReason: z.string().optional(),
  bandwidthMbps: z.number().optional(),
  occurredAt: z.string(), // ISO 8601
});

export type StreamHealthEvent = z.infer<typeof streamHealthEventSchema>;

// A-2.3.6: No membership prompts - stream is free/unauthenticated
// Newsletter capture is allowed per amendment
export const streamViewerInteractionSchema = z.object({
  interactionId: z.string(),
  streamId: z.string(),
  interactionType: z.enum(['viewed', 'newsletter_signup', 'share']),
  sessionId: z.string().optional(),
  guestEmailHash: z.string().optional(),
  occurredAt: z.string(),
});

export type StreamViewerInteraction = z.infer<typeof streamViewerInteractionSchema>;
