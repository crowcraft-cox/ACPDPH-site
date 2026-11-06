import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { animate } from 'animejs';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ScrollProgressBar, BackToTop } from './components/layout/ScrollUI';
import { useLenis, smoothScrollTo } from './hooks/useLenis';
import { useI18n } from './i18n';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Governance = lazy(() => import('./pages/Governance'));
const MemberCv = lazy(() => import('./pages/MemberCv'));
const Pillars = lazy(() => import('./pages/Pillars'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Partners = lazy(() => import('./pages/Partners'));

const Support = lazy(() => import('./pages/Support'));
const Careers = lazy(() => import('./pages/Careers'));
const JobDetail = lazy(() => import('./pages/JobDetail'));
const JobApplication = lazy(() => import('./pages/JobApplication'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Gallery = lazy(() => import('./pages/Gallery'));
const GalleryManager = lazy(() => import('./pages/admin/GalleryManager'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  const { lang } = useI18n();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-ba-dark">
      <div className="w-10 h-10 border-3 border-ba-blue border-t-transparent rounded-full animate-spin"></div>
      <span className="mt-4 font-heading font-semibold text-xs tracking-wider uppercase text-ba-text-secondary">
        {lang === 'en' ? 'Loading...' : lang === 'it' ? 'Caricamento...' : lang === 'de' ? 'Laden...' : 'Chargement...'}
      </span>
    </div>
  );
}

/**
 * Animated route container with Anime.js page transitions and scroll restoration
 */
function AnimatedPage({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    smoothScrollTo(0, { immediate: true });

    const el = pageRef.current;
    if (!el) return;

    const anim = animate(el, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 350,
      ease: 'outExpo',
    });

    return () => {
      if (anim && typeof anim.pause === 'function') anim.pause();
    };
  }, [location.pathname]);

  return <div ref={pageRef}>{children}</div>;
}

function MainLayout() {
  const location = useLocation();
  const { lang, setLang } = useI18n();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Synchronisation de la langue avec l'URL
  useEffect(() => {
    const p = location.pathname;
    if (p === '/en' || p.startsWith('/en/')) {
      if (lang !== 'en') setLang('en');
    } else if (p === '/it' || p.startsWith('/it/')) {
      if (lang !== 'it') setLang('it');
    } else if (p === '/de' || p.startsWith('/de/')) {
      if (lang !== 'de') setLang('de');
    } else if (!p.startsWith('/admin')) {
      const savedLang = localStorage.getItem('ba-lang');
      if (!savedLang && lang !== 'fr') setLang('fr');
    }
  }, [location.pathname, lang, setLang]);

  // Lenis smooth scroll — active on public pages only
  useLenis();

  if (isAdminRoute) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/galerie" element={<GalleryManager />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      {/* Global scroll UI — progress bar + back-to-top */}
      <ScrollProgressBar />
      <BackToTop />

      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
          <Suspense fallback={<PageLoader />}>
            <AnimatedPage>
              <Routes>
                {/* Routes Françaises / Par défaut */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="/gouvernance" element={<Governance />} />
                <Route path="/gouvernance/:slug" element={<MemberCv />} />
                <Route path="/governance/:slug" element={<MemberCv />} />
                <Route path="/pillars" element={<Pillars />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/publications" element={<Navigate to="/" replace />} />
                <Route path="/support" element={<Support />} />
                <Route path="/act" element={<Support />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/offres-emplois" element={<Careers />} />
                <Route path="/offres-emplois/:id" element={<JobDetail />} />
                <Route path="/offres-emplois/:id/postuler" element={<JobApplication />} />
                <Route path="/careers/:id" element={<JobDetail />} />
                <Route path="/careers/:id/postuler" element={<JobApplication />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/galerie" element={<Gallery />} />

                {/* Routes Anglaises (préfixe /en) */}
                <Route path="/en" element={<Home />} />
                <Route path="/en/about" element={<About />} />
                <Route path="/en/governance" element={<Governance />} />
                <Route path="/en/governance/:slug" element={<MemberCv />} />
                <Route path="/en/gouvernance" element={<Governance />} />
                <Route path="/en/gouvernance/:slug" element={<MemberCv />} />
                <Route path="/en/pillars" element={<Pillars />} />
                <Route path="/en/projects" element={<Projects />} />
                <Route path="/en/projects/:id" element={<ProjectDetail />} />
                <Route path="/en/partners" element={<Partners />} />
                <Route path="/en/publications" element={<Navigate to="/en" replace />} />
                <Route path="/en/support" element={<Support />} />
                <Route path="/en/act" element={<Support />} />
                <Route path="/en/careers" element={<Careers />} />
                <Route path="/en/careers/:id" element={<JobDetail />} />
                <Route path="/en/careers/:id/apply" element={<JobApplication />} />
                <Route path="/en/careers/:id/postuler" element={<JobApplication />} />
                <Route path="/en/offres-emplois" element={<Careers />} />
                <Route path="/en/offres-emplois/:id" element={<JobDetail />} />
                <Route path="/en/offres-emplois/:id/postuler" element={<JobApplication />} />
                <Route path="/en/news" element={<News />} />
                <Route path="/en/news/:id" element={<NewsDetail />} />
                <Route path="/en/contact" element={<Contact />} />
                <Route path="/en/gallery" element={<Gallery />} />
                <Route path="/en/galerie" element={<Gallery />} />

                {/* Routes Italiennes (préfixe /it) */}
                <Route path="/it" element={<Home />} />
                <Route path="/it/about" element={<About />} />
                <Route path="/it/governance" element={<Governance />} />
                <Route path="/it/governance/:slug" element={<MemberCv />} />
                <Route path="/it/gouvernance" element={<Governance />} />
                <Route path="/it/gouvernance/:slug" element={<MemberCv />} />
                <Route path="/it/pillars" element={<Pillars />} />
                <Route path="/it/projects" element={<Projects />} />
                <Route path="/it/projects/:id" element={<ProjectDetail />} />
                <Route path="/it/partners" element={<Partners />} />
                <Route path="/it/publications" element={<Navigate to="/it" replace />} />
                <Route path="/it/support" element={<Support />} />
                <Route path="/it/act" element={<Support />} />
                <Route path="/it/careers" element={<Careers />} />
                <Route path="/it/careers/:id" element={<JobDetail />} />
                <Route path="/it/careers/:id/apply" element={<JobApplication />} />
                <Route path="/it/careers/:id/postuler" element={<JobApplication />} />
                <Route path="/it/offres-emplois" element={<Careers />} />
                <Route path="/it/offres-emplois/:id" element={<JobDetail />} />
                <Route path="/it/offres-emplois/:id/postuler" element={<JobApplication />} />
                <Route path="/it/news" element={<News />} />
                <Route path="/it/news/:id" element={<NewsDetail />} />
                <Route path="/it/contact" element={<Contact />} />
                <Route path="/it/gallery" element={<Gallery />} />
                <Route path="/it/galerie" element={<Gallery />} />

                {/* Routes Allemandes (préfixe /de) */}
                <Route path="/de" element={<Home />} />
                <Route path="/de/about" element={<About />} />
                <Route path="/de/governance" element={<Governance />} />
                <Route path="/de/governance/:slug" element={<MemberCv />} />
                <Route path="/de/gouvernance" element={<Governance />} />
                <Route path="/de/gouvernance/:slug" element={<MemberCv />} />
                <Route path="/de/pillars" element={<Pillars />} />
                <Route path="/de/projects" element={<Projects />} />
                <Route path="/de/projects/:id" element={<ProjectDetail />} />
                <Route path="/de/partners" element={<Partners />} />
                <Route path="/de/publications" element={<Navigate to="/de" replace />} />
                <Route path="/de/support" element={<Support />} />
                <Route path="/de/act" element={<Support />} />
                <Route path="/de/careers" element={<Careers />} />
                <Route path="/de/careers/:id" element={<JobDetail />} />
                <Route path="/de/careers/:id/apply" element={<JobApplication />} />
                <Route path="/de/careers/:id/postuler" element={<JobApplication />} />
                <Route path="/de/offres-emplois" element={<Careers />} />
                <Route path="/de/offres-emplois/:id" element={<JobDetail />} />
                <Route path="/de/offres-emplois/:id/postuler" element={<JobApplication />} />
                <Route path="/de/news" element={<News />} />
                <Route path="/de/news/:id" element={<NewsDetail />} />
                <Route path="/de/contact" element={<Contact />} />
                <Route path="/de/gallery" element={<Gallery />} />
                <Route path="/de/galerie" element={<Gallery />} />

                {/* Page 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatedPage>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;
