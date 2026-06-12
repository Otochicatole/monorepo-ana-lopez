import { NextRequest } from "next/server";
import { contentUseCases } from "@/features/content/infrastructure/content-container";
import { getOptionalLocale } from "@/features/content/presentation/public-content-schemas";
import { galleryTypeToStrapiDto } from "@/features/content/presentation/strapi-compatible-dtos";
import { jsonResponse } from "@/shared/presentation/http/json-response";
import { rateLimit } from "@/shared/presentation/http/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, {
    keyPrefix: "public:gallery-types",
    limit: 120,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const locale = getOptionalLocale(request.nextUrl.searchParams);
  const types = await contentUseCases.listGalleryTypes.execute(locale);

  return jsonResponse({
    data: types.map(galleryTypeToStrapiDto),
    meta: {},
  });
}

