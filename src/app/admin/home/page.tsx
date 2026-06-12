import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { prisma } from "@/shared/infrastructure/prisma";
import { resolveAdminLocale } from "../_components/locale-toggle";
import { listLocales } from "@/features/locale/infrastructure/locale-repository";
import { HomeContentClient } from "./home-content-client";

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const [locale, locales] = await Promise.all([
    resolveAdminLocale(params?.locale),
    listLocales({ activeOnly: true }),
  ]);
  const [record, media] = await Promise.all([
    prisma.homeContent.findUnique({ where: { localeId: locale.id } }),
    prisma.mediaFile.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),
  ]);

  const mediaItems = media.map((item) => ({
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    url: item.url,
    alternativeText: item.alternativeText,
  }));

  return (
    <HomeContentClient
      locale={locale}
      locales={locales}
      record={record ? { about: record.about, imageAboutId: record.imageAboutId } : null}
      media={mediaItems}
    />
  );
}
