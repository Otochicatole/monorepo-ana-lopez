import { NextRequest } from "next/server";
import { listLocales } from "@/features/locale/infrastructure/locale-repository";
import { jsonResponse } from "@/shared/presentation/http/json-response";
import { rateLimit } from "@/shared/presentation/http/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, {
    keyPrefix: "public:locales",
    limit: 60,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const locales = await listLocales({ activeOnly: true });

  return jsonResponse({
    data: locales.map((locale) => ({
      id: locale.id,
      code: locale.code,
      name: locale.name,
      isDefault: locale.isDefault,
    })),
    meta: {},
  });
}
