import { cookies } from "next/headers";
import { resolveLocaleCode } from "@/features/locale/infrastructure/locale-repository";

const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export async function getServerLocale(): Promise<string> {
  const cookieStore = await cookies();
  const code = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale = await resolveLocaleCode(code);
  return locale.code;
}
