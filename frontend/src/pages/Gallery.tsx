import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface GalleryItem {
  _id: string;
  title: string;
  alt: string;
  caption?: string;
  type: 'image' | 'video' | 'youtube';
  url: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  date: string;
  order: number;
}

type Filter = 'all' | 'image' | 'video';

const ITEMS_PER_PAGE = 12;
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ─── Demo fallback items ───────────────────────────────────────────────────────
const DEMO_ITEMS: GalleryItem[] = [
  {
    _id: 'd1', title: 'Atelier de sensibilisation', alt: 'Participants a un atelier de sensibilisation',
    caption: 'Formation des acteurs communautaires', type: 'image',
    url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80',
    date: '2024-06-15', order: 0,
  },
  {
    _id: 'd2', title: 'Remise de kits scolaires', alt: 'Distribution de kits scolaires aux enfants',
    caption: 'Appui a la scolarisation des enfants en situation de handicap', type: 'image',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
    date: '2024-05-20', order: 1,
  },
  {
    _id: 'd3', title: 'Forum des droits', alt: 'Forum national sur les droits des personnes handicapees',
    caption: 'Plaidoyer pour l\'inclusion sociale', type: 'image',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    date: '2024-04-10', order: 2,
  },
  {
    _id: 'd4', title: 'Formation aux droits', alt: 'Session de formation aux droits',
    type: 'image', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
    date: '2024-03-05', order: 3,
  },
  {
    _id: 'd5', title: 'Rencontre partenariale', alt: 'Reunions avec les partenaires institutionnels',
    type: 'image', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
    date: '2024-02-18', order: 4,
  },
  {
    _id: 'd6', title: 'Mission de terrain', alt: 'Equipe en mission de terrain dans une communaute',
    type: 'image', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80',
    date: '2024-01-30', order: 5,
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function getYoutubeThumbnail(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
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

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      role="dialog" aria-modal="true" aria-label={item.title}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Fermer la galerie"
        className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={onPrev}
          aria-label="Element precedent"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      )}

      {/* Content */}
      <div className="max-w-5xl max-h-[90vh] w-full mx-14 flex flex-col items-center gap-3">
        {item.type === 'youtube' && item.youtubeId ? (
          <div className="w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        ) : item.type === 'video' ? (
          <video
            src={item.url.startsWith('/') ? `${API_BASE}${item.url}` : item.url}
            controls autoPlay
            className="max-h-[75vh] rounded-lg"
            aria-label={item.alt}
          />
        ) : (
          <img
            src={item.url.startsWith('/') ? `${API_BASE}${item.url}` : item.url}
            alt={item.alt}
            className="max-h-[75vh] max-w-full object-contain rounded-lg"
          />
        )}
        <div className="text-center">
          <p className="text-white font-heading font-semibold text-base">{item.title}</p>
          {item.caption && <p className="text-white/70 text-sm mt-1">{item.caption}</p>}
          <p className="text-white/50 text-xs mt-1">{formatDate(item.date)}</p>
        </div>
        <p className="text-white/40 text-xs">{index + 1} / {items.length}</p>
      </div>

      {/* Next */}
      {index < items.length - 1 && (
        <button
          onClick={onNext}
          aria-label="Element suivant"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Media card ────────────────────────────────────────────────────────────────
interface CardProps {
  item: GalleryItem;
  onClick: () => void;
}

function MediaCard({ item, onClick }: CardProps) {
  const thumb =
    item.type === 'youtube' && item.youtubeId
      ? getYoutubeThumbnail(item.youtubeId)
      : item.thumbnailUrl
        ? (item.thumbnailUrl.startsWith('/') ? `${API_BASE}${item.thumbnailUrl}` : item.thumbnailUrl)
        : item.url.startsWith('/') ? `${API_BASE}${item.url}` : item.url;

  return (
    <article
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-100"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      tabIndex={0}
      role="button"
      aria-label={`Ouvrir: ${item.title}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {item.type === 'video' ? (
          <div className="relative w-full h-full">
            <img
              src={thumb} alt={item.alt} loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow">
                <svg viewBox="0 0 24 24" fill="var(--color-primary)" className="w-6 h-6 ml-0.5">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        ) : item.type === 'youtube' ? (
          <div className="relative w-full h-full">
            <img
              src={thumb} alt={item.alt} loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-0.5">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <img
            src={thumb} alt={item.alt} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {/* Type badge */}
        {item.type !== 'image' && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white">
            {item.type === 'youtube' ? 'YouTube' : 'Video'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-heading font-semibold text-sm text-gray-900 line-clamp-1">{item.title}</h3>
        {item.caption && <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{item.caption}</p>}
        <p className="text-gray-400 text-xs mt-1">{formatDate(item.date)}</p>
      </div>
    </article>
  );
}

// ─── Main Gallery page ────────────────────────────────────────────────────────
export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const topRef = useRef<HTMLDivElement>(null);

  // Fetch
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/v1/gallery`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.length > 0) setItems(d.data);
        else setItems(DEMO_ITEMS);
        setError('');
      })
      .catch(() => {
        setItems(DEMO_ITEMS);
        setError('');
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter
  const filtered = items.filter(it => {
    if (filter === 'all') return true;
    if (filter === 'video') return it.type === 'video' || it.type === 'youtube';
    return it.type === 'image';
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = page < totalPages;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () => setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i));
  const goNext = () => setLightboxIndex(i => (i !== null && i < paginated.length - 1 ? i + 1 : i));

  const handleFilter = (f: Filter) => {
    setFilter(f);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(p => p + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50" ref={topRef}>
      {/* ── Hero ── */}
      <section
        className="relative py-20 text-white"
        style={{ background: 'linear-gradient(135deg, #1F4FDB 0%, #1a3fad 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-wider mb-4">
            Notre Galerie
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto leading-relaxed">
            Revivez les moments forts de nos actions, formations et evenements en faveur
            de l&rsquo;inclusion et des droits des personnes vivant avec handicap en RDC.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-4" role="tablist" aria-label="Filtrer la galerie">
          {(['all', 'image', 'video'] as Filter[]).map(f => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => handleFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-heading font-semibold uppercase tracking-wider transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] min-h-[40px] ${
                filter === f
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {f === 'all' ? 'Tout' : f === 'image' ? 'Photos' : 'Videos'}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400 hidden sm:block">
            {filtered.length} element{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 mx-auto mb-4 opacity-40">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p className="font-heading font-semibold text-lg">Aucun media dans cette categorie</p>
          </div>
        )}

        {/* Grid */}
        {!loading && paginated.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((item, idx) => (
              <MediaCard key={item._id} item={item} onClick={() => openLightbox(idx)} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark,#1a3fad)] text-white font-heading font-bold uppercase tracking-wider text-sm rounded-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] min-h-[48px]"
            >
              Voir plus ({filtered.length - paginated.length} restants)
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
