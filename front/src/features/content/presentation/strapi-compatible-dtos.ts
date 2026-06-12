import { AboutContentEntity } from "../domain/about-content";
import { GalleryItemEntity, GalleryTypeEntity } from "../domain/gallery";
import { HomeContentEntity } from "../domain/home-content";
import { MediaFileEntity } from "../domain/media";

type StrapiMeta = {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

export type StrapiResponse<T> = {
  data: T;
  meta: StrapiMeta;
};

export type StrapiCollectionResponse<T> = {
  data: T[];
  meta: StrapiMeta;
};

function dateToJson(date: Date | null): string | null {
  return date ? date.toISOString() : null;
}

export function mediaToStrapiDto(media: MediaFileEntity) {
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
    size: media.size,
    url: media.url,
    previewUrl: media.previewUrl,
    provider: media.provider,
    provider_metadata: media.providerMetadata,
    createdAt: dateToJson(media.createdAt),
    updatedAt: dateToJson(media.updatedAt),
    publishedAt: dateToJson(media.createdAt),
    focalPoint: media.focalPoint,
  };
}

export function homeToStrapiDto(home: HomeContentEntity) {
  return {
    id: home.id,
    documentId: home.id.toString(),
    about: home.about,
    imageAbout: mediaToStrapiDto(home.imageAbout),
    createdAt: dateToJson(home.createdAt),
    updatedAt: dateToJson(home.updatedAt),
    publishedAt: dateToJson(home.createdAt),
  };
}

export function aboutToStrapiDto(about: AboutContentEntity) {
  return {
    id: about.id,
    documentId: about.id.toString(),
    Text1: about.text1,
    Image1: about.image1 ? mediaToStrapiDto(about.image1) : null,
    Text2: about.text2,
    Image2: about.image2 ? mediaToStrapiDto(about.image2) : null,
    Text3: about.text3,
    Image3: about.image3 ? mediaToStrapiDto(about.image3) : null,
    createdAt: dateToJson(about.createdAt),
    updatedAt: dateToJson(about.updatedAt),
    publishedAt: dateToJson(about.createdAt),
  };
}

export function galleryTypeToStrapiDto(type: GalleryTypeEntity) {
  return {
    id: type.id,
    documentId: type.documentId,
    name: type.name,
    createdAt: dateToJson(type.createdAt),
    updatedAt: dateToJson(type.updatedAt),
    publishedAt: dateToJson(type.createdAt),
  };
}

export function galleryItemToStrapiDto(item: GalleryItemEntity) {
  return {
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    media: mediaToStrapiDto(item.media),
    types_of_gallery: item.galleryType
      ? galleryTypeToStrapiDto(item.galleryType)
      : null,
    createdAt: dateToJson(item.createdAt),
    updatedAt: dateToJson(item.updatedAt),
    publishedAt: dateToJson(item.createdAt),
  };
}
