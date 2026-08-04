import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/adminData';
import { useI18n } from '../i18n';

/* Renders description text with [photo:N] inline images */
function ProjectDescription({ text, images }: { text: string; images?: { id: string; url: string; caption?: string }[] }) {
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

const statusColors: Record<string, string> = {
  'En cours':          'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  'Achevé':            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
  'En planification':  'bg-amber-500/20 text-amber-300 border border-amber-500/40',
};

export default function ProjectDetail() {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useAdminData();

  const project = data.projects.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!project) {
    return (
      <div style={{ paddingTop: '150px' }} className="container-ba pb-32 text-center">
        <p className="text-ba-text-secondary text-xl mb-8">Projet introuvable.</p>
        <Link to="/projects" className="btn btn-primary">← Retour aux projets</Link>
      </div>
    );
  }

  const allPhotos = project.images && project.images.length > 0
    ? project.images
    : project.image ? [{ id: '0', url: project.image, caption: project.title }] : [];

  return (
    <div className="min-h-screen">

      {/* ── HERO COVER ── */}
      <div className="relative w-full" style={{ height: 'min(70vh, 560px)', marginTop: '80px' }}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{ display: 'block' }}
          />
        ) : (
          <div className="w-full h-full bg-ba-dark-light flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)' }}
        />

        {/* Back Button */}
        <button
          onClick={() => navigate('/projects')}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {t.projects.back_to_projects}
        </button>

        {/* Hero Text */}
        <div className="absolute bottom-0 left-0 right-0 pb-10" style={{ paddingLeft: 'clamp(2rem, 5vw, 4rem)', paddingRight: 'clamp(2rem, 5vw, 4rem)' }}>
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${project.color || 'bg-ba-red'} text-white`}>
                {project.type}
              </span>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[project.status] || 'bg-gray-500/30 text-gray-300 border border-gray-500/40'}`}>
                {project.status}
              </span>
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
              {project.title}
            </h1>

            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <svg className="w-4 h-4 text-ba-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {project.location}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="container-ba py-16">
        <div className="w-full">

          {/* Description */}
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-8 rounded-full bg-ba-red inline-block" />
              {t.projects.about_project}
            </h2>
            {project.description ? (
              <ProjectDescription text={project.description} images={project.images} />
            ) : (
              <p className="text-ba-text-secondary italic">Aucune description disponible pour ce projet.</p>
            )}
          </section>

          {/* Photo Gallery (only if more than 1 photo and NOT already all embedded inline) */}
          {allPhotos.length > 1 && (
            <section className="mb-16">
              <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1 h-8 rounded-full bg-ba-red inline-block" />
                {t.projects.photo_gallery}
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

          {/* Back CTA */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/projects"
              className="flex items-center gap-2 text-ba-text-secondary hover:text-ba-red transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.projects.back_to_all_projects}
            </Link>
            <Link
              to="/contact"
              className="btn btn-primary text-sm"
            >
              {t.projects.contact_us_about} →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
