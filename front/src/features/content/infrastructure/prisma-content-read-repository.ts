import { PrismaClient } from "@prisma/client";
import { createPaginationMeta } from "@/shared/domain/pagination";
import { PublicLocale, toPersistenceLocale, toPublicLocale } from "@/shared/domain/locale";
import {
  ContentReadRepository,
  PaginatedResult,
} from "../application/content-read-repository";
import { AboutContentEntity } from "../domain/about-content";
import { GalleryItemEntity, GalleryTypeEntity } from "../domain/gallery";
import { HomeContentEntity } from "../domain/home-content";
import { MediaFileEntity } from "../domain/media";

type PrismaMedia = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: unknown;
  hash: string | null;
  ext: string | null;
  mime: string;
  size: { toNumber(): number } | number;
  url: string;
  previewUrl: string | null;
  provider: string;
  providerMetadata: unknown;
  focalPoint: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaGalleryType = {
  id: number;
  documentId: string;
  locale: "en" | "es_AR";
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type GalleryItemWithRelations = {
  id: number;
  documentId: string;
  name: string | null;
  media: PrismaMedia;
  galleryType: PrismaGalleryType | null;
  createdAt: Date;
  updatedAt: Date;
};

function mapMedia(media: PrismaMedia): MediaFileEntity {
  return {
    id: media.id,
    documentId: media.documentId,
    name: media.name,
    alternativeText: media.alternativeText,
    caption: media.caption,
    width: media.width,
    height: media.height,
    formats: media.formats,
    hash: media.hash,
    ext: media.ext,
    mime: media.mime,
    size:
      typeof media.size === "number" ? media.size : media.size.toNumber(),
    url: media.url,
    previewUrl: media.previewUrl,
    provider: media.provider,
    providerMetadata: media.providerMetadata,
    focalPoint: media.focalPoint,
    createdAt: media.createdAt,
    updatedAt: media.updatedAt,
  };
}

function mapGalleryType(type: PrismaGalleryType): GalleryTypeEntity {
  return {
    id: type.id,
    documentId: type.documentId,
    locale: toPublicLocale(type.locale),
    name: type.name,
    createdAt: type.createdAt,
    updatedAt: type.updatedAt,
  };
}

function mapGalleryItem(item: GalleryItemWithRelations): GalleryItemEntity {
  return {
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    media: mapMedia(item.media),
    galleryType: item.galleryType ? mapGalleryType(item.galleryType) : null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export class PrismaContentReadRepository implements ContentReadRepository {
  constructor(private readonly db: PrismaClient) {}

  async findHome(locale: PublicLocale): Promise<HomeContentEntity | null> {
    const record = await this.db.homeContent.findFirst({
      where: {
        locale: toPersistenceLocale(locale),
        deletedAt: null,
      },
      include: { imageAbout: true },
    });

    if (!record) return null;

    return {
      id: record.id,
      locale,
      about: record.about,
      imageAbout: mapMedia(record.imageAbout),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async findAbout(locale: PublicLocale): Promise<AboutContentEntity | null> {
    const record = await this.db.aboutContent.findFirst({
      where: {
        locale: toPersistenceLocale(locale),
        deletedAt: null,
      },
      include: {
        image1: true,
        image2: true,
        image3: true,
      },
    });

    if (!record) return null;

    return {
      id: record.id,
      locale,
      text1: record.text1,
      image1: record.image1 ? mapMedia(record.image1) : null,
      text2: record.text2,
      image2: record.image2 ? mapMedia(record.image2) : null,
      text3: record.text3,
      image3: record.image3 ? mapMedia(record.image3) : null,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async listGalleryTypes(locale?: PublicLocale): Promise<GalleryTypeEntity[]> {
    const records = await this.db.galleryType.findMany({
      where: {
        ...(locale ? { locale: toPersistenceLocale(locale) } : {}),
        deletedAt: null,
      },
      orderBy: { name: "asc" },
    });

    return records.map(mapGalleryType);
  }

  async listGalleryItems(input: {
    pagination: { page: number; pageSize: number };
    galleryTypeDocumentId?: string;
    locale?: PublicLocale;
  }): Promise<PaginatedResult<GalleryItemEntity>> {
    const galleryTypeWhere =
      input.galleryTypeDocumentId || input.locale
        ? {
            ...(input.galleryTypeDocumentId
              ? { documentId: input.galleryTypeDocumentId }
              : {}),
            ...(input.locale ? { locale: toPersistenceLocale(input.locale) } : {}),
          }
        : undefined;

    const where = {
      deletedAt: null,
      ...(galleryTypeWhere ? { galleryType: galleryTypeWhere } : {}),
    };

    const [items, total] = await this.db.$transaction([
      this.db.galleryItem.findMany({
        where,
        include: {
          media: true,
          galleryType: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (input.pagination.page - 1) * input.pagination.pageSize,
        take: input.pagination.pageSize,
      }),
      this.db.galleryItem.count({ where }),
    ]);

    return {
      items: items.map(mapGalleryItem),
      total,
    };
  }

  async findGalleryTypeWithItems(input: {
    documentId: string;
    locale?: PublicLocale;
  }): Promise<(GalleryTypeEntity & { galleries: GalleryItemEntity[] }) | null> {
    const record = await this.db.galleryType.findFirst({
      where: {
        documentId: input.documentId,
        ...(input.locale ? { locale: toPersistenceLocale(input.locale) } : {}),
        deletedAt: null,
      },
      include: {
        galleries: {
          where: {
            deletedAt: null,
          },
          include: {
            media: true,
            galleryType: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!record) return null;

    return {
      ...mapGalleryType(record),
      galleries: record.galleries.map(mapGalleryItem),
    };
  }
}

export function paginationMetaFor(input: { page: number; pageSize: number }, total: number) {
  return createPaginationMeta(input, total);
}
