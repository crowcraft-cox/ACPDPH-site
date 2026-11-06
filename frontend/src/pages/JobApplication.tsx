import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/adminData';
import { apiFetch } from '../services/api';
import { smoothScrollTo } from '../hooks/useLenis';
import { useI18n, getLocalized } from '../i18n';

interface SubmissionSummary {
  prenom: string;
  jobTitle: string;
  reference: string;
  date: string;
  email: string;
}

interface LanguageEntry {
  langue: string;
  niveau: string;
}

interface ExperienceEntry {
  titrePoste: string;
  organisation: string;
  anneesExperience: string;
}

const GET_EDUCATION_LEVELS = (lang: string) => [
  { value: 'Aucun diplôme', label: lang === 'en' ? 'No diploma' : 'Aucun diplôme' },
  { value: "Diplôme d'État", label: lang === 'en' ? 'State Diploma (Secondary school)' : "Diplôme d'État" },
  { value: 'Certificat / attestation professionnelle', label: lang === 'en' ? 'Professional certificate / training' : 'Certificat / attestation professionnelle' },
  { value: 'Graduat / Licence (Bac+3)', label: lang === 'en' ? "Bachelor's degree (Bac+3)" : 'Graduat / Licence (Bac+3)' },
  { value: 'Licence / Master (Bac+5)', label: lang === 'en' ? "Master's degree (Bac+5)" : 'Licence / Master (Bac+5)' },
  { value: 'Doctorat', label: lang === 'en' ? 'Doctorate / PhD' : 'Doctorat' },
  { value: 'Autre', label: lang === 'en' ? 'Other' : 'Autre' },
];

const GET_LANGUAGE_OPTIONS = (lang: string) => [
  { value: 'Français', label: lang === 'en' ? 'French' : 'Français' },
  { value: 'Swahili', label: 'Swahili' },
  { value: 'Lingala', label: 'Lingala' },
  { value: 'Kinande', label: 'Kinande' },
  { value: 'Anglais', label: lang === 'en' ? 'English' : 'Anglais' },
  { value: 'Autre', label: lang === 'en' ? 'Other' : 'Autre' },
];

const GET_LANGUAGE_LEVELS = (lang: string) => [
  { value: 'Notions', label: lang === 'en' ? 'Basic' : 'Notions' },
  { value: 'Courant', label: lang === 'en' ? 'Fluent' : 'Courant' },
  { value: 'Langue maternelle', label: lang === 'en' ? 'Native' : 'Langue maternelle' },
];

const GET_EXPERIENCE_YEARS = (lang: string) => [
  { value: 'Moins de 1 an', label: lang === 'en' ? 'Less than 1 year' : 'Moins de 1 an' },
  { value: '1 an', label: lang === 'en' ? '1 year' : '1 an' },
  { value: '2 ans', label: lang === 'en' ? '2 years' : '2 ans' },
  { value: '3 ans', label: lang === 'en' ? '3 years' : '3 ans' },
  { value: '4 ans', label: lang === 'en' ? '4 years' : '4 ans' },
  { value: '5 ans', label: lang === 'en' ? '5 years' : '5 ans' },
  { value: '6 à 9 ans', label: lang === 'en' ? '6 to 9 years' : '6 à 9 ans' },
  { value: '10 ans et plus', label: lang === 'en' ? '10+ years' : '10 ans et plus' },
];

