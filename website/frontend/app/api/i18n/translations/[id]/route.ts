import { NextRequest, NextResponse } from 'next/server';

import {
  getTranslation,
  updateTranslation,
  transitionTranslationStatus,
  markAsHumanEdited,
} from '@/lib/i18n/store';
import type { Locale, TranslationStatus } from '@/lib/i18n/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') as Locale;
    const namespace = searchParams.get('namespace');

    if (!locale || !namespace) {
      return NextResponse.json(
        { error: 'locale and namespace required' },
        { status: 400 }
      );
    }

    const translation = await getTranslation(locale, namespace, id);

    if (!translation) {
      return NextResponse.json({ error: 'Translation not found' }, { status: 404 });
    }

    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Error getting translation:', error);
    return NextResponse.json(
      { error: 'Failed to get translation' },
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
    const { locale, namespace, action } = body;

    if (!locale || !namespace) {
      return NextResponse.json(
        { error: 'locale and namespace required' },
        { status: 400 }
      );
    }

    let translation;

    // Handle status transitions
    if (action === 'transition' && body.newStatus) {
      translation = await transitionTranslationStatus(
        locale as Locale,
        namespace,
        id,
        body.newStatus as TranslationStatus,
        body.actorId ?? 'system'
      );
      return NextResponse.json({ translation });
    }

    // Handle human edit marking
    if (action === 'human_edit' && body.newText) {
      translation = await markAsHumanEdited(
        locale as Locale,
        namespace,
        id,
        body.editorId ?? 'system',
        body.newText
      );
      if (!translation) {
        return NextResponse.json({ error: 'Translation not found' }, { status: 404 });
      }
      return NextResponse.json({ translation });
    }

    // Handle general updates
    translation = await updateTranslation(locale as Locale, namespace, id, body.updates ?? body);

    if (!translation) {
      return NextResponse.json({ error: 'Translation not found' }, { status: 404 });
    }

    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Error updating translation:', error);
    const message = error instanceof Error ? error.message : 'Failed to update translation';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
