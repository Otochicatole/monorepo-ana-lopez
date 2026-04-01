import { GalleryResponse } from "../types/http-gallery.types";
import { httpClient } from "./http-client";

export async function httpGetGallery(
    page: number = 1, 
    pageSize: number = 6,
    typeDocumentId?: string,
    locale?: string
): Promise<GalleryResponse> {
    try {
        let endpoint = `/api/galleries?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
        
        if (typeDocumentId) {
            endpoint += `&filters[types_of_gallery][documentId][$eq]=${typeDocumentId}`;
        }
        
        return await httpClient<GalleryResponse>(endpoint, {
            method: "GET",
            cache: "no-cache",
            locale,
        });
    } catch (error) {
        console.error("Error fetching gallery data:", error);
        throw error;
    }
}

