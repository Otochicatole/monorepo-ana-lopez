import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { prisma } from "@/shared/infrastructure/prisma";
import { GalleryItemsClient } from "./gallery-items-client";

export default async function AdminGalleryPage() {
  await requireAdmin();
  const [items, media, types] = await Promise.all([
    prisma.galleryItem.findMany({
      where: { deletedAt: null },
      include: { media: true, galleryType: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.mediaFile.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),
    prisma.galleryType.findMany({
      where: { deletedAt: null },
      orderBy: { documentId: "asc" },
    }),
  ]);

  const mediaItems = media.map((item) => ({
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    url: item.url,
    alternativeText: item.alternativeText,
  }));

  const typeOptions = types.map((type) => ({
    id: type.id,
    documentId: type.documentId,
  }));

  const itemRows = items.map((item) => ({
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    mediaId: item.mediaId,
    galleryTypeId: item.galleryTypeId,
    galleryTypeDocumentId: item.galleryType?.documentId ?? null,
    createdAt: item.createdAt.toISOString(),
    media: {
      id: item.media.id,
      documentId: item.media.documentId,
      name: item.media.name,
      url: item.media.url,
      alternativeText: item.media.alternativeText,
    },
  }));

  return (
    <GalleryItemsClient
      items={itemRows}
      mediaItems={mediaItems}
      types={typeOptions}
    />
  );
}
