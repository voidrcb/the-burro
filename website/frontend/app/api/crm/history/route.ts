import { NextRequest, NextResponse } from 'next/server';

import { getEventHistory, getActiveEmails } from '@/lib/crm/history';
import type { ExtendedEventType } from '@/lib/crm/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const profileId = searchParams.get('profileId');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const limit = searchParams.get('limit');
    const eventTypes = searchParams.get('eventTypes');
    const activeEmails = searchParams.get('activeEmails') === 'true';

    if (activeEmails) {
      const emails = await getActiveEmails({
        fromDate: fromDate ?? undefined,
        eventTypes: eventTypes?.split(','),
      });
      return NextResponse.json({ emails });
    }

    const events = await getEventHistory({
      email: email ?? undefined,
      profileId: profileId ?? undefined,
      fromDate: fromDate ?? undefined,
      toDate: toDate ?? undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      eventTypes: eventTypes ? (eventTypes.split(',') as ExtendedEventType[]) : undefined,
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error getting event history:', error);
    return NextResponse.json(
      { error: 'Failed to get event history' },
      { status: 500 }
    );
  }
}
