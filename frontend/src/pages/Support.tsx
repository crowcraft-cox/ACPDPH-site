import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Support() {
  const { ref: headerRef } = useScrollReveal();
  const [donationFrequency, setDonationFrequency] = useState<'once' | 'monthly'>('once');
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'bank' | 'material'>('mobile');

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [donorData, setDonorData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    notes: '',
  });

  const getEffectiveAmount = () => {
    if (selectedAmount === 'custom') {
      return customAmount ? `${customAmount} $` : 'Montant libre';
    }
    return `${selectedAmount} $`;
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
      {/* ── HEADER HERO ── */}
      <section ref={headerRef} className="container-ba text-center mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue dark:bg-ba-blue/25 dark:text-blue-300 mb-3">
          Solidarité & Impact Direct
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Nous Soutenir
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Dons financiers, dons matériels, partenariats et appels à collaboration : chaque geste apporte une aide concrète aux personnes en situation de handicap à Beni et dans l'Est de la RDC.
        </p>
      </section>

      {/* ── IMPACT CONCRET DU DON ── */}
      <section className="container-ba mb-16">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ce que votre soutien permet de financer sur le terrain
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            100% des fonds collectés sont affectés aux programmes d'autonomie et d'assistance directe aux bénéficiaires.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              amount: '30 $',
              title: 'Kit Scolaire Inclusif',
              desc: 'Fournitures adaptées, uniforme et droits d\'inscription pour un enfant handicapé.',
              badge: 'Éducation',
            },
            {
              amount: '80 $',
              title: 'Paire de Béquilles & Rééducation',
              desc: 'Aides à la marche adaptées et 5 séances de kinésithérapie spécialisée.',
              badge: 'Santé & Mobilité',
            },
            {
              amount: '250 $',
              title: 'Fauteuil Roulant Tout-Terrain',
              desc: 'Fauteuil robuste adapté aux pistes et routes non asphaltées de Beni.',
              badge: 'Autonomie',
            },
            {
              amount: '500 $',
              title: 'Micro-Crédit d\'Autonomisation',
              desc: 'Financement du démarrage d\'un atelier artisanal pour une personne handicapée.',
              badge: 'Activité Économique',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="card card-interactive p-6 flex flex-col justify-between"
              style={{ background: '#ffffff' }}
            >
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue mb-3 inline-block">
                  {item.badge}
                </span>
                <span className="font-heading text-3xl font-extrabold text-ba-blue block mb-2">
                  {item.amount}
                </span>
                <h3 className="font-heading font-bold text-base mb-2" style={{ color: '#111827' }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CANAUX DE PAIEMENT & FORMULAIRE ── */}
      <section className="container-ba mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Colonne Gauche : Canaux de Don direct (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card p-6 sm:p-8" style={{ background: '#ffffff' }}>
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: '#111827' }}>
                Canaux de Règlement Officiels
              </h2>

              {/* Onglets de sélection de canal */}
              <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-zinc-900 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mobile')}
                  className={`flex-1 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                    paymentMethod === 'mobile'
                      ? 'bg-white dark:bg-zinc-800 text-ba-blue dark:text-white shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Mobile Money (RDC)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex-1 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                    paymentMethod === 'bank'
                      ? 'bg-white dark:bg-zinc-800 text-ba-blue dark:text-white shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Virement Bancaire
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('material')}
                  className={`flex-1 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                    paymentMethod === 'material'
                      ? 'bg-white dark:bg-zinc-800 text-ba-blue dark:text-white shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Dons en Nature
                </button>
              </div>

              {/* CANAL 1: MOBILE MONEY */}
              {paymentMethod === 'mobile' && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Effectuez un transfert direct via votre opérateur en République Démocratique du Congo :
                  </p>

                  {[
                    {
                      operator: 'Vodacom M-Pesa',
                      number: '+243 81 234 5678',
                      beneficiary: 'ACPDPH ASBL',
                      color: 'border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/50',
                      badge: 'M-PESA RDC',
                    },
                    {
                      operator: 'Airtel Money',
                      number: '+243 99 876 5432',
                      beneficiary: 'ACPDPH ASBL',
                      color: 'border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/50',
                      badge: 'AIRTEL MONEY',
                    },
                    {
                      operator: 'Orange Money',
                      number: '+243 89 123 4567',
                      beneficiary: 'ACPDPH ASBL',
                      color: 'border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900/50',
                      badge: 'ORANGE MONEY',
                    },
                  ].map((chan, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border ${chan.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                          {chan.badge}
                        </span>
                        <span className="font-heading font-bold text-base text-gray-900 dark:text-white block">
                          {chan.operator}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          Bénéficiaire : <strong>{chan.beneficiary}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-sm font-mono font-bold text-ba-blue dark:text-white border border-gray-200 dark:border-zinc-700 select-all">
                          {chan.number}
                        </span>
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-gray-400 italic">
                    Après transfert, vous pouvez nous transmettre une capture d'écran via WhatsApp ou via le formulaire ci-contre pour recevoir un reçu officiel de don.
                  </p>
                </div>
              )}

              {/* CANAL 2: VIREMENT BANCAIRE */}
              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Pour les dons institutionnels, virements nationaux et internationaux :
                  </p>

                  <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50 space-y-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-ba-blue block">Banque Partenaire</span>
                      <strong className="text-gray-900 dark:text-white font-heading text-base">RAWBANK / EQUITY BCDC — Agence de Beni</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-ba-blue block">Intitulé du compte</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">AGENCE CONGOLAISE DE PROMOTION DES DROITS DES PERSONNES HANDICAPEES (ACPDPH ASBL)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-blue-100 dark:border-blue-900/50">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">Compte USD</span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white select-all">01000-XXXXXXXX-USD</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">Compte CDF</span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white select-all">01000-XXXXXXXX-CDF</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-blue-100 dark:border-blue-900/50">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Code SWIFT / BIC</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white select-all">RAWBKICDXXX</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CANAL 3: DONS EN NATURE */}
              {paymentMethod === 'material' && (
                <div className="space-y-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    L'ACPDPH réceptionne directement au siège de Beni (ou via nos points focaux de Kinshasa et Goma) les équipements suivants :
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Aides à la mobilité : Fauteuils roulants (manuels ou tricycles), béquilles, cannes de marche, cannes blanches pour personnes non-voyantes.',
                      'Matériels d\'appareillage orthopédique et kinésithérapie.',
                      'Matériel scolaire adapté : Machines à écrire braille, papiers braille, loupes, ordinateurs équipés de logiciels de synthèse vocale.',
                      'Équipements pour ateliers professionnels : Machines à coudre, outillage de cordonnerie et vannerie.',
                    ].map((mat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-ba-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-xs">
                    Pour l'expédition ou le dépôt d'un colis de dons matériels, contactez directement notre secrétariat au <strong>contact@acpdph.org</strong>.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colonne Droite : Formulaire d'engagement de Don / Promesse (5 cols) */}
          <div className="lg:col-span-5">
            <div className="card p-6 sm:p-8 shadow-sm" style={{ background: '#ffffff' }}>
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white mb-2">
                    Merci pour votre engagement !
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Votre promesse de soutien de <strong>{getEffectiveAmount()}</strong> a été enregistrée avec succès. Notre équipe financière vous transmettra votre accusé officiel sous 24h.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-ba-blue text-white text-xs font-bold hover:bg-ba-blue/90"
                  >
                    Faire un autre don
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePledgeSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
                      Formulaire d'Engagement de Don
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-ba-blue/10 text-ba-blue">
                      100% Sécurisé
                    </span>
                  </div>

                  {/* Fréquence */}
                  <div className="flex gap-2 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setDonationFrequency('once')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        donationFrequency === 'once'
                          ? 'bg-white dark:bg-zinc-800 text-ba-blue dark:text-white shadow-2xs'
                          : 'text-gray-500'
                      }`}
                    >
                      Don Ponctuel
                    </button>
                    <button
                      type="button"
                      onClick={() => setDonationFrequency('monthly')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        donationFrequency === 'monthly'
                          ? 'bg-white dark:bg-zinc-800 text-ba-blue dark:text-white shadow-2xs'
                          : 'text-gray-500'
                      }`}
                    >
                      Don Mensuel
                    </button>
                  </div>

                  {/* Montant prédéfini */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Sélectionnez un montant (USD) :
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[30, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setSelectedAmount(amt)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            selectedAmount === amt
                              ? 'border-ba-blue bg-ba-blue text-white shadow-2xs'
                              : 'border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-ba-blue/50'
                          }`}
                        >
                          {amt} $
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSelectedAmount('custom')}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedAmount === 'custom'
                            ? 'border-ba-blue bg-ba-blue text-white shadow-2xs'
                            : 'border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-ba-blue/50'
                        }`}
                      >
                        Autre
                      </button>
                    </div>

                    {selectedAmount === 'custom' && (
                      <input
                        type="number"
                        min="5"
                        required
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Entrez votre montant en USD"
                        className="w-full mt-2 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Coordonnées */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Nom complet ou Entreprise *
                    </label>
                    <input
                      type="text"
                      required
                      value={donorData.fullName}
                      onChange={(e) => setDonorData({ ...donorData, fullName: e.target.value })}
                      placeholder="Prénom et Nom"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Courriel *
                      </label>
                      <input
                        type="email"
                        required
                        value={donorData.email}
                        onChange={(e) => setDonorData({ ...donorData, email: e.target.value })}
                        placeholder="votre-email@domaine.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Téléphone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={donorData.phone}
                        onChange={(e) => setDonorData({ ...donorData, phone: e.target.value })}
                        placeholder="+243..."
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Commentaire / Précision (optionnel)
                    </label>
                    <textarea
                      rows={2}
                      value={donorData.notes}
                      onChange={(e) => setDonorData({ ...donorData, notes: e.target.value })}
                      placeholder="Affectation souhaitée : bourses scolaires, fauteuils..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-ba-blue hover:bg-ba-blue/90 text-white font-heading font-bold text-sm shadow-xs transition-colors cursor-pointer"
                  >
                    Confirmer mon don ({getEffectiveAmount()})
                  </button>

                  <p className="text-[11px] text-gray-400 text-center leading-tight">
                    Votre don ouvre droit à un reçu de contribution délivré par la trésorerie de l'ACPDPH ASBL.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
