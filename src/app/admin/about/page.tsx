import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { prisma } from "@/shared/infrastructure/prisma";
import { resolveAdminLocale } from "../_components/locale-toggle";
import { listLocales } from "@/features/locale/infrastructure/locale-repository";
import { AboutContentClient } from "./about-content-client";

export default async function AdminAboutPage({
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
    prisma.aboutContent.findUnique({ where: { localeId: locale.id } }),
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
    <AboutContentClient
      locale={locale}
      locales={locales}
      record={
        record
          ? {
              text1: record.text1,
              image1Id: record.image1Id,
              text2: record.text2,
              image2Id: record.image2Id,
              text3: record.text3,
              image3Id: record.image3Id,
            }
          : null
      }
      media={mediaItems}
    />
  );
}
