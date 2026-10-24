import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { animate } from 'animejs';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ScrollProgressBar, BackToTop } from './components/layout/ScrollUI';
import { useLenis, smoothScrollTo } from './hooks/useLenis';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Pillars = lazy(() => import('./pages/Pillars'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Safeguarding = lazy(() => import('./pages/Safeguarding'));
const ActWithUs = lazy(() => import('./pages/ActWithUs'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-ba-dark">
      <div className="w-10 h-10 border-3 border-ba-blue border-t-transparent rounded-full animate-spin"></div>
      <span className="mt-4 font-heading font-semibold text-xs tracking-wider uppercase text-ba-text-secondary">Chargement...</span>
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
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Lenis smooth scroll — active on public pages only
  useLenis();

  if (isAdminRoute) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
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
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <AnimatedPage>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/pillars" element={<Pillars />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/safeguarding" element={<Safeguarding />} />
                <Route path="/act" element={<ActWithUs />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/contact" element={<Contact />} />
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

