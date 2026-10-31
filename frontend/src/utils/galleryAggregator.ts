import type { Project, NewsArticle, Pillar, GalleryItem } from '../types';

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = re.exec(url);
    if (m) return m[1];
  }
  return null;
}

export function detectMediaType(url: string): 'image' | 'video' | 'youtube' {
  if (!url) return 'image';
  if (extractYoutubeId(url)) return 'youtube';
  const clean = url.split('?')[0].toLowerCase();
  if (clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.ogg') || clean.endsWith('.mov')) {
    return 'video';
  }
  return 'image';
}

export function getYoutubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Agrège directement les images et vidéos publiées dans :
 * - Les projets (photos de couverture + galeries de photos)
 * - Les domaines d'intervention (piliers)
 * - Les actualités (photos de couverture + galeries de photos)
 * - Les médias ajoutés manuellement à la galerie par l'administrateur
 */
export function aggregateAllGalleryItems(
  projects: Project[] = [],
  news: NewsArticle[] = [],
  pillars: Pillar[] = [],
  customGallery: GalleryItem[] = []
): GalleryItem[] {
  const items: GalleryItem[] = [];
  const seenUrls = new Set<string>();

  // 1. Médias ajoutés manuellement à la galerie
  for (const item of customGallery) {
    if (item.active === false) continue;
    const url = item.url?.trim();
    if (!url || seenUrls.has(url)) continue;
    seenUrls.add(url);

    const type = item.type || detectMediaType(url);
    const ytId = item.youtubeId || (type === 'youtube' ? extractYoutubeId(url) || undefined : undefined);

    items.push({
      ...item,
      type,
      youtubeId: ytId,
      thumbnailUrl: item.thumbnailUrl || (ytId ? getYoutubeThumbnail(ytId) : undefined),
      sourceCategory: item.sourceCategory || 'Galerie',
    });
  }

  // 2. Projets humanitaires
  for (const project of projects) {
    // Photo de couverture
    if (project.image && project.image.trim()) {
      const url = project.image.trim();
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        const type = detectMediaType(url);
        const ytId = type === 'youtube' ? extractYoutubeId(url) || undefined : undefined;
        items.push({
          _id: `proj-cover-${project.id}`,
          title: project.title,
          alt: project.title,
          caption: project.location
            ? `${project.location} • ${project.type || 'Projet humanitaire'}`
            : (project.type || 'Projet humanitaire'),
          type,
          url,
          thumbnailUrl: ytId ? getYoutubeThumbnail(ytId) : undefined,
          youtubeId: ytId,
          date: project.date || 'Projet',
          order: 10,
          active: true,
          sourceCategory: 'Projets',
          sourceLink: `/projects/${project.id}`,
        });
      }
    }

    // Galerie de photos du projet
    if (project.images && Array.isArray(project.images)) {
      project.images.forEach((img, idx) => {
        if (!img.url || !img.url.trim()) return;
        const url = img.url.trim();
        if (seenUrls.has(url)) return;
        seenUrls.add(url);

        const type = detectMediaType(url);
        const ytId = type === 'youtube' ? extractYoutubeId(url) || undefined : undefined;
        items.push({
          _id: `proj-img-${project.id}-${img.id || idx}`,
          title: img.caption ? `${project.title} — ${img.caption}` : project.title,
          alt: img.caption || project.title,
          caption: img.caption || (project.location ? `${project.title} (${project.location})` : project.title),
          type,
          url,
          thumbnailUrl: ytId ? getYoutubeThumbnail(ytId) : undefined,
          youtubeId: ytId,
          date: project.date || 'Projet',
          order: 12,
          active: true,
          sourceCategory: 'Projets',
          sourceLink: `/projects/${project.id}`,
        });
      });
    }
  }

  // 3. Dernières actualités
  for (const article of news) {
    // Photo de couverture
    if (article.image && article.image.trim()) {
      const url = article.image.trim();
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        const type = detectMediaType(url);
        const ytId = type === 'youtube' ? extractYoutubeId(url) || undefined : undefined;
        items.push({
          _id: `news-cover-${article.id}`,
          title: article.title,
          alt: article.title,
          caption: article.excerpt
            ? (article.excerpt.length > 120 ? article.excerpt.slice(0, 120) + '...' : article.excerpt)
            : article.category,
          type,
          url,
          thumbnailUrl: ytId ? getYoutubeThumbnail(ytId) : undefined,
          youtubeId: ytId,
          date: article.date || 'Actualité',
          order: 20,
          active: true,
          sourceCategory: 'Actualités',
          sourceLink: `/news/${article.id}`,
        });
      }
    }

    // Galerie de photos de l'article
    if (article.images && Array.isArray(article.images)) {
      article.images.forEach((img, idx) => {
        if (!img.url || !img.url.trim()) return;
        const url = img.url.trim();
        if (seenUrls.has(url)) return;
        seenUrls.add(url);

        const type = detectMediaType(url);
        const ytId = type === 'youtube' ? extractYoutubeId(url) || undefined : undefined;
        items.push({
          _id: `news-img-${article.id}-${img.id || idx}`,
          title: img.caption ? `${article.title} — ${img.caption}` : article.title,
          alt: img.caption || article.title,
          caption: img.caption || article.title,
          type,
          url,
          thumbnailUrl: ytId ? getYoutubeThumbnail(ytId) : undefined,
          youtubeId: ytId,
          date: article.date || 'Actualité',
          order: 22,
          active: true,
          sourceCategory: 'Actualités',
          sourceLink: `/news/${article.id}`,
        });
      });
    }
  }

  // 4. Domaines d'intervention (piliers)
  for (const pillar of pillars) {
    if (pillar.image && pillar.image.trim()) {
      const url = pillar.image.trim();
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        const type = detectMediaType(url);
        const ytId = type === 'youtube' ? extractYoutubeId(url) || undefined : undefined;
        items.push({
          _id: `pillar-${pillar.id}`,
          title: pillar.title,
          alt: pillar.title,
          caption: pillar.description
            ? (pillar.description.length > 120 ? pillar.description.slice(0, 120) + '...' : pillar.description)
            : 'Domaine d\'intervention',
          type,
          url,
          thumbnailUrl: ytId ? getYoutubeThumbnail(ytId) : undefined,
          youtubeId: ytId,
          date: 'Pilier d\'action',
          order: 30,
          active: true,
          sourceCategory: 'Domaines d\'intervention',
          sourceLink: `/pillars`,
        });
      }
    }
  }

  return items;
}
