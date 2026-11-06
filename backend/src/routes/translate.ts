import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Limiteur de fréquence : 30 requêtes de traduction par minute par IP/utilisateur
const translateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: 'Limite de traductions atteinte. Veuillez patienter une minute avant de réessayer.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Cache en mémoire pour éviter de retraduire des textes inchangés et économiser le quota
// Clé: hash(source + target + text), Valeur: texte traduit
const translationCache = new Map<string, string>();
const MAX_CACHE_ENTRIES = 5000;

function getCacheKey(source: string, target: string, text: string): string {
  return crypto.createHash('sha256').update(`${source}:${target}:${text}`).digest('hex');
}

/**
 * Termes et règles du glossaire ACPDPH pour post-traiter et garantir l'exactitude terminologique
 * Respecte scrupuleusement les exigences de non-stigmatisation et les dénominations officielles
 */
function applyGlossaryCorrections(text: string, targetLang: string): string {
  if (!text || typeof text !== 'string') return text;

  let corrected = text;

  if (targetLang === 'en') {
    const replacementsEn: Array<[RegExp, string]> = [
      [/\bhandicapped people\b/gi, 'persons with disabilities'],
      [/\bhandicapped persons\b/gi, 'persons with disabilities'],
      [/\bhandicapped individuals\b/gi, 'persons with disabilities'],
      [/\bdisabled people\b/gi, 'persons with disabilities'],
      [/\bdisabled persons\b/gi, 'persons with disabilities'],
      [/\bthe disabled\b/gi, 'persons with disabilities'],
      [/\bhandicapped\b/gi, 'persons with disabilities'],
      [/\binclusive school\b/gi, 'inclusive education'],
      [/\bincome generating activities\b/gi, 'income-generating activities'],
      [/\bassistive equipment\b/gi, 'assistive devices and rehabilitation'],
      [/\bControl Commission\b/gi, 'Oversight Committee'],
      [/\bSupervisory Commission\b/gi, 'Oversight Committee'],
      [/\bAdministrative Council\b/gi, 'Board of Directors'],
      [/\bNational Executive Secretariat\b/gi, 'Executive Secretariat'],
      [/\bGeneral Assembly\b/gi, 'General Assembly'],
    ];

    for (const [regex, replacement] of replacementsEn) {
      corrected = corrected.replace(regex, replacement);
    }
  } else if (targetLang === 'it') {
    const replacementsIt: Array<[RegExp, string]> = [
      [/\bhandicappati\b/gi, 'persone con disabilità'],
      [/\bi disabili\b/gi, 'le persone con disabilità'],
      [/\bportatori di handicap\b/gi, 'persone con disabilità'],
      [/\battività generatrici di reddito\b/gi, 'attività generatrici di reddito'],
      [/\bausili e riabilitazione\b/gi, 'ausili e riabilitazione'],
      [/\bConsiglio di Amministrazione\b/gi, 'Consiglio di Amministrazione'],
      [/\bCommissione di Controllo\b/gi, 'Commissione di Controllo'],
      [/\bCommissione di Vigilanza\b/gi, 'Commissione di Controllo'],
      [/\bSegreteria Esecutiva\b/gi, 'Segreteria Esecutiva'],
      [/\bAssemblea Generale\b/gi, 'Assemblea Generale'],
    ];

    for (const [regex, replacement] of replacementsIt) {
      corrected = corrected.replace(regex, replacement);
    }
  } else if (targetLang === 'de') {
    const replacementsDe: Array<[RegExp, string]> = [
      [/\bBehinderte Menschen\b/gi, 'Menschen mit Behinderungen'],
      [/\bBehinderte\b/gi, 'Menschen mit Behinderungen'],
      [/\bdie Behinderten\b/gi, 'Menschen mit Behinderungen'],
      [/\binklusiven Bildung\b/gi, 'inklusive Bildung'],
      [/\bAufsichtskommission\b/gi, 'Kontrollkommission'],
      [/\bVorstand\b/gi, 'Vorstand'],
      [/\bExekutivsekretariat\b/gi, 'Exekutivsekretariat'],
      [/\bGeneralversammlung\b/gi, 'Generalversammlung'],
      [/\beinkommensschaffende Aktivitäten\b/gi, 'einkommensschaffende Aktivitäten'],
      [/\bHilfsmittel und Rehabilitation\b/gi, 'Hilfsmittel und Rehabilitation'],
    ];

    for (const [regex, replacement] of replacementsDe) {
      corrected = corrected.replace(regex, replacement);
    }
  }

  return corrected;
}

/**
 * Traduction unitaire de plusieurs textes vers une langue cible donnée
 */
