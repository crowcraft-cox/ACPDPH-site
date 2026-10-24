import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Returns the active Lenis instance if available.
 */
export function getLenis(): Lenis | null {
  if (typeof window === 'undefined') return null;
  return window.__lenis || null;
}

/**
 * Unified scroll helper: uses Lenis smooth scroll if active,
 * otherwise falls back smoothly to native window.scrollTo.
 */
export function smoothScrollTo(
  target: string | number | HTMLElement,
  options?: { offset?: number; duration?: number; immediate?: boolean }
) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
      immediate: options?.immediate ?? false,
    });
  } else {
    if (typeof target === 'number') {
      window.scrollTo({
        top: target,
        behavior: options?.immediate ? 'instant' : 'smooth',
      });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0);
        window.scrollTo({
          top,
          behavior: options?.immediate ? 'instant' : 'smooth',
        });
      }
    } else if (target instanceof HTMLElement) {
      const top = target.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0);
      window.scrollTo({
        top,
        behavior: options?.immediate ? 'instant' : 'smooth',
      });
    }
  }
}

/**
 * Initializes Lenis smooth-scroll globally for the page.
 * Synchronizes with requestAnimationFrame; respects prefers-reduced-motion.
 * Automatically intercepts in-page hash links for seamless smooth navigation.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let rafId: number;

    try {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.8,
        infinite: false,
      });

      lenisRef.current = lenis;
      window.__lenis = lenis;

      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      // Intercept anchor link clicks for smooth animated scrolling with offset
      const handleAnchorClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('a[href^="#"]');
        if (!target) return;
        const href = target.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) return;

        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl as HTMLElement, { offset: -88, duration: 1.1 });
        }
      };

      document.addEventListener('click', handleAnchorClick);

      return () => {
        document.removeEventListener('click', handleAnchorClick);
        cancelAnimationFrame(rafId);
        lenis.destroy();
        lenisRef.current = null;
        delete window.__lenis;
      };
    } catch (err) {
      console.warn('[useLenis] Initialization fallback:', err);
    }
  }, []);

  return lenisRef;
}

