'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'es-AR';

type LocaleContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
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
    const [locale, setLocaleState] = useState<Locale>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const initializeLocale = () => {
            const cookieLocale = getCookie(LOCALE_COOKIE_NAME) as Locale | null;
            const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
            const initialLocale = cookieLocale || stored;
            
            if (initialLocale && (initialLocale === 'en' || initialLocale === 'es-AR')) {
                setLocaleState(initialLocale);
            }
            setMounted(true);
        };

        initializeLocale();
    }, []);

    const setLocale = (newLocale: Locale) => {
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
