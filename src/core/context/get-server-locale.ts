import { cookies } from 'next/headers';

type Locale = 'en' | 'es-AR';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const DEFAULT_LOCALE: Locale = 'en';

export async function getServerLocale(): Promise<Locale> {
    const cookieStore = await cookies();
    const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value as Locale | undefined;
    
    if (locale && (locale === 'en' || locale === 'es-AR')) {
        return locale;
    }
    
    return DEFAULT_LOCALE;
}
