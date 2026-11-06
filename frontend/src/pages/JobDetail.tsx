import { useParams, Link } from 'react-router-dom';
import { useAdminData } from '../context/adminData';
import { smoothScrollTo } from '../hooks/useLenis';
import { useEffect } from 'react';
import { useI18n, getLocalized } from '../i18n';

const GRADIENT_LIST = [
  'from-blue-950 via-blue-900 to-indigo-950',
  'from-slate-900 via-blue-950 to-cyan-950',
  'from-indigo-950 via-blue-900 to-sky-950',
  'from-blue-900 via-indigo-950 to-slate-950',
  'from-teal-950 via-blue-950 to-indigo-900',
];

const formatDeadline = (dateStr?: string, lang: string = 'fr') => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang === 'it' ? 'it-IT' : lang === 'de' ? 'de-DE' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  }
  return dateStr;
};

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { data } = useAdminData();
  const { t, lang, getLocalizedPath } = useI18n();

  useEffect(() => {
    smoothScrollTo(0, { immediate: true });
  }, [id]);

  const jobs = data.jobs || [];
  const job = jobs.find((j) => String(j.id) === String(id));

  if (!job) {
    return (
      <div className="pt-28 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
        <div className="container-ba max-w-3xl text-center py-16">
          <div className="card p-8 sm:p-12 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2350D9] dark:text-blue-400 mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t.jobs.jobNotFound}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
              {t.jobs.jobNotFoundDesc}
            </p>
            <Link
              to={getLocalizedPath('/offres-emplois')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2350D9] text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>{t.jobs.backToAllJobs}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Déterminer si la date limite est expirée
  let isExpired = false;
  if (job.deadline && job.deadline.trim()) {
    const deadlineDate = new Date(job.deadline);
    if (!isNaN(deadlineDate.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      isExpired = deadlineDate < today;
    }
  }

  // Index de gradient basé sur l'identifiant pour la cohérence visuelle
  const gradientIndex = Math.abs(
    String(job.id)
      .split('')
      .reduce((acc, c) => acc + c.charCodeAt(0), 0)
  ) % GRADIENT_LIST.length;
  const gradientClass = GRADIENT_LIST[gradientIndex];

  // Lien de candidature externe (si renseigné et commence par http)
  const isExternalLink = Boolean(
    job.applicationLink &&
    job.applicationLink.trim() &&
    job.applicationLink.startsWith('http')
  );
  const externalUrl = isExternalLink ? job.applicationLink!.trim() : null;

  const jobTitle = getLocalized(job, 'title', lang);
  const jobDescription = getLocalized(job, 'description', lang);
  const jobLocation = getLocalized(job, 'location', lang);
  const jobContractType = getLocalized(job, 'contractType', lang);
  const jobProfile = getLocalized(job, 'profile', lang);
  const jobApplicationDossier = getLocalized(job, 'applicationDossier', lang);
  const missionsList = (lang === 'en' && job.missions_en && job.missions_en.length > 0)
    ? job.missions_en
    : (job.missions || []);

  // Vérifier si l'offre est longue pour répéter le bouton en haut
  const isLongOffer = Boolean(
    (jobDescription && jobDescription.length > 250) ||
    (missionsList && missionsList.length > 2) ||
    (jobProfile && jobProfile.length > 150) ||
    jobApplicationDossier
  );

  const formattedDeadline = formatDeadline(job.deadline, lang);

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
      <div className="container-ba max-w-4xl">
        {/* 1. Lien retour */}
        <div className="mb-6">
          <Link
            to={getLocalizedPath('/offres-emplois')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>{t.jobs.backToAllJobs}</span>
          </Link>
        </div>

        {/* 2. Bandeau supérieur avec le titre de l'offre */}
        <header className={`rounded-2xl p-8 sm:p-12 text-center text-white bg-gradient-to-br ${gradientClass} shadow-md mb-8`}>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wide leading-tight mb-6">
            {jobTitle}
          </h1>

          {/* 3. Ligne d'infos : lieu, contrat, date limite */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-[#FFD4A3]">
            {/* Lieu de travail */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>{jobLocation}</span>
            </div>

            {/* Type de contrat */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
              <span>
                {jobContractType}
                {job.contractPrecision ? ` – ${job.contractPrecision}` : ''}
              </span>
            </div>

            {/* Date limite */}
            {job.deadline && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span>{t.jobs.deadline} {formattedDeadline}</span>
              </div>
            )}
          </div>

          {/* Bouton haut si offre longue */}
          {isLongOffer && (
            <div className="mt-8 flex justify-center">
              {isExpired ? (
                <div className="px-6 py-3 rounded-xl bg-white/20 text-white font-heading font-bold uppercase tracking-wider text-xs">
                  {t.jobs.applicationsClosed}
                </div>
              ) : isExternalLink && externalUrl ? (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#C2530A] hover:bg-[#a84408] text-white font-heading font-bold uppercase tracking-wider text-sm transition-colors shadow-sm"
                >
                  <span>{t.jobs.applyToOffer}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              ) : (
                <Link
                  to={getLocalizedPath(`/offres-emplois/${job.id}/postuler`)}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#C2530A] hover:bg-[#a84408] text-white font-heading font-bold uppercase tracking-wider text-sm transition-colors shadow-sm"
                >
                  <span>{t.jobs.applyToOffer}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </header>

        {/* Encadré d'alerte discret pour la date limite */}
        {job.deadline && (
          <div className={`mb-8 p-4 rounded-xl border flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold ${
            isExpired
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {isExpired
                  ? t.jobs.deadlinePassed.replace('{{deadline}}', formattedDeadline)
                  : t.jobs.deadlineNotice.replace('{{deadline}}', formattedDeadline)}
              </span>
            </div>
            {isExpired && (
              <span className="shrink-0 px-2.5 py-1 rounded-md bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 text-xs font-bold uppercase tracking-wider">
                {t.jobs.closedBadge}
              </span>
            )}
          </div>
        )}

        {/* Détails du poste */}
        <div className="space-y-6 mb-12">
          {/* Section Description du poste */}
          {jobDescription && (
            <section>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.jobDescription}
              </h2>
              <div className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 text-left md:text-justify whitespace-pre-line">
                {jobDescription}
              </div>
            </section>
          )}

          {/* Section Missions principales */}
          {missionsList && missionsList.length > 0 && (
            <section>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.keyMissions}
              </h2>
              <ul className="mt-2.5 space-y-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {missionsList.map((mission, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-left md:text-justify">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2350D9] dark:bg-blue-400 mt-2 shrink-0" />
                    <span>{mission}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Section Profil recherché */}
          {jobProfile && (
            <section>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.requiredProfile}
              </h2>
              <div className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 text-left md:text-justify whitespace-pre-line">
                {jobProfile}
              </div>
            </section>
          )}

          {/* Section Dossier de candidature */}
          {jobApplicationDossier && (
            <section>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.applicationDossier}
              </h2>
              <div className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 text-left md:text-justify whitespace-pre-line">
                {jobApplicationDossier}
              </div>
            </section>
          )}

          {/* Bouton d'action principal */}
          <div className="pt-6 flex justify-end">
            {isExpired ? (
              <div className="px-8 py-3.5 rounded-xl bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-heading font-bold uppercase tracking-wider text-xs">
                {t.jobs.applicationsClosed}
              </div>
            ) : isExternalLink && externalUrl ? (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#C2530A] hover:bg-[#a84408] text-white font-heading font-bold uppercase tracking-wider text-sm transition-colors shadow-sm"
              >
                <span>{t.jobs.applyToOffer}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            ) : (
              <Link
                to={getLocalizedPath(`/offres-emplois/${job.id}/postuler`)}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#C2530A] hover:bg-[#a84408] text-white font-heading font-bold uppercase tracking-wider text-sm transition-colors shadow-sm"
              >
                <span>{t.jobs.applyToOffer}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
