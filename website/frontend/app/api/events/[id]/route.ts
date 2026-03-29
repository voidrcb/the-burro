import { NextRequest, NextResponse } from 'next/server';

import {
  getEvent,
  updateEvent,
  transitionEventStatus,
  addSession,
  updateSession,
  removeSession,
  addPricingTier,
  updatePricingTier,
  scheduleCommunication,
  updateCommunication,
} from '@/lib/events/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error getting event:', error);
    return NextResponse.json(
      { error: 'Failed to get event' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    let event;

    switch (action) {
      case 'transition_status':
        if (!body.status || !body.changedBy) {
          return NextResponse.json(
            { error: 'status and changedBy required' },
            { status: 400 }
          );
        }
        event = await transitionEventStatus(id, body.status, body.changedBy, body.reason);
        break;

      case 'add_session':
        event = await addSession(id, body.session);
        break;

      case 'update_session':
        if (!body.sessionId) {
          return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        }
        event = await updateSession(id, body.sessionId, body.updates);
        break;

      case 'remove_session':
        if (!body.sessionId) {
          return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        }
        event = await removeSession(id, body.sessionId);
        break;

      case 'add_pricing_tier':
        event = await addPricingTier(id, body.tier);
        break;

      case 'update_pricing_tier':
        if (!body.tierId) {
          return NextResponse.json({ error: 'tierId required' }, { status: 400 });
        }
        event = await updatePricingTier(id, body.tierId, body.updates);
        break;

      case 'schedule_communication':
        event = await scheduleCommunication(id, body.communication);
        break;

      case 'update_communication':
        if (!body.commId) {
          return NextResponse.json({ error: 'commId required' }, { status: 400 });
        }
        event = await updateCommunication(id, body.commId, body.updates);
        break;

      default:
        // General update
        event = await updateEvent(id, body);
    }

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error updating event:', error);
    const message = error instanceof Error ? error.message : 'Failed to update event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
