import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import { smoothScrollTo } from '../../hooks/useLenis';

/**
 * ScrollProgressBar — sleek accent reading bar fixed at the top of the viewport.
 * Uses requestAnimationFrame for fluid 60/120fps scaling without layout thrashing.
 * Complies strictly with the no-emoji rule.
 */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    function update() {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-ba-blue via-ba-blue-light to-ba-blue shadow-[0_0_10px_rgba(29,78,216,0.5)]"
        style={{
          transform: 'scaleX(0)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

/**
 * BackToTop — floating button with a circular SVG progress indicator.
 * Fills dynamically with the exact reading progress as the user scrolls.
 * Features smooth Anime.js entrance, Lenis integration, and strictly inline SVG (no emojis).
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);
  const visibleRef = useRef(false);

  const radius = 18;
  const circumference = 2 * Math.PI * radius; // ~113.1

  useEffect(() => {
    let ticking = false;

    function update() {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0;
      setProgress(ratio);

      const shouldShow = scrolled > 320;
      if (shouldShow !== visibleRef.current) {
        visibleRef.current = shouldShow;
        setVisible(shouldShow);
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animate in/out with Anime.js
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    animate(btn, {
      opacity: [visible ? 0 : 1, visible ? 1 : 0],
      scale: [visible ? 0.75 : 1, visible ? 1 : 0.75],
      translateY: [visible ? 16 : 0, visible ? 0 : 16],
      duration: 300,
      ease: 'outExpo',
    });
  }, [visible]);

  const handleScrollToTop = () => {
    smoothScrollTo(0, { duration: 1.2 });
  };

  const strokeDashoffset = circumference - progress * circumference;

  return (
    <button
      ref={btnRef}
      id="back-to-top-btn"
      onClick={handleScrollToTop}
      aria-label="Retour en haut de page"
      title="Retour en haut de page"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full
                 bg-white dark:bg-ba-dark-light text-ba-text-primary dark:text-white
                 flex items-center justify-center
                 shadow-lg border border-gray-200/80 dark:border-gray-700
                 transition-transform duration-200 hover:scale-110 active:scale-95
                 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ba-blue/50"
      style={{
        opacity: 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* SVG Circular Progress Track + Indicator */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
        viewBox="0 0 44 44"
        aria-hidden="true"
      >
        {/* Background track circle */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-gray-200 dark:text-gray-700/60"
        />
        {/* Dynamic progress circle */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#1D4ED8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>

      {/* Modern Chevron Up — Heroicons inline SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-ba-blue transition-transform group-hover:-translate-y-0.5"
        aria-hidden="true"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
