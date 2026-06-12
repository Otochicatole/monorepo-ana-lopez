import { NextRequest } from "next/server";
import { contentUseCases } from "@/features/content/infrastructure/content-container";
import { getOptionalLocale } from "@/features/content/presentation/public-content-schemas";
import {
  galleryItemToStrapiDto,
  galleryTypeToStrapiDto,
} from "@/features/content/presentation/strapi-compatible-dtos";
import { jsonResponse } from "@/shared/presentation/http/json-response";
import { rateLimit } from "@/shared/presentation/http/rate-limit";

type RouteContext = {
  params: Promise<{ documentId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const limited = rateLimit(request, {
    keyPrefix: "public:gallery-type-detail",
    limit: 120,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const { documentId } = await context.params;
  const locale = getOptionalLocale(request.nextUrl.searchParams);
  const type = await contentUseCases.getGalleryTypeWithItems.execute({
    documentId,
    locale,
  });

  if (!type) {
    return jsonResponse({ data: null, meta: {} }, { status: 404 });
  }

  return jsonResponse({
    data: {
      ...galleryTypeToStrapiDto(type),
      galleries: type.galleries.map(galleryItemToStrapiDto),
    },
    meta: {},
  });
}

