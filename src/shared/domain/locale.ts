export type PublicLocale = "en" | "es-AR";
export type PersistenceLocale = "en" | "es_AR";

export const DEFAULT_LOCALE: PublicLocale = "en";

export function toPersistenceLocale(locale: PublicLocale): PersistenceLocale {
  return locale === "es-AR" ? "es_AR" : "en";
}

export function toPublicLocale(locale: PersistenceLocale): PublicLocale {
  return locale === "es_AR" ? "es-AR" : "en";
}

