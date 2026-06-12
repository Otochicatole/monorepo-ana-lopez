import { NextRequest } from "next/server";
import { contentUseCases } from "@/features/content/infrastructure/content-container";
import {
  getGalleryTypeDocumentId,
  getOptionalLocale,
  getPagination,
} from "@/features/content/presentation/public-content-schemas";
import { galleryItemToStrapiDto } from "@/features/content/presentation/strapi-compatible-dtos";
import { createPaginationMeta } from "@/shared/domain/pagination";
import { jsonResponse } from "@/shared/presentation/http/json-response";
import { rateLimit } from "@/shared/presentation/http/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, {
    keyPrefix: "public:galleries",
    limit: 180,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const pagination = getPagination(request.nextUrl.searchParams);
  const locale = getOptionalLocale(request.nextUrl.searchParams);
  const galleryTypeDocumentId = getGalleryTypeDocumentId(
    request.nextUrl.searchParams
  );
  const result = await contentUseCases.listGalleryItems.execute({
    pagination,
    locale,
    galleryTypeDocumentId,
  });

  return jsonResponse({
    data: result.items.map(galleryItemToStrapiDto),
    meta: {
      pagination: createPaginationMeta(pagination, result.total),
    },
  });
}

