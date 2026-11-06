import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { localesFr, localesEn, localesIt, localesDe, type LocaleTranslations } from '../locales';

export type Lang = 'fr' | 'en' | 'it' | 'de';
export type Translations = LocaleTranslations;

export interface LanguageOption {
  code: Lang;
  label: string;
  name: string;
  nativeName: string;
}

/**
 * Constante unique et modifiable des langues prises en charge
 */
export const LANGUAGES: readonly LanguageOption[] = [
  { code: 'fr', label: 'FR', name: 'Français', nativeName: 'Français' },
  { code: 'en', label: 'EN', name: 'Anglais', nativeName: 'English' },
  { code: 'it', label: 'IT', name: 'Italien', nativeName: 'Italiano' },
  { code: 'de', label: 'DE', name: 'Allemand', nativeName: 'Deutsch' },
] as const;

export const AVAILABLE_LANGUAGES = LANGUAGES;

/**
 * Ordre de repli strict pour chaque langue
 * en → fr
 * it → en → fr
 * de → en → fr
 * fr → fr
 */
export const FALLBACK_ORDER: Record<Lang, readonly Lang[]> = {
  fr: ['fr'],
  en: ['en', 'fr'],
  it: ['it', 'en', 'fr'],
  de: ['de', 'en', 'fr'],
} as const;

export type TranslationFunction = {
  (key: string, params?: Record<string, string | number>): string;
} & LocaleTranslations;

interface I18nContextType {
  lang: Lang;
  t: TranslationFunction;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
  languages: readonly LanguageOption[];
  getLocalized: (item: any, field: string) => any;
  getLocalizedValue: (frVal: any, enVal?: any, itVal?: any, deVal?: any) => any;
  getLocalizedPath: (pathname: string) => string;
}

const translationsRecord: Record<Lang, LocaleTranslations> = {
  fr: localesFr,
  en: localesEn,
  it: localesIt,
  de: localesDe,
};

function resolveDotPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

function createTranslationFunction(activeLang: Lang): TranslationFunction {
  const currentDict = translationsRecord[activeLang] || localesFr;
  const fallbacks = FALLBACK_ORDER[activeLang] || ['fr'];

  const fn = function (key: string, params?: Record<string, string | number>): string {
    let resolved: any = undefined;

    for (const fbLang of fallbacks) {
      const dict = translationsRecord[fbLang] || localesFr;
      resolved = resolveDotPath(dict, key);
      if (resolved !== undefined && resolved !== null && String(resolved).trim() !== '') {
        break;
      }
    }

    if (resolved === undefined || resolved === null || String(resolved).trim() === '') {
      return key;
    }

    if (typeof resolved !== 'string') {
      return String(resolved);
    }

    if (params) {
      let output = resolved;
      for (const [k, v] of Object.entries(params)) {
        output = output.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      }
      return output;
    }
    return resolved;
  };

  return new Proxy(fn, {
    get(target, prop, receiver) {
      if (prop in currentDict) {
        return (currentDict as any)[prop];
      }
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      return undefined;
    },
  }) as TranslationFunction;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * Determine la langue initiale :
 * 1. Prefix d'URL /en, /it, /de
 * 2. localStorage 'ba-lang'
 * 3. Langue du navigateur (si fr, en, it, de)
 * 4. Repli par defaut : fr
 */
function getInitialLang(): Lang {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const match = path.match(/^\/(en|it|de)(\/|$)/);
    if (match) {
      return match[1] as Lang;
    }

    const saved = localStorage.getItem('ba-lang') as Lang;
    if (saved === 'fr' || saved === 'en' || saved === 'it' || saved === 'de') {
      return saved;
    }

    const browserLang = (navigator.language || '').toLowerCase().slice(0, 2);
    if (browserLang === 'en' || browserLang === 'it' || browserLang === 'de') {
      return browserLang as Lang;
    }
  }
  return 'fr';
}

/**
 * Met a jour les balises du document (<html lang>, title, meta description, alternate hreflang)
 */
