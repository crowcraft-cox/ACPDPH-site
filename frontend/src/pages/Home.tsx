import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useScrollReveal, useCountUp, useAnimeReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';
import { buildHeroHookTitle } from '../utils/heroHook';

export default function Home() {
  return (
    <div>
      <HeroSection />
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
      link: news[2]?.id ? `/news/${news[2].id}` : '/publications',
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
      aria-label="Carousel de projets et publications"
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
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: '#111827' }}>{t.impact.title}</h2>
          <p className="text-base leading-relaxed text-justify w-full" style={{ color: '#4B5563' }}>
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

        <p className="text-sm mb-6" style={{ color: '#6B7280', lineHeight: 1.5 }}>
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
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: '#111827' }}>{t.pillars.title}</h2>
          <p className="text-base leading-relaxed text-justify w-full" style={{ color: '#4B5563' }}>
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
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>{pillar.description}</p>
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

/* ===== NOS VALEURS SECTION (CARDS AVEC ICONES, SANS EXPLICATIONS) ===== */
function ValuesSection() {
  const { t } = useI18n();
  const { ref: containerRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.value-card',
    staggerDelay: 80,
  });

  const valuesList = [
    {
      title: t.about?.values?.[0] || 'Professionnalisme',
      number: '01',
      icon: (
        <svg className="w-7 h-7 text-ba-blue transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: t.about?.values?.[1] || 'Solidarité',
      number: '02',
      icon: (
        <svg className="w-7 h-7 text-ba-blue transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
    {
      title: t.about?.values?.[2] || 'Non-discrimination',
      number: '03',
      icon: (
        <svg className="w-7 h-7 text-ba-blue transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      title: t.about?.values?.[3] || 'Respect de la dignité humaine',
      number: '04',
      icon: (
        <svg className="w-7 h-7 text-ba-blue transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      title: t.about?.values?.[4] || 'Bien-être',
      number: '05',
      icon: (
        <svg className="w-7 h-7 text-ba-blue transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="section-padding bg-slate-50/80 dark:bg-ba-surface-elevated relative border-y border-gray-100 dark:border-zinc-800">
      <div className="container-ba">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-ba-blue bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40 px-3.5 py-1 rounded-full inline-block mb-3.5">
            Éthique & Engagement
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3" style={{ color: "#111827" }}>
            Nos valeurs
          </h2>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {valuesList.map((val) => (
            <div
              key={val.number}
              className="value-card bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-ba-blue/50 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-ba-blue transition-all duration-300 [&>svg]:group-hover:text-white">
                {val.icon}
              </div>
              <span className="text-xs font-bold text-ba-blue/70 dark:text-blue-400/70 tracking-wider mb-2">
                {val.number}
              </span>
              <h3 className="font-heading text-base font-bold text-gray-900 dark:text-white leading-snug">
                {val.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== PROJECTS PREVIEW (STAGGERED WITH ANIME.JS) ===== */
function ProjectsPreviewSection() {
  const { data } = useAdminData();
  const { ref: containerRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.project-preview-card',
    staggerDelay: 90,
  });

  const projects = data.projects.slice(0, 3);
  if (projects.length === 0) return null;

  const statusBadge: Record<string, string> = {
    'En cours':         'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    'Achevé':           'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    'En planification': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  };

  return (
    <section className="section-padding relative">
      <div className="container-ba">
        <div className="mb-10 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold" style={{ color: '#111827' }}>Nos Projets</h2>
            <Link to="/projects" className="btn btn-outline btn-sm shrink-0">
              Tous les projets
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <p className="text-base leading-relaxed text-justify w-full" style={{ color: '#4B5563' }}>
            Découvrez nos réalisations concrètes et nos initiatives stratégiques menées directement sur le terrain en République Démocratique du Congo. Qu'il s'agisse de la mise aux normes d'accessibilité des bâtiments publics, du renforcement des capacités économiques par l'apprentissage de métiers adaptés, de la scolarisation d'enfants vivant avec handicap ou de la fourniture d'aides techniques à la mobilité, chaque projet est élaboré en concertation étroite avec les bénéficiaires afin d'assurer un impact tangible, mesurable et pérenne dans leurs milieux de vie.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj, i) => {
            const excerpt = proj.description
              ? proj.description.replace(/\[photo:\d+\]/g, '').trim().slice(0, 110) + (proj.description.length > 110 ? '…' : '')
              : '';
            return (
              <Link
                key={proj.id || i}
                to={`/projects/${proj.id}`}
                className="project-preview-card card card-cover group flex flex-col"
                style={{ padding: 0 }}
              >
                {/* Miniature */}
                <div className="relative w-full overflow-hidden" style={{ height: '200px' }}>
                  {proj.image ? (
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                      <svg className="w-10 h-10" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#1D4ED8' }}>
                    {proj.type}
                  </div>
                </div>

                {/* Corps */}
                <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div className="card-row mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge[proj.status] || 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                      {proj.status}
                    </span>
                    <span className="flex items-center gap-1" style={{ color: '#6B7280', fontSize: '0.75rem' }}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="#1D4ED8" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {proj.location}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold mb-2 group-hover:transition-colors line-clamp-2" style={{ color: '#111827', fontSize: '1rem', lineHeight: 1.35 }}>
                    {proj.title}
                  </h3>

                  {excerpt && (
                    <p className="line-clamp-2 flex-1 mb-4" style={{ color: '#6B7280', fontSize: '0.8rem', lineHeight: 1.5 }}>{excerpt}</p>
                  )}

                  <div className="card-footer" style={{ marginTop: 'auto' }}>
                    <span className="flex items-center gap-1.5 font-semibold" style={{ color: '#1D4ED8', fontSize: '0.75rem' }}>
                      Voir les détails
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold" style={{ color: '#111827' }}>{t.news.title}</h2>
            <Link to="/news" className="btn btn-outline btn-sm shrink-0">
              {t.news.all_news}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <p className="text-base leading-relaxed text-justify w-full" style={{ color: '#4B5563' }}>
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
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: '#1D4ED8' }}>
                    {article.category}
                  </span>
                </div>
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

                  <p className="line-clamp-2 mb-4" style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.5 }}>{article.excerpt}</p>
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
