import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/adminData';
import type { GalleryItem } from '../types';
import { aggregateAllGalleryItems, getYoutubeThumbnail } from '../utils/galleryAggregator';

type MediaTypeFilter = 'all' | 'image' | 'video';

const ITEMS_PER_PAGE = 12;
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ─── Formatage de date ────────────────────────────────────────────────────────
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ items, index, onClose, onPrev, onNext }: LightboxProps) {
  const item = items[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!item) return null;

  const isVideo = item.type === 'video';
  const isYoutube = item.type === 'youtube';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Bouton Fermer */}
      <button
        onClick={onClose}
        aria-label="Fermer la galerie"
        className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Bouton Précédent */}
      {index > 0 && (
        <button
          onClick={onPrev}
          aria-label="Élément précédent"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Contenu principal */}
      <div className="max-w-5xl max-h-[92vh] w-full flex flex-col items-center justify-center gap-3">
        {isYoutube && item.youtubeId ? (
          <div className="w-full aspect-video max-h-[72vh] rounded-lg overflow-hidden shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : isVideo ? (
          <video
            src={item.url.startsWith('/') && !item.url.startsWith('/images') && !item.url.startsWith('/pillars') ? `${API_BASE}${item.url}` : item.url}
            controls
            autoPlay
            className="max-h-[72vh] max-w-full rounded-lg shadow-2xl"
            aria-label={item.alt}
          />
        ) : (
          <img
            src={item.url.startsWith('/') && !item.url.startsWith('/images') && !item.url.startsWith('/pillars') && !item.url.startsWith('data:') ? `${API_BASE}${item.url}` : item.url}
            alt={item.alt}
            className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-2xl"
          />
        )}

        {/* Informations */}
        <div className="text-center text-white max-w-2xl px-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            {item.sourceCategory && (
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                {item.sourceCategory}
              </span>
            )}
            {item.date && (
              <span className="text-white/60 text-xs">
                {formatDate(item.date)}
              </span>
            )}
          </div>

          <h3 className="font-heading font-bold text-lg text-white">
            {item.title}
          </h3>

          {item.caption && (
            <p className="text-white/80 text-sm mt-1 leading-relaxed">
              {item.caption}
            </p>
          )}

          {item.sourceLink && (
            <div className="mt-3">
              <Link
                to={item.sourceLink}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark,#1a3fad)] text-white rounded transition-colors"
              >
                <span>Voir la publication complète</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        <p className="text-white/40 text-xs mt-1">
          {index + 1} / {items.length}
        </p>
      </div>

      {/* Bouton Suivant */}
      {index < items.length - 1 && (
        <button
          onClick={onNext}
          aria-label="Élément suivant"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Carte Média ──────────────────────────────────────────────────────────────
interface CardProps {
  item: GalleryItem;
  onClick: () => void;
}

function MediaCard({ item, onClick }: CardProps) {
  const thumb =
    item.type === 'youtube' && item.youtubeId
      ? getYoutubeThumbnail(item.youtubeId)
      : item.thumbnailUrl || item.url;

  const resolvedThumb =
    thumb.startsWith('/') && !thumb.startsWith('/images') && !thumb.startsWith('/pillars') && !thumb.startsWith('data:')
      ? `${API_BASE}${thumb}`
      : thumb;

  return (
    <article
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 flex flex-col"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      tabIndex={0}
      role="button"
      aria-label={`Ouvrir: ${item.title}`}
    >
      {/* Miniature pleine largeur sans rien par-dessus */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={resolvedThumb}
          alt={item.alt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Indicateur de lecture pour les vidéos */}
        {item.type !== 'image' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/15 transition-colors">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${item.type === 'youtube' ? 'bg-red-600 text-white' : 'bg-white text-[var(--color-primary)]'}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Texte et pied de carte */}
      <div className="p-3.5 flex flex-col flex-grow">
        <h3 className="font-heading font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
          {item.title}
        </h3>
        {item.caption && (
          <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {item.caption}
          </p>
        )}
        <div className="mt-auto pt-2 flex items-center justify-between text-gray-400 text-[11px]">
          <span className="font-medium text-gray-500">
            {item.sourceCategory === 'Projets'
              ? 'Projet'
              : item.sourceCategory === 'Actualités'
              ? 'Actualité'
              : item.sourceCategory === "Domaines d'intervention"
              ? 'Domaine'
              : item.sourceCategory || (item.date ? formatDate(item.date) : 'Galerie')}
          </span>
          <span className="text-[var(--color-primary)] font-semibold text-[11px] group-hover:underline">
            Voir
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Page Principale Galerie ──────────────────────────────────────────────────
export default function Gallery() {
  const { data, gallery } = useAdminData();

  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaTypeFilter>('all');
  const [page, setPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [backendItems, setBackendItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Définir le titre du document
  useEffect(() => {
    document.title = 'Galeries - ACPDPH';
  }, []);

  // Synchronisation avec l'API backend si disponible
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/v1/gallery`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setBackendItems(d.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Agrégation dynamique complète des médias de toutes les sources
  const allItems = useMemo(() => {
    const combinedCustom: GalleryItem[] = [...gallery];
    backendItems.forEach((b) => {
      if (!combinedCustom.some((c) => c._id === b._id || c.url === b.url)) {
        combinedCustom.push(b);
      }
    });

    return aggregateAllGalleryItems(data.projects, data.news, data.pillars, combinedCustom);
  }, [data.projects, data.news, data.pillars, gallery, backendItems]);

  // Filtrage par Type de média (Tout / Photos / Vidéos), affichant toutes les sources simultanément
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (mediaTypeFilter === 'video') {
        return item.type === 'video' || item.type === 'youtube';
      }
      if (mediaTypeFilter === 'image') {
        return item.type === 'image';
      }
      return true;
    });
  }, [allItems, mediaTypeFilter]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginated = filteredItems.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = page < totalPages;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const goNext = () => setLightboxIndex((i) => (i !== null && i < paginated.length - 1 ? i + 1 : i));

  const handleMediaTypeChange = (f: MediaTypeFilter) => {
    setMediaTypeFilter(f);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((p) => p + 1);
  };

  // Compteurs pour les filtres (indépendants de la source)
  const photosCount = allItems.filter((i) => i.type === 'image').length;
  const videosCount = allItems.filter((i) => i.type === 'video' || i.type === 'youtube').length;

  return (
    <div className="min-h-screen bg-gray-50" ref={topRef}>
      {/* ── Hero ── */}
      <section
        className="relative py-12 md:py-16 text-white mb-8"
        style={{ background: 'linear-gradient(135deg, #1F4FDB 0%, #1a3fad 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-wider">
            Galeries
          </h1>
        </div>
      </section>

      {/* ── Contenu ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {/* Barre de filtres : Type de média */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-gray-200 pb-4" role="tablist" aria-label="Filtrer par type de média">
          <div className="flex flex-wrap items-center gap-2">
            <button
              role="tab"
              aria-selected={mediaTypeFilter === 'all'}
              onClick={() => handleMediaTypeChange('all')}
              className={`px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] min-h-[38px] ${
                mediaTypeFilter === 'all'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              Tous les médias ({allItems.length})
            </button>
            <button
              role="tab"
              aria-selected={mediaTypeFilter === 'image'}
              onClick={() => handleMediaTypeChange('image')}
              className={`px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] min-h-[38px] ${
                mediaTypeFilter === 'image'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              Photos ({photosCount})
            </button>
            <button
              role="tab"
              aria-selected={mediaTypeFilter === 'video'}
              onClick={() => handleMediaTypeChange('video')}
              className={`px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] min-h-[38px] ${
                mediaTypeFilter === 'video'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              Vidéos ({videosCount})
            </button>
          </div>

          <span className="text-xs font-semibold text-gray-400">
            {filteredItems.length} élément{filteredItems.length > 1 ? 's' : ''} affiché{filteredItems.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Chargement */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* État vide */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-24 text-gray-400 bg-white rounded-2xl border border-gray-100 p-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 mx-auto mb-4 opacity-40">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="font-heading font-semibold text-lg text-gray-700">Aucun média dans cette sélection</p>
            <p className="text-sm text-gray-400 mt-1">
              Sélectionnez "Tous les médias" pour voir l'ensemble des éléments disponibles.
            </p>
          </div>
        )}

        {/* Grille des médias */}
        {!loading && paginated.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginated.map((item, idx) => (
              <MediaCard key={item._id} item={item} onClick={() => openLightbox(idx)} />
            ))}
          </div>
        )}

        {/* Bouton Voir plus */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark,#1a3fad)] text-white font-heading font-bold uppercase tracking-wider text-xs rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] min-h-[46px] shadow-sm"
            >
              Voir plus ({filteredItems.length - paginated.length} restants)
            </button>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={paginated}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}
