import { PrismaClient } from "@prisma/client";
import { createPaginationMeta } from "@/shared/domain/pagination";
import { PublicLocale } from "@/shared/domain/locale";
import {
  ContentReadRepository,
  PaginatedResult,
} from "../application/content-read-repository";
import { AboutContentEntity } from "../domain/about-content";
import { GalleryItemEntity, GalleryTypeEntity } from "../domain/gallery";
import { HomeContentEntity } from "../domain/home-content";
import { MediaFileEntity } from "../domain/media";
import { resolveLocaleCode } from "@/features/locale/infrastructure/locale-repository";

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

type GalleryTypeWithTranslations = {
  id: number;
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
  translations: Array<{
    name: string;
    locale: { code: string };
  }>;
};

type GalleryItemWithRelations = {
  id: number;
  documentId: string;
  name: string | null;
  media: PrismaMedia;
  galleryType: GalleryTypeWithTranslations | null;
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

function resolveTypeName(
  type: GalleryTypeWithTranslations,
  localeCode: PublicLocale
): string {
  const match =
    type.translations.find((t) => t.locale.code === localeCode) ??
    type.translations[0];
  return match?.name ?? type.documentId;
}

function mapGalleryType(
  type: GalleryTypeWithTranslations,
  localeCode: PublicLocale
): GalleryTypeEntity {
  return {
    id: type.id,
    documentId: type.documentId,
    locale: localeCode,
    name: resolveTypeName(type, localeCode),
    createdAt: type.createdAt,
    updatedAt: type.updatedAt,
  };
}

function mapGalleryItem(
  item: GalleryItemWithRelations,
  localeCode: PublicLocale
): GalleryItemEntity {
  return {
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    media: mapMedia(item.media),
    galleryType: item.galleryType
      ? mapGalleryType(item.galleryType, localeCode)
      : null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

const galleryTypeInclude = {
  translations: {
    include: { locale: true },
  },
} as const;

const galleryItemInclude = {
  media: true,
  galleryType: {
    include: galleryTypeInclude,
  },
} as const;

export class PrismaContentReadRepository implements ContentReadRepository {
  constructor(private readonly db: PrismaClient) {}

  async findHome(localeCode: PublicLocale): Promise<HomeContentEntity | null> {
    const locale = await resolveLocaleCode(localeCode);
    const record = await this.db.homeContent.findFirst({
      where: {
        localeId: locale.id,
        deletedAt: null,
      },
      include: { imageAbout: true },
    });

    if (!record) return null;

    return {
      id: record.id,
      locale: locale.code,
      about: record.about,
      imageAbout: mapMedia(record.imageAbout),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async findAbout(localeCode: PublicLocale): Promise<AboutContentEntity | null> {
    const locale = await resolveLocaleCode(localeCode);
    const record = await this.db.aboutContent.findFirst({
      where: {
        localeId: locale.id,
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
      locale: locale.code,
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

  async listGalleryTypes(localeCode?: PublicLocale): Promise<GalleryTypeEntity[]> {
    const locale = await resolveLocaleCode(localeCode);
    const records = await this.db.galleryType.findMany({
      where: { deletedAt: null },
      include: {
        translations: {
          where: { localeId: locale.id },
          include: { locale: true },
        },
      },
      orderBy: { documentId: "asc" },
    });

    return records
      .filter((record) => record.translations.length > 0)
      .map((record) => mapGalleryType(record, locale.code));
  }

  async listGalleryItems(input: {
    pagination: { page: number; pageSize: number };
    galleryTypeDocumentId?: string;
    locale?: PublicLocale;
  }): Promise<PaginatedResult<GalleryItemEntity>> {
    const locale = await resolveLocaleCode(input.locale);
    const where = {
      deletedAt: null,
      ...(input.galleryTypeDocumentId
        ? { galleryType: { documentId: input.galleryTypeDocumentId, deletedAt: null } }
        : {}),
    };

    const [items, total] = await this.db.$transaction([
      this.db.galleryItem.findMany({
        where,
        include: galleryItemInclude,
        orderBy: { createdAt: "desc" },
        skip: (input.pagination.page - 1) * input.pagination.pageSize,
        take: input.pagination.pageSize,
      }),
      this.db.galleryItem.count({ where }),
    ]);

    return {
      items: items.map((item) => mapGalleryItem(item, locale.code)),
      total,
    };
  }

  async findGalleryTypeWithItems(input: {
    documentId: string;
    locale?: PublicLocale;
  }): Promise<(GalleryTypeEntity & { galleries: GalleryItemEntity[] }) | null> {
    const locale = await resolveLocaleCode(input.locale);
    const record = await this.db.galleryType.findFirst({
      where: {
        documentId: input.documentId,
        deletedAt: null,
        translations: { some: { localeId: locale.id } },
      },
      include: {
        translations: {
          where: { localeId: locale.id },
          include: { locale: true },
        },
        galleries: {
          where: { deletedAt: null },
          include: galleryItemInclude,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!record || record.translations.length === 0) return null;

    return {
      ...mapGalleryType(record, locale.code),
      galleries: record.galleries.map((item) =>
        mapGalleryItem(item, locale.code)
      ),
    };
  }
}

export function paginationMetaFor(
  input: { page: number; pageSize: number },
  total: number
) {
  return createPaginationMeta(input, total);
}
