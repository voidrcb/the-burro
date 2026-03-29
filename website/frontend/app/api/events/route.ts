import { NextRequest, NextResponse } from 'next/server';

import {
  createEvent,
  listEvents,
  getEventBySlug,
} from '@/lib/events/store';
import type { EventQueryOptions } from '@/lib/events/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const status = searchParams.get('status');
    const eventType = searchParams.get('eventType');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const limit = searchParams.get('limit');

    if (slug) {
      const event = await getEventBySlug(slug);
      return NextResponse.json({ event });
    }

    const options: EventQueryOptions = {};

    if (status) {
      options.status = status.split(',') as EventQueryOptions['status'];
    }

    if (eventType) {
      options.eventType = eventType.split(',') as EventQueryOptions['eventType'];
    }

    if (fromDate) options.fromDate = fromDate;
    if (toDate) options.toDate = toDate;
    if (limit) options.limit = parseInt(limit, 10);

    const events = await listEvents(options);
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error listing events:', error);
    return NextResponse.json(
      { error: 'Failed to list events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = await createEvent({
      slug: body.slug,
      name: body.name,
      tagline: body.tagline,
      description: body.description,
      eventType: body.eventType,
      dateRange: body.dateRange,
      capacityTotal: body.capacityTotal,
      registrationOpen: body.registrationOpen,
      registrationClose: body.registrationClose,
      venue: body.venue,
      venueAddress: body.venueAddress,
      locationNotes: body.locationNotes,
      heroImageUrl: body.heroImageUrl,
      createdBy: body.createdBy ?? 'api',
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    const message = error instanceof Error ? error.message : 'Failed to create event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
