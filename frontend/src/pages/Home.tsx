import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useScrollReveal, useCountUp, useAnimeReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';
import { buildHeroHookTitle } from '../utils/heroHook';
import { formatProjectDate } from '../utils/dateFormatter';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ImpactSection />
      <PillarsSection />
      <ValuesSection />
      <ProjectsPreviewSection />
      <NewsPreviewSection />
      <CTASection />
    </div>
  );
}

interface HeroItem {
  type: 'project' | 'news';
  typeLabel: 'Projet' | 'Publication';
  title: string;       /* Titre d'accroche pour la page d'accueil */
  rawTitle: string;    /* Titre administratif complet pour l'accessibilité */
  description: string;
  link: string;
  image?: string;
}

/* ===== HERO SECTION ===== */
function HeroSection() {
  const { t } = useI18n();
  const { data } = useAdminData();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const projects = data.projects || [];
  const news = data.news || [];

  /* Respect prefers-reduced-motion */
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Dynamic 6-item rotation: alternating Projects and Publications */
  const slides: HeroItem[] = [
    {
      type: 'project',
      typeLabel: 'Projet',
      title: buildHeroHookTitle(projects[0] || {
        title: 'Écoles Inclusives & Équité Éducative',
        type: 'Éducation Inclusive',
        location: 'Beni, Nord-Kivu, RDC',
        description: 'Aménagement de salles adaptées, formation des enseignants à l\'inclusion et dotation d\'outils pédagogiques pour les enfants vivant avec handicap.',
      }, 'project'),
      rawTitle: projects[0]?.title || 'Écoles Inclusives & Équité Éducative',
      description: projects[0]?.description?.replace(/\[photo:\d+\]/g, '').trim() || 'Aménagement de salles adaptées, formation des enseignants à l\'inclusion et dotation d\'outils pédagogiques pour les enfants vivant avec handicap.',
      link: `/projects/${projects[0]?.id || '1'}`,
      image: projects[0]?.image || '/pillars/formation.jpg',
    },
    {
      type: 'news',
      typeLabel: 'Publication',
      title: buildHeroHookTitle(news[0] || {
        title: 'Campagne de plaidoyer pour l\'accessibilité des édifices publics à Beni',
        category: 'Plaidoyer',
        excerpt: 'L\'ACPDPH a rencontré les autorités urbaines de Beni pour la mise en conformité des accès aux bâtiments administratifs.',
      }, 'news'),
      rawTitle: news[0]?.title || 'Campagne de plaidoyer pour l\'accessibilité des édifices publics à Beni',
      description: news[0]?.excerpt || 'L\'ACPDPH a rencontré les autorités urbaines de Beni pour la mise en conformité des accès aux bâtiments administratifs.',
      link: `/news/${news[0]?.id || '1'}`,
      image: news[0]?.image || '/images/hero/photo_accueil.jpg',
    },
    {
      type: 'project',
      typeLabel: 'Projet',
      title: buildHeroHookTitle(projects[1] || {
        title: 'Autonomisation & Métiers pour Personnes Handicapées',
        type: 'Autonomisation',
        location: 'Beni et environs',
        description: 'Formations professionnelles aux métiers d\'artisanat, numérique et gestion de micro-entreprises avec octroi de kits de démarrage.',
      }, 'project'),
      rawTitle: projects[1]?.title || 'Autonomisation & Métiers pour Personnes Handicapées',
      description: projects[1]?.description?.replace(/\[photo:\d+\]/g, '').trim() || 'Formations professionnelles aux métiers d\'artisanat, numérique et gestion de micro-entreprises avec octroi de kits de démarrage.',
      link: `/projects/${projects[1]?.id || '2'}`,
      image: projects[1]?.image || '/pillars/protection.jpg',
    },
    {
      type: 'news',
      typeLabel: 'Publication',
      title: buildHeroHookTitle(news[1] || {
        title: 'Remise d\'aides techniques et bourses scolaires inclusives',
        category: 'Inclusion',
        location: 'Beni',
        excerpt: 'L\'ACPDPH a distribué des tricycles et kits scolaires complets à 120 élèves en situation de handicap à Beni.',
      }, 'news'),
      rawTitle: news[1]?.title || 'Remise d\'aides techniques et bourses scolaires inclusives',
      description: news[1]?.excerpt || 'L\'ACPDPH a distribué des tricycles et kits scolaires complets à 120 élèves en situation de handicap à Beni.',
      link: `/news/${news[1]?.id || '2'}`,
      image: news[1]?.image || '/images/hero/photo_accueil.jpg',
    },
    {
      type: 'project',
      typeLabel: 'Projet',
      title: buildHeroHookTitle(projects[2] || {
        title: 'Clinique Mobile de Réadaptation & Aides Mobilité',
        type: 'Santé & Réadaptation',
        location: 'Nord-Kivu, RDC',
        description: 'Consultations médicales itinérantes, consultations de kinésithérapie et don d\'aides techniques à la mobilité pour les personnes vulnérables.',
      }, 'project'),
      rawTitle: projects[2]?.title || 'Clinique Mobile de Réadaptation & Aides Mobilité',
      description: projects[2]?.description?.replace(/\[photo:\d+\]/g, '').trim() || 'Consultations médicales itinérantes, consultations de kinésithérapie et don d\'aides techniques à la mobilité pour les personnes vulnérables.',
      link: `/projects/${projects[2]?.id || '3'}`,
      image: projects[2]?.image || '/pillars/sante.jpg',
    },
    {
      type: 'news',
      typeLabel: 'Publication',
      title: buildHeroHookTitle(news[2] || {
        title: 'Publication du rapport d\'évaluation sur l\'inclusion scolaire',
        category: 'Publication',
        excerpt: 'Rapport diagnostique et recommandations stratégiques pour l\'accès universel à l\'éducation inclusive dans le Grand Nord-Kivu.',
      }, 'news'),
      rawTitle: news[2]?.title || 'Publication du rapport d\'évaluation sur l\'inclusion scolaire',
      description: news[2]?.excerpt || 'Rapport diagnostique et recommandations stratégiques pour l\'accès universel à l\'éducation inclusive dans le Grand Nord-Kivu.',
      link: news[2]?.id ? `/news/${news[2].id}` : '/news',
      image: news[2]?.image || '/images/hero/photo_accueil.jpg',
    },
  ];

  const totalSlides = slides.length;

  /* ── Avancer d'une diapositive ── */
  const advance = (dir: 1 | -1 = 1) => {
    setCurrentIndex((prev) => (prev + dir + totalSlides) % totalSlides);
  };

  /* ── Navigation manuelle ── */
  const goManual = (dir: 1 | -1) => {
    advance(dir);
  };

  const togglePause = () => {
    setIsPaused((p) => !p);
  };

  /* ── Auto-rotate (désactivé si reduced-motion) ── */
  useEffect(() => {
    if (prefersReduced || isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      advance(1);
    }, 6000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPaused, prefersReduced, totalSlides]);

  /* ── Pause quand l'onglet n'est pas visible ── */
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setIsPaused(true);
      else setIsPaused(false);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  /* ── Navigation clavier (flèches gauche/droite) ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goManual(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goManual(1); }
  };

  /* ── Swipe tactile ── */
  const touchStartX = { current: 0 };
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) goManual(delta < 0 ? 1 : -1);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section
      className="hero-section relative flex items-center justify-center overflow-visible bg-ba-dark"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Carousel de projets et actualités"
      aria-roledescription="carousel"
    >
      {/* Background Image avec fondu */}
      <div
        key={currentSlide.image}
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 ease-out"
        style={{ backgroundImage: `url('${currentSlide.image || '/images/hero/photo_accueil.jpg'}')` }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/85 via-black/75 to-black/65" aria-hidden="true" />

      {/* Subtle Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-ba-blue/10 animate-float" />
        <div className="absolute bottom-20 right-1/4 w-60 h-60 rounded-full bg-ba-blue/10 animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* ── Commandes accessibles (masquées visuellement, visibles au focus clavier) ── */}
      <div className="hero-a11y-controls" aria-label="Commandes du carousel">
        <button
          className="hero-a11y-btn"
          onClick={() => goManual(-1)}
          aria-label="Diapositive précédente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="hero-a11y-btn"
          onClick={togglePause}
          aria-label={isPaused ? 'Lecture' : 'Pause'}
          aria-pressed={isPaused}
        >
          {isPaused ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
        </button>
        <button
          className="hero-a11y-btn"
          onClick={() => goManual(1)}
          aria-label="Diapositive suivante"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="relative container-ba text-white z-10 hero-inner w-full">
        {/* Slide */}
        <div
          key={`slide-${currentIndex}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${currentIndex + 1} sur ${totalSlides}`}
          className="hero-slide-container hero-text-anim"
        >
          {/* Bloc de texte */}
          <div className="hero-slide-text-block">
            <h2 className="hero-slide-title">
              {currentSlide.title}
            </h2>
            {currentSlide.description && (
              <p className="hero-slide-desc">
                {currentSlide.description}
              </p>
            )}
          </div>

          {/* Bouton Lire plus — à droite */}
          <div className="hero-btn-wrapper hero-btn-anim">
            <Link
              to={currentSlide.link}
              aria-label={`Lire plus : ${currentSlide.rawTitle}`}
              className="hero-read-more-btn group"
            >
              <span>Lire plus</span>
              <svg
                className="w-4 h-4 ml-2.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlapping CTA Button */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-4">
        <div className="container-ba flex items-center justify-center">
          <Link to="/support" className="btn btn-blue btn-lg group shadow-lg">
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {t.hero.cta_donate}
          </Link>
        </div>
      </div>
    </section>
  );
}



