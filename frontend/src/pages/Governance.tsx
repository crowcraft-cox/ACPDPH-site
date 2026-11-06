import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/adminData';
import { useI18n, getLocalizedPath, type Lang } from '../i18n';
import { getGovernanceTexts, DEFAULT_GOVERNANCE_MEMBERS, type GovernanceMember } from '../data/governanceData';
import { generateSlug } from '../utils/slugify';
import { resolveImageUrl } from '../utils/imageUrl';

interface MemberCardProps {
  name: string;
  role: string;
  photo?: string;
  cvSlug?: string;
  lang: Lang;
}

function MemberCard({ name, role, photo, cvSlug, lang }: MemberCardProps) {
  const [imageError, setImageError] = useState(false);
  const resolvedPhoto = photo ? resolveImageUrl(photo) : '';
  const hasPhoto = Boolean(resolvedPhoto && !imageError);

  useEffect(() => {
    setImageError(false);
  }, [photo]);

  const photoContent = hasPhoto ? (
    <img
      src={resolvedPhoto}
      alt={lang === 'en' ? `Photo of ${name}` : lang === 'it' ? `Foto di ${name}` : lang === 'de' ? `Foto von ${name}` : `Photo de ${name}`}
      loading="lazy"
      decoding="async"
      width={600}
      height={600}
      onError={() => setImageError(true)}
      className={`w-full h-full object-cover object-top ${cvSlug ? 'transition-transform duration-300 group-hover:scale-105' : ''}`}
    />
  ) : (
    <div
      className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 ${cvSlug ? 'transition-transform duration-300 group-hover:scale-105' : ''}`}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-10 md:w-12 md:h-12 text-white"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );

  const cvPath = getLocalizedPath(`/governance/${cvSlug}`, lang);

  return (
    <article className="flex bg-white dark:bg-slate-800 rounded-none min-h-[140px] md:min-h-0 md:aspect-[3.2/1] overflow-hidden items-stretch">
      {/* Partie 1 : Photo ou Emplacement neutre (Lien vers CV si publié) */}
      {cvSlug ? (
        <Link
          to={cvPath}
          aria-label={lang === 'en' ? `View CV of ${name}` : lang === 'it' ? `Visualizza il CV di ${name}` : lang === 'de' ? `Lebenslauf von ${name} ansehen` : `Voir le CV de ${name}`}
          className="w-1/3 shrink-0 self-stretch block overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 cursor-pointer"
        >
          {photoContent}
        </Link>
      ) : (
        <div className="w-1/3 shrink-0 self-stretch overflow-hidden">
          {photoContent}
        </div>
      )}

      {/* Partie 2 : Nom, trait noir et fonction */}
      <div className="flex flex-1 min-w-0 flex-col justify-center pl-4 pr-3 md:pl-6 md:pr-6 py-3">
        <h3
          className="font-barlow-condensed font-bold text-xl sm:text-2xl md:text-[28px] lg:text-[32px] leading-[1.05] break-words text-left"
          style={{ color: 'var(--member-name-color, #3A12F4)' }}
        >
          {name}
        </h3>
        <div className="h-[3px] bg-black dark:bg-white w-full my-3 shrink-0" />
        <p className="font-sans font-bold text-black dark:text-white text-sm md:text-base lg:text-lg leading-tight m-0 text-left">
          {role}
        </p>
      </div>
    </article>
  );
}

export default function Governance() {
  const { data } = useAdminData();
  const { lang, getLocalized } = useI18n();

  const allMembers: GovernanceMember[] =
    data.governanceMembers && data.governanceMembers.length > 0
      ? data.governanceMembers
      : DEFAULT_GOVERNANCE_MEMBERS;

  const boardMembers = allMembers.filter((m) => m.organ === 'board');
  const auditMembers = allMembers.filter((m) => m.organ === 'audit');
  const secretariatMembers = allMembers.filter((m) => m.organ === 'secretariat');

  const { sections, mainTitle } = getGovernanceTexts(lang);

  const getMemberCvSlug = (member: GovernanceMember) => {
    const slug = generateSlug(member.name);
    const cv = (data.cvs || []).find(
      (c) => (c.memberId === member.id || c.slug === slug || generateSlug(c.memberId || '') === slug) && c.published
    );
    return cv ? (cv.slug || slug) : undefined;
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Titre principal */}
        <h1 className="font-heading text-4xl font-semibold tracking-wide text-blue-600 dark:text-blue-400 text-center uppercase mb-10">
          {mainTitle}
        </h1>

        <div className="flex flex-col gap-14">
          {/* ── SECTION 1 : ASSEMBLÉE GÉNÉRALE ── */}
          <section aria-labelledby="section-ag">
            <h2
              id="section-ag"
              className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400 uppercase text-left mb-3"
            >
              {sections.generalAssembly.title}
            </h2>
            <div className="space-y-4">
              {sections.generalAssembly.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-left md:text-justify text-base leading-relaxed text-slate-600 dark:text-slate-300 m-0"
                >
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* ── SECTION 2 : CONSEIL D'ADMINISTRATION ── */}
          <section aria-labelledby="section-ca">
            <h2
              id="section-ca"
              className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400 uppercase text-left mb-3"
            >
              {sections.board.title}
            </h2>
            <p className="text-left md:text-justify text-base leading-relaxed text-slate-600 dark:text-slate-300 m-0">
              {sections.board.intro}
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-5 list-none p-0 items-stretch">
              {boardMembers.map((member) => (
                <li key={member.id} className="h-full">
                  <MemberCard
                    name={member.name}
                    role={getLocalized(member, 'role')}
                    photo={member.photo}
                    cvSlug={getMemberCvSlug(member)}
                    lang={lang}
                  />
                </li>
              ))}
            </ul>

            <p className="text-left md:text-justify text-base leading-relaxed text-slate-600 dark:text-slate-300 mt-5 mb-0">
              {sections.board.conclusion}
            </p>
          </section>

          {/* ── SECTION 3 : COMMISSION DE CONTRÔLE ── */}
          <section aria-labelledby="section-cc">
            <h2
              id="section-cc"
              className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400 uppercase text-left mb-3"
            >
              {sections.audit.title}
            </h2>
            <p className="text-left md:text-justify text-base leading-relaxed text-slate-600 dark:text-slate-300 m-0">
              {sections.audit.intro}
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-5 list-none p-0 items-stretch">
              {auditMembers.map((member) => (
                <li key={member.id} className="h-full">
                  <MemberCard
                    name={member.name}
                    role={getLocalized(member, 'role')}
                    photo={member.photo}
                    cvSlug={getMemberCvSlug(member)}
                    lang={lang}
                  />
                </li>
              ))}
            </ul>
          </section>

          {/* ── SECTION 4 : SECRÉTARIAT EXÉCUTIF ── */}
          <section aria-labelledby="section-se">
            <h2
              id="section-se"
              className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400 uppercase text-left mb-3"
            >
              {sections.secretariat.title}
            </h2>
            <p className="text-left md:text-justify text-base leading-relaxed text-slate-600 dark:text-slate-300 m-0">
              {sections.secretariat.intro}
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-5 list-none p-0 items-stretch">
              {secretariatMembers.map((member) => (
                <li key={member.id} className="h-full">
                  <MemberCard
                    name={member.name}
                    role={getLocalized(member, 'role')}
                    photo={member.photo}
                    cvSlug={getMemberCvSlug(member)}
                    lang={lang}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
