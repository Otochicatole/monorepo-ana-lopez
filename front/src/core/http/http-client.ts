import { HttpError, type HttpRequestConfig } from "@/core/types/http-error.types";

const BASE_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

type HttpClientConfig = HttpRequestConfig & {
    locale?: string;
};

async function httpClient<T>(
    endpoint: string,
    config: HttpClientConfig = {}
): Promise<T> {
    let url = `${BASE_URL}${endpoint}`;

    if (config.locale) {
        const separator = endpoint.includes('?') ? '&' : '?';
        url = `${url}${separator}locale=${config.locale}`;
    }

    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
    };

    const requestConfig: RequestInit = {
        ...config,
        headers: {
            ...defaultHeaders,
            ...config.headers,
        },
    };

    const response = await fetch(url, requestConfig);

    if (!response.ok) {
        throw new HttpError(
            response.status,
            response.statusText,
            `Failed to fetch ${endpoint}`
        );
    }

    return await response.json();
}

export { httpClient };


