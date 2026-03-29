import { NextRequest, NextResponse } from 'next/server';

import {
  createPartner,
  listPartners,
  listApprovedPartners,
} from '@/lib/partner/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const approvedOnly = searchParams.get('approved') === 'true';

    if (approvedOnly) {
      const partners = await listApprovedPartners();
      return NextResponse.json({ partners });
    }

    const partners = await listPartners({
      status: status as 'pending' | 'approved' | 'suspended' | 'inactive' | undefined,
      category: category as 'guide' | 'artisan' | 'observatory' | 'preservation_org' | 'local_maker' | 'hospitality' | 'transport' | undefined,
    });

    return NextResponse.json({ partners });
  } catch (error) {
    console.error('Error listing partners:', error);
    return NextResponse.json(
      { error: 'Failed to list partners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const partner = await createPartner({
      slug: body.slug,
      legalName: body.legalName,
      displayName: body.displayName,
      contact: body.contact,
      category: body.category,
      approvalStatus: body.approvalStatus ?? 'pending',
      liability: body.liability ?? {
        waiverAccepted: false,
        insuranceVerified: false,
      },
      revenueModel: body.revenueModel ?? 'commission_pct',
      defaultCommissionRate: body.defaultCommissionRate,
      cmsRights: body.cmsRights ?? {
        canPublish: false,
        requiresReview: true,
        publishedExperienceCount: 0,
      },
      serviceArea: body.serviceArea,
      physicalAddress: body.physicalAddress,
      onboardedBy: body.onboardedBy ?? 'operator',
      notes: body.notes,
    });

    return NextResponse.json({ partner }, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}
