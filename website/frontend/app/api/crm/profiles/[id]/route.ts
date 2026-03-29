import { NextRequest, NextResponse } from 'next/server';

import {
  getProfile,
  updateProfile,
  updateCommunicationPreferences,
  unsubscribeProfile,
  mergeProfiles,
  computeProfileStats,
} from '@/lib/crm/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('stats') === 'true';

    const profile = await getProfile(id);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (includeStats) {
      const stats = await computeProfileStats(id);
      return NextResponse.json({ profile: { ...profile, stats } });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error getting profile:', error);
    return NextResponse.json(
      { error: 'Failed to get profile' },
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

    let profile;

    switch (action) {
      case 'update_preferences':
        profile = await updateCommunicationPreferences(id, body.preferences);
        break;

      case 'unsubscribe':
        profile = await unsubscribeProfile(id, body.reason);
        break;

      case 'merge':
        if (!body.sourceProfileId || !body.mergedBy) {
          return NextResponse.json(
            { error: 'sourceProfileId and mergedBy required for merge' },
            { status: 400 }
          );
        }
        profile = await mergeProfiles(id, body.sourceProfileId, body.mergedBy, body.reason);
        break;

      default:
        // General update
        profile = await updateProfile(id, body);
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
