/**
 * Locale Routing Configuration per A-3.1.1 (DEC-053)
 *
 * Path-based locale routing with Next.js i18n.
 * English at root, Spanish at /es/...
 * Cookie persistence with URL override.
 */

import type { Locale } from './types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, LOCALE_COOKIE_NAME, LOCALE_COOKIE_MAX_AGE } from './types';

// Next.js i18n configuration
export const i18nConfig = {
  defaultLocale: DEFAULT_LOCALE,
  locales: SUPPORTED_LOCALES,
  localeDetection: true, // Auto-detect from Accept-Language header
};

/**
 * Extract locale from path
 * /es/about -> 'es'
 * /about -> 'en'
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }

  return DEFAULT_LOCALE;
}

/**
 * Remove locale prefix from path
 * /es/about -> /about
 * /about -> /about
 */
export function removeLocaleFromPath(pathname: string): string {
  const locale = getLocaleFromPath(pathname);

  if (locale !== DEFAULT_LOCALE) {
    return pathname.replace(new RegExp(`^/${locale}`), '') || '/';
  }

  return pathname;
}

/**
 * Add locale prefix to path
 * /about, 'es' -> /es/about
 * /about, 'en' -> /about
 */
export function addLocaleToPath(pathname: string, locale: Locale): string {
  const cleanPath = removeLocaleFromPath(pathname);

  if (locale === DEFAULT_LOCALE) {
    return cleanPath;
  }

  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Build localized href for links
 */
export function localizedHref(pathname: string, locale: Locale): string {
  return addLocaleToPath(pathname, locale);
}

/**
 * Get alternate language URLs for SEO (hreflang)
 */
export function getAlternateUrls(
  pathname: string,
  baseUrl: string
): Array<{ locale: Locale; href: string }> {
  const cleanPath = removeLocaleFromPath(pathname);

  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
    href: `${baseUrl}${addLocaleToPath(cleanPath, locale)}`,
  }));
}

/**
 * Parse Accept-Language header to determine preferred locale
 */
export function parseAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;

  // Parse q-values and sort
  const languages = header
    .split(',')
    .map((lang) => {
      const [code, qValue] = lang.trim().split(';q=');
      return {
        code: code.split('-')[0].toLowerCase(), // 'en-US' -> 'en'
        q: qValue ? parseFloat(qValue) : 1,
      };
    })
    .sort((a, b) => b.q - a.q);

  // Find first supported locale
  for (const { code } of languages) {
    if (SUPPORTED_LOCALES.includes(code as Locale)) {
      return code as Locale;
    }
  }

  return DEFAULT_LOCALE;
}

/**
 * Create locale cookie value
 */
export function createLocaleCookie(locale: Locale): string {
  return `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

/**
 * Parse locale from cookie string
 */
export function parseLocaleCookie(cookieString: string | null): Locale | null {
  if (!cookieString) return null;

  const match = cookieString.match(new RegExp(`${LOCALE_COOKIE_NAME}=([^;]+)`));
  if (match && SUPPORTED_LOCALES.includes(match[1] as Locale)) {
    return match[1] as Locale;
  }

  return null;
}

/**
 * Determine effective locale from various sources
 * Priority: URL > Cookie > Accept-Language > Default
 */
export function determineLocale(
  pathname: string,
  cookieString: string | null,
  acceptLanguage: string | null
): Locale {
  // 1. Check URL
  const urlLocale = getLocaleFromPath(pathname);
  if (urlLocale !== DEFAULT_LOCALE) {
    return urlLocale;
  }

  // 2. Check cookie
  const cookieLocale = parseLocaleCookie(cookieString);
  if (cookieLocale) {
    return cookieLocale;
  }

  // 3. Check Accept-Language header
  return parseAcceptLanguage(acceptLanguage);
}

/**
 * Check if a redirect is needed based on locale preferences
 */
export function shouldRedirectForLocale(
  pathname: string,
  currentLocale: Locale,
  preferredLocale: Locale
): string | null {
  // Only redirect if URL doesn't have locale prefix and preference differs
  const urlLocale = getLocaleFromPath(pathname);

  // If URL already has correct locale, no redirect
  if (urlLocale === preferredLocale) {
    return null;
  }

  // If URL has no locale prefix and user prefers non-default
  if (urlLocale === DEFAULT_LOCALE && preferredLocale !== DEFAULT_LOCALE) {
    return addLocaleToPath(pathname, preferredLocale);
  }

  return null;
}

/**
 * Get canonical URL (always English/default locale)
 */
export function getCanonicalUrl(pathname: string, baseUrl: string): string {
  const cleanPath = removeLocaleFromPath(pathname);
  return `${baseUrl}${cleanPath}`;
}

/**
 * Language switcher data
 */
export interface LanguageSwitchOption {
  locale: Locale;
  label: string;
  nativeLabel: string;
  href: string;
  isCurrent: boolean;
}

export function getLanguageSwitchOptions(
  currentPath: string,
  currentLocale: Locale
): LanguageSwitchOption[] {
  const cleanPath = removeLocaleFromPath(currentPath);

  return [
    {
      locale: 'en',
      label: 'English',
      nativeLabel: 'English',
      href: cleanPath,
      isCurrent: currentLocale === 'en',
    },
    {
      locale: 'es',
      label: 'Spanish',
      nativeLabel: 'Espanol',
      href: `/es${cleanPath === '/' ? '' : cleanPath}`,
      isCurrent: currentLocale === 'es',
    },
  ];
}
