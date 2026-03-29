import { NextRequest, NextResponse } from 'next/server';

import {
  getMarketplaceItem,
  transitionMarketplaceItemState,
} from '@/lib/partner/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await getMarketplaceItem(id);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error getting marketplace item:', error);
    return NextResponse.json(
      { error: 'Failed to get marketplace item' },
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

    // Handle state transitions
    if (body.targetState && body.operatorId) {
      const item = await transitionMarketplaceItemState(
        id,
        body.targetState,
        body.operatorId,
        body.notes
      );

      return NextResponse.json({ item });
    }

    return NextResponse.json(
      { error: 'targetState and operatorId required for state transition' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating marketplace item:', error);
    const message = error instanceof Error ? error.message : 'Failed to update marketplace item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
