import { TypesOfGalleriesResponse } from "../types/http-types-of-galleries.types";
import { httpClient } from "./http-client";

export async function httpGetTypesOfGalleries(locale?: string): Promise<TypesOfGalleriesResponse> {
    try {
        return await httpClient<TypesOfGalleriesResponse>("/api/types-of-galleries", {
            method: "GET",
            cache: "no-cache",
            locale,
        });
    } catch (error) {
        console.error("Error fetching types of galleries:", error);
        throw error;
    }
}
