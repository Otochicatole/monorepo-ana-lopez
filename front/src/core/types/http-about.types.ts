import { StrapiEntity, StrapiMedia, StrapiResponse } from "./strapi.types";

export type AboutResponse = StrapiResponse<AboutData>;

export interface AboutData extends StrapiEntity {
    Text1: string;
    Text2: string;
    Text3: string;
    Image1: StrapiMedia;
    Image2: StrapiMedia;
    Image3: StrapiMedia;
}
