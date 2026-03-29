import { NextRequest, NextResponse } from 'next/server';

import {
  createMarketplaceItem,
  listMarketplaceItems,
  listPublishedMarketplaceItems,
  listPendingReviewItems,
} from '@/lib/partner/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const itemType = searchParams.get('itemType');
    const state = searchParams.get('state');
    const publishedOnly = searchParams.get('published') === 'true';
    const pendingReview = searchParams.get('pendingReview') === 'true';

    if (publishedOnly) {
      const items = await listPublishedMarketplaceItems();
      return NextResponse.json({ items });
    }

    if (pendingReview) {
      const items = await listPendingReviewItems();
      return NextResponse.json({ items });
    }

    const items = await listMarketplaceItems({
      partnerId: partnerId ?? undefined,
      itemType: itemType as 'experience' | 'goods' | undefined,
      state: state as 'draft' | 'pending_review' | 'approved' | 'published' | 'suspended' | 'archived' | undefined,
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error listing marketplace items:', error);
    return NextResponse.json(
      { error: 'Failed to list marketplace items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const item = await createMarketplaceItem({
      partnerId: body.partnerId,
      itemType: body.itemType,
      itemRef: body.itemRef,
      reviewerRequired: body.reviewerRequired ?? true,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Error creating marketplace item:', error);
    return NextResponse.json(
      { error: 'Failed to create marketplace item' },
      { status: 500 }
    );
  }
}
