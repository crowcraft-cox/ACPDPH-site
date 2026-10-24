import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import fr from './fr.json';
import en from './en.json';
import it from './it.json';
import de from './de.json';

export type Lang = 'fr' | 'en' | 'it' | 'de';
type Translations = typeof fr;

export interface LanguageOption {
  code: Lang;
  label: string;
  name: string;
}

export const AVAILABLE_LANGUAGES: readonly LanguageOption[] = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'it', label: 'IT', name: 'Italiano' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
] as const;

interface I18nContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
  languages: readonly LanguageOption[];
}

const translations: Record<Lang, Translations> = { fr, en, it, de };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('ba-lang') as Lang;
    if (saved && (saved === 'fr' || saved === 'en' || saved === 'it' || saved === 'de')) {
      return saved;
    }
    return 'fr';
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('ba-lang', newLang);
    document.documentElement.lang = newLang;
  }, []);

  const toggleLang = useCallback(() => {
    const cycle: Record<Lang, Lang> = {
      fr: 'en',
      en: 'it',
      it: 'de',
      de: 'fr',
    };
    setLang(cycle[lang] || 'fr');
  }, [lang, setLang]);

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang] || fr, toggleLang, setLang, languages: AVAILABLE_LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

