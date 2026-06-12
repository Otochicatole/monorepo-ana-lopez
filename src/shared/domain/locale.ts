export type PublicLocale = string;

export const FALLBACK_LOCALE_CODE = "en";

/** BCP 47-style codes: en, es-AR, pt-BR, es-419, etc. */
export function isValidLocaleCode(code: string): boolean {
  return /^[a-z]{2}(-[A-Za-z0-9]{2,8})?$/.test(code);
}

export function normalizeLocaleCode(code: string): string {
  const trimmed = code.trim();
  if (!trimmed) return trimmed;

  const parts = trimmed.split("-").filter(Boolean);
  const language = parts[0].toLowerCase();
  if (parts.length === 1) return language;

  const region = parts.slice(1).join("-");
  const normalizedRegion =
    region.length === 2 ? region.toUpperCase() : region.toLowerCase();

  return `${language}-${normalizedRegion}`;
}

/** @deprecated Use locale.code from DB. Kept for static UI translations map keys. */
export type StaticTranslationLocale = "en" | "es-AR";

export function toStaticTranslationLocale(code: PublicLocale): StaticTranslationLocale {
  if (code === "en") return "en";
  return "es-AR";
}
