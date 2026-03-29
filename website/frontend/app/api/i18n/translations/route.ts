import { NextRequest, NextResponse } from 'next/server';

import {
  createTranslation,
  listTranslations,
  getTranslationCoverage,
  importTranslations,
} from '@/lib/i18n/store';
import type { Locale, TranslationStatus } from '@/lib/i18n/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') as Locale | null;
    const namespace = searchParams.get('namespace');
    const status = searchParams.get('status') as TranslationStatus | null;
    const coverage = searchParams.get('coverage') === 'true';
    const includeDeprecated = searchParams.get('includeDeprecated') === 'true';

    // Get coverage stats
    if (coverage && locale) {
      const stats = await getTranslationCoverage(locale);
      return NextResponse.json({ coverage: stats });
    }

    // List translations
    const translations = await listTranslations({
      locale: locale ?? undefined,
      namespace: namespace ?? undefined,
      status: status ?? undefined,
      includeDeprecated,
    });

    return NextResponse.json({ translations });
  } catch (error) {
    console.error('Error listing translations:', error);
    return NextResponse.json(
      { error: 'Failed to list translations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Bulk import
    if (Array.isArray(body.records)) {
      const imported = await importTranslations(body.records);
      return NextResponse.json({ imported: imported.length }, { status: 201 });
    }

    // Single creation
    const translation = await createTranslation({
      sourceKey: body.sourceKey,
      sourceLocale: body.sourceLocale ?? 'en',
      targetLocale: body.targetLocale,
      sourceText: body.sourceText,
      translatedText: body.translatedText,
      machineTranslated: body.machineTranslated ?? false,
      humanEdited: body.humanEdited ?? false,
      namespace: body.namespace,
      context: body.context,
    });

    return NextResponse.json({ translation }, { status: 201 });
  } catch (error) {
    console.error('Error creating translation:', error);
    return NextResponse.json(
      { error: 'Failed to create translation' },
      { status: 500 }
    );
  }
}
