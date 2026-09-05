/**
 * Language configuration for ORCA
 * Supports all major Indian languages
 */

export const LANGUAGES = {
  en: { code: 'en-IN', nativeName: 'English', englishName: 'English' },
  hi: { code: 'hi-IN', nativeName: 'हिंदी', englishName: 'Hindi' },
  ta: { code: 'ta-IN', nativeName: 'தமிழ்', englishName: 'Tamil' },
  te: { code: 'te-IN', nativeName: 'తెలుగు', englishName: 'Telugu' },
  bn: { code: 'bn-IN', nativeName: 'বাংলা', englishName: 'Bengali' },
  mr: { code: 'mr-IN', nativeName: 'मराठी', englishName: 'Marathi' },
  kn: { code: 'kn-IN', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
  ml: { code: 'ml-IN', nativeName: 'മലയാളം', englishName: 'Malayalam' },
  or: { code: 'or-IN', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia' },
  pa: { code: 'pa-IN', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi' },
  gu: { code: 'gu-IN', nativeName: 'ગુજરાતી', englishName: 'Gujarati' },
  as: { code: 'as-IN', nativeName: 'অসমীয়া', englishName: 'Assamese' },
  ur: { code: 'ur-IN', nativeName: 'اردو', englishName: 'Urdu' },
  ne: { code: 'ne-IN', nativeName: 'नेपाली', englishName: 'Nepali' },
  kok: { code: 'kok-IN', nativeName: 'कोंकणी', englishName: 'Konkani' },
  ks: { code: 'ks-IN', nativeName: 'کشمیری', englishName: 'Kashmiri' },
  sd: { code: 'sd-IN', nativeName: 'سندھی', englishName: 'Sindhi' },
  sa: { code: 'sa-IN', nativeName: 'संस्कृतम्', englishName: 'Sanskrit' },
  sat: { code: 'sat-IN', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', englishName: 'Santali' },
  mni: { code: 'mni-IN', nativeName: 'ꯃꯅꯤꯄꯨꯔ', englishName: 'Manipuri' },
  brx: { code: 'brx-IN', nativeName: 'बड़ो', englishName: 'Bodo' },
  mai: { code: 'mai-IN', nativeName: 'मैथिली', englishName: 'Maithili' },
  doi: { code: 'doi-IN', nativeName: 'डोगरी', englishName: 'Dogri' }
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

/**
 * Get language code for speech recognition
 */
export function getSpeechLangCode(lang: LanguageCode): string {
  return LANGUAGES[lang]?.code || 'en-IN';
}

/**
 * Get native language name
 */
export function getLanguageName(lang: LanguageCode): string {
  return LANGUAGES[lang]?.nativeName || lang;
}

/**
 * Get all language codes
 */
export function getAllLanguageCodes(): LanguageCode[] {
  return Object.keys(LANGUAGES) as LanguageCode[];
}

/**
 * Popular Indian coastal languages (shorter list for quick access)
 */
export const COASTAL_LANGUAGES: LanguageCode[] = ['en', 'ta', 'te', 'ml', 'kn', 'mr', 'hi', 'bn'];
