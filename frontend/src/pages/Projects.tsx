import { useState } from 'react';
import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';
import { useI18n } from '../i18n';
import { Link } from 'react-router-dom';
import { formatProjectDate } from '../utils/dateFormatter';

export default function Projects() {
  const { t } = useI18n();
  const { ref: headerRef } = useScrollReveal();
  const { ref: cardsContainerRef } = useAnimeReveal<HTMLUListElement>({
    variant: 'stagger-cards',
    itemSelector: '.project-card-item',
    staggerDelay: 80,
  });
  const { data } = useAdminData();

  const [visibleCount, setVisibleCount] = useState(12);

  // Tri décroissant par date (les plus récents d'abord)
  const sortedProjects = [...(data.projects || [])].sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : 0;
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    return timeB - timeA;
  });

  const displayedProjects = sortedProjects.slice(0, visibleCount);

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

      {/* Project Cards Grid (IDDC design) */}
      <div className="container-ba mb-20">
        <ul ref={cardsContainerRef} role="list" className="projects-grid">
          {displayedProjects.map((proj) => {
            const dateInfo = formatProjectDate(proj.date);
            return (
              <li key={proj.id} className="project-card-item">
                <Link
                  to={`/projects/${proj.id}`}
                  className="project-card-link"
                  aria-label={`${proj.title}, ${dateInfo.accessible}`}
                >
                  {/* Photo : hauteur fixe 170px, ratio 16:9 sur <600px */}
                  <div className="project-card-image-wrap">
                    {proj.image ? (
                      <img
                        src={proj.image}
                        alt=""
                        loading="lazy"
                        className="project-card-image"
                      />
                    ) : (
                      <div className="project-card-image-fallback" aria-hidden="true">
                        <svg className="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Panneau coloré bleu (#1F4FDB) */}
                  <div className="project-card-body">
                    <h3 className="project-card-title">
                      {proj.title}
                    </h3>
                    <time dateTime={dateInfo.iso} className="project-card-date">
                      {dateInfo.display}
                    </time>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Chargement progressif / pagination par 12 */}
        {visibleCount < sortedProjects.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="btn btn-outline btn-lg"
            >
              Charger plus de projets
            </button>
          </div>
        )}

        {sortedProjects.length === 0 && (
          <div className="text-center py-24 text-ba-text-muted">
            <p className="text-lg">{t.projects.no_projects}</p>
          </div>
        )}

        {/* Annual Reports */}
        <div className="mt-16 card p-8 md:p-12" style={{ background: '#ffffff' }}>
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
