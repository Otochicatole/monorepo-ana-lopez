import { useLocale } from '@/core/context/locale-context';
import { translations, type TranslationStructure } from './translations';

export function useTranslations(): TranslationStructure {
    const { locale } = useLocale();
    return translations[locale];
}
