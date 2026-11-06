import type { Project, NewsArticle, Pillar, GalleryItem } from '../types';
import { getLocalized, type Lang } from '../i18n';

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
  customGallery: GalleryItem[] = [],
  lang: Lang = 'fr'
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
      title: getLocalized(item, 'title', lang) || item.title,
      alt: getLocalized(item, 'alt', lang) || item.alt,
      caption: getLocalized(item, 'caption', lang) || item.caption,
      type,
      youtubeId: ytId,
      thumbnailUrl: item.thumbnailUrl || (ytId ? getYoutubeThumbnail(ytId) : undefined),
      sourceCategory: item.sourceCategory || 'Galerie',
    });
  }

  // 2. Projets humanitaires
  for (const project of projects) {
    const pTitle = getLocalized(project, 'title', lang) || project.title;
    const pLocation = getLocalized(project, 'location', lang) || project.location;
    const pType = getLocalized(project, 'type', lang) || project.type || (lang === 'en' ? 'Humanitarian Project' : lang === 'it' ? 'Progetto umanitario' : lang === 'de' ? 'Humanitäres Projekt' : 'Projet humanitaire');

    // Photo de couverture
    if (project.image && project.image.trim()) {
      const url = project.image.trim();
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        const type = detectMediaType(url);
        const ytId = type === 'youtube' ? extractYoutubeId(url) || undefined : undefined;
        items.push({
          _id: `proj-cover-${project.id}`,
          title: pTitle,
          alt: pTitle,
          caption: pLocation ? `${pLocation} • ${pType}` : pType,
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
        const imgCaption = getLocalized(img, 'caption', lang) || img.caption;

        items.push({
          _id: `proj-img-${project.id}-${img.id || idx}`,
          title: imgCaption ? `${pTitle} — ${imgCaption}` : pTitle,
          alt: imgCaption || pTitle,
          caption: imgCaption || (pLocation ? `${pTitle} (${pLocation})` : pTitle),
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
    const nTitle = getLocalized(article, 'title', lang) || article.title;
    const nExcerpt = getLocalized(article, 'excerpt', lang) || article.excerpt;
    const nCategory = getLocalized(article, 'category', lang) || article.category;

    // Photo de couverture
    if (article.image && article.image.trim()) {
      const url = article.image.trim();
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        const type = detectMediaType(url);
        const ytId = type === 'youtube' ? extractYoutubeId(url) || undefined : undefined;
        items.push({
          _id: `news-cover-${article.id}`,
          title: nTitle,
          alt: nTitle,
          caption: nExcerpt
            ? (nExcerpt.length > 120 ? nExcerpt.slice(0, 120) + '...' : nExcerpt)
            : nCategory,
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
        const imgCaption = getLocalized(img, 'caption', lang) || img.caption;

        items.push({
          _id: `news-img-${article.id}-${img.id || idx}`,
          title: imgCaption ? `${nTitle} — ${imgCaption}` : nTitle,
          alt: imgCaption || nTitle,
          caption: imgCaption || nTitle,
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
    const pilTitle = getLocalized(pillar, 'title', lang) || pillar.title;
    const pilDesc = getLocalized(pillar, 'description', lang) || pillar.description;
    const pilDefault = lang === 'en' ? 'Area of action' : lang === 'it' ? 'Settore di intervento' : lang === 'de' ? 'Tätigkeitsbereich' : "Domaine d'intervention";

    if (pillar.image && pillar.image.trim()) {
      const url = pillar.image.trim();
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        const type = detectMediaType(url);
        const ytId = type === 'youtube' ? extractYoutubeId(url) || undefined : undefined;
        items.push({
          _id: `pillar-${pillar.id}`,
          title: pilTitle,
          alt: pilTitle,
          caption: pilDesc
            ? (pilDesc.length > 120 ? pilDesc.slice(0, 120) + '...' : pilDesc)
            : pilDefault,
          type,
          url,
          thumbnailUrl: ytId ? getYoutubeThumbnail(ytId) : undefined,
          youtubeId: ytId,
          date: pilDefault,
          order: 30,
          active: true,
          sourceCategory: "Domaines d'intervention",
          sourceLink: `/pillars`,
        });
      }
    }
  }

  return items;
}
