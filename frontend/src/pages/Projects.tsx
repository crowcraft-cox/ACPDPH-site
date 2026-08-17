import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';
import { useI18n } from '../i18n';
import { Link } from 'react-router-dom';

const statusBadge: Record<string, string> = {
  'En cours':          'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  'Achevé':            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
  'En planification':  'bg-amber-500/20 text-amber-300 border border-amber-500/40',
};

export default function Projects() {
  const { t } = useI18n();
  const { ref, isVisible } = useScrollReveal();
  const { data } = useAdminData();
  const projects = data.projects;

  return (
    <div style={{ paddingTop: '150px' }} className="pb-20">
      {/* Page Header */}
      <div
        ref={ref}
        className={`container-ba mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-center">{t.projects.title}</h1>
        <p className="text-ba-text-secondary text-lg text-justify md:text-left leading-relaxed">
          {t.projects.subtitle}
        </p>
      </div>

      {/* Project Cards Grid */}
      <div className="container-ba">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {projects.map((proj) => {
            const photoCount = proj.images ? proj.images.length : proj.image ? 1 : 0;
            /* Short excerpt — first 150 chars of description, strip [photo:N] tags */
            const excerpt = proj.description
              ? proj.description.replace(/\[photo:\d+\]/g, '').trim().slice(0, 150) + (proj.description.length > 150 ? '…' : '')
              : '';

            return (
              <div
                key={proj.id}
                className="group flex flex-col glass-card rounded-3xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] hover:border-ba-red/30 transition-all duration-300"
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
                    <div className="w-full h-full flex items-center justify-center bg-ba-dark-light text-ba-text-muted">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
                      </svg>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className={`absolute top-4 left-4 ${proj.color || 'bg-ba-red'} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md`}>
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
                <div className="flex flex-col flex-1 p-6">
                  {/* Status & Location row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[proj.status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/40'}`}>
                      {proj.status}
                    </span>
                    <p className="text-xs text-ba-text-muted font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-ba-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span>{proj.location}</span>
                    </p>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-ba-red transition-colors leading-tight">
                    {proj.title}
                  </h3>

                  {/* Short Excerpt */}
                  <p className="text-sm text-ba-text-secondary leading-relaxed mb-6 flex-1">
                    {excerpt}
                  </p>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] mt-auto">
                    <Link
                      to={`/projects/${proj.id}`}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-ba-red/5 hover:bg-ba-red hover:text-white text-ba-red font-semibold text-sm transition-all duration-300 group/btn"
                    >
                      <span>{t.projects.view_details}</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
        <div className="mt-12 bg-ba-surface-elevated dark:bg-ba-dark-light rounded-3xl p-8 md:p-12">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">{t.projects.annual_reports}</h2>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <p className="text-ba-text-secondary text-lg max-w-2xl text-left">
              {t.projects.reports_subtitle}
            </p>
            <div className="flex flex-col gap-4 shrink-0">
              <button className="btn btn-outline border-ba-gray dark:border-ba-dark-lighter hover:bg-ba-red hover:text-white hover:border-ba-red flex items-center gap-2 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t.projects.report_pdf} 2025 (PDF)
              </button>
              <button className="btn btn-outline border-ba-gray dark:border-ba-dark-lighter hover:bg-ba-red hover:text-white hover:border-ba-red flex items-center gap-2 transition-colors">
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