function updateDocumentLanguageMeta(currentLang: Lang) {
  if (typeof document === 'undefined') return;

  // 1. <html lang="...">
  document.documentElement.lang = currentLang;

  // 2. Balise meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  const descMap: Record<Lang, string> = {
    fr: "L'Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) œuvre pour la défense des droits, l'accessibilité universelle, l'éducation inclusive et l'autonomie en RDC.",
    en: "The Congolese Agency for the Promotion of the Rights of Persons with Disabilities (ACPDPH) works for advocacy, universal accessibility, inclusive education, and empowerment in DRC.",
    it: "L'Agenzia Congolese per la Promozione dei Diritti delle Persone con Disabilità (ACPDPH) opera per la difesa dei diritti, l'accessibilità universale, l'educazione inclusiva e l'autonomia nella RDC.",
    de: "Die Kongolesische Agentur für die Förderung der Rechte von Menschen mit Behinderungen (ACPDPH) setzt sich für Interessenvertretung, Barrierefreiheit, inklusive Bildung und Selbstständigkeit in der DRK ein.",
  };

  if (metaDesc) {
    metaDesc.setAttribute('content', descMap[currentLang] || descMap.fr);
  }

  // 3. Alternate hreflang
  const currentPath = window.location.pathname;
  const cleanPath = currentPath.replace(/^\/(en|it|de)(\/|$)/, '/');

  LANGUAGES.forEach((langOpt) => {
    const code = langOpt.code;
    let link = document.querySelector(`link[hreflang="${code}"]`) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = code;
      document.head.appendChild(link);
    }
    const localizedUrl = code === 'fr'
      ? `${window.location.origin}${cleanPath}`
      : `${window.location.origin}/${code}${cleanPath === '/' ? '' : cleanPath}`;
    link.href = localizedUrl;
  });

  // x-default hreflang
  let linkXDefault = document.querySelector('link[hreflang="x-default"]') as HTMLLinkElement | null;
  if (!linkXDefault) {
    linkXDefault = document.createElement('link');
    linkXDefault.rel = 'alternate';
    linkXDefault.hreflang = 'x-default';
    document.head.appendChild(linkXDefault);
  }
  linkXDefault.href = `${window.location.origin}${cleanPath}`;
}

/**
 * Helper global de resolution localisee avec cascade stricte
 * en: en → fr
 * it: it → en → fr
 * de: de → en → fr
 * Un champ vide ou contenant seulement des espaces compte comme manquant.
 * En developpement, un avertissement console signale chaque repli.
 */
export function getLocalized(item: any, field: string, lang: Lang = 'fr'): any {
  if (!item) return '';

  const fallbacks = FALLBACK_ORDER[lang] || ['fr'];

  for (let i = 0; i < fallbacks.length; i++) {
    const l = fallbacks[i];
    let val: any = undefined;

    if (l === 'fr') {
      val = item[field];
      if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
        val = item[`${field}_fr`];
      }
    } else {
      val = item[`${field}_${l}`];
      if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
        // Support de camelCase eventuel
        const capitalized = l.charAt(0).toUpperCase() + l.slice(1);
        val = item[`${field}${capitalized}`];
      }
    }

    if (val !== undefined && val !== null) {
      if (typeof val === 'string') {
        if (val.trim() !== '') {
          if (import.meta.env?.DEV && l !== lang) {
            console.warn(`[i18n] Repli pour "${field}": [${lang}] -> [${l}]`);
          }
          return val;
        }
      } else if (Array.isArray(val)) {
        if (val.length > 0) {
          if (import.meta.env?.DEV && l !== lang) {
            console.warn(`[i18n] Repli pour "${field}": [${lang}] -> [${l}]`);
          }
          return val;
        }
      } else {
        if (import.meta.env?.DEV && l !== lang) {
          console.warn(`[i18n] Repli pour "${field}": [${lang}] -> [${l}]`);
        }
        return val;
      }
    }
  }

  return '';
}

export const getLocalizedField = getLocalized;

/**
 * Helper de conversion d'URL pour le changement de langue
 */
export function getLocalizedPath(pathname: string, targetLang: Lang): string {
  const cleanPath = pathname.replace(/^\/(en|it|de)(\/|$)/, '/');
  if (targetLang === 'fr') {
    return cleanPath;
  }
  return cleanPath === '/' ? `/${targetLang}` : `/${targetLang}${cleanPath}`;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ba-lang', newLang);
      updateDocumentLanguageMeta(newLang);
    }
  }, []);

  const toggleLang = useCallback(() => {
    const nextIdx = (LANGUAGES.findIndex((l) => l.code === lang) + 1) % LANGUAGES.length;
    setLang(LANGUAGES[nextIdx].code);
  }, [lang, setLang]);

  useEffect(() => {
    updateDocumentLanguageMeta(lang);
  }, [lang]);

  const getLocalizedCb = useCallback((item: any, field: string) => {
    return getLocalized(item, field, lang);
  }, [lang]);

  const getLocalizedValue = useCallback((frVal: any, enVal?: any, itVal?: any, deVal?: any) => {
    const values: Record<Lang, any> = {
      fr: frVal,
      en: enVal,
      it: itVal,
      de: deVal,
    };
    const fallbacks = FALLBACK_ORDER[lang] || ['fr'];
    for (const l of fallbacks) {
      const v = values[l];
      if (v !== undefined && v !== null && (typeof v !== 'string' || v.trim() !== '')) {
        return v;
      }
    }
    return frVal ?? '';
  }, [lang]);

  const getLocPath = useCallback((pathname: string) => {
    return getLocalizedPath(pathname, lang);
  }, [lang]);

  const t = createTranslationFunction(lang);

  return (
    <I18nContext.Provider
      value={{
        lang,
        t,
        toggleLang,
        setLang,
        languages: LANGUAGES,
        getLocalized: getLocalizedCb,
        getLocalizedValue,
        getLocalizedPath: getLocPath,
      }}
    >
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
