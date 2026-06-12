export interface StrapiResponse<T> {
    data: T;
    meta: StrapiMeta;
}

export interface StrapiCollectionResponse<T> {
    data: T[];
    meta: StrapiMeta;
}

export interface StrapiEntity {
    id: number;
    documentId: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
}

export interface StrapiMeta {
    pagination?: StrapiPagination;
}

export interface StrapiPagination {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

export interface StrapiMedia {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: StrapiMediaFormats;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: unknown;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    focalPoint: unknown;
}

export interface StrapiMediaFormats {
    thumbnail: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
}

export interface StrapiImageFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: string | null;
    width: number;
    height: number;
    size: number;
    sizeInBytes: number;
    url: string;
}
