import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useScrollReveal, useCountUp } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';
import type { Project, NewsArticle } from '../types';

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
  const [fading, setFading] = useState(false);

  /* Build dynamic slides array: Default -> Project 1 -> News 1 -> Project 2 -> News 2 */
  const slides: HeroSlide[] = [{ kind: 'default' }];
  
  if (data.projects.length > 0) slides.push({ kind: 'project', data: data.projects[0] });
  if (data.news.length > 0) slides.push({ kind: 'news', data: data.news[0] });
  if (data.projects.length > 1) slides.push({ kind: 'project', data: data.projects[1] });
  if (data.news.length > 1) slides.push({ kind: 'news', data: data.news[1] });

  /* Auto-rotate slides every 5 seconds */
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setFading(false);
      }, 400);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setFading(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setFading(false);
    }, 300);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section className="relative min-h-[72vh] md:min-h-[78vh] flex items-center justify-center overflow-visible bg-ba-dark">
      {/* Background Image — ALWAYS FIXED, NEVER CHANGES */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('/photo1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0 bg-black/65" />
      
      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-ba-green/10 animate-float" />
        <div className="absolute bottom-20 right-1/4 w-60 h-60 rounded-full bg-ba-red/10 animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative container-ba text-center text-white z-10 pt-28 pb-20 md:pt-32 md:pb-24 flex flex-col items-center justify-center min-h-[380px]">

        {/* Dynamic Content Box with Fade Transition */}
        <div
          className="w-full flex flex-col items-center justify-center transition-all duration-500"
          style={{ opacity: fading ? 0 : 1, transform: fading ? 'scale(0.98)' : 'scale(1)' }}
        >
          {/* SLIDE 0: DEFAULT HERO PRESENTATION */}
          {currentSlide.kind === 'default' && (
            <>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem] font-bold mb-6 leading-tight max-w-5xl">
                <span className="block">{t.hero.title1}</span>
                <span className="block mt-2">
                  <span className="gradient-text-red">{t.hero.title2}</span>
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
                  <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden flex-shrink-0 border border-white/20 shadow-2xl">
                    <img src={currentSlide.data.image} alt={currentSlide.data.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed mb-4 line-clamp-3">
                    {currentSlide.data.description?.replace(/\[photo:\d+\]/g, '').trim()}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm text-gray-300 font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-ba-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {currentSlide.data.location} — <span className="text-ba-red font-semibold">{currentSlide.data.status}</span>
                    </span>
                    <Link
                      to={`/projects/${currentSlide.data.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ba-red hover:bg-ba-red-dark text-white text-sm font-semibold transition-all shadow-lg hover:scale-105"
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ba-green hover:bg-ba-green-dark text-white text-sm font-semibold transition-all shadow-lg hover:scale-105"
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
                    ? 'w-8 h-3 bg-ba-red rounded-full'
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

      {/* Overlapping CTA Buttons (Always Fixed at bottom) */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-4">
        <div className="container-ba flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link to="/act" className="btn btn-red btn-lg group shadow-xl">
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {t.hero.cta_donate}
          </Link>
          <Link to="/safeguarding" className="btn btn-outline btn-lg border-white/20 text-white bg-ba-dark/80 backdrop-blur-md hover:border-ba-red hover:text-ba-red shadow-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {t.hero.cta_report}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ===== IMPACT COUNTERS ===== */
function ImpactSection() {
  const { t } = useI18n();
  const { ref: sectionRef, isVisible } = useScrollReveal();
  const { data } = useAdminData();

  const counters = data.impact;

  return (
    <section className="section-padding pt-36 sm:pt-40 md:pt-24 bg-ba-surface-elevated relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ba-red/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ba-green/20 to-transparent" />
      </div>

      <div ref={sectionRef} className={`container-ba transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-8 impact-title-offset">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">{t.impact.title}</h2>
          <p className="text-ba-text-secondary text-justify">{t.impact.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {counters.map((item, i) => (
            <CounterCard key={item.id || i} value={item.value} label={item.label} color={item.color} delay={i * 200} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CounterCard({ value, label, color, delay }: { value: number; label: string; color: string; delay: number }) {
  const { count, ref } = useCountUp(value, 2500);

  const isRed = color === 'ba-red';

  return (
    <div
      ref={ref}
      className="glass-card rounded-3xl p-6 md:p-8 text-center group relative overflow-hidden border border-black/[0.06] dark:border-white/[0.08] hover:border-ba-red/30 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background ambient glow */}
      <div className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full blur-3xl opacity-20 pointer-events-none ${isRed ? 'bg-ba-red' : 'bg-ba-green'}`} />

      <div className="relative z-10 flex flex-col items-center">
        <span className={`font-heading text-3xl md:text-4xl font-extrabold tracking-tight ${isRed ? 'text-ba-red' : 'text-ba-green'} block mb-2 transition-transform duration-300 group-hover:scale-105`}>
          {count.toLocaleString()}+
        </span>
        <span className="text-ba-text-secondary text-sm md:text-base font-medium">{label}</span>
      </div>
    </div>
  );
}

/* ===== 4 PILLARS SECTION ===== */
function PillarsSection() {
  const { t } = useI18n();
  const { ref, isVisible } = useScrollReveal();
  const { data } = useAdminData();

  const pillars = data.pillars;

  return (
    <section className="section-padding relative">
      <div ref={ref} className={`container-ba transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-red/10 text-ba-red mb-3">
            Domaines d'intervention
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">{t.pillars.title}</h2>
          <p className="text-ba-text-secondary text-base leading-relaxed">{t.pillars.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, i) => (
            <Link
              key={pillar.id || i}
              to="/pillars"
              className="glass-card group flex flex-col rounded-3xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] hover:border-ba-red/30 transition-all duration-300"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Card Header with Image */}
              <div className="h-60 w-full overflow-hidden relative">
                <img 
                  src={pillar.image} 
                  alt={pillar.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 z-10">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20 mb-2">
                    Pilier #{i + 1}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-white leading-tight">{pillar.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                <p className="text-ba-text-secondary text-sm md:text-base leading-relaxed mb-6">{pillar.description}</p>
                
                {/* Card Footer */}
                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-medium text-ba-text-muted">En savoir plus</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-ba-red group-hover:translate-x-1.5 transition-transform duration-300">
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

/* ===== PROJECTS PREVIEW ===== */
function ProjectsPreviewSection() {
  const { ref, isVisible } = useScrollReveal();
  const { data } = useAdminData();

  const projects = data.projects.slice(0, 3);
  if (projects.length === 0) return null;

  const statusBadge: Record<string, string> = {
    'En cours':         'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    'Achevé':           'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    'En planification': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  };

  return (
    <section className="section-padding relative">
      <div ref={ref} className={`container-ba transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-green/10 text-ba-green mb-3">
              Impact Terrain
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Nos Projets</h2>
            <p className="text-ba-text-secondary max-w-3xl leading-relaxed">Découvrez nos actions concrètes déployées sur le terrain à travers le continent africain pour la protection de l'enfance, la santé, l'éducation et l'environnement.</p>
          </div>
          <Link to="/projects" className="btn btn-outline btn-sm shrink-0">
            Tous les projets
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj, i) => {
            const excerpt = proj.description
              ? proj.description.replace(/\[photo:\d+\]/g, '').trim().slice(0, 110) + (proj.description.length > 110 ? '…' : '')
              : '';
            return (
              <Link
                key={proj.id || i}
                to={`/projects/${proj.id}`}
                className="glass-card group flex flex-col rounded-3xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] hover:border-ba-red/30 transition-all duration-300"
              >
                {/* Cover Thumbnail */}
                <div className="relative w-full overflow-hidden" style={{ height: '200px' }}>
                  {proj.image ? (
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-ba-dark-light text-ba-text-muted">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
                      </svg>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className={`absolute top-3 left-3 ${proj.color || 'bg-ba-red'} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                    {proj.type}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge[proj.status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                      {proj.status}
                    </span>
                    <p className="text-xs text-ba-text-muted flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-ba-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {proj.location}
                    </p>
                  </div>

                  <h3 className="font-heading text-lg font-bold mb-2 group-hover:text-ba-red transition-colors leading-snug line-clamp-2">
                    {proj.title}
                  </h3>

                  {excerpt && (
                    <p className="text-xs text-ba-text-secondary leading-relaxed line-clamp-2 mb-4 flex-1">{excerpt}</p>
                  )}

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.06] mt-auto flex items-center justify-between">
                    <span className="text-xs font-semibold text-ba-red flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
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

/* ===== NEWS PREVIEW ===== */
function NewsPreviewSection() {
  const { t } = useI18n();
  const { ref, isVisible } = useScrollReveal();
  const { data } = useAdminData();

  const articles = data.news.slice(0, 3);

  return (
    <section className="section-padding">
      <div ref={ref} className={`container-ba transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-red/10 text-ba-red mb-3">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <Link
              key={article.id || i}
              to={`/news/${article.id}`}
              className="glass-card group flex flex-col rounded-3xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] hover:border-ba-red/30 transition-all duration-300"
            >
              {/* Cover Image or Graphic */}
              <div className="relative h-48 w-full overflow-hidden">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${article.color === 'ba-red' ? 'from-ba-red/20 to-ba-red/5' : 'from-ba-green/20 to-ba-green/5'} flex items-center justify-center`}>
                    <div className={`w-14 h-14 rounded-2xl ${article.color === 'ba-red' ? 'bg-ba-red/20 text-ba-red' : 'bg-ba-green/20 text-ba-green'} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Category Pill */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${article.color === 'ba-red' ? 'bg-ba-red/90 text-white border-ba-red/40' : 'bg-ba-green/90 text-white border-ba-green/40'}`}>
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-ba-text-muted mb-3">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="font-heading font-bold text-lg mb-2.5 group-hover:text-ba-red transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-ba-text-secondary text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-semibold text-ba-red flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    {t.news.read_more}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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

/* ===== CTA SECTION ===== */
function CTASection() {
  const { t } = useI18n();
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-ba-red/10 animate-pulse-soft" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-ba-green/10 animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      </div>

      <div ref={ref} className={`container-ba section-padding relative z-10 text-center text-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
          {t.cta.title}
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          {t.cta.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/act" className="btn btn-red btn-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {t.cta.donate}
          </Link>
          <Link to="/about" className="btn btn-green btn-lg">
            {t.cta.join}
          </Link>
        </div>
      </div>
    </section>
  );
}
