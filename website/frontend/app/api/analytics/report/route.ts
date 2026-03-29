import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  generateMonthlyReport,
  getMonthlyReport,
  listAvailableReports,
} from '@/lib/analytics/store';

const postSchema = z.object({
  year: z.number().int().min(2024).max(2030),
  month: z.number().int().min(1).max(12),
});

const getSchema = z.object({
  year: z.string().regex(/^\d{4}$/).optional(),
  month: z.string().regex(/^(0?[1-9]|1[0-2])$/).optional(),
});

// POST /api/analytics/report - Generate monthly report per HF-908
export async function POST(request: Request) {
  try {
    const body = postSchema.parse(await request.json());

    const report = await generateMonthlyReport(body.year, body.month);

    return NextResponse.json({ report });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/analytics/report - Get existing report or list available
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = getSchema.parse({
      year: url.searchParams.get('year') ?? undefined,
      month: url.searchParams.get('month') ?? undefined,
    });

    // If year and month provided, get specific report
    if (params.year && params.month) {
      const report = await getMonthlyReport(
        parseInt(params.year, 10),
        parseInt(params.month, 10)
      );

      if (!report) {
        return NextResponse.json(
          { error: 'Report not found. Generate it first via POST.' },
          { status: 404 }
        );
      }

      return NextResponse.json({ report });
    }

    // Otherwise, list available reports
    const reports = await listAvailableReports();
    return NextResponse.json({ availableReports: reports });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
