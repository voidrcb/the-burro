import { NextRequest, NextResponse } from 'next/server';

import {
  createCustomerProfile,
  listProfiles,
  getProfileByEmail,
  getOrCreateProfile,
} from '@/lib/crm/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
      const profile = await getProfileByEmail(email);
      return NextResponse.json({ profile });
    }

    const profiles = await listProfiles();
    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Error listing profiles:', error);
    return NextResponse.json(
      { error: 'Failed to list profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get or create mode
    if (body.getOrCreate && body.email) {
      const profile = await getOrCreateProfile(body.email);
      return NextResponse.json({ profile }, { status: 200 });
    }

    // Create new profile
    const profile = await createCustomerProfile({
      primaryEmail: body.email,
      displayName: body.displayName,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      tags: body.tags,
      communicationPreferences: body.communicationPreferences,
      createdBy: body.createdBy ?? 'api',
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    const message = error instanceof Error ? error.message : 'Failed to create profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
