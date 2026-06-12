import { NextRequest } from "next/server";
import { contentUseCases } from "@/features/content/infrastructure/content-container";
import { getLocale } from "@/features/content/presentation/public-content-schemas";
import { homeToStrapiDto } from "@/features/content/presentation/strapi-compatible-dtos";
import { jsonResponse } from "@/shared/presentation/http/json-response";
import { rateLimit } from "@/shared/presentation/http/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, {
    keyPrefix: "public:home",
    limit: 120,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const locale = getLocale(request.nextUrl.searchParams);
  const home = await contentUseCases.getHomeContent.execute(locale);

  return jsonResponse({
    data: home ? homeToStrapiDto(home) : null,
    meta: {},
  });
}

