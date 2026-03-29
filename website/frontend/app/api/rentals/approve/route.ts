import { NextResponse } from 'next/server';
import { z } from 'zod';

import { logAnalyticsEvent } from '@/lib/analytics/store';
import { getRentalAssetById } from '@/lib/content/rentals';
import {
  getQuoteRequest,
  updateQuoteRequest,
  createRentalBooking,
  calculateRentalPricing,
  getRentalDayCount,
} from '@/lib/rental/store';

const approveInputSchema = z.object({
  quoteRequestId: z.string().min(1),
  operatorId: z.string().min(1),
  operatorNotes: z.string().optional(),
  // Optional overrides
  adjustedDailyRate: z.number().positive().optional(),
  adjustedDeliveryFee: z.number().nonnegative().optional(),
  deliveryScheduled: z.string().optional(),
  pickupScheduled: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = approveInputSchema.parse(body);

    // Get quote request
    const quoteRequest = await getQuoteRequest(input.quoteRequestId);
    if (!quoteRequest) {
      return NextResponse.json({ error: 'Quote request not found.' }, { status: 404 });
    }

    if (quoteRequest.status !== 'pending') {
      return NextResponse.json(
        { error: `Quote request is already ${quoteRequest.status}.` },
        { status: 400 }
      );
    }

    // Get asset
    const asset = await getRentalAssetById(quoteRequest.assetId);
    if (!asset) {
      return NextResponse.json({ error: 'Rental asset not found.' }, { status: 404 });
    }

    // Calculate final pricing (allow operator overrides)
    const totalDays = getRentalDayCount(quoteRequest.requestedStartDate, quoteRequest.requestedEndDate);
    const dailyRate = input.adjustedDailyRate ?? asset.dailyRate;
    const deliveryFee = quoteRequest.deliveryRequired
      ? (input.adjustedDeliveryFee ?? asset.deliveryFee)
      : 0;

    const pricing = calculateRentalPricing(
      dailyRate,
      totalDays,
      deliveryFee,
      asset.depositRequired
    );

    // Create the rental booking in 'quoted' state
    const booking = await createRentalBooking({
      quoteRequestId: quoteRequest.id,
      assetId: asset.id,
      assetName: asset.name,
      customerName: quoteRequest.customerName,
      customerEmail: quoteRequest.customerEmail,
      customerPhone: quoteRequest.customerPhone,
      startDate: quoteRequest.requestedStartDate,
      endDate: quoteRequest.requestedEndDate,
      deliveryRequired: quoteRequest.deliveryRequired,
      deliveryAddress: quoteRequest.deliveryAddress,
      deliveryScheduled: input.deliveryScheduled,
      pickupScheduled: input.pickupScheduled,
      dailyRate,
      totalDays,
      subtotal: pricing.subtotal,
      deliveryFee: pricing.deliveryFee,
      taxAmount: pricing.taxAmount,
      depositAmount: pricing.depositAmount,
      totalAmount: pricing.totalAmount,
      maintenanceFlag: false, // New bookings start without maintenance flag
      approvedBy: input.operatorId,
      operatorNotes: input.operatorNotes,
    });

    // Update quote request status
    await updateQuoteRequest(quoteRequest.id, {
      status: 'approved',
      operatorNotes: input.operatorNotes,
    });

    // A-2.3.1: Server-side analytics event per HF-907
    await logAnalyticsEvent('rental_approved', '/api/rentals/approve', {
      guestEmail: quoteRequest.customerEmail,
      metadata: {
        bookingId: booking.id,
        quoteRequestId: quoteRequest.id,
        assetId: asset.id,
        assetName: asset.name,
        totalDays,
        totalAmount: pricing.totalAmount,
        approvedBy: input.operatorId,
      },
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      booking,
      message: 'Quote approved and rental booking created.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to approve quote.' },
      { status: 500 }
    );
  }
}
