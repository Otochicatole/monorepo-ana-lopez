import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { prisma } from "@/shared/infrastructure/prisma";
import { MediaLibraryClient } from "./media-library-client";

export default async function AdminMediaPage() {
  await requireAdmin();
  const media = await prisma.mediaFile.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  const mediaItems = media.map((item) => ({
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    url: item.url,
    alternativeText: item.alternativeText,
    mime: item.mime,
    ext: item.ext,
    width: item.width,
    height: item.height,
    size: item.size.toString(),
  }));

  return <MediaLibraryClient media={mediaItems} />;
}
