import { NextRequest, NextResponse } from 'next/server';

import {
  getPartner,
  updatePartner,
  updatePartnerApprovalStatus,
} from '@/lib/partner/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partner = await getPartner(id);

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({ partner });
  } catch (error) {
    console.error('Error getting partner:', error);
    return NextResponse.json(
      { error: 'Failed to get partner' },
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

    // Handle approval status changes separately for proper history tracking
    if (body.approvalStatus && body.changedBy) {
      const partner = await updatePartnerApprovalStatus(
        id,
        body.approvalStatus,
        body.changedBy,
        body.reason
      );

      if (!partner) {
        return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
      }

      return NextResponse.json({ partner });
    }

    // Handle other updates
    const partner = await updatePartner(id, body);

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({ partner });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { error: 'Failed to update partner' },
      { status: 500 }
    );
  }
}
