import { API_BASE_URL } from '../services/api';

/**
 * Résout une URL d'image pour s'assurer qu'elle est toujours accessible
 * qu'il s'agisse d'un data URI (Base64), d'un asset public (/images/...)
 * ou d'un fichier téléversé (/uploads/...) sur le serveur backend.
 */
export function resolveImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // 1. Data URI ou Blob (aperçu immédiat local en Base64)
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // 2. URL absolue externe (http:// ou https://)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // 3. Fichiers publics frontend (stockés dans /public/images, /public/pillars, etc.)
  if (
    trimmed.startsWith('/images/') ||
    trimmed.startsWith('/pillars/') ||
    trimmed.startsWith('/modeles/') ||
    trimmed.startsWith('/icons/')
  ) {
    return trimmed;
  }

  // 4. Fichiers téléversés sur le serveur backend (/uploads/... ou uploads/...)
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    let backendHost = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

    // Si on est en dev local (localhost) sans variable d'env explicite, cibler le port 3001
    if (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
      !import.meta.env.VITE_API_URL
    ) {
      backendHost = 'http://localhost:3001';
    }

    return `${backendHost}${cleanPath}`;
  }

  // Fallback
  return trimmed;
}

/**
 * Compresse et convertit une image choisie sur l'appareil au format moderne WebP
 * (avec repli automatique JPEG de haute qualité si l'environnement ne supporte pas l'encodage WebP).
 *
 * Avantages :
 * - Format WebP moderne avec compression visuellement sans perte (lossy perceptually lossless)
 * - Poids réduit de 35% à 50% par rapport au JPEG standard sans dégradation de la netteté
 * - Lissage haute précision (imageSmoothingQuality = 'high') pour préserver les détails
 * - Stockage léger et pérenne dans MongoDB Atlas, idéal pour connexions mobiles 3G
 */
export function compressImageToDataUrl(
  file: File,
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Si c'est déjà un SVG vectoriel, on le préserve intégralement
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const srcUrl = event.target?.result as string;
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Redimensionnement proportionnel si l'image dépasse les dimensions maximales
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(srcUrl);
          return;
        }

        // Lissage haute qualité bicubique pour préserver la netteté des visages et détails
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // 1. Tenter l'export en WebP moderne
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          // Si le navigateur supporte WebP, le préfixe sera 'data:image/webp'
          if (webpData && webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {
          // Repli vers JPEG
        }

        // 2. Repli vers JPEG haute qualité si WebP indisponible
        try {
          const jpegData = canvas.toDataURL('image/jpeg', Math.min(quality + 0.05, 0.88));
          resolve(jpegData);
        } catch {
          resolve(srcUrl);
        }
      };

      img.onerror = () => resolve(srcUrl);
      img.src = srcUrl;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Alias pour compatibilité
export const compressImage = compressImageToDataUrl;

