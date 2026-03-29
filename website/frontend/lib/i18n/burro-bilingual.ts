/**
 * Burro Bilingual Behavior Constraints per A-3.1.5 (DEC-057)
 *
 * Language detection, approved-phrase-only responses,
 * English fallback with acknowledgment.
 */

import { getApprovedTranslations } from './store';
import { getMessages } from './messages';
import type { Locale } from './types';

// Spanish keywords for language detection
const SPANISH_GREETINGS = [
  'hola',
  'buenos dias',
  'buenas tardes',
  'buenas noches',
  'que tal',
  'como esta',
  'como estas',
];

const SPANISH_KEYWORDS = [
  'quiero',
  'necesito',
  'puedo',
  'donde',
  'cuando',
  'cuanto',
  'como',
  'por favor',
  'gracias',
  'ayuda',
  'reserva',
  'reservar',
  'hospedaje',
  'taller',
  'experiencia',
  'precio',
  'disponible',
  'informacion',
];

// Common Spanish question patterns
const SPANISH_PATTERNS = [
  /\bque\s/i,
  /\bdonde\s/i,
  /\bcuando\s/i,
  /\bcomo\s/i,
  /\bcuanto\s/i,
  /\bpuedo\s/i,
  /\btiene[ns]?\s/i,
  /\bhay\s/i,
];

/**
 * Detect if query appears to be in Spanish
 * Simple heuristic: starts with Spanish greeting or contains Spanish keywords
 */
export function detectQueryLanguage(query: string): Locale {
  const normalizedQuery = query.toLowerCase().trim();

  // Check for Spanish greetings at start
  for (const greeting of SPANISH_GREETINGS) {
    if (normalizedQuery.startsWith(greeting)) {
      return 'es';
    }
  }

  // Count Spanish keyword matches
  let spanishScore = 0;
  for (const keyword of SPANISH_KEYWORDS) {
    if (normalizedQuery.includes(keyword)) {
      spanishScore++;
    }
  }

  // Check for Spanish patterns
  for (const pattern of SPANISH_PATTERNS) {
    if (pattern.test(normalizedQuery)) {
      spanishScore++;
    }
  }

  // If we have 2+ Spanish indicators, treat as Spanish
  return spanishScore >= 2 ? 'es' : 'en';
}

/**
 * Get response in the appropriate language
 * Returns translated response if approved translation exists,
 * otherwise falls back to English with Spanish acknowledgment
 */
export async function getBilingualResponse(
  templateKey: string,
  namespace: string,
  detectedLocale: Locale,
  fallbackEnglishText: string
): Promise<{ text: string; locale: Locale; wasFallback: boolean }> {
  if (detectedLocale === 'en') {
    return {
      text: fallbackEnglishText,
      locale: 'en',
      wasFallback: false,
    };
  }

  // Try to get approved Spanish translation
  const translations = await getApprovedTranslations('es', namespace);
  const translatedText = translations.get(templateKey);

  if (translatedText) {
    return {
      text: translatedText,
      locale: 'es',
      wasFallback: false,
    };
  }

  // No approved translation - fallback to English with acknowledgment
  const messages = getMessages('es');
  const acknowledgment = messages.assistant.fallback.spanishAcknowledgment;

  return {
    text: `${acknowledgment}\n\n${fallbackEnglishText}`,
    locale: 'en',
    wasFallback: true,
  };
}

/**
 * Check if a response template has an approved translation
 */
export async function hasApprovedTranslation(
  templateKey: string,
  namespace: string,
  locale: Locale
): Promise<boolean> {
  if (locale === 'en') return true;

  const translations = await getApprovedTranslations(locale, namespace);
  return translations.has(templateKey);
}

/**
 * Get safe bilingual greeting based on detected language
 */
export function getBilingualGreeting(detectedLocale: Locale): string {
  const messages = getMessages(detectedLocale);
  return messages.assistant.greetings.welcome;
}

/**
 * Format a "contact operator" fallback message
 * Used when query cannot be handled with approved content
 */
export function getContactOperatorMessage(detectedLocale: Locale): string {
  const messages = getMessages(detectedLocale);
  return messages.assistant.responses.contactOperator;
}

/**
 * Bilingual response builder for assistant
 */
export interface BilingualResponseContext {
  queryLocale: Locale;
  responseLocale: Locale;
  usedFallback: boolean;
  approvedPhraseUsed: boolean;
}

export async function buildBilingualResponse(
  query: string,
  responseTemplateKey: string,
  namespace: string,
  englishResponse: string
): Promise<{
  response: string;
  context: BilingualResponseContext;
}> {
  const queryLocale = detectQueryLanguage(query);
  const result = await getBilingualResponse(
    responseTemplateKey,
    namespace,
    queryLocale,
    englishResponse
  );

  return {
    response: result.text,
    context: {
      queryLocale,
      responseLocale: result.locale,
      usedFallback: result.wasFallback,
      approvedPhraseUsed: !result.wasFallback,
    },
  };
}

/**
 * Approved phrase checker for policy/safety content
 * NEVER generate machine-translated policy content on-the-fly per A-3.1.5
 */
export async function canRespondInSpanish(
  templateKey: string,
  namespace: string,
  isPolicyContent: boolean
): Promise<{ canRespond: boolean; reason?: string }> {
  const hasTranslation = await hasApprovedTranslation(templateKey, namespace, 'es');

  if (hasTranslation) {
    return { canRespond: true };
  }

  if (isPolicyContent) {
    return {
      canRespond: false,
      reason: 'Policy content requires approved translation. Cannot generate on-the-fly.',
    };
  }

  return {
    canRespond: false,
    reason: 'No approved translation available. Will use English fallback.',
  };
}

/**
 * Language preference indicators for UI
 */
export function getLanguageIndicator(locale: Locale): {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
} {
  const indicators: Record<Locale, { code: string; name: string; nativeName: string; flag: string }> = {
    en: {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: 'US',
    },
    es: {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Espanol',
      flag: 'MX',
    },
  };

  return indicators[locale];
}
