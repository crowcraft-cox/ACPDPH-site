import { useState } from 'react';
import { useI18n } from '../i18n';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { apiFetch } from '../services/api';

export default function ActWithUs() {
  const { t } = useI18n();
  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal();

  const [activeTab, setActiveTab] = useState<'donate' | 'membership'>('donate');

  // Donation State
  const [donationData, setDonationData] = useState({
    frequency: 'ONE_TIME',
    amount: '50',
    customAmount: '',
    currency: 'USD',
    paymentMethod: 'Mobile Money (M-Pesa / Airtel)',
    name: '',
    email: '',
  });

  // Membership State
  const [membershipData, setMembershipData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: '',
    motivation: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const finalAmount = parseFloat(donationData.customAmount || donationData.amount || '0');

    const res = await apiFetch('/donations', {
      method: 'POST',
      body: JSON.stringify({
        amount: finalAmount,
        type: donationData.frequency,
        name: donationData.name.trim() || 'Anonyme',
        email: donationData.email.trim() || 'donor@acpdph.org',
        paymentMethod: `${donationData.paymentMethod} (${donationData.currency})`,
      }),
    });

    setLoading(false);

    if (res.success) {
      setStatusMsg({
        type: 'success',
        text: `Merci pour votre générosité ! Votre promesse de don de ${finalAmount} ${donationData.currency} a été enregistrée avec succès.`,
      });
      setDonationData({
        frequency: 'ONE_TIME',
        amount: '50',
        customAmount: '',
        currency: 'USD',
        paymentMethod: 'Mobile Money (M-Pesa / Airtel)',
        name: '',
        email: '',
      });
    } else {
      setStatusMsg({
        type: 'error',
        text: res.error || 'Erreur lors de l\'enregistrement du don.',
      });
    }
  };

  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const res = await apiFetch('/membership', {
      method: 'POST',
      body: JSON.stringify(membershipData),
    });

    setLoading(false);

    if (res.success) {
      setStatusMsg({
        type: 'success',
        text: 'Votre demande d\'adhésion à l\'ACPDPH (AGENCE CONGOLAISE DE PROMOTION DES DROITS DES PERSONNES HANDICAPEES-ACPDPH) a été soumise avec succès ! Notre bureau examinera votre dossier.',
      });
      setMembershipData({
        fullName: '',
        email: '',
        phone: '',
        profession: '',
        motivation: '',
      });
    } else {
      setStatusMsg({
        type: 'error',
        text: res.error || 'Erreur lors de la soumission de la demande d\'adhésion.',
      });
    }
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20">
      {/* Header */}
      <div 
        ref={headerRef} 
        className={`container-ba mb-12 transition-all duration-700 ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-center">{t.act.title}</h1>
        <p className="text-ba-text-secondary text-lg text-center max-w-3xl mx-auto leading-relaxed">
          {t.act.subtitle}. Que ce soit par un don ponctuel ou en devenant membre actif de l'ACPDPH, votre engagement apporte un soutien direct aux personnes en situation de handicap.
        </p>

        {/* Tabs switcher */}
        <div className="flex justify-center mt-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-ba-gray-light dark:bg-ba-dark-light border border-ba-gray dark:border-ba-dark-lighter">
            <button
              onClick={() => { setActiveTab('donate'); setStatusMsg(null); }}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'donate' ? 'bg-ba-blue text-white' : 'text-ba-text-secondary hover:text-ba-blue'
              }`}
            >
              Faire un don
            </button>
            <button
              onClick={() => { setActiveTab('membership'); setStatusMsg(null); }}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'membership' ? 'bg-ba-blue text-white' : 'text-ba-text-secondary hover:text-ba-blue'
              }`}
            >
              Devenir Membre
            </button>
          </div>
        </div>
      </div>

      <div className="container-ba">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Side (Left) */}
          <div className="lg:col-span-7">

             {statusMsg && (
                <div className={`p-4 mb-6 rounded-xl text-sm flex items-center gap-3 ${
                  statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    {statusMsg.type === 'success' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.05a9 9 0 110 18 9 9 0 010-18zm0 13.5h.008v.008H12v-.008z" />
                    )}
                  </svg>
                  <span>{statusMsg.text}</span>
                </div>
              )}

             <div className="card p-6 sm:p-8 md:p-10" style={{ background: '#ffffff' }}>
               {activeTab === 'donate' ? (
                 <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-ba-blue/10 flex items-center justify-center text-ba-blue shrink-0">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                         </svg>
                      </div>
                      <div>
                         <h2 className="font-heading text-2xl font-bold">{t.act.donate_title}</h2>
                         <p className="text-ba-text-secondary">{t.act.donate_subtitle}</p>
                      </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleDonationSubmit}>
                       {/* Frequency */}
                       <div>
                         <label className="block text-sm font-medium mb-3">{t.act.frequency}</label>
                         <div className="flex gap-4">
                           <button
                             type="button"
                             onClick={() => setDonationData({ ...donationData, frequency: 'ONE_TIME' })}
                             className={`flex-1 px-4 py-3 text-center rounded-xl border-2 font-semibold transition-all ${
                               donationData.frequency === 'ONE_TIME' ? 'border-ba-blue bg-ba-blue/10 text-ba-blue' : 'border-ba-gray dark:border-ba-dark-lighter'
                             }`}
                           >
                             {t.act.one_time}
                           </button>
                           <button
                             type="button"
                             onClick={() => setDonationData({ ...donationData, frequency: 'MONTHLY' })}
                             className={`flex-1 px-4 py-3 text-center rounded-xl border-2 font-semibold transition-all ${
                               donationData.frequency === 'MONTHLY' ? 'border-ba-blue bg-ba-blue/10 text-ba-blue' : 'border-ba-gray dark:border-ba-dark-lighter'
                             }`}
                           >
                             {t.act.monthly}
                           </button>
                         </div>
                       </div>

                       {/* Amount & Currency */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium mb-2">{t.act.amount}</label>
                            <div className="flex gap-2 mb-2">
                               {['10', '20', '50', '100'].map(val => (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => setDonationData({ ...donationData, amount: val, customAmount: '' })}
                                    className={`flex-1 py-2 rounded-lg border font-medium transition-colors ${
                                      donationData.amount === val && !donationData.customAmount
                                        ? 'bg-ba-blue text-white border-ba-blue'
                                        : 'border-ba-gray dark:border-ba-dark-lighter hover:border-ba-blue'
                                    }`}
                                  >
                                     {val}
                                  </button>
                               ))}
                            </div>
                            <input
                              type="number"
                              placeholder="Autre montant..."
                              value={donationData.customAmount}
                              onChange={(e) => setDonationData({ ...donationData, customAmount: e.target.value })}
                              className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-blue transition-colors"
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-medium mb-2">{t.act.currency}</label>
                            <select
                              value={donationData.currency}
                              onChange={(e) => setDonationData({ ...donationData, currency: e.target.value })}
                              className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-blue transition-colors"
                            >
                               <option value="USD">USD ($)</option>
                               <option value="CDF">Francs Congolais (FC)</option>
                               <option value="EUR">Euro (€)</option>
                            </select>
                         </div>
                       </div>

                       {/* Donator Info */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium mb-2">Votre Nom Complet</label>
                            <input
                              type="text"
                              placeholder="Ex: Marie Kabuo"
                              value={donationData.name}
                              onChange={(e) => setDonationData({ ...donationData, name: e.target.value })}
                              className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-blue transition-colors"
                            />
                         </div>
                         <div>
                            <label className="block text-sm font-medium mb-2">Adresse Email</label>
                            <input
                              type="email"
                              placeholder="Ex: marie@gmail.com"
                              value={donationData.email}
                              onChange={(e) => setDonationData({ ...donationData, email: e.target.value })}
                              className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-blue transition-colors"
                            />
                         </div>
                       </div>

                       {/* Payment Methods */}
                       <div>
                         <label className="block text-sm font-medium mb-3">{t.act.payment_method}</label>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['Mobile Money (M-Pesa)', 'Airtel Money', 'Carte Bancaire', 'Virement / PayPal'].map(method => (
                               <button
                                key={method}
                                type="button"
                                onClick={() => setDonationData({ ...donationData, paymentMethod: method })}
                                className={`px-3 py-3 text-center text-sm rounded-lg border transition-all ${
                                  donationData.paymentMethod === method
                                    ? 'border-ba-blue bg-ba-blue/10 text-ba-blue font-bold'
                                    : 'border-ba-gray dark:border-ba-dark-lighter'
                                }`}
                               >
                                  {method}
                               </button>
                            ))}
                         </div>
                       </div>

                       <button
                        type="submit"
                        disabled={loading}
                        className={`btn btn-blue w-full flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                         {loading ? 'Enregistrement du don...' : t.act.submit_donation}
                       </button>
                    </form>
                 </div>
               ) : (
                 <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-ba-blue/10 flex items-center justify-center text-ba-blue shrink-0">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                         </svg>
                      </div>
                      <div>
                         <h2 className="font-heading text-2xl font-bold">Demande d'Adhésion (Membre)</h2>
                         <p className="text-ba-text-secondary">Rejoignez l'ACPDPH en tant que membre adhérent ou sympathisant.</p>
                      </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleMembershipSubmit}>
                      <div>
                        <label className="block text-sm font-medium mb-2">Nom Complet *</label>
                        <input
                          required
                          type="text"
                          placeholder="Ex: Patient Mupenzi"
                          value={membershipData.fullName}
                          onChange={(e) => setMembershipData({ ...membershipData, fullName: e.target.value })}
                          className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-blue transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Adresse Email *</label>
                          <input
                            required
                            type="email"
                            placeholder="Ex: patient@acpdph.org"
                            value={membershipData.email}
                            onChange={(e) => setMembershipData({ ...membershipData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-blue transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Numéro Téléphone / WhatsApp</label>
                          <input
                            type="tel"
                            placeholder="+243 990 000 000"
                            value={membershipData.phone}
                            onChange={(e) => setMembershipData({ ...membershipData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-blue transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Profession / Domaine d'Activité</label>
                        <input
                          type="text"
                          placeholder="Ex: Enseignant, Juriste, Travailleur social, Étudiant..."
                          value={membershipData.profession}
                          onChange={(e) => setMembershipData({ ...membershipData, profession: e.target.value })}
                          className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-blue transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Motivation à rejoindre l'ACPDPH</label>
                        <textarea
                          rows={4}
                          placeholder="Expliquez brièvement les raisons de votre démarche et comment vous souhaitez contribuer..."
                          value={membershipData.motivation}
                          onChange={(e) => setMembershipData({ ...membershipData, motivation: e.target.value })}
                          className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-blue transition-colors"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`btn btn-blue w-full flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'Soumission de la candidature...' : 'Soumettre ma demande d\'adhésion'}
                      </button>
                    </form>
                 </div>
               )}
             </div>

          </div>

          {/* Large Logo Side (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center p-6 space-y-6">
             <img 
               src="/logo_ACPDPH.jpg" 
               alt="ACPDPH Logo" 
               className="w-full max-w-sm md:max-w-md h-auto object-contain" 
             />
             <div className="card-sm p-6 border-l-4 border-ba-blue text-sm space-y-2" style={{ background: '#ffffff', color: '#6B7280' }}>
               <div className="font-bold text-ba-blue">Engagement éthique & Transparence</div>
               <p>Conformément aux statuts de l'ACPDPH, chaque membre s'engage à respecter les principes de promotion des droits des personnes handicapées, de non-discrimination et d'inclusion sociale.</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
