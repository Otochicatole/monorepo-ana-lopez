import { PaginationInput } from "@/shared/domain/pagination";
import { PublicLocale } from "@/shared/domain/locale";
import { AboutContentEntity } from "../domain/about-content";
import { GalleryItemEntity, GalleryTypeEntity } from "../domain/gallery";
import { HomeContentEntity } from "../domain/home-content";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface ContentReadRepository {
  findHome(locale: PublicLocale): Promise<HomeContentEntity | null>;
  findAbout(locale: PublicLocale): Promise<AboutContentEntity | null>;
  listGalleryTypes(locale?: PublicLocale): Promise<GalleryTypeEntity[]>;
  listGalleryItems(input: {
    pagination: PaginationInput;
    galleryTypeDocumentId?: string;
    locale?: PublicLocale;
  }): Promise<PaginatedResult<GalleryItemEntity>>;
  findGalleryTypeWithItems(input: {
    documentId: string;
    locale?: PublicLocale;
  }): Promise<(GalleryTypeEntity & { galleries: GalleryItemEntity[] }) | null>;
}

