import { HttpError, type HttpRequestConfig } from "@/core/types/http-error.types";

function getBaseUrl() {
    if (typeof window !== "undefined") {
        return "";
    }

    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return `http://localhost:${process.env.PORT || 3000}`;
}

type HttpClientConfig = HttpRequestConfig & {
    locale?: string;
};

async function httpClient<T>(
    endpoint: string,
    config: HttpClientConfig = {}
): Promise<T> {
    let url = `${getBaseUrl()}${endpoint}`;

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

