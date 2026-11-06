import { useI18n } from '../i18n';
import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';
import { OFFICE_ADDRESS } from '../constants/contact';

export default function About() {
  const { t } = useI18n();
  const { ref: headerRef } = useScrollReveal();
  const { ref: historyRef } = useScrollReveal();
  const { ref: govRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.gov-card',
    staggerDelay: 80,
  });

  const historyParagraphs = [
    t.about.historyP1,
    t.about.historyP2,
    t.about.historyP3,
    t.about.historyP4,
  ];

  const recognitionSteps = t.about.recognitionSteps || [];

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-white dark:bg-ba-dark">

      {/* ── HEADER ── */}
      <div
        ref={headerRef}
        className="container-ba text-center mb-12 sm:mb-16"
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase text-ba-blue dark:text-blue-400">
          {t.about.title}
        </h1>
      </div>

      {/* ── HISTORY & CONTEXT ── */}
      <div style={{ background: '#ffffff', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div
          ref={historyRef}
          className="container-ba"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col gap-10 md:gap-14">
              {/* HISTORIQUE */}
              <div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-wide text-ba-blue dark:text-blue-400 mb-3">
                  {t.about.historyTitle}
                </h2>
                <div className="space-y-4 text-base md:text-lg leading-relaxed text-justify" style={{ color: '#374151' }}>
                  {historyParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* NOTRE VISION */}
              <div>
                <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-wide text-ba-blue dark:text-blue-400 mb-3">
                  {t.about.visionTitle}
                </h3>
                <p className="text-base md:text-lg leading-loose text-justify" style={{ color: '#374151' }}>
                  {t.about.visionText}
                </p>
              </div>

              {/* NOTRE MISSION */}
              <div>
                <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-wide text-ba-blue dark:text-blue-400 mb-3">
                  {t.about.missionTitle}
                </h3>
                <p className="text-base md:text-lg leading-loose text-justify" style={{ color: '#374151' }}>
                  {t.about.missionText}
                </p>
              </div>

              {/* OBJECTIF SOCIAL */}
              <div>
                <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-wide text-ba-blue dark:text-blue-400 mb-3">
                  {t.about.objectiveTitle}
                </h3>
                <p className="text-base md:text-lg leading-loose text-justify" style={{ color: '#374151' }}>
                  {t.about.objectiveText}
                </p>
              </div>

              {/* STATUT JURIDIQUE */}
              <div>
                <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-wide text-ba-blue dark:text-blue-400 mb-3">
                  {t.about.legalStatusTitle}
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-justify mb-4" style={{ color: '#4B5563' }}>
                  {t.about.legalStatusDesc}
                </p>

                {/* Synthèse Identité */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: t.about.orgLabel, value: 'ACPDPH' },
                    { label: t.about.legalFormLabel, value: t.about.legalFormValue },
                    { label: t.about.legalFrameworkLabel, value: t.about.legalFrameworkValue },
                    { label: t.about.headquartersLabel, value: OFFICE_ADDRESS },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 h-full flex flex-col justify-center"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                        {item.label}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECONNAISSANCE ADMINISTRATIVE ET JURIDIQUE */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    className="w-7 h-7 text-blue-600 dark:text-blue-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <h3 className="text-xl md:text-2xl font-semibold uppercase text-blue-600 dark:text-blue-400 leading-tight">
                    {t.about.recognitionTitle}
                  </h3>
                </div>

                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mb-6">
                  {t.about.recognitionIntro}
                </p>

                <ol className="border-t border-slate-200 dark:border-slate-700 list-none p-0 m-0">
                  {recognitionSteps.map((step: any, idx: number) => (
                    <li
                      key={idx}
                      className="border-b border-slate-200 dark:border-slate-700 py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-x-5 gap-y-1"
                    >
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
                          {step.date}
                        </span>
                        <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                          {step.badge}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                          {step.title}
                        </p>
                        {step.ref && (
                          <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-1 break-all">
                            {step.ref}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Logo Card & Photo Équipe */}
            <div className="relative lg:sticky lg:top-28">
              <div
                className="relative rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-8 bg-slate-50 border-none shadow-none"
                style={{ border: 'none', boxShadow: 'none' }}
              >
                <img
                  src="/logo_ACPDPH.jpg"
                  alt="ACPDPH Logo"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              <img
                src="/images/a-propos-equipe.jpg"
                alt={t.about.teamPhotoAlt}
                loading="lazy"
                decoding="async"
                width={1200}
                height={800}
                className="w-full h-auto block mt-5 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── GOVERNANCE & DOCUMENTS ── */}
      <div style={{ background: '#ffffff', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-ba">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold" style={{ color: '#111827' }}>
              {t.governance.title}
            </h2>
          </div>

          <div ref={govRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: t.governance.generalAssembly.title, desc: t.governance.generalAssembly.p1 },
              { title: t.governance.board.title, desc: t.governance.board.intro },
              { title: t.governance.audit.title, desc: t.governance.audit.intro },
              { title: t.governance.secretariat.title, desc: t.governance.secretariat.intro },
            ].map((card, i) => (
              <div
                key={card.title}
                className="gov-card card card-interactive group p-6 sm:p-8 flex flex-col justify-between text-center"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl mx-auto mb-5 flex items-center justify-center font-bold text-sm bg-ba-blue/10 text-ba-blue transition-transform duration-200 group-hover:scale-105">
                    0{i + 1}
                  </div>
                  <h4 className="font-heading font-bold text-lg mb-3 leading-tight" style={{ color: '#111827' }}>
                    {card.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
