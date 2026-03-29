import { NextRequest, NextResponse } from 'next/server';

import {
  createRegistration,
  listRegistrations,
  getRegistration,
  confirmRegistration,
  cancelRegistration,
  checkInRegistration,
} from '@/lib/events/store';
import type { RegistrationQueryOptions } from '@/lib/events/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const eventId = searchParams.get('eventId');
    const guestEmail = searchParams.get('guestEmail');
    const profileId = searchParams.get('profileId');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    if (id) {
      const registration = await getRegistration(id);
      return NextResponse.json({ registration });
    }

    const options: RegistrationQueryOptions = {};

    if (eventId) options.eventId = eventId;
    if (guestEmail) options.guestEmail = guestEmail;
    if (profileId) options.profileId = profileId;
    if (status) {
      options.status = status.split(',') as RegistrationQueryOptions['status'];
    }
    if (limit) options.limit = parseInt(limit, 10);

    const registrations = await listRegistrations(options);
    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Error listing registrations:', error);
    return NextResponse.json(
      { error: 'Failed to list registrations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const registration = await createRegistration({
      eventId: body.eventId,
      pricingTierId: body.pricingTierId,
      guestEmail: body.guestEmail,
      profileId: body.profileId,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      selectedSessions: body.selectedSessions,
      dietaryRequirements: body.dietaryRequirements,
      accessibilityNeeds: body.accessibilityNeeds,
      emergencyContact: body.emergencyContact,
      registeredBy: body.registeredBy,
    });

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    console.error('Error creating registration:', error);
    const message = error instanceof Error ? error.message : 'Failed to create registration';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: 'id and action required' },
        { status: 400 }
      );
    }

    let registration;

    switch (action) {
      case 'confirm':
        if (!body.paymentRef || body.amountPaid === undefined) {
          return NextResponse.json(
            { error: 'paymentRef and amountPaid required' },
            { status: 400 }
          );
        }
        registration = await confirmRegistration(id, body.paymentRef, body.amountPaid);
        break;

      case 'cancel':
        registration = await cancelRegistration(id, body.reason, body.refund ?? false);
        break;

      case 'check_in':
        if (!body.checkedInBy) {
          return NextResponse.json(
            { error: 'checkedInBy required' },
            { status: 400 }
          );
        }
        registration = await checkInRegistration(id, body.checkedInBy);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ registration });
  } catch (error) {
    console.error('Error updating registration:', error);
    const message = error instanceof Error ? error.message : 'Failed to update registration';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
