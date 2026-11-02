/**
 * Génère un slug propre et pérenne à partir d'un nom de membre.
 * Exemple: "Emmanuel KAKULE SYAYUKUMBITA" -> "emmanuel-kakule-syayukumbita"
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

