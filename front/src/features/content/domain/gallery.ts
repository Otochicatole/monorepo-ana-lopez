import { PublicLocale } from "@/shared/domain/locale";
import { MediaFileEntity } from "./media";

export interface GalleryTypeEntity {
  id: number;
  documentId: string;
  locale: PublicLocale;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryItemEntity {
  id: number;
  documentId: string;
  name: string | null;
  media: MediaFileEntity;
  galleryType: GalleryTypeEntity | null;
  createdAt: Date;
  updatedAt: Date;
}
