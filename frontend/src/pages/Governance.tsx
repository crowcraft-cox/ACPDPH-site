import { useAdminData } from '../context/adminData';
import { GOVERNANCE_TEXTS, DEFAULT_GOVERNANCE_MEMBERS, getInitials, type GovernanceMember } from '../data/governanceData';

interface MemberCardProps {
  name: string;
  role: string;
}

function MemberCard({ name, role }: MemberCardProps) {
  const initials = getInitials(name);

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 h-full flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
          {name}
        </div>
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          {role}
        </div>
      </div>
    </div>
  );
}

export default function Governance() {
  const { data } = useAdminData();

  const allMembers: GovernanceMember[] =
    data.governanceMembers && data.governanceMembers.length > 0
      ? data.governanceMembers
      : DEFAULT_GOVERNANCE_MEMBERS;

  const boardMembers = allMembers.filter((m) => m.organ === 'board');
  const auditMembers = allMembers.filter((m) => m.organ === 'audit');
  const secretariatMembers = allMembers.filter((m) => m.organ === 'secretariat');

  const { sections, mainTitle } = GOVERNANCE_TEXTS;

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

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 list-none p-0">
              {boardMembers.map((member) => (
                <li key={member.id} className="h-full">
                  <MemberCard name={member.name} role={member.role} />
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

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 list-none p-0">
              {auditMembers.map((member) => (
                <li key={member.id} className="h-full">
                  <MemberCard name={member.name} role={member.role} />
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

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 list-none p-0">
              {secretariatMembers.map((member) => (
                <li key={member.id} className="h-full">
                  <MemberCard name={member.name} role={member.role} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
