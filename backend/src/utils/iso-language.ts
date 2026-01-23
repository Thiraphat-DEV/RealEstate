/**
 * ISO 639-1 Language Codes
 * Reference: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */

export interface Language {
  code: string; // ISO 639-1 code (e.g., 'en', 'th', 'ja')
  name: string; // Language name in English
  nativeName: string; // Language name in its native script
  country?: string; // Primary country code (ISO 3166-1 alpha-2)
}

/**
 * Supported languages object
 * Contains common languages used in the application
 */
export const ISO_LANGUAGES: Record<string, Language> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    country: 'US'
  },
  th: {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    country: 'TH'
  }
};

/**
 * Get language by code
 * @param code - ISO 639-1 language code
 * @returns Language object or undefined if not found
 */
export function getLanguageByCode(code: string): Language | undefined {
  return ISO_LANGUAGES[code.toLowerCase()];
}

/**
 * Get all supported language codes
 * @returns Array of language codes
 */
export function getSupportedLanguageCodes(): string[] {
  return Object.keys(ISO_LANGUAGES);
}

/**
 * Get all supported languages
 * @returns Array of Language objects
 */
export function getSupportedLanguages(): Language[] {
  return Object.values(ISO_LANGUAGES);
}

/**
 * Check if a language code is supported
 * @param code - ISO 639-1 language code
 * @returns true if supported, false otherwise
 */
export function isLanguageSupported(code: string): boolean {
  return code.toLowerCase() in ISO_LANGUAGES;
}

/**
 * Default language code
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Get default language
 */
export function getDefaultLanguage(): Language {
  return ISO_LANGUAGES[DEFAULT_LANGUAGE];
}
