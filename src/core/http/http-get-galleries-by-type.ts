import { TypeOfGalleryWithGalleriesResponse } from "../types/http-types-of-galleries.types";
import { httpClient } from "./http-client";

export async function httpGetGalleriesByType(documentId: string, locale?: string): Promise<TypeOfGalleryWithGalleriesResponse> {
    try {
        return await httpClient<TypeOfGalleryWithGalleriesResponse>(
            `/api/types-of-galleries/${documentId}?populate=*`,
            {
                method: "GET",
                cache: "no-cache",
                locale,
            }
        );
    } catch (error) {
        console.error("Error fetching galleries by type:", error);
        throw error;
    }
}
