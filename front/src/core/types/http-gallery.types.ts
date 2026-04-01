import { StrapiCollectionResponse, StrapiEntity, StrapiMedia } from "./strapi.types";

export type GalleryResponse = StrapiCollectionResponse<GalleryItem>;

export interface GalleryItem extends StrapiEntity {
    name: string;
    media?: StrapiMedia;
    types_of_gallery?: TypeOfGallery;
}

export interface TypeOfGallery extends StrapiEntity {
    name: string;
}
