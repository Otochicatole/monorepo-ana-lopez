import { NextRequest } from "next/server";
import { contentUseCases } from "@/features/content/infrastructure/content-container";
import { getOptionalLocaleCode } from "@/features/content/presentation/public-content-schemas";
import { aboutToStrapiDto } from "@/features/content/presentation/strapi-compatible-dtos";
import { resolveLocaleCode } from "@/features/locale/infrastructure/locale-repository";
import { jsonResponse } from "@/shared/presentation/http/json-response";
import { rateLimit } from "@/shared/presentation/http/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, {
    keyPrefix: "public:about",
    limit: 120,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const code = getOptionalLocaleCode(request.nextUrl.searchParams);
  const locale = await resolveLocaleCode(code);
  const about = await contentUseCases.getAboutContent.execute(locale.code);

  return jsonResponse({
    data: about ? aboutToStrapiDto(about) : null,
    meta: {},
  });
}

