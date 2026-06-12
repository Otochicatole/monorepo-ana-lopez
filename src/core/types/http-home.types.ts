import { StrapiEntity, StrapiMedia, StrapiResponse } from "./strapi.types";

export type HomeResponse = StrapiResponse<HomeData>;

export interface HomeData extends StrapiEntity {
    about: string;
    imageAbout: StrapiMedia;
}