const GET_COUNTRIES = (lang: string) => [
  { value: 'République démocratique du Congo', label: lang === 'en' ? 'Democratic Republic of the Congo' : 'République démocratique du Congo' },
  { value: 'Rwanda', label: 'Rwanda' },
  { value: 'Burundi', label: 'Burundi' },
  { value: 'Ouganda', label: lang === 'en' ? 'Uganda' : 'Ouganda' },
  { value: 'Tanzanie', label: lang === 'en' ? 'Tanzania' : 'Tanzanie' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'République du Congo', label: lang === 'en' ? 'Republic of the Congo' : 'République du Congo' },
  { value: 'Centrafrique', label: lang === 'en' ? 'Central African Republic' : 'Centrafrique' },
  { value: 'Belgique', label: lang === 'en' ? 'Belgium' : 'Belgique' },
  { value: 'France', label: 'France' },
  { value: 'Autre', label: lang === 'en' ? 'Other' : 'Autre' },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

export default function JobApplication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useAdminData();
  const { t, lang, getLocalizedPath } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Redirection si l'utilisateur recharge après avoir soumis
  useEffect(() => {
    const completedKey = `candidature_completed_${id}`;
    if (sessionStorage.getItem(completedKey)) {
      sessionStorage.removeItem(completedKey);
      navigate(getLocalizedPath('/offres-emplois'), { replace: true });
    }
  }, [id, navigate, getLocalizedPath]);

  useEffect(() => {
    smoothScrollTo(0, { immediate: true });
  }, [id]);

  const jobs = data.jobs || [];
  const job = jobs.find((j) => String(j.id) === String(id));

  // Options bilingues
  const educationLevels = useMemo(() => GET_EDUCATION_LEVELS(lang), [lang]);
  const languageOptions = useMemo(() => GET_LANGUAGE_OPTIONS(lang), [lang]);
  const languageLevels = useMemo(() => GET_LANGUAGE_LEVELS(lang), [lang]);
  const experienceYears = useMemo(() => GET_EXPERIENCE_YEARS(lang), [lang]);
  const countries = useMemo(() => GET_COUNTRIES(lang), [lang]);

  // Vérifier si l'offre est expirée
  let isExpired = false;
  if (job?.deadline && job.deadline.trim()) {
    const deadlineDate = new Date(job.deadline);
    if (!isNaN(deadlineDate.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      isExpired = deadlineDate < today;
    }
  }

  // Si l'offre possède un lien de candidature externe renseigné par l'admin, rediriger vers ce lien
  useEffect(() => {
    if (job?.applicationLink && job.applicationLink.trim().startsWith('http')) {
      window.location.href = job.applicationLink.trim();
    }
  }, [job]);

  // Form State
  const [nom, setNom] = useState('');
  const [postnom, setPostnom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [sexe, setSexe] = useState<'Homme' | 'Femme' | ''>('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [telephone, setTelephone] = useState('+243 ');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('Beni');
  const [province, setProvince] = useState('Nord-Kivu');
  const [pays, setPays] = useState('République démocratique du Congo');
  const [niveauEducation, setNiveauEducation] = useState('');

  const [langues, setLangues] = useState<LanguageEntry[]>([
    { langue: 'Français', niveau: 'Courant' },
  ]);

  const [experiences, setExperiences] = useState<ExperienceEntry[]>([
    { titrePoste: '', organisation: '', anneesExperience: '1 an' },
    { titrePoste: '', organisation: '', anneesExperience: '1 an' },
    { titrePoste: '', organisation: '', anneesExperience: '1 an' },
  ]);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File[]>([]);

  const [enSituationHandicap, setEnSituationHandicap] = useState<'Oui' | 'Non' | 'Préfère ne pas répondre'>('Préfère ne pas répondre');
  const [amenagementsSouhaites, setAmenagementsSouhaites] = useState('');
  const [consentement, setConsentement] = useState(false);

  // Honeypot anti-spam
  const [honeypot, setHoneypot] = useState('');

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionSummary, setSubmissionSummary] = useState<SubmissionSummary | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (submitted) {
      smoothScrollTo(0, { immediate: true });
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);
    }
  }, [submitted]);

  // ── Cas offre absente ou expirée ──────────────────────────────────────────
  if (!job || isExpired) {
    return (
      <div className="pt-28 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
        <div className="container-ba max-w-2xl text-center py-16">
          <div className="card p-8 sm:p-12 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-xs">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t.jobs.noLongerOpen}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
              {t.jobs.noLongerOpenDesc}
            </p>
            <Link
              to={getLocalizedPath('/offres-emplois')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2350D9] text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>{t.jobs.consultAllOffers}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Gestion des langues ───────────────────────────────────────────────────
  const handleAddLanguage = () => {
    if (langues.length < 3) {
      setLangues([...langues, { langue: 'Swahili', niveau: 'Courant' }]);
    }
  };

  const handleRemoveLanguage = (index: number) => {
    setLangues(langues.filter((_, i) => i !== index));
  };

  const handleUpdateLanguage = (index: number, field: keyof LanguageEntry, value: string) => {
    const updated = [...langues];
    updated[index] = { ...updated[index], [field]: value };
    setLangues(updated);
  };

  // ── Gestion des expériences ───────────────────────────────────────────────
  const handleUpdateExperience = (index: number, field: keyof ExperienceEntry, value: string) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  // ── Validation et upload de fichiers ──────────────────────────────────────
  const validateDocFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!['.pdf', '.doc', '.docx'].includes(ext)) {
      return t.jobs.fileFormatError || 'Format non accepté. Formats autorisés : PDF, DOC, DOCX.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return t.jobs.fileSizeError || 'Fichier trop volumineux. Taille maximale : 5 Mo.';
    }
    return null;
  };

  const validateCertFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'].includes(ext)) {
      return t.jobs.certFormatError || 'Format non accepté. Formats autorisés : PDF, DOC, DOCX, JPG, PNG.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return t.jobs.fileSizeError || 'Fichier trop volumineux. Taille maximale : 5 Mo.';
    }
    return null;
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateDocFile(file);
    if (err) {
      setErrors((prev) => ({ ...prev, cv: err }));
      setCvFile(null);
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.cv;
        return next;
      });
      setCvFile(file);
    }
  };

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateDocFile(file);
    if (err) {
      setErrors((prev) => ({ ...prev, coverLetter: err }));
      setCoverLetterFile(null);
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.coverLetter;
        return next;
      });
      setCoverLetterFile(file);
    }
  };

  const handleCertificatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let certError: string | null = null;
    const validFiles: File[] = [];

    files.forEach((f) => {
      const err = validateCertFile(f);
      if (err) certError = err;
      else validFiles.push(f);
    });

    if (certError) {
      setErrors((prev) => ({ ...prev, certificates: certError! }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.certificates;
        return next;
      });
      setCertificates((prev) => [...prev, ...validFiles].slice(0, 5));
    }
  };

  const handleRemoveCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  // ── Validation globale côté client ────────────────────────────────────────
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nom.trim()) newErrors.nom = t.jobs.errorNom || 'Le nom est obligatoire.';
    if (!prenom.trim()) newErrors.prenom = t.jobs.errorPrenom || 'Le prénom est obligatoire.';

    if (!dateNaissance) {
      newErrors.dateNaissance = t.jobs.errorDateRequired || 'La date de naissance est obligatoire.';
    } else {
      const birth = new Date(dateNaissance);
      const today = new Date();
      if (isNaN(birth.getTime()) || birth > today) {
        newErrors.dateNaissance = t.jobs.errorDateInvalid || 'Date de naissance invalide.';
      } else {
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        if (age < 18) {
          newErrors.dateNaissance = t.jobs.errorDateAge || 'Vous devez être âgé(e) d’au moins 18 ans pour postuler.';
        }
      }
    }

    if (!sexe) newErrors.sexe = t.jobs.errorSexe || 'Veuillez préciser le sexe.';

    if (!email.trim()) {
      newErrors.email = t.jobs.errorEmailRequired || "L'adresse e-mail est obligatoire.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = t.jobs.errorEmailFormat || 'Format d’adresse e-mail invalide.';
    }

    if (!confirmEmail.trim()) {
      newErrors.confirmEmail = t.jobs.errorConfirmEmailRequired || 'Veuillez confirmer votre adresse e-mail.';
    } else if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      newErrors.confirmEmail = t.jobs.errorConfirmEmailMismatch || 'Les deux adresses e-mail ne correspondent pas.';
    }

    if (!telephone.trim() || telephone.trim().length < 8) {
      newErrors.telephone = t.jobs.errorPhone || 'Le numéro de téléphone international est obligatoire.';
    }

    if (!niveauEducation) {
      newErrors.niveauEducation = t.jobs.errorEducation || "Veuillez sélectionner votre niveau d'éducation.";
    }

    if (!cvFile) {
      newErrors.cv = t.jobs.errorCv || 'Le Curriculum Vitae (CV) est obligatoire.';
    }

    if (!coverLetterFile) {
      newErrors.coverLetter = t.jobs.errorCoverLetter || 'La lettre de motivation est obligatoire.';
    }

    if (!consentement) {
      newErrors.consentement = t.jobs.errorConsent || 'Vous devez attester de l’exactitude de vos informations pour postuler.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Défilement jusqu'au premier champ erroné
      const firstKey = Object.keys(newErrors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return false;
    }

    return true;
  };

  // ── Soumission du formulaire ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Anti-spam honeypot
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('jobId', job.id);
      formData.append('jobTitle', job.title);
      formData.append('nom', nom.trim());
      formData.append('postnom', postnom.trim());
      formData.append('prenom', prenom.trim());
      formData.append('dateNaissance', dateNaissance);
      formData.append('sexe', sexe);
      formData.append('email', email.trim().toLowerCase());
      formData.append('confirmEmail', confirmEmail.trim().toLowerCase());
      formData.append('telephone', telephone.trim());
      formData.append('adresse', adresse.trim());
      formData.append('ville', ville.trim());
      formData.append('province', province.trim());
      formData.append('pays', pays);
      formData.append('niveauEducation', niveauEducation);
      formData.append('langues', JSON.stringify(langues));

      // Filtrer les expériences non renseignées
      const validExp = experiences.filter((exp) => exp.titrePoste.trim() && exp.organisation.trim());
      formData.append('experiences', JSON.stringify(validExp));

      formData.append('enSituationHandicap', enSituationHandicap);
      formData.append('amenagementsSouhaites', amenagementsSouhaites.trim());
      formData.append('consentement', 'true');
      formData.append('lang', lang);

      if (cvFile) formData.append('cv', cvFile);
      if (coverLetterFile) formData.append('coverLetter', coverLetterFile);
      certificates.forEach((cert) => {
        formData.append('certificates', cert);
      });

      const res = await apiFetch('/applications', {
        method: 'POST',
        body: formData,
      });

      setSubmitting(false);

      if (res.success) {
        const refCode =
          res.data?.reference ||
          `CAND-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;

        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(now);

        const jobDisplayTitle = getLocalized(job, 'title', lang);

        setSubmissionSummary({
          prenom: prenom.trim(),
          jobTitle: jobDisplayTitle,
          reference: refCode,
          date: formattedDate,
          email: email.trim().toLowerCase(),
        });
        setSubmitted(true);
        sessionStorage.setItem(`candidature_completed_${job.id}`, 'true');
        smoothScrollTo(0, { immediate: true });
      } else {
        setServerError(
          res.error || t.jobs.serverError ||
            (lang === 'en'
              ? 'An error occurred while submitting your application. Please try again.'
              : "Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer.")
        );
        smoothScrollTo(0);
      }
    } catch (err: any) {
      setSubmitting(false);
      setServerError(
        t.jobs.serverErrorNetwork ||
          (lang === 'en'
            ? 'Unable to contact the server. Please check your internet connection and try again.'
            : 'Impossible de joindre le serveur. Veuillez vérifier votre connexion internet et réessayer.')
      );
      smoothScrollTo(0);
    }
  };

  // ── Écran de confirmation après envoi réussi ──────────────────────────────
  if (submitted && submissionSummary) {
    return (
      <div className="pt-28 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
        <main className="max-w-xl mx-auto px-4 py-12 md:py-16 text-center">
          {/* Icône de validation */}
          <div className="flex justify-center mb-5">
            <svg
              className="w-14 h-14 text-blue-600 dark:text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Titre avec role="status" et aria-live="polite" */}
          <h1
            ref={titleRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="font-heading text-2xl font-semibold uppercase tracking-tight text-[#2350D9] dark:text-blue-400 outline-none mb-3"
          >
            {t.jobs.applicationSuccessTitle}
          </h1>

          {/* Phrase d'introduction personnalisée */}
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            {t.jobs.successThankPrefix} {submissionSummary.prenom}. {t.jobs.successAppliedFor}{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              « {submissionSummary.jobTitle} »
            </span>{' '}
            {t.jobs.successAppliedForEnd}
          </p>

          {/* Récapitulatif en lignes, sans cartes */}
          <div className="border-t border-slate-200 dark:border-zinc-800 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-4 gap-y-1 py-3.5 border-b border-slate-200 dark:border-zinc-800 items-baseline">
              <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                {t.jobs.jobTitleApplied}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
                {submissionSummary.jobTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-4 gap-y-1 py-3.5 border-b border-slate-200 dark:border-zinc-800 items-baseline">
              <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                {t.jobs.applicationReference}
              </span>
              <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
                {submissionSummary.reference}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-4 gap-y-1 py-3.5 border-b border-slate-200 dark:border-zinc-800 items-baseline">
              <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                {t.jobs.submittedOn}
              </span>
              <span className="text-xs sm:text-sm text-slate-900 dark:text-white">
                {submissionSummary.date}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-4 gap-y-1 py-3.5 border-b border-slate-200 dark:border-zinc-800 items-baseline">
              <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                {t.jobs.confirmationSentTo}
              </span>
              <span className="text-xs sm:text-sm text-slate-900 dark:text-white break-all">
                {submissionSummary.email}
              </span>
            </div>
          </div>

          {/* Section "Et maintenant ?" */}
          <div className="mt-8 text-left">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400 mb-4">
              {t.jobs.whatNext}
            </h2>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="font-bold text-[#2350D9] dark:text-blue-400 shrink-0">1.</span>
                <span>{t.jobs.nextStep1}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-[#2350D9] dark:text-blue-400 shrink-0">2.</span>
                <span>{t.jobs.nextStep2}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-[#2350D9] dark:text-blue-400 shrink-0">3.</span>
                <span>
                  {t.jobs.nextStep3Prefix}{' '}
                  <a
                    href={`mailto:info.acpdph.asbl.rdc@gmail.com?subject=${encodeURIComponent(
                      lang === 'en'
                        ? `Question regarding application ${submissionSummary.reference}`
                        : `Question candidature ${submissionSummary.reference}`
                    )}`}
                    className="font-semibold text-[#2350D9] dark:text-blue-400 hover:underline"
                  >
                    info.acpdph.asbl.rdc@gmail.com
                  </a>{' '}
                  {t.jobs.nextStep3Suffix}
                </span>
              </li>
            </ol>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link
              to={getLocalizedPath('/offres-emplois')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#C2530A] hover:bg-[#a84408] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2530A] focus-visible:ring-offset-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>{t.jobs.backToCareers}</span>
            </Link>

            <Link
              to={getLocalizedPath('/')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span>{t.jobs.homePage}</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ── Formulaire de candidature ─────────────────────────────────────────────
  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        {/* Lien retour à l'offre */}
        <div className="mb-6">
          <Link
            to={getLocalizedPath(`/offres-emplois/${job.id}`)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>{t.jobs.backToJobs}</span>
          </Link>
        </div>

        {/* ── EN-TÊTE DE LA PAGE ── */}
        <header className="text-center mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase text-[#2350D9] dark:text-blue-400 tracking-tight mb-4">
            {t.jobs.applicationFormTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed text-left md:text-justify w-full mb-3">
            {t.jobs.headerSubtitle}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
            {t.jobs.requiredIndicator}
          </p>
        </header>

        {/* Message d'erreur serveur */}
        {serverError && (
          <div className="mb-8 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{serverError}</span>
            </div>
            <button
              type="button"
              onClick={() => setServerError(null)}
              className="text-xs font-bold uppercase underline hover:no-underline cursor-pointer"
            >
              {t.jobs.retry}
            </button>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Honeypot invisible pour contrer les bots */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input
              type="text"
              name="hp_check"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* ── SECTION a. POSTE VISÉ ── */}
          <section className="space-y-3">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.sectionPosition}
              </h2>
            </div>
            <div>
              <label htmlFor="field-jobTitle" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                {t.jobs.positionApplied} *
              </label>
              <input
                id="field-jobTitle"
                type="text"
                readOnly
                value={getLocalized(job, 'title', lang)}
                className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-zinc-300 font-medium cursor-not-allowed select-none"
              />
            </div>
          </section>

          {/* ── SECTION b. IDENTITÉ ── */}
          <section className="space-y-3">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.sectionIdentity}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Nom */}
              <div>
                <label htmlFor="field-nom" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.lastName} *
                </label>
                <input
                  id="field-nom"
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  aria-invalid={Boolean(errors.nom)}
                  aria-describedby={errors.nom ? 'field-nom-error' : undefined}
                  className={`w-full bg-white dark:bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9] ${
                    errors.nom ? 'border-red-500' : 'border-slate-300 dark:border-zinc-700'
                  }`}
                  placeholder="Ex : KASEREKA"
                />
                {errors.nom && <p id="field-nom-error" className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.nom}</p>}
              </div>

              {/* Postnom */}
              <div>
                <label htmlFor="field-postnom" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.middleName}
                </label>
                <input
                  id="field-postnom"
                  type="text"
                  value={postnom}
                  onChange={(e) => setPostnom(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
                  placeholder="Ex : MUHINDO"
                />
              </div>

              {/* Prénom */}
              <div>
                <label htmlFor="field-prenom" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.firstName} *
                </label>
                <input
                  id="field-prenom"
                  type="text"
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  aria-invalid={Boolean(errors.prenom)}
                  aria-describedby={errors.prenom ? 'field-prenom-error' : undefined}
                  className={`w-full bg-white dark:bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9] ${
                    errors.prenom ? 'border-red-500' : 'border-slate-300 dark:border-zinc-700'
                  }`}
                  placeholder="Ex : Jean-Claude"
                />
                {errors.prenom && <p id="field-prenom-error" className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.prenom}</p>}
              </div>

              {/* Date de naissance */}
              <div>
                <label htmlFor="field-dateNaissance" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.birthDateLabel} *
                </label>
                <input
                  id="field-dateNaissance"
                  type="date"
                  required
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  aria-invalid={Boolean(errors.dateNaissance)}
                  aria-describedby={errors.dateNaissance ? 'field-dateNaissance-error' : undefined}
                  className={`w-full bg-white dark:bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9] ${
                    errors.dateNaissance ? 'border-red-500' : 'border-slate-300 dark:border-zinc-700'
                  }`}
                />
                {errors.dateNaissance && <p id="field-dateNaissance-error" className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.dateNaissance}</p>}
              </div>

              {/* Sexe */}
              <div className="md:col-span-2">
                <span className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-2">
                  {t.jobs.gender} *
                </span>
                <div id="field-sexe" className="flex items-center gap-6">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="sexe"
                      value="Homme"
                      checked={sexe === 'Homme'}
                      onChange={() => setSexe('Homme')}
                      className="text-[#2350D9] focus:ring-[#2350D9]"
                    />
                    <span>{t.jobs.genderMale}</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="sexe"
                      value="Femme"
                      checked={sexe === 'Femme'}
                      onChange={() => setSexe('Femme')}
                      className="text-[#2350D9] focus:ring-[#2350D9]"
                    />
                    <span>{t.jobs.genderFemale}</span>
                  </label>
                </div>
                {errors.sexe && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.sexe}</p>}
              </div>
            </div>
          </section>

          {/* ── SECTION c. CONTACT ── */}
          <section className="space-y-3">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.sectionContact}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* E-mail */}
              <div>
                <label htmlFor="field-email" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.emailLabel} *
                </label>
                <input
                  id="field-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'field-email-error' : undefined}
                  className={`w-full bg-white dark:bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9] ${
                    errors.email ? 'border-red-500' : 'border-slate-300 dark:border-zinc-700'
                  }`}
                  placeholder="nom@exemple.com"
                />
                {errors.email && <p id="field-email-error" className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Confirmer l'e-mail */}
              <div>
                <label htmlFor="field-confirmEmail" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.confirmEmailLabel} *
                </label>
                <input
                  id="field-confirmEmail"
                  type="email"
                  required
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  aria-invalid={Boolean(errors.confirmEmail)}
                  aria-describedby={errors.confirmEmail ? 'field-confirmEmail-error' : undefined}
                  className={`w-full bg-white dark:bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9] ${
                    errors.confirmEmail ? 'border-red-500' : 'border-slate-300 dark:border-zinc-700'
                  }`}
                  placeholder="nom@exemple.com"
                />
                {errors.confirmEmail && <p id="field-confirmEmail-error" className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.confirmEmail}</p>}
              </div>

              {/* Numéro de téléphone */}
              <div className="md:col-span-2">
                <label htmlFor="field-telephone" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.phoneLabel} *
                </label>
                <input
                  id="field-telephone"
                  type="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  aria-invalid={Boolean(errors.telephone)}
                  aria-describedby={errors.telephone ? 'field-telephone-error' : undefined}
                  className={`w-full bg-white dark:bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9] ${
                    errors.telephone ? 'border-red-500' : 'border-slate-300 dark:border-zinc-700'
                  }`}
                  placeholder="+243 970 000 000"
                />
                {errors.telephone && <p id="field-telephone-error" className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.telephone}</p>}
              </div>
            </div>
          </section>

          {/* ── SECTION d. ADRESSE ── */}
          <section className="space-y-3">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.sectionAddress}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="field-adresse" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.addressLabel}
                </label>
                <input
                  id="field-adresse"
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
                  placeholder="Ex : Av. Ruwenzori, Q. Résidentiel"
                />
              </div>

              <div>
                <label htmlFor="field-ville" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.cityTerritory}
                </label>
                <input
                  id="field-ville"
                  type="text"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
                  placeholder="Ex : Beni"
                />
              </div>

              <div>
                <label htmlFor="field-province" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.province}
                </label>
                <input
                  id="field-province"
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
                  placeholder="Ex : Nord-Kivu"
                />
              </div>

              <div>
                <label htmlFor="field-pays" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.country}
                </label>
                <select
                  id="field-pays"
                  value={pays}
                  onChange={(e) => setPays(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
                >
                  {countries.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ── SECTION e. PARCOURS ── */}
          <section className="space-y-4">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.sectionPath}
              </h2>
            </div>

            {/* Niveau d'éducation */}
            <div>
              <label htmlFor="field-niveauEducation" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                {t.jobs.educationLevelLabel} *
              </label>
              <select
                id="field-niveauEducation"
                required
                value={niveauEducation}
                onChange={(e) => setNiveauEducation(e.target.value)}
                aria-invalid={Boolean(errors.niveauEducation)}
                aria-describedby={errors.niveauEducation ? 'field-niveauEducation-error' : undefined}
                className={`w-full bg-white dark:bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9] ${
                  errors.niveauEducation ? 'border-red-500' : 'border-slate-300 dark:border-zinc-700'
                }`}
              >
                <option value="">{t.jobs.selectEducationLevel}...</option>
                {educationLevels.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                ))}
              </select>
              {errors.niveauEducation && <p id="field-niveauEducation-error" className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.niveauEducation}</p>}
            </div>

            {/* Connaissances linguistiques */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="block text-xs font-semibold text-slate-700 dark:text-zinc-200">
                  {t.jobs.languageKnowledge}
                </span>
                {langues.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddLanguage}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2350D9] dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>{t.jobs.addLanguage}</span>
                  </button>
                )}
              </div>

              {langues.map((l, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <select
                      value={l.langue}
                      onChange={(e) => handleUpdateLanguage(idx, 'langue', e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
                    >
                      {languageOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>

                    <select
                      value={l.niveau}
                      onChange={(e) => handleUpdateLanguage(idx, 'niveau', e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
                    >
                      {languageLevels.map((lvl) => (
                        <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                      ))}
                    </select>
                  </div>

                  {langues.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(idx)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title={t.jobs.removeLanguage}
                      aria-label={t.jobs.removeLanguage}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION f. EXPÉRIENCES PERTINENTES ── */}
          <section className="space-y-4">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.sectionExperiences}
              </h2>
            </div>

            {experiences.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-800/40 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  {t.jobs.experience} {idx + 1} {idx === 0 ? t.jobs.experienceRecommended : t.jobs.experienceOptional}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1">
                      {t.jobs.positionTitle2}
                    </label>
                    <input
                      type="text"
                      value={exp.titrePoste}
                      onChange={(e) => handleUpdateExperience(idx, 'titrePoste', e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
                      placeholder="Ex : Chargé de projet"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1">
                      {t.jobs.organization2}
                    </label>
                    <input
                      type="text"
                      value={exp.organisation}
                      onChange={(e) => handleUpdateExperience(idx, 'organisation', e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
                      placeholder="Ex : ONG ou Entreprise"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1">
                      {t.jobs.yearsExperience}
                    </label>
                    <select
                      value={exp.anneesExperience}
                      onChange={(e) => handleUpdateExperience(idx, 'anneesExperience', e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
                    >
                      {experienceYears.map((y) => (
                        <option key={y.value} value={y.value}>{y.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* ── SECTION g. DOCUMENTS À JOINDRE ── */}
          <section className="space-y-4">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.sectionDocuments}
              </h2>
            </div>

            {/* Curriculum Vitae (CV) */}
            <div id="field-cv">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                {t.jobs.cvLabel}
              </label>
              {cvFile ? (
                <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2.5 truncate">
                    <svg className="w-5 h-5 shrink-0 text-[#2350D9] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="text-xs font-medium text-slate-800 dark:text-zinc-200 truncate">{cvFile.name}</span>
                    <span className="text-[11px] text-slate-500 shrink-0">({(cvFile.size / (1024 * 1024)).toFixed(2)} Mo)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCvFile(null)}
                    className="text-xs font-semibold text-red-600 hover:underline shrink-0 ml-3 cursor-pointer"
                  >
                    {t.jobs.removeFile}
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-[#2350D9] dark:hover:border-blue-500 rounded-lg bg-white dark:bg-zinc-800 cursor-pointer transition-colors text-center">
                  <svg className="w-7 h-7 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#2350D9] dark:text-blue-400">{t.jobs.chooseFile}</span>
                  <span className="text-[11px] text-slate-500 mt-1">{t.jobs.fileFormats}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvChange}
                    className="hidden"
                  />
                </label>
              )}
              {errors.cv && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.cv}</p>}
            </div>

            {/* Lettre de motivation */}
            <div id="field-coverLetter">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                {t.jobs.coverLetterLabel}
              </label>
              {coverLetterFile ? (
                <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2.5 truncate">
                    <svg className="w-5 h-5 shrink-0 text-[#2350D9] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="text-xs font-medium text-slate-800 dark:text-zinc-200 truncate">{coverLetterFile.name}</span>
                    <span className="text-[11px] text-slate-500 shrink-0">({(coverLetterFile.size / (1024 * 1024)).toFixed(2)} Mo)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCoverLetterFile(null)}
                    className="text-xs font-semibold text-red-600 hover:underline shrink-0 ml-3 cursor-pointer"
                  >
                    {t.jobs.removeFile}
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-[#2350D9] dark:hover:border-blue-500 rounded-lg bg-white dark:bg-zinc-800 cursor-pointer transition-colors text-center">
                  <svg className="w-7 h-7 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#2350D9] dark:text-blue-400">{t.jobs.chooseFile}</span>
                  <span className="text-[11px] text-slate-500 mt-1">{t.jobs.fileFormats}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCoverLetterChange}
                    className="hidden"
                  />
                </label>
              )}
              {errors.coverLetter && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.coverLetter}</p>}
            </div>

            {/* Attestations et diplômes */}
            <div id="field-certificates">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                {t.jobs.certificatesLabel}
              </label>

              {certificates.length > 0 && (
                <div className="space-y-2 mb-3">
                  {certificates.map((cert, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                      <div className="flex items-center gap-2 truncate">
                        <svg className="w-4 h-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span className="text-xs text-slate-700 dark:text-zinc-200 truncate">{cert.name}</span>
                        <span className="text-[11px] text-slate-400 shrink-0">({(cert.size / (1024 * 1024)).toFixed(2)} Mo)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCertificate(idx)}
                        className="text-xs font-semibold text-red-600 hover:underline shrink-0 ml-2 cursor-pointer"
                      >
                        {t.jobs.removeFile}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {certificates.length < 5 && (
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-[#2350D9] dark:hover:border-blue-500 rounded-lg bg-white dark:bg-zinc-800 cursor-pointer transition-colors text-center">
                  <svg className="w-5 h-5 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="text-xs font-semibold text-[#2350D9] dark:text-blue-400">{t.jobs.addDocument}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">{t.jobs.certFormats}</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleCertificatesChange}
                    className="hidden"
                  />
                </label>
              )}
              {errors.certificates && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.certificates}</p>}
            </div>
          </section>

          {/* ── SECTION h. ACCESSIBILITÉ (facultatif) ── */}
          <section className="space-y-3">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-2">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-[#2350D9] dark:text-blue-400">
                {t.jobs.sectionAccessibility}
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <span className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-2">
                  {t.jobs.disabilityQuestion}
                </span>
                <div className="flex flex-wrap items-center gap-6">
                  {[
                    { value: 'Oui', label: t.jobs.disabilityYes },
                    { value: 'Non', label: t.jobs.disabilityNo },
                    { value: 'Préfère ne pas répondre', label: t.jobs.disabilityPreferNotToSay },
                  ].map((opt) => (
                    <label key={opt.value} className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300 cursor-pointer">
                      <input
                        type="radio"
                        name="handicap"
                        value={opt.value}
                        checked={enSituationHandicap === opt.value}
                        onChange={() => setEnSituationHandicap(opt.value as any)}
                        className="text-[#2350D9] focus:ring-[#2350D9]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="field-amenagements" className="block text-xs font-semibold text-slate-700 dark:text-zinc-200 mb-1.5">
                  {t.jobs.accommodationsLabel}
                </label>
                <textarea
                  id="field-amenagements"
                  rows={3}
                  value={amenagementsSouhaites}
                  onChange={(e) => setAmenagementsSouhaites(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
                  placeholder={
                    lang === 'en'
                      ? 'e.g., Need for sign language interpreter, wheelchair accessibility, documents in large print...'
                      : "Ex : Besoin d'interprète en langue des signes, accessibilité fauteuil roulant, documents en gros caractères..."
                  }
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.jobs.accessibilityNote}
              </p>
            </div>
          </section>

          {/* ── SECTION i. CONSENTEMENT ── */}
          <section id="field-consentement" className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentement}
                onChange={(e) => setConsentement(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#2350D9] focus:ring-[#2350D9] border-slate-300"
              />
              <span className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                {t.jobs.consentText} *
              </span>
            </label>
            {errors.consentement && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.consentement}</p>}
          </section>

          {/* ── BOUTON D'ENVOI ── */}
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-md bg-[#C2530A] hover:bg-[#a84408] text-white font-heading font-bold uppercase tracking-wider text-sm transition-colors shadow-sm cursor-pointer ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <span>{submitting ? t.jobs.submitting : (t.jobs.submitApplication || 'SOUMETTRE MA CANDIDATURE')}</span>
              {!submitting && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
