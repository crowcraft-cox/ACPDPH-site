import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
export { useAnimeReveal, useAnimeCounter, useAnimeHeroSequence } from './useAnime';

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * useScrollReveal powered by Anime.js
 * Retains full backward compatibility with { ref, isVisible } signature
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    let anim: any = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          anim = animate(el, {
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 750,
            ease: 'outExpo',
          });

          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (anim && typeof anim.pause === 'function') {
        anim.pause();
      }
    };
  }, [threshold]);

  return { ref, isVisible };
}

/**
 * useCountUp powered by Anime.js
 * Animates numerical values with smooth exponential deceleration easing
 */
export function useCountUp(end: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setCount(end);
      return;
    }

    let anim: any = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;

          const counterObj = { current: start };
          anim = animate(counterObj, {
            current: end,
            duration,
            ease: 'outExpo',
            onUpdate: () => {
              setCount(Math.round(counterObj.current));
            },
            onComplete: () => {
              setCount(end);
            },
          });

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (anim && typeof anim.pause === 'function') {
        anim.pause();
      }
    };
  }, [end, duration, start]);

  return { count, ref };
}
