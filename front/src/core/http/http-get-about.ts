import { AboutResponse } from "../types/http-about.types";
import { httpClient } from "./http-client";

export async function httpGetAbout(locale?: string): Promise<AboutResponse> {
    try {
        return await httpClient<AboutResponse>("/api/about?populate=*", {
            method: "GET",
            cache: "no-cache",
            locale,
        });
    } catch (error) {
        console.error("Error fetching about data:", error);
        throw error;
    }
}
