export type PublicLocale = string;

export const FALLBACK_LOCALE_CODE = "en";

export function isValidLocaleCode(code: string): boolean {
  return /^[a-z]{2}(-[A-Za-z]{2})?$/.test(code);
}

/** @deprecated Use locale.code from DB. Kept for static UI translations map keys. */
export type StaticTranslationLocale = "en" | "es-AR";

export function toStaticTranslationLocale(code: PublicLocale): StaticTranslationLocale {
  if (code === "en") return "en";
  return "es-AR";
}
