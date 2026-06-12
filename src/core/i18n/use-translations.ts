import { useLocale } from '@/core/context/locale-context';
import { translations, type TranslationStructure } from './translations';
import { toStaticTranslationLocale } from '@/shared/domain/locale';

export function useTranslations(): TranslationStructure {
    const { locale } = useLocale();
    const key = toStaticTranslationLocale(locale);
    return translations[key] ?? translations.en;
}
