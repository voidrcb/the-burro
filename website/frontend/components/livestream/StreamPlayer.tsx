'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import type { StreamConfig, StreamHealth, StreamState } from '@/lib/livestream/types';
import { STREAM_STATE_META } from '@/lib/livestream/types';

type StreamPlayerProps = {
  initialConfig: StreamConfig | null;
  initialHealth: StreamHealth | null;
  showNewsletterCapture?: boolean;
};

// State indicator colors per A-2.3.3
const STATE_COLORS: Record<StreamState, string> = {
  live: 'bg-green-500',
  low_bandwidth: 'bg-yellow-500',
  static_fallback: 'bg-orange-400',
  timelapse_fallback: 'bg-orange-400',
  scheduled_offline: 'bg-gray-400',
  error_recovery: 'bg-red-500',
};

export function StreamPlayer({
  initialConfig,
  initialHealth,
  showNewsletterCapture = true,
}: StreamPlayerProps) {
  const [config, setConfig] = useState(initialConfig);
  const [health, setHealth] = useState(initialHealth);
  const [isLoading, setIsLoading] = useState(true);

  // Poll for health updates every 30 seconds
  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch('/api/livestream/health');
        const data = await res.json();
        if (data.config) setConfig(data.config);
        if (data.health) setHealth(data.health);
      } catch {
        // Silently fail - graceful degradation
      } finally {
        setIsLoading(false);
      }
    }

    // Initial fetch
    fetchHealth();

    // Poll every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Log view interaction (A-2.3.6 compliant - no monetization)
  useEffect(() => {
    if (config?.id) {
      fetch('/api/livestream/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamId: config.id,
          interactionType: 'viewed',
        }),
      }).catch(() => {
        // Silently fail
      });
    }
  }, [config?.id]);

  const currentState = health?.currentState ?? 'scheduled_offline';
  const stateMeta = STREAM_STATE_META[currentState];

  // Determine what to display based on state per A-2.3.3
  function renderContent() {
    if (isLoading) {
      return (
        <div className="flex aspect-video items-center justify-center bg-surface-base">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-accent-earth border-t-transparent" />
            <p className="mt-4 text-sm text-text-muted">Loading stream...</p>
          </div>
        </div>
      );
    }

    if (!config) {
      return (
        <div className="flex aspect-video items-center justify-center bg-surface-base">
          <div className="text-center">
            <p className="text-lg font-semibold text-text-strong">Stream Coming Soon</p>
            <p className="mt-2 text-sm text-text-muted">
              We&apos;re preparing a live view from Big Bend for you.
            </p>
          </div>
        </div>
      );
    }

    switch (currentState) {
      case 'live':
      case 'low_bandwidth':
        // Show live stream (embed or HLS)
        if (config.embedUrl) {
          return (
            <iframe
              src={config.embedUrl}
              className="aspect-video w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={config.name}
            />
          );
        }
        if (config.hlsUrl) {
          return (
            <video
              className="aspect-video w-full bg-black"
              controls
              autoPlay
              muted
              playsInline
            >
              <source src={config.hlsUrl} type="application/x-mpegURL" />
              Your browser does not support HLS streaming.
            </video>
          );
        }
        // Fallback to static if no live URL
        return (
          <div className="relative aspect-video w-full">
            <Image
              src={config.staticFallbackUrl}
              alt={config.name}
              fill
              className="object-cover"
            />
          </div>
        );

      case 'timelapse_fallback':
        // Show timelapse video
        if (config.timelapseFallbackUrl) {
          return (
            <video
              className="aspect-video w-full bg-black"
              controls
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={config.timelapseFallbackUrl} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          );
        }
        // Fallthrough to static if no timelapse
        return (
          <div className="relative aspect-video w-full">
            <Image
              src={config.staticFallbackUrl}
              alt={config.name}
              fill
              className="object-cover"
            />
          </div>
        );

      case 'static_fallback':
      case 'error_recovery':
        // Show static fallback image
        return (
          <div className="relative aspect-video w-full">
            <Image
              src={config.staticFallbackUrl}
              alt={config.name}
              fill
              className="object-cover"
            />
          </div>
        );

      case 'scheduled_offline':
        // Show scheduled offline notice
        return (
          <div className="flex aspect-video items-center justify-center bg-surface-base">
            <div className="text-center px-6">
              {config.thumbnailUrl && (
                <div className="relative mx-auto mb-4 h-32 w-auto flex justify-center">
                  <Image
                    src={config.thumbnailUrl}
                    alt={config.name}
                    height={128}
                    width={200}
                    className="rounded-lg opacity-50 object-contain"
                  />
                </div>
              )}
              <p className="text-lg font-semibold text-text-strong">
                {config.scheduledOfflineMessage ?? 'Stream Offline for Maintenance'}
              </p>
              {config.scheduledOfflineEnd && (
                <p className="mt-2 text-sm text-text-muted">
                  Expected back: {new Date(config.scheduledOfflineEnd).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="relative aspect-video w-full">
            <Image
              src={config.staticFallbackUrl}
              alt={config.name}
              fill
              className="object-cover"
            />
          </div>
        );
    }
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-text-strong/10 bg-white shadow-soft">
      {/* Stream container */}
      <div className="relative">
        {renderContent()}

        {/* State indicator overlay per A-2.3.3 */}
        {config && (
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5">
            <div className={`h-2 w-2 rounded-full ${STATE_COLORS[currentState]} ${currentState === 'live' ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-semibold text-white">
              {stateMeta.publicMessage}
            </span>
          </div>
        )}
      </div>

      {/* Stream info */}
      {config && (
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-xl text-text-strong">{config.name}</h3>
              <p className="mt-1 text-sm text-text-muted">{config.description}</p>
            </div>
            <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-earth">
              {config.type === 'night_sky' ? 'Dark Sky' : 'Scenic'}
            </span>
          </div>

          {/* A-2.3.6: Soft newsletter capture allowed (no membership/donation prompts) */}
          {showNewsletterCapture && (
            <div className="mt-5 rounded-lg bg-surface-base/60 p-4">
              <p className="text-sm font-semibold text-text-strong">
                Get updates on stream schedules
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Sign up for our newsletter to know when special events are streaming.
              </p>
              <a
                href="/#newsletter"
                className="mt-3 inline-block rounded-full bg-accent-earth px-4 py-2 text-sm font-semibold text-white"
              >
                Subscribe to Newsletter
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