/* ===== ABOUT SECTION (INSPIRED BY IDDC) ===== */
function AboutSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal();

  const paragraphs = [
    "L'Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) est une ONG nationale, apolitique et sans but lucratif, créée le 3 décembre 2018 à Beni, dans la province du Nord-Kivu, en République démocratique du Congo.",
    "Notre mission est de promouvoir les droits, l'inclusion et l'autonomisation des personnes handicapées, en favorisant l'égalité des chances, l'accès aux services essentiels et la pleine participation à la vie sociale, économique et communautaire.",
    "À travers une approche communautaire fondée sur les droits humains, nous intervenons notamment dans l'éducation inclusive, la santé, la protection, l'assistance humanitaire, la lutte contre les violences basées sur le genre et l'autonomisation économique.",
    "Nous œuvrons pour une société inclusive, juste et solidaire, dans laquelle chaque personne handicapée peut exercer pleinement ses droits, développer son potentiel et contribuer activement au développement de sa communauté.",
    "Notre vision : bâtir une société sans discrimination fondée sur le handicap, où chaque personne handicapée vit dans un état de bien-être socio-économique.",
  ]

  return (
    <section
      className="bg-white"
      style={{ paddingTop: 'clamp(48px, 8vw, 96px)', paddingBottom: 'clamp(48px, 8vw, 96px)' }}
      aria-labelledby="about-heading"
    >
      <div
        ref={sectionRef}
        className={`container-ba transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      >
        <div className="about-grid">

          {/* ── Colonne gauche : bloc titre ── */}
          <div className="about-title-col" aria-hidden="false">
            <h2
              id="about-heading"
              className="about-heading-block"
            >
              <span className="about-line-light" aria-hidden="true">À propos</span>
              <span className="sr-only">À propos de l'ACPDPH</span>
            </h2>
          </div>

          {/* ── Colonne droite : texte + bouton ── */}
          <div className="about-content-col">
            <div className="about-paragraphs">
              {paragraphs.map((p, i) => (
                <p key={i} className="about-para">{p}</p>
              ))}
            </div>
            <Link
              to="/about"
              className="about-cta-btn"
              aria-label="Lire plus sur l'ACPDPH"
            >
              Lire plus
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ===== IMPACT COUNTERS (DE-AI RULES APPLIED: 1 PRIMARY, 3 SECONDARY, THE NUMBER IS THE HERO) ===== */
function ImpactSection() {
  const { t } = useI18n();
  const { ref: sectionRef, isVisible } = useScrollReveal();
  const { data } = useAdminData();

  const counters = data.impact;
  const primaryItem = counters[0] || { value: 2500, label: 'Personnes accompagnées' };
  const secondaryItems = counters.slice(1, 4);

  return (
    <section className="section-padding pt-36 sm:pt-40 md:pt-24 bg-ba-surface-elevated relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-ba-border" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-ba-border" />
      </div>

      <div ref={sectionRef} className={`container-ba transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="w-full mb-10 impact-title-offset">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: '#1F4FDB' }}>{t.impact.title}</h2>
          <p className="text-base leading-relaxed text-justify w-full" style={{ color: '#000000' }}>
            Des avancées concrètes, mesurables et durables pour l'inclusion des personnes handicapées en République Démocratique du Congo. À travers nos programmes intégrés d'accompagnement juridique, de réadaptation fonctionnelle, d'éducation inclusive et d'insertion socio-économique, nous œuvrons sans relâche pour transformer le quotidien des personnes vulnérables et de leurs familles. Chaque action menée sur le terrain renforce l'autonomie, restaure la dignité humaine et favorise une participation citoyenne équitable et respectueuse des droits fondamentaux.
          </p>
        </div>

        {/* 1 PRIMARY + 3 SECONDARIES GRID (RULE 3 & RULE 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* PRIMARY CARD (The Hero Metric) */}
          <div className="lg:col-span-5 flex">
            <PrimaryCounterCard 
              value={primaryItem.value} 
              label={primaryItem.label} 
              description="Bénéficiaires directs et familles accompagnés vers l'accès aux soins, à l'éducation inclusive, à l'autonomie et aux droits fondamentaux."
            />
          </div>

          {/* THREE SECONDARY CARDS (Grouped & streamlined) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {secondaryItems.map((item, idx) => (
              <SecondaryCounterCard 
                key={item.id || idx} 
                value={item.value} 
                label={item.label} 
                index={idx + 1}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* Primary Hero Card */
function PrimaryCounterCard({ value, label, description }: { value: number; label: string; description: string }) {
  const { count, ref } = useCountUp(value, 2200);

  return (
    <div ref={ref} className="card w-full flex flex-col justify-between">
      <div>
        <div className="flex justify-end mb-6">
          <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>Région Nord-Kivu</span>
        </div>

        <div className="mb-4">
          <div className="font-heading text-5xl sm:text-6xl font-black tracking-tight mb-1" style={{ color: '#1D4ED8' }}>
            {count.toLocaleString('fr-FR')}+
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold" style={{ color: '#111827' }}>
            {label}
          </h3>
        </div>

        <p className="text-sm mb-6" style={{ color: '#000000', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      <div className="card-footer">
        <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>Rapport de terrain 2026</span>
        <span className="font-semibold" style={{ color: '#1D4ED8', fontSize: '0.75rem' }}>Audit annuel conforme</span>
      </div>
    </div>
  );
}

/* Secondary Counter Card */
function SecondaryCounterCard({ value, label }: { value: number; label: string; index?: number }) {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <div ref={ref} className="card-sm flex-1 card-row gap-4 items-center">
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="font-heading font-bold block" style={{ color: '#111827', fontSize: '1.05rem', lineHeight: 1.3 }}>
          {label}
        </span>
      </div>
      <div className="font-heading font-extrabold tabular-nums" style={{ color: '#1D4ED8', fontSize: '2rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
        {count.toLocaleString('fr-FR')}+
      </div>
    </div>
  );
}

/* ===== 4 PILLARS SECTION (STAGGERED WITH ANIME.JS) ===== */
function PillarsSection() {
  const { t } = useI18n();
  const { data } = useAdminData();
  const { ref: containerRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.pillar-card',
    staggerDelay: 90,
  });

  const pillars = data.pillars;

  return (
    <section className="section-padding relative">
      <div className="container-ba">
        <div className="w-full mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: '#1F4FDB' }}>{t.pillars.title}</h2>
          <p className="text-base leading-relaxed text-justify w-full" style={{ color: '#000000' }}>
            L'ACPDPH déploie une approche globale et multisectorielle structurée autour d'axes d'intervention prioritaires pour garantir l'épanouissement intégral, l'égalité des chances et la pleine participation citoyenne des personnes en situation de handicap. De la promotion des droits et de l'accessibilité universelle du cadre bâti jusqu'à l'accès prioritaire à l'éducation inclusive, aux soins adaptés et à l'autonomie financière, nous construisons des solutions pérennes pour surmonter les barrières discriminatoires et promouvoir une société congolaise juste et solidaire.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, i) => (
            <Link
              key={pillar.id || i}
              to="/pillars"
              className="pillar-card card card-cover group flex flex-col"
              style={{ padding: 0 }}
            >
              {/* Image couverture */}
              <div className="h-56 w-full overflow-hidden relative">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />
                <div className="absolute bottom-4 left-5 right-5 z-10">
                  <h3 className="font-heading text-xl font-bold leading-tight" style={{ color: '#fff' }}>{pillar.title}</h3>
                </div>
              </div>

              {/* Corps */}
              <div style={{ padding: '20px 24px 24px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ color: '#000000', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>{pillar.description}</p>
                <div className="card-footer">
                  <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>En savoir plus</span>
                  <div className="flex items-center gap-2 font-bold group-hover:translate-x-1.5 transition-transform duration-200" style={{ color: '#1D4ED8', fontSize: '0.875rem' }}>
                    <span>{t.pillars.learn_more}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== NOS VALEURS SECTION (INTERACTIVE IDDC-INSPIRED TABLIST) ===== */
interface ValueItem {
  id: string;
  name: string;
  icon: () => React.ReactNode;
  explanation: string;
  link: string;
}

/* ─── Icônes SVG au trait (stroke: currentColor, fill: none, épaisseur 2px, monochrome) ─── */
function IconProfessionnalisme() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-10 h-10 md:w-11 md:h-11 lg:w-14 lg:h-14 shrink-0">
      <rect x="8" y="16" width="40" height="28" />
      <path d="M20 16V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
      <path d="M8 26h40" />
      <circle cx="28" cy="26" r="5" />
      <path d="M28 23.5v5M25.5 26h5" />
    </svg>
  );
}

function IconSolidarite() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-10 h-10 md:w-11 md:h-11 lg:w-14 lg:h-14 shrink-0">
      <circle cx="16" cy="15" r="5" />
      <path d="M8 38v-5a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v5" />
      <circle cx="40" cy="15" r="5" />
      <path d="M32 38v-5a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v5" />
      <path d="M22 31c2 4 10 4 12 0" />
      <circle cx="28" cy="38" r="3" />
    </svg>
  );
}

function IconNonDiscrimination() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-10 h-10 md:w-11 md:h-11 lg:w-14 lg:h-14 shrink-0">
      <path d="M28 14v28" />
      <path d="M18 42h20" />
      <path d="M12 18h32" />
      <path d="M12 18l-5 13h10l-5-13z" />
      <path d="M44 18l-5 13h10l-5-13z" />
      <circle cx="28" cy="14" r="3.5" />
      <path d="M28 8v4" />
    </svg>
  );
}

function IconDigniteHumaine() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-10 h-10 md:w-11 md:h-11 lg:w-14 lg:h-14 shrink-0">
      <path d="M10 32a18 18 0 0 1 36 0" />
      <circle cx="28" cy="24" r="5" />
      <path d="M19 44v-4a9 9 0 0 1 18 0v4" />
      <path d="M28 8v4" />
      <path d="M22 10l2 3" />
      <path d="M34 10l-2 3" />
    </svg>
  );
}

