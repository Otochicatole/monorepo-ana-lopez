import { HomeResponse } from "../types/http-home.types";
import { httpClient } from "./http-client";

export async function httpGetHome(locale?: string): Promise<HomeResponse> {
    try {
        return await httpClient<HomeResponse>("/api/home?populate=*", {
            method: "GET",
            cache: "no-cache",
            locale,
        });
    } catch (error) {
        console.error("Error fetching home data:", error);
        throw error;
    }
}

