export class HttpError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        message?: string
    ) {
        super(message || `HTTP Error ${status}: ${statusText}`);
        this.name = "HttpError";
    }
}

export type HttpRequestConfig = RequestInit;

