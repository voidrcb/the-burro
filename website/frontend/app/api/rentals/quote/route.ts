import { NextResponse } from 'next/server';
import { z } from 'zod';

import { logAnalyticsEvent } from '@/lib/analytics/store';
import { getRentalAssetById, checkAssetAvailability } from '@/lib/content/rentals';
import { createQuoteRequest, calculateRentalPricing, getRentalDayCount } from '@/lib/rental/store';
import type { QuoteResponse } from '@/lib/rental/types';

const quoteRequestInputSchema = z.object({
  assetId: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  requestedStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  requestedEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  deliveryRequired: z.boolean(),
  deliveryAddress: z.string().optional(),
  intendedUse: z.string().min(10),
  previousRentalExperience: z.boolean(),
  insuranceConfirmed: z.boolean(),
  policyAcknowledged: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = quoteRequestInputSchema.parse(body);

    // Validate asset exists
    const asset = await getRentalAssetById(input.assetId);
    if (!asset) {
      return NextResponse.json({ error: 'Rental asset not found.' }, { status: 404 });
    }

    // Check availability
    const availability = await checkAssetAvailability(
      input.assetId,
      input.requestedStartDate,
      input.requestedEndDate
    );
    if (!availability.available) {
      return NextResponse.json(
        { error: `Asset is not available: ${availability.reason}` },
        { status: 400 }
      );
    }

    // Calculate pricing
    const totalDays = getRentalDayCount(input.requestedStartDate, input.requestedEndDate);
    const deliveryFee = input.deliveryRequired ? asset.deliveryFee : 0;
    const pricing = calculateRentalPricing(
      asset.dailyRate,
      totalDays,
      deliveryFee,
      asset.depositRequired
    );

    // Create quote request in database (pending operator approval per A-2.2.1)
    const quoteRequest = await createQuoteRequest({
      assetId: input.assetId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      requestedStartDate: input.requestedStartDate,
      requestedEndDate: input.requestedEndDate,
      deliveryRequired: input.deliveryRequired,
      deliveryAddress: input.deliveryAddress,
      intendedUse: input.intendedUse,
      previousRentalExperience: input.previousRentalExperience,
      insuranceConfirmed: input.insuranceConfirmed,
      policyAcknowledged: input.policyAcknowledged,
    });

    // Build quote response
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7); // Quote valid for 7 days

    const quoteResponse: QuoteResponse = {
      assetId: asset.id,
      assetName: asset.name,
      startDate: input.requestedStartDate,
      endDate: input.requestedEndDate,
      totalDays,
      dailyRate: asset.dailyRate,
      subtotal: pricing.subtotal,
      deliveryFee: pricing.deliveryFee,
      taxEstimate: pricing.taxAmount,
      depositRequired: pricing.depositAmount,
      totalEstimate: pricing.totalAmount,
      validUntil: validUntil.toISOString(),
    };

    // A-2.3.1: Server-side analytics event per HF-907
    await logAnalyticsEvent('rental_quote_requested', '/api/rentals/quote', {
      guestEmail: input.customerEmail,
      metadata: {
        quoteRequestId: quoteRequest.id,
        assetId: asset.id,
        assetName: asset.name,
        totalDays,
        totalEstimate: pricing.totalAmount,
      },
    });

    return NextResponse.json({
      quoteRequestId: quoteRequest.id,
      quote: quoteResponse,
      message: 'Quote request submitted. Our team will review and contact you within 24 hours to confirm availability and finalize your reservation.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to process quote request.' },
      { status: 500 }
    );
  }
}
