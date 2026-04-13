'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import en from './locales/en';
import zhTW from './locales/zh-TW';
import zhCN from './locales/zh-CN';
import type { Translations } from './locales/en';

export type Language = 'en' | 'zh-TW' | 'zh-CN';

const locales: Record<Language, Translations> = { en, 'zh-TW': zhTW, 'zh-CN': zhCN };

const STORAGE_KEY = 'wenxige-lang';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && locales[stored]) {
      setLanguageState(stored);
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const t = locales[language];

  // Prevent hydration mismatch — render English on SSR, then switch on client
  if (!mounted) {
    return (
      <LanguageContext value={{ language: 'en', setLanguage, t: en }}>
        {children}
      </LanguageContext>
    );
  }

  return (
    <LanguageContext value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}

export type { Translations };
