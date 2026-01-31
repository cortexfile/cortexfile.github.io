import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../utils/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        return (localStorage.getItem('cortex_lang') as Language) || 'en';
    });

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        localStorage.setItem('cortex_lang', language);
        document.documentElement.dir = dir;
        document.documentElement.lang = language;

        // Switch font based on language - Tajawal for Arabic
        if (language === 'ar') {
            document.body.style.fontFamily = "'Tajawal', sans-serif";
        } else {
            document.body.style.fontFamily = "'Inter', sans-serif";
        }
    }, [language, dir]);

    const t = (path: string) => {
        const keys = path.split('.');

        // Debug: Check if translations object is loaded
        if (!translations) {
            console.error('Translations object is undefined!');
            return path;
        }

        // Try current language
        let value: any = translations[language];
        for (const key of keys) {
            value = value?.[key];
            if (!value) break;
        }

        // If found, return it
        if (value && typeof value === 'string') return value;

        // Debug: Log missing key
        if (language === 'ar') {
            console.warn(`[Missing Translation] Path: "${path}", Language: "${language}"`);
        }

        // Fallback to English
        value = translations['en'];
        for (const key of keys) {
            value = value?.[key];
            if (!value) break;
        }

        return (value as string) || path;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
