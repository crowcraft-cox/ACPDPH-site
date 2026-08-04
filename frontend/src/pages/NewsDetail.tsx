import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/adminData';

/* Renders article text with [photo:N] inline images — same as ProjectDescription */
function NewsContent({ text, images }: { text: string; images?: { id: string; url: string; caption?: string }[] }) {
  if (!text) return null;
  const parts = text.split(/(\[photo:\d+\])/g);

  return (
    <div className="space-y-4">
      {parts.map((part, i) => {
        const match = part.match(/^\[photo:(\d+)\]$/);
        if (match) {
          const photoIdx = parseInt(match[1], 10) - 1;
          const photo = images && images[photoIdx];
          if (photo) {
            return (
              <figure key={i} className="my-6 rounded-2xl overflow-hidden shadow-xl border border-white/10 relative">
                <img
                  src={photo.url}
                  alt={photo.caption || `Photo ${photoIdx + 1}`}
                  className="w-full max-h-[480px] object-cover"
                />
                <span style={{ position: 'absolute', bottom: '10px', left: '12px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', color: 'rgba(255,255,255,0.85)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', padding: '3px 8px', borderRadius: '6px', fontFamily: "'Outfit', sans-serif" }}>
                  Bright African · {new Date().getFullYear()}
                </span>
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

  const mainContent = article.content || article.excerpt;
  const badgeColor = article.color === 'ba-red' ? 'bg-ba-red' : 'bg-ba-green';

  return (
    <div className="min-h-screen">

      {/* ── HERO COVER — même structure que ProjectDetail ── */}
      <div className="relative w-full" style={{ height: 'min(70vh, 560px)', marginTop: '80px' }}>
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            style={{ display: 'block' }}
          />
        ) : (
          <div className="w-full h-full bg-ba-dark-light flex items-center justify-center">
            <span className="text-8xl opacity-30">📰</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)' }}
        />

        {/* Back Button */}
        <button
          onClick={() => navigate('/news')}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Retour aux actualités
        </button>

        {/* Hero Text */}
        <div className="absolute bottom-0 left-0 right-0 pb-10" style={{ paddingLeft: 'clamp(2rem, 5vw, 4rem)', paddingRight: 'clamp(2rem, 5vw, 4rem)' }}>
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${badgeColor} text-white`}>
                {article.category}
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                📅 {article.date}
              </span>
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-white/75 text-base md:text-lg max-w-3xl leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENT — même structure que ProjectDetail ── */}
      <div className="container-ba py-16">
        <div className="w-full">

          {/* Corps de l'article */}
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-8 rounded-full bg-ba-red inline-block" />
              À propos de cet article
            </h2>
            {mainContent ? (
              <NewsContent text={mainContent} images={article.images} />
            ) : (
              <p className="text-ba-text-secondary italic">Aucun contenu disponible pour cet article.</p>
            )}
          </section>

          {/* Galerie photos (si plus d'1 photo) — même structure que ProjectDetail */}
          {allPhotos.length > 1 && (
            <section className="mb-16">
              <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1 h-8 rounded-full bg-ba-red inline-block" />
                Galerie de photos
                <span className="text-sm font-normal text-ba-text-secondary ml-2">
                  ({allPhotos.length} photo{allPhotos.length > 1 ? 's' : ''})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {allPhotos.map((photo, i) => (
                  <div
                    key={photo.id || i}
                    className="group rounded-2xl overflow-hidden border border-white/10 bg-ba-dark-light shadow-lg"
                  >
                    <div className="relative overflow-hidden" style={{ height: '240px' }}>
                      <img
                        src={photo.url}
                        alt={photo.caption || `Photo ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Signature Bright African */}
                      <span style={{ position: 'absolute', bottom: '10px', left: '12px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', color: 'rgba(255,255,255,0.85)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', padding: '3px 8px', borderRadius: '6px', fontFamily: "'Outfit', sans-serif" }}>
                        Bright African · {new Date().getFullYear()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Back CTA — même structure que ProjectDetail */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/news"
              className="flex items-center gap-2 text-ba-text-secondary hover:text-ba-red transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Toutes les actualités
            </Link>
            <Link
              to="/act"
              className="btn btn-primary text-sm"
            >
              Soutenir nos actions →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
