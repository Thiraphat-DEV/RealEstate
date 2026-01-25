export interface Language {
  code: string; // ISO 639-1 code (e.g., 'en', 'th', 'ja')
  name: string; // Language name in English
  nativeName: string; // Language name in its native script
  country?: string; // Primary country code (ISO 3166-1 alpha-2)
}

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

export function getLanguageByCode(code: string): Language | undefined {
  return ISO_LANGUAGES[code.toLowerCase()];
}

export function getSupportedLanguageCodes(): string[] {
  return Object.keys(ISO_LANGUAGES);
}

export function getSupportedLanguages(): Language[] {
  return Object.values(ISO_LANGUAGES);
}

export function isLanguageSupported(code: string): boolean {
  return code.toLowerCase() in ISO_LANGUAGES;
}

export const DEFAULT_LANGUAGE = 'en';

export function getDefaultLanguage(): Language {
  return ISO_LANGUAGES[DEFAULT_LANGUAGE];
}
