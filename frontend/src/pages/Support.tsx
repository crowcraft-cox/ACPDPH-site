import { useState } from 'react';
import { Link } from 'react-router-dom';
import { OFFICE_ADDRESS } from '../constants/contact';

export default function Support() {
  // État pour le bouton copier (id du champ copié affiché pendant 2 secondes)
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // État de l'accordéon FAQ (index de la question ouverte)
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopy = (text: string, fieldId: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedField(fieldId);
          setTimeout(() => setCopiedField(null), 2000);
        })
        .catch(() => {
          // Si l'API clipboard est bloquée, sélection manuelle silencieuse
        });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#F6F8FC] text-[#0F172A] font-body selection:bg-[#C2540A] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HERO BLEU AVEC CHIFFRES CLÉS                                          */}
      {/* ========================================================================= */}
      <section
        className="relative bg-gradient-to-b from-[#1F4FD8] to-[#163BB3] text-white pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Motifs géométriques subtils d'arrière-plan sans surcharge */}
        <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-white blur-2xl" />
        </div>

        <div className="container-ba relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Colonne Gauche : Titre et accroche (7 colonnes) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Étiquette « Nous soutenir » */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-heading font-bold uppercase tracking-wider backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#FFA04D]" aria-hidden="true" />
                <span>Nous soutenir &bull; ACPDPH</span>
              </div>

              {/* Titre fort */}
              <h1
                id="hero-title"
                className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-white"
              >
                Votre soutien transforme des vies et bâtit une société inclusive
              </h1>

              {/* Phrase d'accroche */}
              <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl">
                En République Démocratique du Congo, des milliers de personnes handicapées luttent chaque jour pour leur dignité, leur autonomie et leurs droits. Chaque don permet de financer directement des aides techniques, la scolarisation d&apos;enfants et des actions concrètes de plaidoyer sur le terrain.
              </p>

              {/* Boutons d'action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#coordonnees"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[14px] bg-[#C2540A] hover:bg-[#9F4100] text-white font-heading font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F4FD8]"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Faire un don</span>
                </a>

                <a
                  href="#impact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[14px] bg-transparent hover:bg-white/10 text-white font-heading font-bold text-sm uppercase tracking-wider border-2 border-white transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F4FD8]"
                >
                  <span>Voir l&apos;impact de votre don</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Colonne Droite : Carte chiffres clés (5 colonnes) */}
            <div className="lg:col-span-5">
              <div
                className="rounded-[18px] bg-white p-7 sm:p-9 shadow-xl border border-white/20 text-[#0F172A]"
                style={{ borderRadius: '18px' }}
              >
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#1F4FD8] block mb-1">
                    Transparence &bull; RDC
                  </span>
                  <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0F172A] leading-snug">
                    L&apos;impact de vos contributions
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Chiffre 1 */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-blue-50 text-[#1F4FD8] flex items-center justify-center shrink-0 border border-blue-100">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1F4FD8] leading-tight">
                        1 250+
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mt-0.5">
                        Personnes en situation de handicap accompagnées et outillées <span className="text-[11px] text-gray-400 font-normal">[À remplacer]</span>
                      </p>
                    </div>
                  </div>

                  {/* Chiffre 2 */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-amber-50 text-[#C2540A] flex items-center justify-center shrink-0 border border-amber-100">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F172A] leading-tight">
                        14
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mt-0.5">
                        Projets et initiatives actifs sur le terrain (Beni, Nord-Kivu, RDC) <span className="text-[11px] text-gray-400 font-normal">[À remplacer]</span>
                      </p>
                    </div>
                  </div>

                  {/* Chiffre 3 */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-700 leading-tight">
                        85 %
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mt-0.5">
                        Des dons alloués directement aux programmes de terrain <span className="text-[11px] text-gray-400 font-normal">[À remplacer]</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TROIS CARTES « COMMENT DONNER » CHEVAUCHANT LE HERO                    */}
      {/* ========================================================================= */}
      <section className="relative z-20 -mt-8 sm:-mt-12 lg:-mt-16 container-ba mb-16 sm:mb-20" aria-label="Modes de contribution">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carte 1 : Virement bancaire */}
          <div
            className="rounded-[18px] bg-white p-7 shadow-lg border border-gray-100 flex flex-col justify-between hover:translate-y-[-4px] hover:shadow-xl transition-all duration-200"
            style={{ borderRadius: '18px' }}
          >
            <div>
              <div className="w-13 h-13 rounded-[14px] bg-blue-50 text-[#1F4FD8] flex items-center justify-center mb-5 border border-blue-100">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-2.5">
                Virement bancaire
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Idéal pour les particuliers, les entreprises et les bailleurs souhaitant effectuer un don ponctuel ou récurrent en USD ou CDF, au niveau national et international.
              </p>
            </div>
            <a
              href="#virement-bancaire"
              className="inline-flex items-center gap-2 text-sm font-heading font-bold text-[#1F4FD8] hover:text-[#163BB3] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FD8] rounded-md py-1"
            >
              <span>Voir les coordonnées bancaires</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Carte 2 : Mobile Money */}
          <div
            className="rounded-[18px] bg-white p-7 shadow-lg border border-gray-100 flex flex-col justify-between hover:translate-y-[-4px] hover:shadow-xl transition-all duration-200"
            style={{ borderRadius: '18px' }}
          >
            <div>
              <div className="w-13 h-13 rounded-[14px] bg-amber-50 text-[#C2540A] flex items-center justify-center mb-5 border border-amber-100">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-2.5">
                Mobile Money (RDC)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Le moyen le plus simple et immédiat depuis votre téléphone en RDC via Vodacom M-Pesa, Airtel Money et Orange Money. Les dons sont directement perçus par l&apos;association.
              </p>
            </div>
            <a
              href="#mobile-money"
              className="inline-flex items-center gap-2 text-sm font-heading font-bold text-[#C2540A] hover:text-[#9F4100] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2540A] rounded-md py-1"
            >
              <span>Voir les numéros Mobile Money</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Carte 3 : Don en nature & bénévolat */}
          <div
            className="rounded-[18px] bg-white p-7 shadow-lg border border-gray-100 flex flex-col justify-between hover:translate-y-[-4px] hover:shadow-xl transition-all duration-200"
            style={{ borderRadius: '18px' }}
          >
            <div>
              <div className="w-13 h-13 rounded-[14px] bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 border border-emerald-100">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-2.5">
                Don en nature &amp; bénévolat
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Fauteuils roulants, cannes blanches, matériel scolaire braille, outillage professionnel ou partage de compétences : votre contribution matérielle ou humaine est précieuse.
              </p>
            </div>
            <a
              href="#don-nature"
              className="inline-flex items-center gap-2 text-sm font-heading font-bold text-emerald-700 hover:text-emerald-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-md py-1"
            >
              <span>Découvrir les besoins matériels</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION COORDONNÉES OFFICIELLES (DEUX CARTES CÔTE À CÔTE)              */}
      {/* ========================================================================= */}
      <section id="coordonnees" className="container-ba mb-20 sm:mb-24 scroll-mt-28" aria-labelledby="coordonnees-title">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#1F4FD8] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-block mb-3">
            Canaux vérifiés
          </span>
          <h2 id="coordonnees-title" className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight mb-3">
            Coordonnées officielles pour vos dons
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Pour garantir la sécurité de votre contribution, utilisez exclusivement les comptes et numéros officiels de l&apos;ACPDPH certifiés ci-dessous.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* CARTE 1 : COMPTE BANCAIRE */}
          <div
            id="virement-bancaire"
            className="rounded-[18px] bg-white p-6 sm:p-8 shadow-md border border-gray-100 scroll-mt-28"
            style={{ borderRadius: '18px' }}
          >
            <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-blue-50 text-[#1F4FD8] flex items-center justify-center border border-blue-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#0F172A]">
                    Virement bancaire
                  </h3>
                  <span className="text-xs text-gray-500">National &bull; International</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-blue-50 text-[#1F4FD8] border border-blue-200">
                  USD
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-amber-50 text-[#C2540A] border border-amber-200">
                  CDF
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Bénéficiaire */}
              <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                    Bénéficiaire
                  </span>
                  <p className="font-semibold text-sm text-[#0F172A] truncate">
                    ACPDPH ASBL <span className="text-xs font-normal text-gray-400">[À remplacer]</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('ACPDPH ASBL', 'beneficiaire')}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-semibold text-[#0F172A] transition-colors shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FD8]"
                  aria-label="Copier le nom du bénéficiaire"
                >
                  {copiedField === 'beneficiaire' ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copié</span>
                    </span>
                  ) : (
                    <span>Copier</span>
                  )}
                </button>
              </div>

              {/* Banque */}
              <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                    Banque
                  </span>
                  <p className="font-semibold text-sm text-[#0F172A] truncate">
                    RAWBANK — Agence de Beni <span className="text-xs font-normal text-gray-400">[À remplacer]</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('RAWBANK — Agence de Beni', 'banque')}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-semibold text-[#0F172A] transition-colors shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FD8]"
                  aria-label="Copier le nom de la banque"
                >
                  {copiedField === 'banque' ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copié</span>
                    </span>
                  ) : (
                    <span>Copier</span>
                  )}
                </button>
              </div>

              {/* Numéro de compte USD */}
              <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                    Numéro de compte (USD)
                  </span>
                  <p className="font-mono font-bold text-sm text-[#1F4FD8] truncate">
                    01000-00000000-USD <span className="text-xs font-normal text-gray-400">[À remplacer]</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('01000-00000000-USD', 'compte_usd')}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-semibold text-[#0F172A] transition-colors shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FD8]"
                  aria-label="Copier le numéro de compte USD"
                >
                  {copiedField === 'compte_usd' ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copié</span>
                    </span>
                  ) : (
                    <span>Copier</span>
                  )}
                </button>
              </div>

              {/* Numéro de compte CDF */}
              <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                    Numéro de compte (CDF)
                  </span>
                  <p className="font-mono font-bold text-sm text-[#0F172A] truncate">
                    01000-00000000-CDF <span className="text-xs font-normal text-gray-400">[À remplacer]</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('01000-00000000-CDF', 'compte_cdf')}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-semibold text-[#0F172A] transition-colors shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FD8]"
                  aria-label="Copier le numéro de compte CDF"
                >
                  {copiedField === 'compte_cdf' ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copié</span>
                    </span>
                  ) : (
                    <span>Copier</span>
                  )}
                </button>
              </div>

              {/* IBAN */}
              <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                    IBAN (International)
                  </span>
                  <p className="font-mono font-semibold text-xs sm:text-sm text-[#0F172A] truncate">
                    CD00 RAWB 0100 0000 0000 00 <span className="text-xs font-normal text-gray-400">[À remplacer]</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('CD00 RAWB 0100 0000 0000 00', 'iban')}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-semibold text-[#0F172A] transition-colors shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FD8]"
                  aria-label="Copier le code IBAN"
                >
                  {copiedField === 'iban' ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copié</span>
                    </span>
                  ) : (
                    <span>Copier</span>
                  )}
                </button>
              </div>

              {/* SWIFT / BIC */}
              <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                    Code SWIFT / BIC
                  </span>
                  <p className="font-mono font-bold text-sm text-[#0F172A] truncate">
                    RAWBKICDXXX <span className="text-xs font-normal text-gray-400">[À remplacer]</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('RAWBKICDXXX', 'swift')}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-semibold text-[#0F172A] transition-colors shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FD8]"
                  aria-label="Copier le code SWIFT"
                >
                  {copiedField === 'swift' ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copié</span>
                    </span>
                  ) : (
                    <span>Copier</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* CARTE 2 : MOBILE MONEY */}
          <div
            id="mobile-money"
            className="rounded-[18px] bg-white p-6 sm:p-8 shadow-md border border-gray-100 scroll-mt-28"
            style={{ borderRadius: '18px' }}
          >
            <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-amber-50 text-[#C2540A] flex items-center justify-center border border-amber-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#0F172A]">
                    Mobile Money
                  </h3>
                  <span className="text-xs text-gray-500">RDC &bull; Transfert direct</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-amber-50 text-[#C2540A] border border-amber-200">
                Paiement local
              </span>
            </div>

            <div className="space-y-4">
              {/* Opérateur 1 : Vodacom M-Pesa */}
              <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-red-600 block mb-0.5">
                    Opérateur 1 &bull; Vodacom M-Pesa
                  </span>
                  <p className="font-mono font-bold text-sm text-[#0F172A] truncate">
                    +243 81 000 0000 <span className="text-xs font-normal text-gray-400">[À remplacer]</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('+243 81 000 0000', 'mpesa')}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-semibold text-[#0F172A] transition-colors shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2540A]"
                  aria-label="Copier le numéro Vodacom M-Pesa"
                >
                  {copiedField === 'mpesa' ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copié</span>
                    </span>
                  ) : (
                    <span>Copier</span>
                  )}
                </button>
              </div>

              {/* Opérateur 2 : Airtel Money */}
              <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-red-700 block mb-0.5">
                    Opérateur 2 &bull; Airtel Money
                  </span>
                  <p className="font-mono font-bold text-sm text-[#0F172A] truncate">
                    +243 99 000 0000 <span className="text-xs font-normal text-gray-400">[À remplacer]</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('+243 99 000 0000', 'airtel')}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-semibold text-[#0F172A] transition-colors shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2540A]"
                  aria-label="Copier le numéro Airtel Money"
                >
                  {copiedField === 'airtel' ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copié</span>
                    </span>
                  ) : (
                    <span>Copier</span>
                  )}
                </button>
              </div>

              {/* Opérateur 3 : Orange Money */}
              <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-orange-600 block mb-0.5">
                    Opérateur 3 &bull; Orange Money
                  </span>
                  <p className="font-mono font-bold text-sm text-[#0F172A] truncate">
                    +243 89 000 0000 <span className="text-xs font-normal text-gray-400">[À remplacer]</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('+243 89 000 0000', 'orange')}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-semibold text-[#0F172A] transition-colors shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2540A]"
                  aria-label="Copier le numéro Orange Money"
                >
                  {copiedField === 'orange' ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copié</span>
                    </span>
                  ) : (
                    <span>Copier</span>
                  )}
                </button>
              </div>

              {/* Nom du compte bénéficiaire Mobile */}
              <div className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                    Nom du compte bénéficiaire
                  </span>
                  <p className="font-semibold text-sm text-[#0F172A] truncate">
                    ACPDPH ASBL <span className="text-xs font-normal text-gray-400">[À remplacer]</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('ACPDPH ASBL', 'nom_mobile')}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-gray-200 hover:bg-gray-50 text-xs font-heading font-semibold text-[#0F172A] transition-colors shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2540A]"
                  aria-label="Copier le nom du compte Mobile Money"
                >
                  {copiedField === 'nom_mobile' ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copié</span>
                    </span>
                  ) : (
                    <span>Copier</span>
                  )}
                </button>
              </div>

              {/* Note sur la demande de reçu */}
              <div className="p-4 rounded-[12px] bg-blue-50/70 border border-blue-100 text-xs sm:text-sm text-gray-700 space-y-1.5">
                <div className="flex items-center gap-2 font-heading font-bold text-[#1F4FD8]">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Demande de reçu officiel</span>
                </div>
                <p className="leading-relaxed text-gray-600">
                  Après votre transfert, envoyez la référence ou une capture d&apos;écran par WhatsApp au <strong className="text-[#0F172A] font-semibold">+243 97 127 7581 <span className="font-normal text-gray-400">[À remplacer]</span></strong> ou par courriel à <strong className="text-[#0F172A] font-semibold">info.acpdph.asbl.rdc@gmail.com <span className="font-normal text-gray-400">[À remplacer]</span></strong>. Un reçu de contribution vous sera remis sous 24 à 48 heures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bloc Don en nature & bénévolat */}
        <div
          id="don-nature"
          className="mt-8 rounded-[18px] bg-white p-6 sm:p-8 shadow-sm border border-gray-100 scroll-mt-28"
          style={{ borderRadius: '18px' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-[#0F172A]">
                  Dons en nature, matériels adaptés &amp; bénévolat
                </h3>
                <span className="text-xs text-gray-500">Appareillage &bull; Scolarité &bull; Compétences</span>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#1F4FD8] hover:bg-[#163BB3] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FD8]"
            >
              <span>Proposer un don matériel</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <h4 className="font-heading font-bold text-[#0F172A] text-sm mb-2">
                Équipements et matériels prioritaires recherchés :
              </h4>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Aides à la mobilité : fauteuils roulants (manuels ou tricycles tout-terrain), béquilles, déambulateurs.</li>
                <li>Cannes blanches et aides techniques pour personnes non-voyantes ou malvoyantes.</li>
                <li>Matériel scolaire adapté : machines à écrire braille, papier braille, ordinateurs équipés de logiciels vocaux.</li>
                <li>Équipements pour ateliers d&apos;apprentissage : machines à coudre, outillage de cordonnerie et vannerie.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold text-[#0F172A] text-sm mb-2">
                Points de dépôt et expédition :
              </h4>
              <p className="mb-2">
                Les colis et équipements peuvent être réceptionnés directement à notre siège de Beni ou via nos référents à Goma et Kinshasa.
              </p>
              <div className="p-3 rounded-[10px] bg-slate-50 border border-slate-200 text-xs text-gray-700">
                <strong>Adresse :</strong> {OFFICE_ADDRESS}<br />
                <strong>Contact logistique :</strong> info.acpdph.asbl.rdc@gmail.com &bull; +243 97 127 7581
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION « À QUOI SERVENT VOS DONS ? »                                  */}
      {/* ========================================================================= */}
      <section id="impact" className="container-ba mb-20 sm:mb-24 scroll-mt-28" aria-labelledby="impact-title">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#C2540A] bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 inline-block mb-3">
            Impact mesurable
          </span>
          <h2 id="impact-title" className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight mb-3">
            À quoi servent vos dons ?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Chaque franc congolais et chaque dollar apportent une réponse tangible sur le terrain. Voici ce que permettent concrètement vos contributions indicatives.
          </p>
        </div>

        {/* 4 Montants indicatifs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Montant 1 : 10 $ */}
          <div
            className="rounded-[18px] bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:border-blue-200 hover:shadow-md transition-all duration-200"
            style={{ borderRadius: '18px' }}
          >
            <div>
              <div className="font-heading font-extrabold text-3xl text-[#1F4FD8] mb-1">
                10 $
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider bg-blue-50 text-[#1F4FD8] mb-3">
                Kit scolaire adapté
              </span>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Fournitures scolaires de base et matériel adapté pour permettre à un enfant en situation de handicap de suivre sa scolarité pendant un trimestre.
              </p>
            </div>
          </div>

          {/* Montant 2 : 25 $ */}
          <div
            className="rounded-[18px] bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:border-amber-200 hover:shadow-md transition-all duration-200"
            style={{ borderRadius: '18px' }}
          >
            <div>
              <div className="font-heading font-extrabold text-3xl text-[#C2540A] mb-1">
                25 $
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider bg-amber-50 text-[#C2540A] mb-3">
                Mobilité &amp; béquilles
              </span>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Achat d&apos;une paire de béquilles métalliques ergonomiques et accompagnement kinésithérapeutique initial pour retrouver la mobilité quotidienne.
              </p>
            </div>
          </div>

          {/* Montant 3 : 50 $ */}
          <div
            className="rounded-[18px] bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:border-blue-200 hover:shadow-md transition-all duration-200"
            style={{ borderRadius: '18px' }}
          >
            <div>
              <div className="font-heading font-extrabold text-3xl text-[#1F4FD8] mb-1">
                50 $
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider bg-blue-50 text-[#1F4FD8] mb-3">
                Autonomisation
              </span>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Appui au démarrage d&apos;une activité génératrice de revenus (petit élevage, artisanat, atelier de couture) pour une femme ou un jeune handicapé.
              </p>
            </div>
          </div>

          {/* Montant 4 : 100 $ */}
          <div
            className="rounded-[18px] bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:border-emerald-200 hover:shadow-md transition-all duration-200"
            style={{ borderRadius: '18px' }}
          >
            <div>
              <div className="font-heading font-extrabold text-3xl text-emerald-700 mb-1">
                100 $
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 mb-3">
                Fauteuil roulant &bull; Appareillage
              </span>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Contribution majeure à l&apos;acquisition et l&apos;adaptation sur mesure d&apos;un fauteuil roulant tout-terrain adapté aux routes difficiles de Beni.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Barres de répartition des fonds */}
        <div
          className="rounded-[18px] bg-white p-7 sm:p-9 shadow-md border border-gray-100"
          style={{ borderRadius: '18px' }}
        >
          <div className="max-w-2xl mb-6">
            <h3 className="font-heading font-bold text-xl text-[#0F172A] mb-1.5">
              Répartition rigoureuse de chaque don
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              L&apos;ACPDPH s&apos;engage à une gestion transparente de ses ressources conformément aux principes éthiques de l&apos;action communautaire inclusive.
            </p>
          </div>

          <div className="space-y-6">
            {/* Barre 1 : Projets terrain (80%) */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-heading font-bold text-[#0F172A] mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#1F4FD8]" aria-hidden="true" />
                  <span>Projets &amp; actions directes sur le terrain (aides techniques, santé, éducation)</span>
                </span>
                <span className="text-[#1F4FD8] font-extrabold">80 %</span>
              </div>
              <div
                className="w-full h-3 rounded-full bg-slate-100 overflow-hidden"
                role="progressbar"
                aria-valuenow={80}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="80% alloués aux projets et actions directes"
              >
                <div className="h-full bg-[#1F4FD8] rounded-full transition-all duration-500" style={{ width: '80%' }} />
              </div>
            </div>

            {/* Barre 2 : Plaidoyer & droits (12%) */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-heading font-bold text-[#0F172A] mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#C2540A]" aria-hidden="true" />
                  <span>Plaidoyer juridique, sensibilisation communautaire &amp; inclusion institutionnelle</span>
                </span>
                <span className="text-[#C2540A] font-extrabold">12 %</span>
              </div>
              <div
                className="w-full h-3 rounded-full bg-slate-100 overflow-hidden"
                role="progressbar"
                aria-valuenow={12}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="12% alloués au plaidoyer juridique et à la sensibilisation"
              >
                <div className="h-full bg-[#C2540A] rounded-full transition-all duration-500" style={{ width: '12%' }} />
              </div>
            </div>

            {/* Barre 3 : Fonctionnement (8%) */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-heading font-bold text-[#0F172A] mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#64748B]" aria-hidden="true" />
                  <span>Frais administratifs, contrôle de gestion &amp; gouvernance transparente</span>
                </span>
                <span className="text-gray-600 font-extrabold">8 %</span>
              </div>
              <div
                className="w-full h-3 rounded-full bg-slate-100 overflow-hidden"
                role="progressbar"
                aria-valuenow={8}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="8% alloués aux frais administratifs et à la gouvernance"
              >
                <div className="h-full bg-[#64748B] rounded-full transition-all duration-500" style={{ width: '8%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FAQ EN ACCORDÉON                                                       */}
      {/* ========================================================================= */}
      <section className="container-ba mb-20 sm:mb-24" aria-labelledby="faq-title">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#1F4FD8] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-block mb-3">
            Questions fréquentes
          </span>
          <h2 id="faq-title" className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight mb-3">
            Tout ce que vous devez savoir sur votre don
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Consultez les réponses aux questions les plus fréquentes concernant la sécurité de votre versement et le suivi de vos dons.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              question: 'Mon don est-il sécurisé ?',
              answer:
                'Oui, absolument. Notre site web ne collecte aucune coordonnée bancaire, aucun mot de passe ni aucune donnée de carte de crédit. Vous effectuez votre transaction directement depuis votre propre compte bancaire ou via l’application de votre opérateur Mobile Money officiel, en utilisant nos identifiants officiels.',
            },
            {
              question: 'Comment obtenir un reçu officiel de don ?',
              answer:
                'Dès que vous avez réalisé votre virement ou votre transfert Mobile Money, transmettez-nous la référence de transaction ou une capture d’écran par e-mail à info.acpdph.asbl.rdc@gmail.com ou par message WhatsApp au +243 97 127 7581. La trésorerie de l’ACPDPH vous délivrera une attestation officielle sous 24 à 48 heures.',
            },
            {
              question: 'Puis-je mettre en place un don régulier ?',
              answer:
                'Oui. Pour les virements bancaires, vous pouvez programmer un ordre de virement périodique (mensuel ou trimestriel) auprès de votre agence bancaire. Pour le Mobile Money, nous pouvons convenir d’un rappel discret selon votre calendrier de préférence.',
            },
            {
              question: 'Comment suivre l’utilisation de mon don sur le terrain ?',
              answer:
                'L’ACPDPH publie des rapports d’activités et des bilans financiers réguliers. Les donateurs enregistrés reçoivent des informations concrètes et transparentes sur les remises de matériel, les scolarisations financées et les avancées concrètes obtenues grâce à leur soutien.',
            },
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-[18px] bg-white border border-gray-100 shadow-xs overflow-hidden transition-all duration-200"
                style={{ borderRadius: '18px' }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-heading font-bold text-base sm:text-lg text-[#0F172A] hover:text-[#1F4FD8] transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-[#1F4FD8] focus-visible:ring-inset cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  <span>{item.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-blue-50 text-[#1F4FD8] rotate-180' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="px-6 pb-6 pt-1 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-50"
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BANDEAU FINAL SOMBRE « UNE QUESTION SUR VOTRE DON ? »                  */}
      {/* ========================================================================= */}
      <section className="bg-[#0F172A] text-white py-16 sm:py-20" aria-labelledby="cta-title">
        <div className="container-ba">
          <div className="max-w-4xl mx-auto rounded-[18px] bg-slate-900/80 border border-slate-800 p-8 sm:p-12 text-center space-y-6">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#FFA04D] inline-block">
              Échange &bull; Transparence &bull; Partenariat
            </span>

            <h2 id="cta-title" className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Une question sur votre don ou un partenariat ?
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Notre équipe se tient à votre entière disposition pour échanger sur vos projets philanthropiques, convenir d&apos;un partenariat institutionnel ou organiser la remise d&apos;un don matériel.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[14px] bg-[#C2540A] hover:bg-[#9F4100] text-white font-heading font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
              >
                <span>Nous contacter</span>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-gray-400">
              <a
                href="mailto:info.acpdph.asbl.rdc@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded py-1 px-2"
              >
                <svg className="w-4 h-4 text-[#FFA04D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info.acpdph.asbl.rdc@gmail.com</span>
              </a>

              <a
                href="tel:+243971277581"
                className="flex items-center gap-2 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded py-1 px-2"
              >
                <svg className="w-4 h-4 text-[#FFA04D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+243 97 127 7581</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
