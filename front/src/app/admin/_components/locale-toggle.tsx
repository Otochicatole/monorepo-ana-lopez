import Link from "next/link";
import { Locale } from "@prisma/client";

const locales: Array<{ value: Locale; label: string }> = [
  { value: "es_AR", label: "Español" },
  { value: "en", label: "English" },
];

export function normalizeAdminLocale(locale?: string | string[]): Locale {
  const value = Array.isArray(locale) ? locale[0] : locale;
  return value === "en" ? "en" : "es_AR";
}

export function LocaleToggle({
  current,
  basePath,
}: {
  current: Locale;
  basePath: string;
}) {
  return (
    <div className="mb-6 inline-flex rounded border border-white/10 bg-white/5 p-1">
      {locales.map((locale) => (
        <Link
          key={locale.value}
          href={`${basePath}?locale=${locale.value}`}
          className={`rounded px-4 py-2 text-sm font-bold ${
            current === locale.value
              ? "bg-pk text-black"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          {locale.label}
        </Link>
      ))}
    </div>
  );
}
