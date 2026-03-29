import { NextRequest, NextResponse } from 'next/server';

import {
  createRecommendationRule,
  listRecommendationRules,
  listRecommendations,
  dismissRecommendation,
  acceptRecommendation,
} from '@/lib/crm/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rules = searchParams.get('rules') === 'true';
    const profileId = searchParams.get('profileId');
    const includeDismissed = searchParams.get('includeDismissed') === 'true';
    const enabledOnly = searchParams.get('enabledOnly') === 'true';

    if (rules) {
      const rulesList = await listRecommendationRules({ enabledOnly });
      return NextResponse.json({ rules: rulesList });
    }

    const recommendations = await listRecommendations({
      profileId: profileId ?? undefined,
      includeDismissed,
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error listing recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to list recommendations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create rule
    if (body.isRule) {
      const rule = await createRecommendationRule({
        name: body.name,
        description: body.description,
        conditions: body.conditions,
        actions: body.actions,
        priority: body.priority ?? 0,
        enabled: body.enabled ?? true,
        validFrom: body.validFrom,
        validTo: body.validTo,
        createdBy: body.createdBy ?? 'api',
      });

      return NextResponse.json({ rule }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Use POST /api/crm/recommendations/generate to create recommendations' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating rule:', error);
    return NextResponse.json(
      { error: 'Failed to create rule' },
      { status: 500 }
    );
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

    let recommendation;

    if (action === 'dismiss') {
      recommendation = await dismissRecommendation(id);
    } else if (action === 'accept') {
      recommendation = await acceptRecommendation(id);
    } else {
      return NextResponse.json(
        { error: `Unknown action: ${action}` },
        { status: 400 }
      );
    }

    if (!recommendation) {
      return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
    }

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error('Error updating recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to update recommendation' },
      { status: 500 }
    );
  }
}
