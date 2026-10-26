/**
 * ACPDPH — Construction du titre d'accroche pour le hero de la page d'accueil
 * 
 * Règles :
 * 1. Champ « hookTitle » renseigné dans le contenu -> utilisé tel quel.
 * 2. Champ optionnel dans le back-office (« Titre d'accroche pour la page d'accueil », 80 car. max).
 * 3. Si vide, génération automatique à partir des champs existants (résumé, objectif, bénéficiaires, lieu, chiffre clé).
 * 4. En dernier recours, titre administratif normal raccourci proprement.
 *
 * Contraintes d'accroche :
 * - 6 à 10 mots, 70 caractères maximum, une seule ligne de pensée.
 * - Combine 2 ou 3 éléments clés (thème, bénéficiaires, résultat/objectif, lieu, chiffre clé).
 * - Forme possible : « Thème : bénéfice concret » ou « Chiffre clé + bénéficiaires + lieu ».
 * - Pas de point final, pas de jargon administratif, pas de promesse absente du contenu.
 */

export interface HookSourceItem {
  title: string;
  hookTitle?: string;
  description?: string;
  excerpt?: string;
  location?: string;
  type?: string;
  category?: string;
}

/**
 * Nettoie le texte :
 * - Espaces normalisés sur une seule ligne
 * - Maximum maxChars (coupe propre au dernier mot)
 * - Suppression de toute ponctuation finale (pas de point final, deux-points, virgule)
 */
export function cleanHookText(str: string, maxChars = 70): string {
  if (!str) return '';

  // 1. Normaliser les espaces et retirer les retours à la ligne
  let text = str.replace(/\s+/g, ' ').trim();

  // 2. Couper proprement au dernier mot sous maxChars si trop long
  if (text.length > maxChars) {
    const cut = text.slice(0, maxChars);
    const lastSpace = cut.lastIndexOf(' ');
    text = lastSpace > 20 ? cut.slice(0, lastSpace) : cut;
  }

  // 3. Pas de point final ni ponctuation résiduelle en fin de chaîne
  // (on autorise le point d'interrogation final '?' s'il s'agit d'une question d'accroche)
  text = text.replace(/[.:;,\-\s]+$/, '').trim();

  return text;
}

/**
 * Compte les mots d'une chaîne
 */
export function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Évalue si une phrase respecte strictement les critères d'accroche :
 * 6 à 10 mots et <= 70 caractères
 */
function isValidHook(hook: string): boolean {
  if (!hook) return false;
  const cleaned = cleanHookText(hook);
  const words = countWords(cleaned);
  return words >= 6 && words <= 10 && cleaned.length <= 70;
}

/**
 * Génération automatique d'une accroche à partir des données existantes (Priorité 3)
 */
