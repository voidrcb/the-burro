'use client';

import { useState, useEffect, useCallback } from 'react';

interface EventSession {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionType: string;
}

interface EventOperation {
  id: string;
  slug: string;
  name: string;
  eventType: string;
  dateRange: { start: string; end: string };
  status: string;
  capacityTotal: number;
  registeredCount: number;
  waitlistCount: number;
  sessions: EventSession[];
  venue: string;
  createdAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const loadEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.set('status', filter);
      }

      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load events');
      }

      setEvents(data.events || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-gray-100 text-gray-800',
      registration_open: 'bg-green-100 text-green-800',
      sold_out: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      conservation_gathering: 'Conservation Gathering',
      symposium: 'Symposium',
      maker_market: 'Maker Market',
      retreat_summit: 'Retreat Summit',
    };
    return labels[type] || type;
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (start === end) {
      return startDate.toLocaleDateString();
    }

    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  const getCapacityPercent = (registered: number, total: number) => {
    return Math.round((registered / total) * 100);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Event Operations</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Operations</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="registration_open">Registration Open</option>
            <option value="sold_out">Sold Out</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No events found</p>
          <p className="text-sm mt-2">Create an event to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{event.name}</h2>
                  <p className="text-gray-600 text-sm">
                    {getEventTypeLabel(event.eventType)} at {event.venue}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}
                >
                  {event.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Dates</p>
                  <p className="font-medium">
                    {formatDateRange(event.dateRange.start, event.dateRange.end)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sessions</p>
                  <p className="font-medium">{event.sessions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-medium">
                    {event.registeredCount} / {event.capacityTotal}
                    {event.waitlistCount > 0 && (
                      <span className="text-yellow-600 ml-1">
                        (+{event.waitlistCount} waitlist)
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fill Rate</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${getCapacityPercent(event.registeredCount, event.capacityTotal)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {getCapacityPercent(event.registeredCount, event.capacityTotal)}%
                    </span>
                  </div>
                </div>
              </div>

              {event.sessions.length > 0 && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <p className="text-sm text-gray-500 mb-2">Sessions</p>
                  <div className="flex flex-wrap gap-2">
                    {event.sessions.slice(0, 5).map((session) => (
                      <span
                        key={session.id}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                      >
                        {session.name} ({session.sessionType})
                      </span>
                    ))}
                    {event.sessions.length > 5 && (
                      <span className="text-gray-500 text-sm">
                        +{event.sessions.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
