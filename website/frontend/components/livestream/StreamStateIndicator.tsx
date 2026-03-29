'use client';

import type { StreamState } from '@/lib/livestream/types';
import { STREAM_STATE_META } from '@/lib/livestream/types';

type StreamStateIndicatorProps = {
  state: StreamState;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

// Visual indicator colors per A-2.3.3
const INDICATOR_COLORS: Record<StreamState, { bg: string; text: string }> = {
  live: { bg: 'bg-green-100', text: 'text-green-700' },
  low_bandwidth: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  static_fallback: { bg: 'bg-orange-100', text: 'text-orange-700' },
  timelapse_fallback: { bg: 'bg-orange-100', text: 'text-orange-700' },
  scheduled_offline: { bg: 'bg-gray-100', text: 'text-gray-600' },
  error_recovery: { bg: 'bg-red-100', text: 'text-red-700' },
};

const DOT_COLORS: Record<StreamState, string> = {
  live: 'bg-green-500',
  low_bandwidth: 'bg-yellow-500',
  static_fallback: 'bg-orange-400',
  timelapse_fallback: 'bg-orange-400',
  scheduled_offline: 'bg-gray-400',
  error_recovery: 'bg-red-500',
};

const SIZE_CLASSES = {
  sm: { container: 'px-2 py-1', dot: 'h-1.5 w-1.5', text: 'text-xs' },
  md: { container: 'px-3 py-1.5', dot: 'h-2 w-2', text: 'text-sm' },
  lg: { container: 'px-4 py-2', dot: 'h-2.5 w-2.5', text: 'text-base' },
};

export function StreamStateIndicator({
  state,
  showDetails = false,
  size = 'md',
}: StreamStateIndicatorProps) {
  const stateMeta = STREAM_STATE_META[state];
  const colors = INDICATOR_COLORS[state];
  const dotColor = DOT_COLORS[state];
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <div className={showDetails ? 'space-y-2' : ''}>
      <div
        className={`inline-flex items-center gap-2 rounded-full ${colors.bg} ${sizeClasses.container}`}
      >
        <div
          className={`rounded-full ${dotColor} ${sizeClasses.dot} ${
            state === 'live' ? 'animate-pulse' : ''
          }`}
        />
        <span className={`font-semibold ${colors.text} ${sizeClasses.text}`}>
          {stateMeta.publicMessage}
        </span>
      </div>

      {showDetails && (
        <div className="text-sm text-text-muted">
          <p>
            <span className="font-medium">Recovery:</span> {stateMeta.recoveryCondition}
          </p>
        </div>
      )}
    </div>
  );
}

// Compact state badge for dashboards
export function StreamStateBadge({ state }: { state: StreamState }) {
  const dotColor = DOT_COLORS[state];

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className={`h-2 w-2 rounded-full ${dotColor} ${state === 'live' ? 'animate-pulse' : ''}`}
      />
      <span className="text-xs font-medium capitalize text-text-muted">
        {state.replace('_', ' ')}
      </span>
    </div>
  );
}
