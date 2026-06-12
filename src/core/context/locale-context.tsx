'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FALLBACK_LOCALE_CODE } from '@/shared/domain/locale';

type LocaleContextType = {
    locale: string;
    setLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'user-locale';
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

function setCookie(name: string, value: string, days: number = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<string>(FALLBACK_LOCALE_CODE);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const cookieLocale = getCookie(LOCALE_COOKIE_NAME);
        const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
        const initialLocale = cookieLocale || stored;

        if (initialLocale) {
            setLocaleState(initialLocale);
        }
        setMounted(true);
    }, []);

    const setLocale = (newLocale: string) => {
        setLocaleState(newLocale);
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
        setCookie(LOCALE_COOKIE_NAME, newLocale);
        window.location.reload();
    };

    if (!mounted) {
        return null;
    }

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
}
