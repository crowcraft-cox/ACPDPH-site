import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/adminData';

/* Renders news article text with [photo:N] inline images */
function NewsArticleContent({ text, images }: { text: string; images?: { id: string; url: string; caption?: string }[] }) {
  if (!text) return null;
  const parts = text.split(/(\[photo:\d+\])/g);

  return (
    <div className="space-y-6">
      {parts.map((part, i) => {
        const match = part.match(/^\[photo:(\d+)\]$/);
        if (match) {
          const photoIdx = parseInt(match[1], 10) - 1;
          const photo = images && images[photoIdx];
          if (photo) {
            return (
              <figure key={i} className="my-8 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={photo.url}
                  alt={photo.caption || `Photo ${photoIdx + 1}`}
                  className="w-full max-h-[520px] object-cover"
                />
                {photo.caption && (
                  <figcaption className="px-4 py-3 text-sm text-center text-gray-300 bg-black/80 backdrop-blur italic">
                    📷 {photo.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
          return null;
        }
        if (!part.trim()) return null;
        return (
          <p key={i} className="text-base md:text-lg text-ba-text-secondary leading-relaxed whitespace-pre-line text-justify">
            {part}
          </p>
        );
      })}
    </div>
  );
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useAdminData();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const article = data.news.find((n) => n.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!article) {
    return (
      <div style={{ paddingTop: '150px' }} className="container-ba pb-32 text-center">
        <p className="text-ba-text-secondary text-xl mb-8">Article introuvable.</p>
        <Link to="/news" className="btn btn-primary">← Retour aux actualités</Link>
      </div>
    );
  }

  const allPhotos = article.images && article.images.length > 0
    ? article.images
    : article.image ? [{ id: '0', url: article.image, caption: article.title }] : [];

  const badgeBg = article.color === 'ba-red' ? 'bg-ba-red/10 text-ba-red border-ba-red/30' : 'bg-ba-green/10 text-ba-green border-ba-green/30';
  const mainContent = article.content || article.excerpt;

  return (
    <div className="min-h-screen">
      {/* ── HERO COVER ── */}
      <div className="relative w-full" style={{ height: 'min(65vh, 520px)', marginTop: '80px' }}>
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ba-dark-light to-ba-dark flex items-center justify-center">
            <span className="text-6xl opacity-40">📰</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ba-dark via-ba-dark/60 to-transparent" />

        {/* Floating Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => navigate('/news')}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-white text-sm font-semibold hover:bg-white/20 transition-all backdrop-blur-md border border-white/20 shadow-lg"
          >
            ← Retour aux actualités
          </button>
        </div>

        {/* Hero Title & Meta */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 container-ba">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${badgeBg}`}>
              {article.category}
            </span>
            <span className="text-xs md:text-sm text-gray-300 font-medium">📅 {article.date}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-4xl">
            {article.title}
          </h1>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container-ba py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Chapeau / Excerpt Highlight */}
          {article.excerpt && article.excerpt !== mainContent && (
            <div className="p-6 md:p-8 rounded-2xl glass-card border-l-4 border-ba-red mb-10 bg-ba-red/5">
              <p className="text-lg md:text-xl font-medium text-white italic leading-relaxed">
                "{article.excerpt}"
              </p>
            </div>
          )}

          {/* Article Full Body (with embedded [photo:X] tags) */}
          <div className="mb-14">
            <NewsArticleContent text={mainContent} images={article.images} />
          </div>

          {/* 📸 GALLERY PHOTOS (If article has multiple photos) */}
          {allPhotos.length > 0 && (
            <div className="mt-16 pt-10 border-t border-white/10">
              <h3 className="font-heading text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span>📷 Galerie de photos</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-ba-text-secondary font-normal">
                  {allPhotos.length} photo{allPhotos.length > 1 ? 's' : ''}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {allPhotos.map((photo, index) => (
                  <div
                    key={photo.id || index}
                    onClick={() => setSelectedPhoto(photo.url)}
                    className="group relative rounded-2xl overflow-hidden glass-card cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-xl border border-white/10"
                    style={{ height: '200px' }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || `Photo ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-xs text-white font-medium line-clamp-2">
                        🔍 {photo.caption || `Agrandir photo ${index + 1}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share & Actions Footer */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => navigate('/news')}
              className="px-6 py-3 rounded-full glass-card text-white text-sm font-semibold hover:bg-white/20 transition-all border border-white/15"
            >
              ← Retour à toutes les actualités
            </button>

            <Link
              to="/act"
              className="px-6 py-3 rounded-full bg-ba-red text-white text-sm font-bold shadow-lg hover:bg-red-600 transition-all"
            >
              Soutenir nos actions →
            </Link>
          </div>
        </div>
      </div>

      {/* 🔍 PHOTO LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto} alt="Agrandissement" className="max-w-full max-h-[85vh] object-contain rounded-3xl" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 text-white text-xl flex items-center justify-center hover:bg-red-600 transition-all border border-white/20"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