function IconBienEtre() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-10 h-10 md:w-11 md:h-11 lg:w-14 lg:h-14 shrink-0">
      <path d="M28 8v4M28 44v4M8 28h4M44 28h4" />
      <path d="M14 14l3 3M39 39l3 3M14 42l3-3M39 17l3-3" />
      <circle cx="28" cy="28" r="10" />
      <path d="M28 22v8M28 25c2-2 4-1 4 1s-2 2-4 2" />
    </svg>
  );
}

const VALUES_DATA: ValueItem[] = [
  {
    id: "professionnalisme",
    name: "Professionnalisme",
    icon: IconProfessionnalisme,
    explanation:
      "L'ACPDPH applique une rigueur exemplaire, de la transparence et des standards éthiques élevés dans la conduite de tous ses projets sur le terrain. Nos interventions reposent sur une gestion responsable des ressources, une expertise technique éprouvée et une obligation constante de redevabilité envers nos bénéficiaires et nos partenaires institutionnels. Cette exigence garantit un impact durable et mesurable pour l'inclusion des personnes en situation de handicap.",
    link: "/about",
  },
  {
    id: "solidarite",
    name: "Solidarité",
    icon: IconSolidarite,
    explanation:
      "Nous croyons fermement à la force de l'entraide communautaire et à l'action collective pour surmonter les barrières de l'exclusion. L'ACPDPH mobilise les personnes vivant avec handicap, leurs familles et les acteurs locaux dans un esprit de fraternité et de soutien mutuel. En unissant nos forces au quotidien, nous construisons un filet de protection sociale et favorisons une véritable résilience communautaire.",
    link: "/about",
  },
  {
    id: "non-discrimination",
    name: "Non-discrimination",
    icon: IconNonDiscrimination,
    explanation:
      "L'égalité absolue de traitement et l'égalité des chances pour chaque individu constituent le fondement inaliénable de notre engagement. Nous luttons vigoureusement contre tous les préjugés, les stigmatisations et les disparités d'accès qui marginalisent les personnes handicapées dans la société congolaise. Chaque citoyen, sans distinction aucune, a le droit légitime de participer pleinement à la vie publique, économique et citoyenne.",
    link: "/about",
  },
  {
    id: "dignite-humaine",
    name: "Respect de la dignité humaine",
    icon: IconDigniteHumaine,
    explanation:
      "Chaque personne possède une valeur intrinsèque inestimable et des droits universels qui doivent être reconnus, protégés et promus sans réserve. Notre approche place l'individu au cœur de nos actions en valorisant son autonomie, sa voix et sa capacité d'autodétermination. Préserver et restaurer la dignité de chacun est au centre de notre combat pour la justice sociale.",
    link: "/about",
  },
  {
    id: "bien-etre",
    name: "Bien-être",
    icon: IconBienEtre,
    explanation:
      "L'épanouissement global de la personne, tant sur le plan physique et psychologique que social et économique, guide nos programmes intégrés. Nous facilitons l'accès aux soins de santé adaptés, à la réadaptation fonctionnelle, à l'éducation inclusive et aux opportunités de subsistance autonome. Favoriser le bien-être, c'est offrir à chacun la possibilité de mener une vie équilibrée, autonome et digne.",
    link: "/about",
  },
];

function ValuesSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentVal = VALUES_DATA[displayIndex] || VALUES_DATA[0];

  const handleSelect = (idx: number) => {
    if (idx === selectedIndex) return;
    setSelectedIndex(idx);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplayIndex(idx);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setDisplayIndex(idx);
      setIsTransitioning(false);
    }, 125);
  };

  const handleTileClick = (idx: number) => {
    handleSelect(idx);
    if (typeof window !== "undefined" && window.innerWidth < 768 && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      if (rect.bottom > window.innerHeight || rect.top < 0) {
        panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const count = VALUES_DATA.length;
    let nextIndex = index;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % count;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + count) % count;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = count - 1;
    } else {
      return;
    }

    handleSelect(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section className="py-20 md:py-24 bg-white relative overflow-hidden" aria-labelledby="values-heading">
      <div className="container-ba">

        {/* 1. Titre de section centré au-dessus des deux colonnes */}
        <h2
          id="values-heading"
          className="font-heading font-bold text-[#1F4FDB] text-center mb-[26px] leading-tight"
          style={{ fontSize: "clamp(2.4rem, 4vw, 3.4rem)" }}
        >
          Nos valeurs
        </h2>

        {/* 2. Disposition à deux colonnes (grid-template-columns: 1fr 1.02fr; gap: 40px) */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.02fr] gap-10 items-start">

          {/* Colonne gauche : Grille 2 colonnes de tuiles (espacement 16px) */}
          <div className="w-full">
            <div
              role="tablist"
              aria-label="Nos valeurs"
              className="grid grid-cols-2 gap-4 values-grid-staggered justify-items-start"
            >
              {VALUES_DATA.map((val, idx) => {
                const isSelected = selectedIndex === idx;
                const IconComponent = val.icon;
                return (
                  <button
                    key={val.id}
                    ref={(el) => { tabRefs.current[idx] = el; }}
                    role="tab"
                    id={`value-tab-${val.id}`}
                    aria-controls={`value-tabpanel-${val.id}`}
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => handleTileClick(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="values-tile rounded-none"
                  >
                    <div className="mb-2.5 flex items-center justify-center">
                      <IconComponent />
                    </div>
                    <span
                      className={`text-center leading-snug transition-colors duration-200 ${
                        isSelected
                          ? "text-black font-bold"
                          : "text-white font-semibold"
                      } text-[14px] sm:text-[15px] lg:text-[16px]`}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {val.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colonne droite : Contenu de la valeur sélectionnée, aligné en haut avec les tuiles */}
          <div className="w-full">
            <div
              ref={panelRef}
              role="tabpanel"
              id={`value-tabpanel-${currentVal.id}`}
              aria-labelledby={`value-tab-${currentVal.id}`}
              tabIndex={0}
              aria-live="polite"
              className="min-h-[280px] md:min-h-[340px] lg:min-h-[360px] flex flex-col justify-start focus:outline-none"
            >
              <div
                className={`transition-all duration-200 ease-out ${
                  isTransitioning
                    ? "opacity-0 translate-y-2"
                    : "opacity-100 translate-y-0"
                }`}
              >
                {/* Nom de la valeur sélectionnée */}
                <h3
                  className="font-bold text-[#C4540A] text-[22px] md:text-[24px] mb-4 leading-snug"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {currentVal.name}
                </h3>

                {/* Explication : 16px, gris foncé, interligne ~1.9, largeur <= 65ch */}
                <p className="text-[#000000] text-[16px] leading-[1.9] max-w-[65ch] text-justify">
                  {currentVal.explanation}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

/* ===== PROJECTS PREVIEW (IDDC CARD DESIGN) ===== */
function ProjectsPreviewSection() {
  const { data } = useAdminData();
  const { ref: containerRef } = useAnimeReveal<HTMLUListElement>({
    variant: 'stagger-cards',
    itemSelector: '.project-card-item',
    staggerDelay: 80,
  });

  // Tri décroissant par date (les plus récents d'abord), max 4 sur la page d'accueil
  const sortedProjects = [...(data.projects || [])].sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : 0;
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    return timeB - timeA;
  });
  const projects = sortedProjects.slice(0, 4);

  if (projects.length === 0) return null;

  return (
    <section
      className="bg-white"
      style={{ paddingTop: 'clamp(64px, 8vw, 96px)', paddingBottom: 'clamp(64px, 8vw, 96px)' }}
      aria-labelledby="projects-heading"
    >
      <div className="container-ba">
        <div className="mb-10 w-full">
          <div className="relative flex items-center justify-center mb-4">
            <h2 id="projects-heading" className="font-heading text-3xl md:text-4xl font-bold text-center" style={{ color: '#1F4FDB' }}>Nos Projets</h2>
            <Link to="/projects" className="btn btn-outline btn-sm shrink-0 absolute right-0 hidden sm:flex">
              Tous les projets
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="flex justify-center sm:hidden mb-4">
            <Link to="/projects" className="btn btn-outline btn-sm">
              Tous les projets
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        <ul ref={containerRef} role="list" className="projects-grid">
          {projects.map((proj) => {
            const dateInfo = formatProjectDate(proj.date);
            return (
              <li key={proj.id} className="project-card-item">
                <Link
                  to={`/projects/${proj.id}`}
                  className="project-card-link"
                  aria-label={`${proj.title}, ${dateInfo.accessible}`}
                >
                  {/* Photo : hauteur fixe 170px, ratio 16:9 sur <600px */}
                  <div className="project-card-image-wrap">
                    {proj.image ? (
                      <img
                        src={proj.image}
                        alt=""
                        loading="lazy"
                        className="project-card-image"
                      />
                    ) : (
                      <div className="project-card-image-fallback" aria-hidden="true">
                        <svg className="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Panneau coloré bleu (#1F4FDB) */}
                  <div className="project-card-body">
                    <h3 className="project-card-title">
                      {proj.title}
                    </h3>
                    <time dateTime={dateInfo.iso} className="project-card-date">
                      {dateInfo.display}
                    </time>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ===== NEWS PREVIEW (STAGGERED WITH ANIME.JS) ===== */
function NewsPreviewSection() {
  const { t } = useI18n();
  const { data } = useAdminData();
  const { ref: containerRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.news-card-item',
    staggerDelay: 90,
  });

  const articles = data.news.slice(0, 3);

  return (
    <section className="section-padding">
      <div className="container-ba">
        <div className="mb-8 w-full">
          <div className="relative flex items-center justify-center mb-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center" style={{ color: '#1F4FDB' }}>{t.news.title}</h2>
            <Link to="/news" className="btn btn-outline btn-sm shrink-0 absolute right-0 hidden sm:flex">
              {t.news.all_news}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="flex justify-center sm:hidden mb-4">
            <Link to="/news" className="btn btn-outline btn-sm">
              {t.news.all_news}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <p className="text-base leading-relaxed text-justify w-full" style={{ color: '#000000' }}>
            Suivez au quotidien nos actions de terrain, nos prises de position publiques, nos ateliers de sensibilisation et les témoignages inspirants de résilience portés par nos membres. À travers nos publications, articles et plaidoyers institutionnels réguliers, l'ACPDPH informe la société civile, interpelle les pouvoirs publics et partage les progrès accomplis dans la promotion et la protection des droits des personnes en situation de handicap en République Démocratique du Congo.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <Link
              key={article.id || i}
              to={`/news/${article.id}`}
              className="news-card-item card card-cover group flex flex-col"
              style={{ padding: 0 }}
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                {article.image ? (
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(29,78,216,0.07)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(29,78,216,0.15)', color: '#1D4ED8' }}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Corps */}
              <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <div className="flex items-center gap-2 mb-3" style={{ color: '#6B7280', fontSize: '0.75rem' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="font-heading font-bold line-clamp-2 mb-2" style={{ color: '#111827', fontSize: '1rem', lineHeight: 1.35 }}>
                    {article.title}
                  </h3>

                  <p className="line-clamp-2 mb-4" style={{ color: '#000000', fontSize: '0.85rem', lineHeight: 1.5 }}>{article.excerpt}</p>
                </div>

                <div className="card-footer">
                  <span className="flex items-center gap-1.5 font-semibold" style={{ color: '#1D4ED8', fontSize: '0.75rem' }}>
                    {t.news.read_more}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== CTA SECTION (ANIME.JS REVEAL) ===== */
function CTASection() {
  const { t } = useI18n();
  const { ref: containerRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'fade-up',
    duration: 800,
  });

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-ba-dark" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-ba-blue/10 animate-pulse-soft" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-ba-blue/10 animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      </div>

      <div ref={containerRef} className="container-ba section-padding relative z-10 text-center text-white">
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
          {t.cta.title}
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          {t.cta.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/act" className="btn btn-blue btn-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {t.cta.donate}
          </Link>
          <Link to="/about" className="btn btn-outline btn-lg border-white/30 text-white hover:border-ba-blue hover:text-ba-blue">
            {t.cta.join}
          </Link>
        </div>
      </div>
    </section>
  );
}
