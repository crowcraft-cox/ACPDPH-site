import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminData } from '../context/adminData';
import { useI18n, getLocalizedPath } from '../i18n';
import type { MemberCv } from '../types';
import { generateSlug } from '../utils/slugify';
import { apiFetch } from '../services/api';
import { resolveImageUrl } from '../utils/imageUrl';

export default function MemberCvPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, getCvBySlug } = useAdminData();
  const { lang, getLocalized } = useI18n();
  const [cv, setCv] = useState<MemberCv | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // 1. Chercher d'abord dans le context local (charge depuis Atlas / fallback)
    const localCv = getCvBySlug(slug) || (data.cvs || []).find((c) => c.slug === slug || generateSlug(c.memberId || '') === slug);

    if (localCv) {
      setCv(localCv);
      setLoading(false);
      return;
    }

    // 2. Requete API backend pour recuperer le CV publie
    let isMounted = true;
    apiFetch<MemberCv>(`/cvs/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setCv(res.data);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setNotFound(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, data.cvs, getCvBySlug]);

  const backGovernancePath = getLocalizedPath('/governance', lang);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
          {lang === 'en' ? 'Loading biographical profile...' : lang === 'it' ? 'Caricamento del curriculum vitae...' : lang === 'de' ? 'Lebenslauf wird geladen...' : 'Chargement du curriculum vitae...'}
        </span>
      </div>
    );
  }

  if (notFound || !cv || !cv.published) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-slate-900 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {lang === 'en' ? 'This profile is not available.' : lang === 'it' ? 'Questo profilo non è disponibile.' : lang === 'de' ? 'Dieses Profil ist nicht verfügbar.' : "Ce CV n'est pas disponible."}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
          {lang === 'en'
            ? 'The requested profile has not been published yet or is temporarily unavailable.'
            : lang === 'it'
            ? "Il profilo richiesto non è ancora stato pubblicato o è temporaneamente non disponibile."
            : lang === 'de'
            ? "Das angeforderte Profil wurde noch nicht veröffentlicht oder ist vorübergehend nicht verfügbar."
            : "Le profil demandé n'a pas encore été publié ou a été temporairement retiré par l'administration."}
        </p>
        <Link
          to={backGovernancePath}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {lang === 'en' ? 'Back to governance' : lang === 'it' ? 'Torna alla governance' : lang === 'de' ? 'Zurück zur Governance' : 'Retour à la gouvernance'}
        </Link>
      </div>
    );
  }

  // Filtrage des coordonnees selon la visibilite
  const showPhone = Boolean(cv.visibility?.phone && cv.contact?.phone);
  const showEmail = Boolean(cv.visibility?.email && cv.contact?.email);
  const showAddress = Boolean(cv.visibility?.address && cv.contact?.address);
  const hasContactInfo = showPhone || showEmail || showAddress;

  // Localisation des champs textuels du CV
  const roleText = getLocalized(cv, 'role');
  const aboutText = getLocalized(cv, 'about');
  const skillsList = (() => {
    const langField = `skills_${lang}` as keyof typeof cv;
    const arr = cv[langField] as string[] | undefined;
    if (arr && arr.length > 0) return arr;
    if (lang !== 'en' && cv.skills_en && cv.skills_en.length > 0) return cv.skills_en;
    return cv.skills || [];
  })();
  const experiencesList = (() => {
    const langField = `experiences_${lang}` as keyof typeof cv;
    const arr = cv[langField] as any[] | undefined;
    if (arr && arr.length > 0) return arr;
    if (lang !== 'en' && cv.experiences_en && cv.experiences_en.length > 0) return cv.experiences_en;
    return cv.experiences || [];
  })();
  const educationList = (() => {
    const langField = `education_${lang}` as keyof typeof cv;
    const arr = cv[langField] as any[] | undefined;
    if (arr && arr.length > 0) return arr;
    if (lang !== 'en' && cv.education_en && cv.education_en.length > 0) return cv.education_en;
    return cv.education || [];
  })();

  const hasAbout = Boolean(aboutText && aboutText.trim().length > 0);
  const hasSkills = Boolean(skillsList && skillsList.length > 0);
  const hasLanguages = Boolean(cv.languages && cv.languages.length > 0);
  const hasExperiences = Boolean(experiencesList && experiencesList.length > 0);
  const hasEducation = Boolean(educationList && educationList.length > 0);

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-slate-200 dark:bg-slate-950 min-h-screen">
      {/* Barre d'outils au-dessus du CV */}
      <div className="max-w-[900px] mx-auto px-4 mb-4 flex items-center justify-between no-print">
        <Link
          to={backGovernancePath}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {lang === 'en' ? 'Back to governance' : lang === 'it' ? 'Torna alla governance' : lang === 'de' ? 'Zurück zur Governance' : 'Retour à la gouvernance'}
        </Link>
      </div>

      {/* ── Document CV Format A4 Portrait ─────────────────────────────────── */}
      <div
        className="cv-print-container max-w-[900px] mx-auto bg-white shadow-2xl relative overflow-hidden transition-all text-slate-900"
        style={{
          minHeight: '1270px',
        }}
      >
        {/* ── Entete Desktop (Haut gauche : Nom / Haut droit : Forme + Photo) ── */}
        <div className="relative pt-10 sm:pt-12 px-6 sm:px-10 pb-6 hidden md:block">
          {/* Haut Droit : Grande forme bleu marine collee en haut a droite */}
          <div
            className="absolute top-0 right-0 w-[42%] h-[230px] rounded-b-[100px] z-0"
            style={{ backgroundColor: 'var(--cv-navy, #1F3757)' }}
            aria-hidden="true"
          />

          {/* Photo en arche / pilule debordant en bas de la forme */}
          <div
            className="absolute right-[8%] top-[30px] w-[24%] max-w-[200px] aspect-[0.7] rounded-full border-[3px] border-white z-10 overflow-hidden shadow-lg bg-slate-100 flex items-center justify-center"
          >
            {cv.photo ? (
              <img
                src={resolveImageUrl(cv.photo)}
                alt={lang === 'en' ? `Photo of ${cv.givenNames} ${cv.familyNames}` : lang === 'it' ? `Foto di ${cv.givenNames} ${cv.familyNames}` : lang === 'de' ? `Foto von ${cv.givenNames} ${cv.familyNames}` : `Photo de ${cv.givenNames} ${cv.familyNames}`}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  const fb = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fb) fb.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              style={{ display: cv.photo ? 'none' : 'flex' }}
              className="w-full h-full items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400"
            >
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>

          {/* Haut Gauche : Prenom(s) fin + Nom(s) gras + Fonction */}
          <div className="max-w-[54%] pr-4 z-10 relative">
            <h1 className="font-josefin font-light text-4xl lg:text-[54px] tracking-tight uppercase leading-[0.95] text-slate-800 m-0">
              {cv.givenNames}
            </h1>
            <h2
              className="font-josefin font-bold text-3xl lg:text-[40px] tracking-tight uppercase leading-[1.05] mt-1 mb-2"
              style={{ color: 'var(--cv-navy, #1F3757)' }}
            >
              {cv.familyNames}
            </h2>
            <p className="font-josefin font-semibold text-black uppercase tracking-[0.15em] text-xs lg:text-sm mt-3 leading-snug">
              {roleText}
            </p>
          </div>
        </div>

        {/* ── Entete Mobile (< 768px) ─────────────────────────────────────────── */}
        <div
          className="md:hidden pt-8 pb-6 px-6 text-center text-white"
          style={{ backgroundColor: 'var(--cv-navy, #1F3757)' }}
        >
          <div className="w-36 aspect-[0.7] mx-auto rounded-full border-[3px] border-white overflow-hidden shadow-lg mb-4 bg-slate-200 flex items-center justify-center relative">
            {cv.photo ? (
              <img
                src={resolveImageUrl(cv.photo)}
                alt={lang === 'en' ? `Photo of ${cv.givenNames} ${cv.familyNames}` : lang === 'it' ? `Foto di ${cv.givenNames} ${cv.familyNames}` : lang === 'de' ? `Foto von ${cv.givenNames} ${cv.familyNames}` : `Photo de ${cv.givenNames} ${cv.familyNames}`}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  const fb = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fb) fb.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              style={{ display: cv.photo ? 'none' : 'flex' }}
              className="w-full h-full items-center justify-center bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500"
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>
          <h1 className="font-josefin font-light text-2xl uppercase tracking-tight text-slate-100 m-0">
            {cv.givenNames}
          </h1>
          <h2 className="font-josefin font-bold text-2xl uppercase tracking-tight text-white mt-0.5 mb-2">
            {cv.familyNames}
          </h2>
          <p className="font-josefin text-xs uppercase tracking-[0.15em] text-blue-200 font-semibold m-0">
            {roleText}
          </p>
        </div>

        {/* ── Corps du CV (Colonnes Desktop / Empile Mobile) ──────────────────── */}
        <div className="flex flex-col md:flex-row items-stretch">
          {/* ── COLONNE GAUCHE (Bleu marine) ── */}
          <aside
            className="w-full md:w-[38%] text-white p-6 sm:p-8 md:pl-[6%] md:pr-6 md:rounded-tr-[130px] flex flex-col gap-8 shrink-0 md:min-h-[850px]"
            style={{ backgroundColor: 'var(--cv-navy, #1F3757)' }}
          >
            {/* 1. A PROPOS */}
            {hasAbout && (
              <section aria-labelledby="cv-about">
                <h3
                  id="cv-about"
                  className="font-montserrat font-bold text-base lg:text-[19px] uppercase tracking-wider text-white mb-3"
                >
                  {lang === 'en' ? 'ABOUT' : lang === 'it' ? 'CHI SONO' : lang === 'de' ? 'ÜBER MICH' : 'À PROPOS'}
                </h3>
                <p className="font-montserrat text-xs lg:text-[13px] leading-relaxed text-slate-100 whitespace-pre-line m-0">
                  {aboutText}
                </p>
              </section>
            )}

            {/* 2. CONTACT */}
            {hasContactInfo && (
              <section aria-labelledby="cv-contact">
                <h3
                  id="cv-contact"
                  className="font-montserrat font-bold text-base lg:text-[19px] uppercase tracking-wider text-white mb-3"
                >
                  CONTACT
                </h3>
                <div className="flex flex-col gap-3">
                  {showPhone && (
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0">
                        <svg
                          className="w-4 h-4"
                          style={{ color: 'var(--cv-navy, #1F3757)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      </div>
                      <span className="font-montserrat text-xs lg:text-[13px] text-slate-100 break-all">
                        {cv.contact.phone}
                      </span>
                    </div>
                  )}

                  {showEmail && (
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0">
                        <svg
                          className="w-4 h-4"
                          style={{ color: 'var(--cv-navy, #1F3757)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <span className="font-montserrat text-xs lg:text-[13px] text-slate-100 break-all">
                        {cv.contact.email}
                      </span>
                    </div>
                  )}

                  {showAddress && (
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0">
                        <svg
                          className="w-4 h-4"
                          style={{ color: 'var(--cv-navy, #1F3757)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      </div>
                      <span className="font-montserrat text-xs lg:text-[13px] text-slate-100">
                        {cv.contact.address}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 3. COMPETENCES */}
            {hasSkills && (
              <section aria-labelledby="cv-skills">
                <h3
                  id="cv-skills"
                  className="font-montserrat font-bold text-base lg:text-[19px] uppercase tracking-wider text-white mb-3"
                >
                  {lang === 'en' ? 'SKILLS' : lang === 'it' ? 'COMPETENZE' : lang === 'de' ? 'KOMPETENZEN' : 'COMPÉTENCES'}
                </h3>
                <ul className="list-disc list-outside ml-4 space-y-2 text-xs lg:text-[13px] text-slate-100 leading-relaxed font-montserrat">
                  {skillsList.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* 4. LANGUES */}
            {hasLanguages && (
              <section aria-labelledby="cv-languages">
                <h3
                  id="cv-languages"
                  className="font-montserrat font-bold text-base lg:text-[19px] uppercase tracking-wider text-white mb-4"
                >
                  {lang === 'en' ? 'LANGUAGES' : lang === 'it' ? 'LINGUE' : lang === 'de' ? 'SPRACHEN' : 'LANGUES'}
                </h3>
                <div className="flex flex-wrap items-center gap-6">
                  {cv.languages.map((item, idx) => {
                    const radius = 22;
                    const circumference = 2 * Math.PI * radius;
                    const validLevel = Math.max(0, Math.min(100, item.level || 0));
                    const strokeDashoffset = circumference - (validLevel / 100) * circumference;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <span className="font-montserrat font-semibold text-xs text-slate-100">
                          {item.name}
                        </span>
                        <div className="relative w-14 h-14 flex items-center justify-center">
                          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 54 54">
                            <circle
                              cx="27"
                              cy="27"
                              r={radius}
                              stroke="rgba(255, 255, 255, 0.25)"
                              strokeWidth="6"
                              fill="transparent"
                            />
                            <circle
                              cx="27"
                              cy="27"
                              r={radius}
                              stroke="#FFFFFF"
                              strokeWidth="6"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>
                          <span className="absolute font-montserrat font-bold text-[11px] text-white">
                            {validLevel}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </aside>

          {/* ── COLONNE DROITE (Fond blanc) ── */}
          <main className="w-full md:w-[62%] py-8 md:py-10 pl-6 md:pl-10 pr-6 md:pr-0 flex flex-col gap-10">
            {/* EXPERIENCE */}
            {hasExperiences && (
              <section aria-labelledby="cv-experience">
                <div
                  className="border-y-2 border-l-2 rounded-l-full py-2 pl-6 pr-4 mb-6"
                  style={{ borderColor: '#BCC7D2' }}
                >
                  <h3
                    id="cv-experience"
                    className="font-montserrat font-bold text-base md:text-lg uppercase tracking-widest m-0"
                    style={{ color: 'var(--cv-navy, #1F3757)' }}
                  >
                    {lang === 'en' ? 'EXPERIENCE' : lang === 'it' ? 'ESPERIENZA' : lang === 'de' ? 'ERFAHRUNG' : 'EXPÉRIENCE'}
                  </h3>
                </div>

                <div className="space-y-6 pr-6">
                  {experiencesList.map((exp, idx) => (
                    <article key={idx} className="flex flex-col">
                      <span className="font-montserrat font-bold text-xs uppercase tracking-wider text-slate-600">
                        {exp.title}
                      </span>

                      <div className="flex flex-wrap items-baseline justify-between gap-2 mt-0.5 mb-2">
                        <h4 className="font-montserrat font-bold text-base md:text-[19px] text-slate-900 leading-snug m-0">
                          {exp.organization}
                        </h4>
                        <span className="font-montserrat font-bold text-xs md:text-sm text-slate-800 shrink-0">
                          {exp.period}
                        </span>
                      </div>

                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc list-outside ml-4 space-y-1 text-xs md:text-[13px] text-slate-700 leading-relaxed font-montserrat">
                          {exp.bullets.map((bullet: string, bIdx: number) => (
                            <li key={bIdx}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* FORMATION */}
            {hasEducation && (
              <section aria-labelledby="cv-formation">
                <div
                  className="border-y-2 border-l-2 rounded-l-full py-2 pl-6 pr-4 mb-6"
                  style={{ borderColor: '#BCC7D2' }}
                >
                  <h3
                    id="cv-formation"
                    className="font-montserrat font-bold text-base md:text-lg uppercase tracking-widest m-0"
                    style={{ color: 'var(--cv-navy, #1F3757)' }}
                  >
                    {lang === 'en' ? 'EDUCATION' : lang === 'it' ? 'FORMAZIONE' : lang === 'de' ? 'AUSBILDUNG' : 'FORMATION'}
                  </h3>
                </div>

                <div className="space-y-5 pr-6">
                  {educationList.map((edu, idx) => (
                    <article key={idx} className="flex flex-col">
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                        <h4 className="font-montserrat font-bold text-base md:text-[19px] text-slate-900 leading-snug m-0">
                          {edu.institution}
                        </h4>
                        <span className="font-montserrat font-bold text-xs md:text-sm text-slate-800 shrink-0">
                          {edu.period}
                        </span>
                      </div>

                      <p className="font-montserrat text-xs md:text-sm text-slate-600 m-0 leading-normal">
                        {edu.degree}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
