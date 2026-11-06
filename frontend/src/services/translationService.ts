import { apiFetch } from './api';

let cachedStatus: boolean | null = null;
let lastCheckTime = 0;

/**
 * Vérifie si le service Google Cloud Translation est configuré côté serveur
 * Ne journalise jamais et n'expose jamais la clé.
 */
export async function isAutoTranslateAvailable(): Promise<boolean> {
  const now = Date.now();
  if (cachedStatus !== null && now - lastCheckTime < 60000) {
    return cachedStatus;
  }

  try {
    const res = await apiFetch<{ available: boolean }>('/translate/status');
    if (res.success && res.data && typeof res.data.available === 'boolean') {
      cachedStatus = res.data.available;
      lastCheckTime = now;
      return cachedStatus;
    }
    cachedStatus = false;
    return false;
  } catch {
    cachedStatus = false;
    return false;
  }
}

export interface TranslationResult {
  success: boolean;
  translations?: string[];
  notice?: string;
  error?: string;
}

export interface MultiTranslationResult {
  success: boolean;
  translations?: {
    en: string[];
    it: string[];
    de: string[];
  };
  notice?: string;
  error?: string;
}

/**
 * Traduit une liste de chaînes vers une langue cible ('en', 'it', 'de')
 */
export async function translateFrTo(
  texts: string[],
  target: 'en' | 'it' | 'de'
): Promise<TranslationResult> {
  try {
    const res = await apiFetch<{ translations: string[]; notice?: string }>('/translate', {
      method: 'POST',
      body: JSON.stringify({
        texts,
        source: 'fr',
        target,
      }),
    });

    if (!res.success) {
      return {
        success: false,
        error: res.error || `Erreur lors de la traduction automatique vers ${target}.`,
      };
    }

    return {
      success: true,
      translations: res.data?.translations || texts,
      notice: res.data?.notice || 'Traduction automatique proposée, à relire avant de publier',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Connexion au service de traduction impossible.',
    };
  }
}

/**
 * Rétro-compatibilité : traduction vers l'anglais
 */
export async function translateFrToEn(texts: string[]): Promise<TranslationResult> {
  return translateFrTo(texts, 'en');
}

/**
 * Traduit simultanément vers les 3 langues cibles : EN, IT, DE
 */
export async function translateFrToAll(texts: string[]): Promise<MultiTranslationResult> {
  try {
    const res = await apiFetch<{
      translations: { en: string[]; it: string[]; de: string[] };
      notice?: string;
    }>('/translate/all', {
      method: 'POST',
      body: JSON.stringify({
        texts,
        source: 'fr',
      }),
    });

    if (!res.success) {
      return {
        success: false,
        error: res.error || 'Erreur lors de la traduction vers toutes les langues.',
      };
    }

    return {
      success: true,
      translations: res.data?.translations,
      notice: res.data?.notice || 'Traductions automatiques proposées, à relire avant de publier',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Connexion au service de traduction impossible.',
    };
  }
}