async function translateBatch(
  apiKey: string,
  texts: string[],
  source: string,
  target: string
): Promise<string[]> {
  const result: string[] = [...texts];
  const uncachedIndices: number[] = [];
  const uncachedQueries: string[] = [];

  // 1. Vérification dans le cache pour éviter les appels inutiles
  texts.forEach((text, idx) => {
    if (!text || text.trim() === '') {
      result[idx] = text;
      return;
    }
    const key = getCacheKey(source, target, text);
    if (translationCache.has(key)) {
      result[idx] = translationCache.get(key)!;
    } else {
      uncachedIndices.push(idx);
      uncachedQueries.push(text);
    }
  });

  if (uncachedQueries.length === 0) {
    return result;
  }

  const googleEndpoint = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const apiResponse = await fetch(googleEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: uncachedQueries,
      source,
      target,
      format: 'text',
    }),
  });

  if (!apiResponse.ok) {
    const errText = await apiResponse.text().catch(() => '');
    throw new Error(`Google Translation API Error (${apiResponse.status}): ${errText}`);
  }

  const data = await apiResponse.json();
  const rawTranslations: string[] = (data.data?.translations || []).map((t: any) => t.translatedText || '');

  uncachedIndices.forEach((origIdx, qIdx) => {
    const translated = rawTranslations[qIdx] || uncachedQueries[qIdx];
    const polished = applyGlossaryCorrections(translated, target);
    result[origIdx] = polished;

    // Enregistrement dans le cache
    const key = getCacheKey(source, target, uncachedQueries[qIdx]);
    if (translationCache.size >= MAX_CACHE_ENTRIES) {
      const firstKey = translationCache.keys().next().value;
      if (firstKey) translationCache.delete(firstKey);
    }
    translationCache.set(key, polished);
  });

  return result;
}

/**
 * GET /api/v1/translate/status
 * Vérifie si la clé GOOGLE_TRANSLATE_API_KEY est configurée sur le serveur
 */
router.get('/status', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GOOGLE_TRANSLATE_API_KEY && process.env.GOOGLE_TRANSLATE_API_KEY.trim() !== '');
  res.status(200).json({
    success: true,
    available: hasKey,
    supportedTargets: ['en', 'it', 'de'],
    provider: 'Google Cloud Translation Basic (v2)',
  });
});

/**
 * POST /api/v1/translate
 * Traduction vers une cible (en, it, ou de)
 */
router.post('/', authMiddleware, translateLimiter, async (req: Request, res: Response) => {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();

  if (!apiKey) {
    return res.status(503).json({
      success: false,
      error: 'Le service de traduction automatique n\'est pas configuré sur ce serveur. Renseignez la variable GOOGLE_TRANSLATE_API_KEY.',
    });
  }

  const { texts, text, source = 'fr', target = 'en' } = req.body;

  let inputTexts: string[] = [];
  if (Array.isArray(texts)) {
    inputTexts = texts.map((t) => (typeof t === 'string' ? t : ''));
  } else if (typeof text === 'string') {
    inputTexts = [text];
  } else {
    return res.status(400).json({
      success: false,
      error: 'Veuillez fournir un texte ou une liste de textes à traduire.',
    });
  }

  const totalLength = inputTexts.reduce((acc, t) => acc + t.length, 0);
  if (totalLength > 10000) {
    return res.status(400).json({
      success: false,
      error: 'La longueur totale des textes dépasse la limite autorisée de 10 000 caractères par requête.',
    });
  }

  try {
    const translations = await translateBatch(apiKey, inputTexts, source, target);
    return res.status(200).json({
      success: true,
      target,
      translations,
      notice: 'Traduction automatique proposée, à relire avant de publier',
    });
  } catch (err: any) {
    console.error('[Translation API Error]:', err.message);
    return res.status(502).json({
      success: false,
      error: 'Erreur lors de la communication avec le service de traduction Google Cloud.',
    });
  }
});

/**
 * POST /api/v1/translate/all
 * Traduction vers l'ensemble des langues cibles supportées (en, it, de) en un seul appel
 */
router.post('/all', authMiddleware, translateLimiter, async (req: Request, res: Response) => {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();

  if (!apiKey) {
    return res.status(503).json({
      success: false,
      error: 'Le service de traduction automatique n\'est pas configuré sur ce serveur.',
    });
  }

  const { texts, source = 'fr' } = req.body;
  if (!Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Veuillez fournir un tableau de textes à traduire.',
    });
  }

  const totalLength = texts.reduce((acc: number, t: string) => acc + (typeof t === 'string' ? t.length : 0), 0);
  if (totalLength > 10000) {
    return res.status(400).json({
      success: false,
      error: 'La longueur totale des textes dépasse la limite autorisée.',
    });
  }

  try {
    const [enTranslations, itTranslations, deTranslations] = await Promise.all([
      translateBatch(apiKey, texts, source, 'en'),
      translateBatch(apiKey, texts, source, 'it'),
      translateBatch(apiKey, texts, source, 'de'),
    ]);

    return res.status(200).json({
      success: true,
      translations: {
        en: enTranslations,
        it: itTranslations,
        de: deTranslations,
      },
      notice: 'Traductions automatiques proposées (en, it, de), à relire avant de publier',
    });
  } catch (err: any) {
    console.error('[Translation All Error]:', err.message);
    return res.status(502).json({
      success: false,
      error: 'Erreur lors de la traduction vers l\'ensemble des langues.',
    });
  }
});

export default router;
