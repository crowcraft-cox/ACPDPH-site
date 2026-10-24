import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';
import { useI18n } from '../i18n';
import { Link } from 'react-router-dom';

const statusBadge: Record<string, string> = {
  'En cours':          'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  'Achevé':            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  'En planification':  'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
};

export default function Projects() {
  const { t } = useI18n();
  const { ref: headerRef } = useScrollReveal();
  const { ref: cardsContainerRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.project-card-item',
    staggerDelay: 80,
  });
  const { data } = useAdminData();
  const projects = data.projects;

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20">
      {/* Page Header */}
      <div
        ref={headerRef}
        className="container-ba mb-16 text-center"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue mb-3">
          Actions de terrain
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">{t.projects.title}</h1>
        <p className="text-ba-text-secondary text-lg max-w-3xl mx-auto leading-relaxed">
          {t.projects.subtitle}
        </p>
      </div>

      {/* Project Cards Grid */}
      <div className="container-ba">
        <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {projects.map((proj) => {
            const photoCount = proj.images ? proj.images.length : proj.image ? 1 : 0;
            const excerpt = proj.description
              ? proj.description.replace(/\[photo:\d+\]/g, '').trim().slice(0, 150) + (proj.description.length > 150 ? '…' : '')
              : '';

            return (
              <div
                key={proj.id}
                className="project-card-item group flex flex-col card card-cover card-interactive"
              >
                {/* Card Header (Cover Image) */}
                <div className="relative w-full overflow-hidden" style={{ height: '230px' }}>
                  {proj.image ? (
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
                      </svg>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-4 left-4 bg-ba-blue text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs">
                    {proj.type}
                  </div>

                  {/* Photo count badge */}
                  {photoCount > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                      </svg>
                      <span>{photoCount} photos</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-6" style={{ background: '#ffffff' }}>
                  {/* Status & Location row */}
                  <div className="card-row mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[proj.status] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                      {proj.status}
                    </span>
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-ba-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span>{proj.location}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-ba-blue transition-colors leading-tight" style={{ color: '#111827' }}>
                    {proj.title}
                  </h3>

                  {/* Short Excerpt */}
                  <p className="text-sm leading-relaxed mb-6 flex-1 break-words" style={{ color: '#6B7280' }}>
                    {excerpt}
                  </p>

                  {/* Card Footer */}
                  <div className="card-footer mt-auto pt-4">
                    <Link
                      to={`/projects/${proj.id}`}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-ba-blue/10 hover:bg-ba-blue hover:text-white text-ba-blue font-semibold text-sm transition-colors group/btn"
                    >
                      <span>{t.projects.view_details}</span>
                      <svg className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-24 text-ba-text-muted">
            <p className="text-lg">{t.projects.no_projects}</p>
          </div>
        )}

        {/* Annual Reports */}
        <div className="mt-12 card p-8 md:p-12" style={{ background: '#ffffff' }}>
          <h2 className="font-heading text-3xl font-bold mb-8 text-center" style={{ color: '#111827' }}>{t.projects.annual_reports}</h2>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <p className="text-ba-text-secondary text-lg max-w-2xl text-left leading-relaxed">
              {t.projects.reports_subtitle}
            </p>
            <div className="flex flex-col gap-4 shrink-0">
              <button className="btn btn-outline hover:bg-ba-blue hover:text-white hover:border-ba-blue flex items-center gap-2 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t.projects.report_pdf} 2025 (PDF)
              </button>
              <button className="btn btn-outline hover:bg-ba-blue hover:text-white hover:border-ba-blue flex items-center gap-2 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t.projects.report_pdf} 2024 (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
