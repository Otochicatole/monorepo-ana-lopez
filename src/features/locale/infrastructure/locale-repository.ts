import { prisma } from "@/shared/infrastructure/prisma";
import { LocaleEntity, mapLocale } from "../domain/locale";

export async function listLocales(options?: {
  activeOnly?: boolean;
}): Promise<LocaleEntity[]> {
  const records = await prisma.locale.findMany({
    where: options?.activeOnly ? { isActive: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return records.map(mapLocale);
}

export async function findLocaleByCode(code: string): Promise<LocaleEntity | null> {
  const record = await prisma.locale.findUnique({ where: { code } });
  return record ? mapLocale(record) : null;
}

export async function findLocaleById(id: string): Promise<LocaleEntity | null> {
  const record = await prisma.locale.findUnique({ where: { id } });
  return record ? mapLocale(record) : null;
}

export async function getDefaultLocale(): Promise<LocaleEntity> {
  const record =
    (await prisma.locale.findFirst({
      where: { isDefault: true, isActive: true },
    })) ??
    (await prisma.locale.findFirst({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }));

  if (!record) {
    throw new Error("No active locale configured. Run seed or create locales in admin.");
  }

  return mapLocale(record);
}

export async function resolveLocaleCode(code?: string | null): Promise<LocaleEntity> {
  if (code) {
    const locale = await findLocaleByCode(code);
    if (locale?.isActive) return locale;
  }
  return getDefaultLocale();
}
