import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useScrollReveal, useCountUp, useAnimeReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';
import type { Project, NewsArticle } from '../types';
import { animate } from 'animejs';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ImpactSection />
      <PillarsSection />
      <ProjectsPreviewSection />
      <NewsPreviewSection />
      <CTASection />
    </div>
  );
}

type HeroSlide =
  | { kind: 'default' }
  | { kind: 'project'; data: Project }
  | { kind: 'news'; data: NewsArticle };

/* ===== HERO SECTION ===== */
function HeroSection() {
  const { t } = useI18n();
  const { data } = useAdminData();

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideContentRef = useRef<HTMLDivElement>(null);

  /* Build dynamic slides array: Default -> Project 1 -> News 1 -> Project 2 -> News 2 */
  const slides: HeroSlide[] = [{ kind: 'default' }];
  
  if (data.projects.length > 0) slides.push({ kind: 'project', data: data.projects[0] });
  if (data.news.length > 0) slides.push({ kind: 'news', data: data.news[0] });
  if (data.projects.length > 1) slides.push({ kind: 'project', data: data.projects[1] });
  if (data.news.length > 1) slides.push({ kind: 'news', data: data.news[1] });

  /* Auto-rotate slides every 6 seconds with smooth Anime.js transition */
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  /* Anime.js entrance whenever active slide changes */
  useEffect(() => {
    const el = slideContentRef.current;
    if (!el) return;

    const anim = animate(el, {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 650,
      ease: 'outExpo',
    });

    return () => {
      if (anim && typeof anim.pause === 'function') anim.pause();
    };
  }, [currentIndex]);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setCurrentIndex(idx);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section className="relative min-h-[72vh] md:min-h-[78vh] flex items-center justify-center overflow-visible bg-ba-dark">
      {/* Background Image — ALWAYS FIXED, NEVER CHANGES */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('/images/hero/photo_accueil.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0 bg-black/65" />
      
      {/* Subtle Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-ba-blue/10 animate-float" />
        <div className="absolute bottom-20 right-1/4 w-60 h-60 rounded-full bg-ba-blue/10 animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative container-ba text-center text-white z-10 pt-28 pb-20 md:pt-32 md:pb-24 flex flex-col items-center justify-center min-h-[380px]">

        {/* Dynamic Content Box with Anime.js Transition */}
        <div
          ref={slideContentRef}
          className="w-full flex flex-col items-center justify-center"
        >
          {/* SLIDE 0: DEFAULT HERO PRESENTATION */}
          {currentSlide.kind === 'default' && (
            <>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem] font-bold mb-6 leading-tight max-w-5xl">
                <span className="block">{t.hero.title1}</span>
                <span className="block mt-2 text-ba-blue-light">
                  {t.hero.title2}
                </span>
              </h1>

              <p className="max-w-3xl mx-auto text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 font-normal">
                {t.hero.subtitle}
              </p>
            </>
          )}

          {/* SLIDE: RECENT PROJECT */}
          {currentSlide.kind === 'project' && (
            <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem] font-bold text-white mb-6 leading-tight max-w-5xl">
                {currentSlide.data.title}
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-8 my-3 text-center md:text-left max-w-4xl">
                {currentSlide.data.image && (
                  <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden flex-shrink-0 border border-white/20">
                    <img src={currentSlide.data.image} alt={currentSlide.data.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed mb-4 line-clamp-3">
                    {currentSlide.data.description?.replace(/\[photo:\d+\]/g, '').trim()}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm text-gray-300 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-ba-blue-light shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {currentSlide.data.location} — <span className="text-ba-blue-light font-semibold">{currentSlide.data.status}</span>
                    </span>
                    <Link
                      to={`/projects/${currentSlide.data.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ba-blue hover:bg-ba-blue-dark text-white text-sm font-semibold transition-all hover:translate-y-[-2px]"
                    >
                      Lire plus sur ce projet
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE: RECENT NEWS */}
          {currentSlide.kind === 'news' && (
            <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem] font-bold text-white mb-6 leading-tight max-w-5xl">
                {currentSlide.data.title}
              </h2>

              <p className="max-w-3xl mx-auto text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 font-normal line-clamp-3">
                {currentSlide.data.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6">
                <span className="text-sm text-gray-300">Publié le {currentSlide.data.date}</span>
                <Link
                  to="/news"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ba-blue hover:bg-ba-blue-dark text-white text-sm font-semibold transition-all hover:translate-y-[-2px]"
                >
                  Lire plus
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Slide Indicators / Navigation Dots */}
        {slides.length > 1 && (
          <div className="flex items-center gap-3 mt-8 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 h-3 bg-ba-blue rounded-full'
                    : 'w-3 h-3 bg-white/40 hover:bg-white/70 rounded-full'
                }`}
              />
            ))}
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-float pointer-events-none hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-white/40 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Overlapping CTA Button (Fixed at bottom) */}
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
        <div className="text-center mb-10 impact-title-offset max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue mb-3">
            Bilan d'impact vérifié
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">{t.impact.title}</h2>
          <p className="text-ba-text-secondary text-base leading-relaxed">{t.impact.subtitle}</p>
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
        <div className="card-row mb-6">
          <span className="badge-accent">Indicateur Majeur</span>
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
function SecondaryCounterCard({ value, label, index }: { value: number; label: string; index: number }) {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <div ref={ref} className="card-sm flex-1 card-row gap-4">
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="block mb-1" style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600 }}>
          Indicateur 0{index + 1}
        </span>
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
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue mb-3">
            Domaines d'intervention
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">{t.pillars.title}</h2>
          <p className="text-ba-text-secondary text-base leading-relaxed">{t.pillars.subtitle}</p>
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
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                    Pilier #{i + 1}
                  </span>
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
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue mb-3">
              Impact Terrain
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Nos Projets</h2>
            <p className="text-ba-text-secondary max-w-3xl leading-relaxed">Découvrez nos actions concrètes déployées sur le terrain en RDC pour la promotion des droits, l'accessibilité, l'éducation inclusive et l'autonomie des personnes handicapées.</p>
          </div>
          <Link to="/projects" className="btn btn-outline btn-sm shrink-0">
            Tous les projets
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
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
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue mb-3">
              Publications Récentes
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">{t.news.title}</h2>
            <p className="text-ba-text-secondary leading-relaxed">{t.news.subtitle}</p>
          </div>
          <Link to="/news" className="btn btn-outline btn-sm shrink-0">
            {t.news.all_news}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
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
