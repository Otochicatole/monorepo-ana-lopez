import { NextRequest } from "next/server";
import { contentUseCases } from "@/features/content/infrastructure/content-container";
import { getOptionalLocaleCode } from "@/features/content/presentation/public-content-schemas";
import { homeToStrapiDto } from "@/features/content/presentation/strapi-compatible-dtos";
import { resolveLocaleCode } from "@/features/locale/infrastructure/locale-repository";
import { jsonResponse } from "@/shared/presentation/http/json-response";
import { rateLimit } from "@/shared/presentation/http/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, {
    keyPrefix: "public:home",
    limit: 120,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const code = getOptionalLocaleCode(request.nextUrl.searchParams);
  const locale = await resolveLocaleCode(code);
  const home = await contentUseCases.getHomeContent.execute(locale.code);

  return jsonResponse({
    data: home ? homeToStrapiDto(home) : null,
    meta: {},
  });
}

