import { StrapiCollectionResponse, StrapiEntity, StrapiResponse } from "./strapi.types";

export type TypesOfGalleriesResponse = StrapiCollectionResponse<TypeOfGalleryItem>;

export interface TypeOfGalleryItem extends StrapiEntity {
    name: string;
}

export type TypeOfGalleryWithGalleriesResponse = StrapiResponse<TypeOfGalleryWithGalleries>;

export interface TypeOfGalleryWithGalleries extends StrapiEntity {
    name: string | null;
    galleries?: GalleryItemReference[];
}

export interface GalleryItemReference extends StrapiEntity {
    name: string | null;
}
