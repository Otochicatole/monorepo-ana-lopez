import Link from "next/link";
import { listLocales } from "@/features/locale/infrastructure/locale-repository";
import { LocaleEntity } from "@/features/locale/domain/locale";
import { cn } from "@/features/admin/presentation/lib/cn";

export async function resolveAdminLocale(code?: string | string[]): Promise<LocaleEntity> {
  const locales = await listLocales({ activeOnly: true });
  const value = Array.isArray(code) ? code[0] : code;

  if (value) {
    const match = locales.find((locale) => locale.code === value);
    if (match) return match;
  }

  return locales.find((locale) => locale.isDefault) ?? locales[0];
}

export async function LocaleToggle({
  current,
  basePath,
}: {
  current: LocaleEntity;
  basePath: string;
}) {
  const locales = await listLocales({ activeOnly: true });

  if (locales.length <= 1) return null;

  return (
    <div
      className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1"
      role="tablist"
      aria-label="Content locale"
    >
      {locales.map((locale) => (
        <Link
          key={locale.id}
          href={`${basePath}?locale=${encodeURIComponent(locale.code)}`}
          role="tab"
          aria-selected={current.id === locale.id}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            current.id === locale.id
              ? "bg-pk text-neutral-950"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          {locale.name}
        </Link>
      ))}
    </div>
  );
}
