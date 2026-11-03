import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { DONATION_CONFIG, DEFAULT_BANK_ACCOUNTS, BANK_DETAILS } from '../config/donationConfig';
import { OFFICE_ADDRESS, OFFICE_EMAIL, OFFICE_PHONE } from '../constants/contact';
import { apiFetch } from '../services/api';
import { useAdminData } from '../context/adminData';

export default function Support() {
  const { data } = useAdminData();
  const bankAccounts = (data?.bankAccounts && data.bankAccounts.length > 0
    ? data.bankAccounts
    : DEFAULT_BANK_ACCOUNTS).filter((acc) => acc.active !== false);

  const contactPhone = data?.contact?.phone && !data.contact.phone.includes('000') && !data.contact.phone.includes('XX')
    ? data.contact.phone
    : OFFICE_PHONE;

  // ── États du formulaire de don en 2 étapes ──
  const [step, setStep] = useState<1 | 2>(1);
  const [frequency, setFrequency] = useState<'monthly' | 'single'>('monthly');
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+243 ');
  const [newsletter, setNewsletter] = useState(false);

  // Étape 2 : Moyen de paiement
  const [paymentMethod, setPaymentMethod] = useState<'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CARD'>('MOBILE_MONEY');

  // États de soumission et erreurs
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // État de succès après confirmation
  const [donationSuccess, setDonationSuccess] = useState<{
    reference: string;
    amount: number;
    currency: string;
    frequency: 'monthly' | 'single';
    name: string;
    email: string;
    paymentMethod: string;
    paymentProvider: string;
    date: string;
  } | null>(null);

  // États d'interaction (copier, partage, accordéon FAQ)
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const customAmountInputId = useId();
  const firstNameInputId = useId();
  const lastNameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();
  const newsletterInputId = useId();

  // Montant effectif (bouton prédéfini ou personnalisé)
  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  // Montants suggérés selon la fréquence
  const suggestedAmounts =
    frequency === 'monthly'
      ? DONATION_CONFIG.suggestedMonthlyAmounts
      : DONATION_CONFIG.suggestedSingleAmounts;

  // Validation Étape 1
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!currentAmount || currentAmount < DONATION_CONFIG.minAmount) {
      errs.amount = `Le montant minimum est de ${DONATION_CONFIG.minAmount} $.`;
    }

    if (!firstName.trim()) {
      errs.firstName = 'Le prénom est requis.';
    }

    if (!lastName.trim()) {
      errs.lastName = 'Le nom de famille est requis.';
    }

    if (!email.trim()) {
      errs.email = 'L’adresse e-mail est requise.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Veuillez saisir une adresse e-mail valide.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      setServerError(null);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  // Soumission finale du soutien
  const handleConfirmDonation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'CARD') {
      setServerError(DONATION_CONFIG.cardPayment.unavailableNotice);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const providerLabel =
      paymentMethod === 'MOBILE_MONEY'
        ? 'Mobile Money'
        : (bankAccounts[0]?.bankName || BANK_DETAILS.bankName);

    try {
      const payload = {
        amount: currentAmount,
        currency: DONATION_CONFIG.defaultCurrency,
        frequency,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        country: 'RDC',
        newsletter,
        paymentMethod,
        paymentProvider: providerLabel,
      };

      const res = await apiFetch('/donations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSubmitting(false);

      if (res.success && res.data) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        setDonationSuccess({
          reference: res.data.reference || `DON-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: currentAmount,
          currency: DONATION_CONFIG.defaultCurrency,
          frequency,
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim().toLowerCase(),
          paymentMethod:
            paymentMethod === 'MOBILE_MONEY' ? 'Mobile Money (RDC)' : 'Virement bancaire',
          paymentProvider: providerLabel,
          date: formattedDate,
        });

        window.scrollTo({ top: 350, behavior: 'smooth' });
      } else {
        setServerError(
          res.error ||
            'Une erreur est survenue lors de l’enregistrement de votre engagement. Veuillez réessayer.'
        );
      }
    } catch (err: any) {
      setSubmitting(false);
      setServerError(
        'Impossible de contacter le serveur. Votre connexion internet ou le serveur est temporairement inaccessible.'
      );
    }
  };

  const handleCopyText = (text: string, key: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedKey(key);
          setTimeout(() => setCopiedKey(null), 2000);
        })
        .catch(() => {
          fallbackCopyText(text, key);
        });
    } else {
      fallbackCopyText(text, key);
    }
  };

  const fallbackCopyText = (text: string, key: string) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Ignorer si échec
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Soutenir l’ACPDPH',
          text: 'Chaque enfant a le droit d’apprendre, de grandir et d’être inclus. Soutenez les actions de l’ACPDPH au Nord-Kivu.',
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-white dark:bg-ba-dark text-[#0F172A] dark:text-slate-100 font-body selection:bg-[#C2530A] selection:text-white"
    >
      {/* ========================================================================= */}
      {/* 1. VISUEL D'ACCUEIL : PHOTO SEULE SANS AUCUN FONDU                        */}
      {/* ========================================================================= */}
      <section
        className="w-full h-[420px] md:h-[560px] lg:h-[640px] overflow-hidden bg-slate-900"
        aria-label="Visuel d'accueil"
      >
        <img
          src="/images/soutenir-hero.jpg"
          alt="Enfant assis sur une chaise dans une salle de classe, soutenu par l'ACPDPH"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover object-[50%_8%] hero-support-image"
        />
      </section>

      {/* ========================================================================= */}
      {/* 2. BANDEAU DE TEXTE BLEU UNI SOUS LA PHOTO                                */}
      {/* ========================================================================= */}
      <section
        className="w-full bg-[#2350D9] text-white py-8 md:py-10 hero-support-banner"
        aria-labelledby="hero-title"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-center">
            <div>
              <h1
                id="hero-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white font-heading"
              >
                Chaque enfant a le droit d&apos;apprendre, de grandir et d&apos;être inclus
              </h1>
            </div>

            <div>
              <p className="text-base leading-relaxed text-white/95 mb-4">
                Avec l&apos;ACPDPH, vous aidez les personnes handicapées du Nord-Kivu à accéder à l&apos;éducation, aux soins et à l&apos;autonomie.
              </p>
              <div>
                <a
                  href="#don"
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById('don');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-block bg-[#C2530A] hover:bg-[#A84508] text-white uppercase font-bold text-sm tracking-wider rounded-md px-6 py-3 transition-all duration-200 hover:-translate-y-[1px] shadow-sm cursor-pointer text-center"
                >
                  FAIRE UN DON
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DISPOSITION 2 COLONNES : FORMULAIRE & INFORMATIONS D'IMPACT           */}
      {/* (Sur mobile : le formulaire s'affiche en premier, directement sous le hero) */}
      {/* ========================================================================= */}
      <section id="don" className="container-ba py-10 sm:py-14 md:py-16 scroll-mt-6" aria-label="Don et soutien">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* ======================================================================= */}
          {/* FORMULAIRE DE DON (Col Droite sur Desktop, Ordre 1 sur Mobile)         */}
          {/* ======================================================================= */}
          <div className="order-1 lg:order-2 lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            {/* Si confirmation réussie : écran de remerciement */}
            {donationSuccess ? (
              <div className="text-left space-y-6">
                <div className="text-center pb-2">
                  <div className="w-14 h-14 mx-auto text-[#2350D9] dark:text-blue-400 flex items-center justify-center mb-3">
                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#2350D9] dark:text-blue-400">
                    Merci pour votre générosité
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    Votre engagement fait une différence concrète pour l&apos;inclusion des personnes handicapées au Nord-Kivu.
                  </p>
                </div>

                {/* Récapitulatif en lignes simples sans cartes lourdes */}
                <div className="border-t border-slate-200 dark:border-zinc-800 pt-4 space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-zinc-800">
                    <span className="text-slate-500">Référence de soutien</span>
                    <span className="font-mono font-bold text-[#2350D9] dark:text-blue-400">
                      {donationSuccess.reference}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-zinc-800">
                    <span className="text-slate-500">Montant engagé</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {donationSuccess.amount} {donationSuccess.currency} ({donationSuccess.frequency === 'monthly' ? 'Mensuel' : 'Ponctuel'})
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-zinc-800">
                    <span className="text-slate-500">Moyen choisi</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {donationSuccess.paymentMethod}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-zinc-800">
                    <span className="text-slate-500">Donateur</span>
                    <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                      {donationSuccess.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-zinc-800">
                    <span className="text-slate-500">Enregistré le</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {donationSuccess.date}
                    </span>
                  </div>
                </div>

                {/* Instructions étape par étape selon le mode */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3">
                  <div className="text-xs font-heading font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                    Finalisation de votre versement
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Veuillez indiquer impérativement la référence <strong className="font-mono text-[#2350D9] dark:text-blue-400">{donationSuccess.reference}</strong> en motif ou libellé de votre versement.
                  </p>

                  {donationSuccess.paymentMethod === 'Virement bancaire' && (
                    <div className="space-y-2 pt-1 border-l-4 border-blue-600 pl-3">
                      <div className="font-mono text-[11px] sm:text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                        <p>Banque : <strong className="font-sans font-bold text-slate-900 dark:text-white">{BANK_DETAILS.bankName}</strong> ({BANK_DETAILS.bankAddress})</p>
                        <p>Intitulé : <strong className="font-sans font-bold text-slate-900 dark:text-white">{BANK_DETAILS.accountName}</strong></p>
                        <div className="flex items-center justify-between gap-2">
                          <span>Compte ({BANK_DETAILS.currency}) : <strong className="font-bold text-slate-900 dark:text-white break-all">{BANK_DETAILS.accountNumber}</strong></span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(BANK_DETAILS.accountNumber, 'success-bank-acc')}
                            className="px-2.5 py-1 text-[11px] font-bold uppercase text-[#2350D9] dark:text-blue-400 border border-[#2350D9] dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer shrink-0"
                            aria-live="polite"
                          >
                            {copiedKey === 'success-bank-acc' ? 'COPIÉ' : 'COPIER'}
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span>SWIFT : <strong className="font-bold text-slate-900 dark:text-white">{BANK_DETAILS.swift}</strong></span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(BANK_DETAILS.swift, 'success-bank-swift')}
                            className="px-2.5 py-1 text-[11px] font-bold uppercase text-[#2350D9] dark:text-blue-400 border border-[#2350D9] dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer shrink-0"
                            aria-live="polite"
                          >
                            {copiedKey === 'success-bank-swift' ? 'COPIÉ' : 'COPIER'}
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic pt-1">
                        Indiquez votre nom en motif du virement.
                      </p>
                    </div>
                  )}

                  {donationSuccess.paymentMethod === 'Mobile Money' && (
                    <div className="space-y-2 pt-1 border-l-4 border-blue-600 pl-3">
                      <div className="text-xs text-slate-700 dark:text-slate-300 flex flex-wrap items-center justify-between gap-2">
                        <span>
                          Numéro Mobile Money ACPDPH :{' '}
                          <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="font-mono font-bold text-slate-900 dark:text-white hover:underline">
                            {contactPhone}
                          </a>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(contactPhone, 'success-mm')}
                          className="px-2.5 py-1 text-[11px] font-bold uppercase text-[#2350D9] dark:text-blue-400 border border-[#2350D9] dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer shrink-0"
                          aria-live="polite"
                        >
                          {copiedKey === 'success-mm' ? 'COPIÉ' : 'COPIER'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic pt-0.5">
                        Indiquez votre nom en référence du transfert.
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Un e-mail récapitulatif a été expédié à <strong className="text-slate-700 dark:text-slate-300">{donationSuccess.email}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(
                        `ACPDPH Don Réf: ${donationSuccess.reference} - Montant: ${donationSuccess.amount} ${donationSuccess.currency} - Donateur: ${donationSuccess.name}${
                          donationSuccess.paymentMethod === 'Virement bancaire'
                            ? ` - Banque: ${BANK_DETAILS.bankName} - Compte: ${BANK_DETAILS.accountNumber} - SWIFT: ${BANK_DETAILS.swift}`
                            : donationSuccess.paymentMethod === 'Mobile Money'
                            ? ` - Mobile Money: ${contactPhone}`
                            : ''
                        }`,
                        'recap'
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2350D9] dark:text-blue-400 hover:underline pt-1 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.849A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.599m7.332 0c.055.194.084.4.084.615v.75m-7.332 0c-.055.194-.084.4-.084.615v.75m7.332 0c0 .414-.336.75-.75.75H8.25a.75.75 0 01-.75-.75v-.75m7.332 0h1.668A2.25 2.25 0 0118.75 6v13.5A2.25 2.25 0 0116.5 21.75H7.5A2.25 2.25 0 015.25 19.5V6a2.25 2.25 0 012.25-2.25h1.668" />
                    </svg>
                    <span>{copiedKey === 'recap' ? 'Coordonnées copiées !' : 'Copier les coordonnées du don'}</span>
                  </button>
                </div>

                {/* Boutons de redirection */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    to="/"
                    className="flex-1 py-3 px-4 rounded-xl text-center bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-slate-200 text-xs font-heading font-bold uppercase tracking-wider transition-colors"
                  >
                    Retour à l&apos;accueil
                  </Link>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex-1 py-3 px-4 rounded-xl text-center bg-[#C2530A] hover:bg-[#9F4100] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    {shareSuccess ? 'Lien copié !' : 'Partager notre action'}
                  </button>
                </div>
              </div>
            ) : (
              /* Formulaire Étape 1 & Étape 2 */
              <div className="space-y-6">
                {/* En-tête du formulaire avec indicateur d'étapes */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
                  <div>
                    <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                      {step === 1 ? 'Étape 1 sur 2' : 'Étape 2 sur 2'}
                    </span>
                    <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                      {step === 1 ? 'Votre soutien financier' : 'Mode de versement'}
                    </h2>
                  </div>

                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-[#2350D9] dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                      Modifier
                    </button>
                  )}
                </div>

                {/* Alerte message d'erreur serveur */}
                {serverError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
                    <svg className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span className="leading-relaxed">{serverError}</span>
                  </div>
                )}

                {/* ── ÉTAPE 1 : Fréquence, montants et coordonnées ── */}
                {step === 1 && (
                  <form onSubmit={handleNextStep} noValidate className="space-y-6">
                    {/* Fréquence : Tous les mois / Une seule fois */}
                    <div>
                      <label className="block text-xs font-heading font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Fréquence de soutien
                      </label>
                      <div className="grid grid-cols-2 gap-2" role="tablist" aria-label="Fréquence de don">
                        <button
                          type="button"
                          role="tab"
                          aria-selected={frequency === 'monthly'}
                          onClick={() => setFrequency('monthly')}
                          className={`py-2.5 px-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            frequency === 'monthly'
                              ? 'bg-[#2350D9] text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          Tous les mois
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={frequency === 'single'}
                          onClick={() => setFrequency('single')}
                          className={`py-2.5 px-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            frequency === 'single'
                              ? 'bg-[#2350D9] text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          Une seule fois
                        </button>
                      </div>
                    </div>

                    {/* Montants prédéfinis */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-heading font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Montant du don ({DONATION_CONFIG.defaultCurrency})
                        </label>
                        <span className="text-[11px] text-slate-500">Devise : Dollar américain ($)</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {suggestedAmounts.map((amt) => {
                          const isSelected = !customAmount && selectedAmount === amt;
                          return (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                setSelectedAmount(amt);
                                setCustomAmount('');
                              }}
                              className={`py-2.5 rounded-xl font-heading font-bold text-sm transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#2350D9] text-white ring-2 ring-[#2350D9] ring-offset-2 dark:ring-offset-slate-900 shadow-xs'
                                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700'
                              }`}
                            >
                              {amt} $
                            </button>
                          );
                        })}
                      </div>

                      {/* Champ Autre Montant */}
                      <div className="relative">
                        <label htmlFor={customAmountInputId} className="sr-only">
                          Autre montant
                        </label>
                        <input
                          id={customAmountInputId}
                          type="number"
                          min="1"
                          step="any"
                          placeholder="Autre montant libre (en $)"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2350D9] focus:ring-2 focus:ring-[#2350D9]/20"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                          USD ($)
                        </span>
                      </div>
                      {errors.amount && (
                        <p className="text-rose-600 dark:text-rose-400 text-xs mt-1.5">{errors.amount}</p>
                      )}
                    </div>

                    {/* Coordonnées du donateur */}
                    <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-zinc-800">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor={firstNameInputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Prénom *
                          </label>
                          <input
                            id={firstNameInputId}
                            type="text"
                            required
                            placeholder="Votre prénom"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2350D9]"
                          />
                          {errors.firstName && (
                            <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.firstName}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor={lastNameInputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Nom *
                          </label>
                          <input
                            id={lastNameInputId}
                            type="text"
                            required
                            placeholder="Votre nom de famille"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2350D9]"
                          />
                          {errors.lastName && (
                            <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor={emailInputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Adresse e-mail *
                        </label>
                        <input
                          id={emailInputId}
                          type="email"
                          required
                          placeholder="exemple@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2350D9]"
                        />
                        {errors.email && (
                          <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor={phoneInputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Numéro de téléphone (optionnel)
                        </label>
                        <input
                          id={phoneInputId}
                          type="tel"
                          placeholder="+243 ..."
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/60 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2350D9]"
                        />
                      </div>

                      <div className="pt-1">
                        <label htmlFor={newsletterInputId} className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
                          <input
                            id={newsletterInputId}
                            type="checkbox"
                            checked={newsletter}
                            onChange={(e) => setNewsletter(e.target.checked)}
                            className="mt-0.5 rounded border-slate-300 text-[#2350D9] focus:ring-[#2350D9]"
                          />
                          <span>J&apos;accepte de recevoir des nouvelles des actions de l&apos;ACPDPH sur le terrain</span>
                        </label>
                      </div>
                    </div>

                    {/* Bouton vers l'étape 2 (Orange #C2530A) */}
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl bg-[#C2530A] hover:bg-[#9F4100] text-white font-heading font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 cursor-pointer text-center"
                    >
                      Passer au paiement &bull; {currentAmount} $
                    </button>
                  </form>
                )}

                {/* ── ÉTAPE 2 : Choix du moyen de paiement ── */}
                {step === 2 && (
                  <form onSubmit={handleConfirmDonation} noValidate className="space-y-6">
                    {/* Récapitulatif du don choisi */}
                    <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400 block">
                          Engagement sélectionné
                        </span>
                        <div className="font-heading font-bold text-base text-slate-900 dark:text-white">
                          Don {frequency === 'monthly' ? 'mensuel' : 'ponctuel'} de {currentAmount} $
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-semibold text-[#2350D9] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Changer
                      </button>
                    </div>

                    {/* Options de paiement */}
                    <div className="space-y-3">
                      <label className="block text-xs font-heading font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Sélectionnez votre moyen de règlement
                      </label>

                      {/* 1. Mobile Money */}
                      <label
                        className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                          paymentMethod === 'MOBILE_MONEY'
                            ? 'border-[#2350D9] bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-[#2350D9]'
                            : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="MOBILE_MONEY"
                            checked={paymentMethod === 'MOBILE_MONEY'}
                            onChange={() => setPaymentMethod('MOBILE_MONEY')}
                            className="mt-1 text-[#2350D9] focus:ring-[#2350D9]"
                          />
                          <div className="flex-1">
                            <span className="font-heading font-bold text-sm text-slate-900 dark:text-white block">
                              Mobile Money (RDC)
                            </span>
                            <p className="text-xs text-slate-500 mt-1">
                              Vodacom M-Pesa, Airtel Money et Orange Money.
                            </p>
                          </div>
                        </div>
                      </label>

                      {/* 2. Virement bancaire */}
                      <label
                        className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                          paymentMethod === 'BANK_TRANSFER'
                            ? 'border-[#2350D9] bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-[#2350D9]'
                            : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="BANK_TRANSFER"
                            checked={paymentMethod === 'BANK_TRANSFER'}
                            onChange={() => setPaymentMethod('BANK_TRANSFER')}
                            className="mt-1 text-[#2350D9] focus:ring-[#2350D9]"
                          />
                          <div className="flex-1">
                            <span className="font-heading font-bold text-sm text-slate-900 dark:text-white block">
                              Virement bancaire
                            </span>
                            <p className="text-xs text-slate-500 mt-1">
                              Comptes en USD et CDF pour dons nationaux et internationaux.
                            </p>
                          </div>
                        </div>
                      </label>

                      {/* 3. Carte bancaire (Bientôt disponible) */}
                      <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/40 opacity-75">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            disabled
                            name="paymentMethod"
                            value="CARD"
                            className="mt-1 text-slate-400 cursor-not-allowed"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-heading font-bold text-sm text-slate-700 dark:text-slate-300">
                                Carte bancaire (Visa / Mastercard)
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-slate-400">
                                Bientôt disponible
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Passerelle financière en ligne en cours d&apos;homologation.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Instructions sous les options avec trait bleu à gauche */}
                      {paymentMethod === 'MOBILE_MONEY' && (
                        <div className="mt-4 border-l-4 border-blue-600 pl-3 py-1 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                          <div className="flex flex-wrap items-center gap-2">
                            <span>
                              Envoyez <strong>{currentAmount} $</strong> au numéro Mobile Money de l&apos;ACPDPH :{' '}
                              <a
                                href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                                className="font-mono font-bold text-slate-900 dark:text-white hover:underline"
                              >
                                {contactPhone}
                              </a>
                              . Indiquez votre nom en référence.
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(contactPhone, 'step2-mm-num')}
                              className="px-2.5 py-1 text-[11px] font-bold uppercase text-[#2350D9] dark:text-blue-400 border border-[#2350D9] dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer shrink-0"
                              aria-live="polite"
                            >
                              {copiedKey === 'step2-mm-num' ? 'COPIÉ' : 'COPIER'}
                            </button>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'BANK_TRANSFER' && (
                        <div className="mt-4 border-l-4 border-blue-600 pl-3 py-1 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                          <div className="space-y-1.5 font-mono text-[11px] sm:text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span>Banque : <strong className="font-sans font-bold text-slate-900 dark:text-white">{BANK_DETAILS.bankName}</strong> ({BANK_DETAILS.bankAddress})</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span>Intitulé : <strong className="font-sans font-bold text-slate-900 dark:text-white">{BANK_DETAILS.accountName}</strong></span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span>Numéro de compte : <strong className="font-bold text-slate-900 dark:text-white break-all">{BANK_DETAILS.accountNumber}</strong></span>
                              <button
                                type="button"
                                onClick={() => handleCopyText(BANK_DETAILS.accountNumber, 'step2-acc-num')}
                                className="px-2.5 py-1 text-[11px] font-bold uppercase text-[#2350D9] dark:text-blue-400 border border-[#2350D9] dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer shrink-0"
                                aria-live="polite"
                              >
                                {copiedKey === 'step2-acc-num' ? 'COPIÉ' : 'COPIER'}
                              </button>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span>SWIFT : <strong className="font-bold text-slate-900 dark:text-white">{BANK_DETAILS.swift}</strong></span>
                              <button
                                type="button"
                                onClick={() => handleCopyText(BANK_DETAILS.swift, 'step2-swift-val')}
                                className="px-2.5 py-1 text-[11px] font-bold uppercase text-[#2350D9] dark:text-blue-400 border border-[#2350D9] dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer shrink-0"
                                aria-live="polite"
                              >
                                {copiedKey === 'step2-swift-val' ? 'COPIÉ' : 'COPIER'}
                              </button>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span>Devise : <strong className="font-bold text-slate-900 dark:text-white">{BANK_DETAILS.currency}</strong></span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 italic pt-0.5">
                            Indiquez votre nom en motif du virement.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Boutons d'action Étape 2 */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="py-3.5 px-4 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-heading font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        Retour
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3.5 px-6 rounded-xl bg-[#C2530A] hover:bg-[#9F4100] text-white font-heading font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 cursor-pointer disabled:opacity-60 text-center"
                      >
                        {submitting ? 'Enregistrement en cours...' : 'Confirmer mon soutien'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* ======================================================================= */}
          {/* COLONNE GAUCHE (Desktop) / ORDRE 2 (Mobile) : IMPACT & TRANSPARENCE   */}
          {/* ======================================================================= */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-10 text-left">
            {/* Section 2a : Votre soutien permet */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
                <h1 className="font-heading text-base sm:text-lg font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                  Votre soutien permet
                </h1>
              </div>

              {/* Liste de 3 lignes sans icônes (typographie épurée) */}
              <div className="space-y-4 pt-1">
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Une éducation inclusive et du matériel scolaire adapté pour les enfants
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Financement des frais de scolarité, fourniture de cannes blanches, papier et machines braille, aménagements physiques des classes à Beni et dans le Nord-Kivu.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Appareillage et réadaptation pour retrouver mobilité et autonomie
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Distribution de fauteuils roulants tout-terrain, béquilles, prothèses et accès aux séances de kinésithérapie pour les personnes vulnérables.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Des activités génératrices de revenus et des formations adaptées
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Ateliers de formation professionnelle, appui technique et micro-crédits pour l&apos;autonomisation économique des familles et des femmes vivant avec un handicap.
                  </p>
                </div>
              </div>
            </div>

            {/* Rubrique : NOS INFORMATIONS BANCAIRES */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
              <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
                <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                  NOS INFORMATIONS BANCAIRES
                </h2>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-zinc-800 border-t border-b border-slate-200 dark:border-zinc-800">
                {/* 1. NOM DE LA BANQUE */}
                <div className="grid grid-cols-1 sm:grid-cols-[38%_1fr] gap-x-3 py-2.5 items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    NOM DE LA BANQUE
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {BANK_DETAILS.bankName}
                  </span>
                </div>

                {/* 2. INTITULÉ DU COMPTE */}
                <div className="grid grid-cols-1 sm:grid-cols-[38%_1fr] gap-x-3 py-2.5 items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    INTITULÉ DU COMPTE
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {BANK_DETAILS.accountName}
                  </span>
                </div>

                {/* 3. ADRESSE DE LA BANQUE */}
                <div className="grid grid-cols-1 sm:grid-cols-[38%_1fr] gap-x-3 py-2.5 items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    ADRESSE DE LA BANQUE
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {BANK_DETAILS.bankAddress}
                  </span>
                </div>

                {/* 4. NUMÉRO DE COMPTE */}
                <div className="grid grid-cols-1 sm:grid-cols-[38%_1fr] gap-x-3 py-2.5 items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    NUMÉRO DE COMPTE
                  </span>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between gap-2">
                    <span className="font-mono break-all">{BANK_DETAILS.accountNumber}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(BANK_DETAILS.accountNumber, 'info-bank-acc')}
                      className="px-2.5 py-1 text-[11px] font-bold uppercase text-[#2350D9] dark:text-blue-400 border border-[#2350D9] dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer shrink-0"
                      aria-live="polite"
                    >
                      {copiedKey === 'info-bank-acc' ? 'COPIÉ' : 'COPIER'}
                    </button>
                  </div>
                </div>

                {/* 5. SWIFT */}
                <div className="grid grid-cols-1 sm:grid-cols-[38%_1fr] gap-x-3 py-2.5 items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    SWIFT
                  </span>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between gap-2">
                    <span className="font-mono break-all">{BANK_DETAILS.swift}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(BANK_DETAILS.swift, 'info-bank-swift')}
                      className="px-2.5 py-1 text-[11px] font-bold uppercase text-[#2350D9] dark:text-blue-400 border border-[#2350D9] dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer shrink-0"
                      aria-live="polite"
                    >
                      {copiedKey === 'info-bank-swift' ? 'COPIÉ' : 'COPIER'}
                    </button>
                  </div>
                </div>

                {/* 6. DEVISE DU COMPTE */}
                <div className="grid grid-cols-1 sm:grid-cols-[38%_1fr] gap-x-3 py-2.5 items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    DEVISE DU COMPTE
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {BANK_DETAILS.currency}
                  </span>
                </div>

                {/* 7. MOBILE MONEY */}
                <div className="grid grid-cols-1 sm:grid-cols-[38%_1fr] gap-x-3 py-2.5 items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    MOBILE MONEY
                  </span>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between gap-2">
                    <a
                      href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                      className="hover:underline font-mono text-slate-900 dark:text-white"
                    >
                      {contactPhone}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyText(contactPhone, 'info-mobile-money')}
                      className="px-2.5 py-1 text-[11px] font-bold uppercase text-[#2350D9] dark:text-blue-400 border border-[#2350D9] dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer shrink-0"
                      aria-live="polite"
                    >
                      {copiedKey === 'info-mobile-money' ? 'COPIÉ' : 'COPIER'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2b : Que devient votre don ? (Transparence financière) */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
              <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
                <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                  Que devient votre don ?
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                L&apos;ACPDPH applique une rigueur stricte dans la gestion de ses ressources financières et matérielles.
              </p>

              {/* Barres de progression discrètes sans cartes lourdes */}
              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                    <span>Projets &amp; actions directes sur le terrain (santé, scolarité, réadaptation)</span>
                    <span className="font-bold text-[#2350D9] dark:text-blue-400">80 %</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-[#2350D9] rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                    <span>Plaidoyer juridique, sensibilisation communautaire &amp; inclusion</span>
                    <span className="font-bold text-[#2350D9] dark:text-blue-400">12 %</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-[#2350D9] rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                    <span>Frais administratifs, contrôle financier &amp; gouvernance transparente</span>
                    <span className="font-bold text-[#2350D9] dark:text-blue-400">8 %</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-[#2350D9] rounded-full" style={{ width: '8%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2c : À propos de l'ACPDPH (Présentation ancrée et légale) */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
              <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
                <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                  À propos de l&apos;ACPDPH
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                L’Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) est une Organisation Non Gouvernementale (ONG) nationale de droit congolais, constituée conformément à la <strong>Loi n° 004/2001 du 20 juillet 2001</strong> régissant les associations sans but lucratif. Établie à Beni, dans la province du Nord-Kivu, elle intervient au quotidien pour l&apos;autonomie, l&apos;accès à l&apos;éducation et la défense des droits fondamentaux des personnes en situation de handicap.
              </p>
              <div className="pt-1">
                <Link
                  to="/a-propos"
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#2350D9] dark:text-blue-400 hover:underline uppercase tracking-wide"
                >
                  <span>En savoir plus sur notre gouvernance et nos statuts</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTIONS D'INFORMATIONS COMPLÉMENTAIRES (PLEINE LARGEUR)               */}
      {/* ========================================================================= */}
      <section className="container-ba pb-20 space-y-16" aria-label="Informations complémentaires">
        {/* Accordéon FAQ */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center mb-8">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400 block mb-1">
              Transparence &bull; Sécurité
            </span>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white uppercase tracking-tight">
              Questions fréquentes sur votre don
            </h2>
          </div>

          {[
            {
              q: 'Mon don est-il sécurisé ?',
              a: 'Oui. Le site de l’ACPDPH ne collecte et ne stocke aucune coordonnée bancaire confidentielle ni code secret. Les transferts s’effectuent directement via votre opérateur Mobile Money ou auprès de votre établissement bancaire, à partir des identifiants et références officiels générés.',
            },
            {
              q: 'Comment obtenir mon reçu officiel ?',
              a: 'Dès votre versement réalisé, transmettez votre référence ou justificatif par e-mail à info.acpdph.asbl.rdc@gmail.com ou par message au bureau de l’association. La trésorerie de l’ACPDPH émettra votre attestation officielle sous 24 à 48 heures.',
            },
            {
              q: 'Puis-je faire un don en nature (matériel médical, scolarité) ?',
              a: 'Absolument. Fauteuils roulants, cannes blanches, machines braille, prothèses et matériel informatique adapté sont directement acheminés aux bénéficiaires. Vous pouvez nous contacter directement via notre page de contact pour convenir de l’acheminement.',
            },
            {
              q: 'Comment sont suivies les contributions sur le terrain ?',
              a: 'L’ACPDPH publie des bilans périodiques d’activités. Les personnes ayant accepté de recevoir des informations sont tenues informées de la remise des matériels et de l’avancement des projets éducatifs et sanitaires à Beni.',
            },
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-zinc-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-[#2350D9] dark:hover:text-blue-400 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#2350D9] dark:text-blue-400' : 'text-slate-400'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-zinc-800">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section Contact Direct & Partenaires */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-zinc-800 p-8 sm:p-10 text-center space-y-6">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
            Une question sur votre soutien ou un partenariat ?
          </span>

          <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
            Notre équipe se tient à votre disposition
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Pour échanger sur un projet philanthropique, un soutien institutionnel, ou organiser la remise d&apos;équipements médicaux ou scolaires :
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs sm:text-sm font-medium">
            <a
              href={`mailto:${OFFICE_EMAIL}`}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-[#2350D9] dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-4 h-4 text-[#2350D9] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>{OFFICE_EMAIL}</span>
            </a>

            <a
              href={`tel:${OFFICE_PHONE.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-[#2350D9] dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-4 h-4 text-[#2350D9] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>{OFFICE_PHONE}</span>
            </a>

            <Link
              to="/contact"
              className="flex items-center gap-1.5 text-[#C2530A] hover:underline font-heading font-bold uppercase tracking-wider"
            >
              <span>Formulaire de contact</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-400">
            Siège : {OFFICE_ADDRESS}
          </div>
        </div>
      </section>
    </main>
  );
}
