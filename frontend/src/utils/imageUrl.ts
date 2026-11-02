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
 * Compresse et convertit une image choisie sur l'appareil en Data URL (JPEG ~640px).
 * Garantit un affichage instantané, persistant dans la base de données sans dépendre
 * du disque éphémère du serveur backend.
 */
export function compressImageToDataUrl(
  file: File,
  maxWidth = 640,
  maxHeight = 800,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calcul du redimensionnement proportionnel
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Exporter en JPEG de haute qualité (~30-60 Ko)
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        // En cas d'erreur avec Image(), repli sur le dataUrl brut
        resolve(e.target?.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