function generateAutomaticHook(item: HookSourceItem, _kind: 'project' | 'news'): string {
  const content = `${item.excerpt || ''} ${item.description || ''}`
    .replace(/\[photo:\d+\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const title = (item.title || '').trim();
  const theme = (item.type || item.category || '').trim();

  // Lieu nettoyé (ex: "Beni, Nord-Kivu, RDC" -> "à Beni" ou "au Nord-Kivu")
  let cleanLoc = '';
  if (content.match(/\bà Beni\b/i) || item.location?.match(/\bBeni\b/i) || title.match(/\bà Beni\b/i)) {
    cleanLoc = 'à Beni';
  } else if (content.match(/\bNord-Kivu\b/i) || item.location?.match(/\bNord-Kivu\b/i)) {
    cleanLoc = 'au Nord-Kivu';
  } else if (item.location) {
    const primaryLoc = item.location.split(',')[0].trim();
    if (primaryLoc) cleanLoc = `à ${primaryLoc}`;
  }

  // ── Cas A : Chiffre clé vérifiable + Bénéficiaires + Lieu / Action ──
  // Forme : « Chiffre clé + bénéficiaires + lieu »
  const figureMatch = content.match(/\b(\d{1,5})\s+(élèves|enfants|jeunes|personnes|familles|bénéficiaires|tricycles|écoles)\b/i);
  if (figureMatch) {
    const count = figureMatch[1];
    const noun = figureMatch[2].toLowerCase();
    const hasHandicap = /handicap|inclusion|vulnérable/i.test(content) || /handicap/i.test(title);

    let candidate = '';
    if (hasHandicap && cleanLoc) {
      candidate = `${count} ${noun} avec handicap soutenus ${cleanLoc}`;
    } else if (cleanLoc) {
      candidate = `${count} ${noun} accompagnés avec succès ${cleanLoc}`;
    } else if (theme) {
      candidate = `${theme} : ${count} ${noun} accompagnés durablement`;
    }

    if (isValidHook(candidate)) {
      return candidate;
    }
  }

  // ── Cas B : Correspondances ciblées sur les éléments clés du contenu ACPDPH ──
  // 1. Rapports & Publications institutionnelles
  if (/rapport|évaluation|diagnostic/i.test(title) || /rapport|publication/i.test(theme)) {
    if (/inclusion|scolaire/i.test(content) || /scolaire/i.test(title)) {
      const candidate = cleanLoc
        ? `Rapport d'évaluation : l'inclusion scolaire ${cleanLoc}`
        : "Rapport d'évaluation : l'inclusion scolaire pour tous";
      if (isValidHook(candidate)) return candidate;
    }
    if (/droits|handicap/i.test(content) || /droits/i.test(title)) {
      const candidate = "Rapport 2026 : où en sont les droits en RDC ?";
      if (isValidHook(candidate)) return candidate;
    }
  }

  // 2. Éducation inclusive / Écoles adaptées
  if (/éduc|école|scolaire/i.test(title) || /éduc/i.test(theme)) {
    if (/salle|enseignant|didactique/i.test(content)) {
      const candidate = "Éducation inclusive : des enfants handicapés enfin à l'école";
      if (isValidHook(candidate)) return candidate;
    }
    if (cleanLoc) {
      const candidate = `Éducation inclusive : des écoles adaptées pour tous ${cleanLoc}`;
      if (isValidHook(candidate)) return candidate;
    }
  }

  // 3. Plaidoyer & Accessibilité des édifices publics
  if (/plaidoyer|accessibilité|édifice/i.test(title) || /plaidoyer/i.test(theme)) {
    if (/édifice|bâtiment|accès/i.test(content) || /édifice/i.test(title)) {
      const candidate = cleanLoc
        ? `Plaidoyer pour l'accessibilité des édifices publics ${cleanLoc}`
        : "Plaidoyer : l'accès garanti aux édifices publics pour tous";
      if (isValidHook(candidate)) return candidate;
    }
  }

  // 4. Autonomisation & Métiers
  if (/autonomis|métier|artisanat|professionnel/i.test(title) || /autonomis/i.test(theme)) {
    if (/formation|kit|micro/i.test(content)) {
      const candidate = "Autonomisation : formations et métiers pour personnes handicapées";
      if (isValidHook(candidate)) return candidate;
    }
  }

  // 5. Santé & Clinique mobile de réadaptation
  if (/clinique|santé|réadaptation|médical/i.test(title) || /santé/i.test(theme)) {
    if (/kinésithérapie|consultation|soin/i.test(content)) {
      const candidate = cleanLoc
        ? `Clinique mobile : réadaptation et soins ${cleanLoc}`
        : "Clinique mobile : réadaptation et soins pour personnes vulnérables";
      if (isValidHook(candidate)) return candidate;
    }
  }

  // ── Cas C : Forme générique « Thème : bénéfice concret » ──
  const cleanTheme = theme.replace(/\s*&.*$/, '').trim(); // ex: "Santé & Réadaptation" -> "Santé"
  if (cleanTheme) {
    // Extraire une action ou bénéfice concret du contenu
    const actionMatch = content.match(/\b(accès|formation|insertion|prise en charge|dotation|distribution|soins|accompagnement)\s+[^.,;]{8,35}/i);
    if (actionMatch) {
      const benefit = actionMatch[0].trim();
      const candidate = `${cleanTheme} : ${benefit}${cleanLoc ? ' ' + cleanLoc : ''}`;
      if (isValidHook(candidate)) return candidate;
    }
  }

  return '';
}

/**
 * Dernier recours : raccourcit proprement le titre administratif d'origine (Priorité 4)
 * - Élimine les préfixes administratifs
 * - Tranche entre 6 et 10 mots et <= 70 caractères
 * - Coupe sans couper les mots et sans ponctuation finale
 */
function fallbackShortenTitle(rawTitle: string, location?: string): string {
  if (!rawTitle) return '';

  // 1. Éliminer le jargon administratif en début de titre
  let clean = rawTitle
    .replace(/^(projet\s+d['’]|projet\s+de\s+|programme\s+d['’]|programme\s+de\s+|campagne\s+de\s+|publication\s+du\s+|publication\s+d['’]|publication\s+de\s+|rapport\s+sur\s+)/i, '')
    .trim();

  // Majuscule initiale
  if (clean.length > 0) {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  // 2. Découper en mots
  let words = clean.split(/\s+/).filter(Boolean);

  // Si moins de 6 mots et qu'on a un lieu, ajouter le lieu pour donner du corps
  if (words.length < 6 && location) {
    const primaryLoc = location.split(',')[0].trim();
    if (primaryLoc && !clean.toLowerCase().includes(primaryLoc.toLowerCase())) {
      clean = `${clean} à ${primaryLoc}`;
      words = clean.split(/\s+/).filter(Boolean);
    }
  }

  // Limiter à 10 mots maximum
  if (words.length > 10) {
    words = words.slice(0, 10);
  }

  let result = words.join(' ');

  // Vérifier la longueur de 70 caractères max
  if (result.length > 70) {
    const cut = result.slice(0, 70);
    const lastSpace = cut.lastIndexOf(' ');
    result = lastSpace > 20 ? cut.slice(0, lastSpace) : cut;
  }

  // Éviter qu'un mot de liaison ou article reste pendant en fin de chaîne
  result = result.replace(/\b(et|ou|de|d['’]|à|a|pour|sur|avec|dans|en|par|le|la|les|un|une|des)\s*$/i, '').trim();

  return cleanHookText(result);
}

/**
 * Fonction principale : résout le titre d'accroche pour un contenu donné
 */
export function buildHeroHookTitle(item: HookSourceItem, kind: 'project' | 'news'): string {
  // Priorité 1 : Champ d'accroche renseigné
  if (item.hookTitle && item.hookTitle.trim().length > 0) {
    return cleanHookText(item.hookTitle);
  }

  // Priorité 3 : Génération automatique
  const generated = generateAutomaticHook(item, kind);
  if (generated && generated.length > 0) {
    return cleanHookText(generated);
  }

  // Priorité 4 : Titre normal raccourci
  return fallbackShortenTitle(item.title, item.location);
}
