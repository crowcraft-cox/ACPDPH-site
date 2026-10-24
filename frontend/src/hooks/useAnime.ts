import { useEffect, useRef, useState, useCallback } from 'react';
import { animate, createTimeline, stagger } from 'animejs';

// Respect prefers-reduced-motion
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export type RevealVariant = 'fade-up' | 'fade-in' | 'stagger-cards' | 'slide-left' | 'slide-right' | 'scale-in';

interface UseAnimeRevealOptions {
  variant?: RevealVariant;
  duration?: number;
  delay?: number;
  staggerDelay?: number;
  itemSelector?: string;
  threshold?: number;
  once?: boolean;
}

/**
 * Hook to smoothly reveal elements or staggered child items when scrolled into view using Anime.js
 */
export function useAnimeReveal<T extends HTMLElement = HTMLDivElement>(options: UseAnimeRevealOptions = {}) {
  const {
    variant = 'fade-up',
    duration = 750,
    delay = 0,
    staggerDelay = 80,
    itemSelector,
    threshold = 0.15,
    once = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      if (itemSelector) {
        el.querySelectorAll(itemSelector).forEach((item) => {
          (item as HTMLElement).style.opacity = '1';
          (item as HTMLElement).style.transform = 'none';
        });
      }
      setHasAnimated(true);
      return;
    }

    // Set initial hidden states
    if (variant === 'stagger-cards') {
      const targets = itemSelector ? Array.from(el.querySelectorAll(itemSelector)) : Array.from(el.children);
      targets.forEach((target) => {
        const item = target as HTMLElement;
        item.style.opacity = '0';
        item.style.transform = 'translateY(28px)';
      });
    } else {
      el.style.opacity = '0';
      if (variant === 'fade-up') el.style.transform = 'translateY(24px)';
      else if (variant === 'slide-left') el.style.transform = 'translateX(-32px)';
      else if (variant === 'slide-right') el.style.transform = 'translateX(32px)';
      else if (variant === 'scale-in') el.style.transform = 'scale(0.95)';
    }

    let currentAnimation: any = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (variant === 'stagger-cards') {
            const targets = itemSelector ? el.querySelectorAll(itemSelector) : Array.from(el.children);
            if (targets.length > 0) {
              currentAnimation = animate(targets, {
                opacity: [0, 1],
                translateY: [28, 0],
                duration,
                delay: stagger(staggerDelay, { start: delay }),
                ease: 'outExpo',
              });
            }
          } else {
            const animProps: Record<string, any> = {
              opacity: [0, 1],
              duration,
              delay,
              ease: 'outExpo',
            };

            if (variant === 'fade-up') animProps.translateY = [24, 0];
            else if (variant === 'slide-left') animProps.translateX = [-32, 0];
            else if (variant === 'slide-right') animProps.translateX = [32, 0];
            else if (variant === 'scale-in') animProps.scale = [0.95, 1];

            currentAnimation = animate(el, animProps);
          }

          setHasAnimated(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (currentAnimation && typeof currentAnimation.pause === 'function') {
        currentAnimation.pause();
      }
    };
  }, [variant, duration, delay, staggerDelay, itemSelector, threshold, once]);

  return { ref, hasAnimated };
}

interface UseAnimeCounterOptions {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  formatter?: (val: number) => string;
  threshold?: number;
}

/**
 * Hook to smoothly animate numbers from start to target using Anime.js easing
 */
export function useAnimeCounter(options: UseAnimeCounterOptions) {
  const {
    end,
    start = 0,
    duration = 2000,
    decimals = 0,
    formatter,
    threshold = 0.25,
  } = options;

  const [displayValue, setDisplayValue] = useState<string>(
    formatter ? formatter(start) : start.toLocaleString()
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      const finalVal = formatter ? formatter(end) : end.toLocaleString();
      setDisplayValue(finalVal);
      return;
    }

    let anim: any = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;

          const counterObj = { current: start };
          anim = animate(counterObj, {
            current: end,
            duration,
            ease: 'outExpo',
            onUpdate: () => {
              const val = decimals > 0 
                ? Number(counterObj.current.toFixed(decimals)) 
                : Math.round(counterObj.current);
              setDisplayValue(formatter ? formatter(val) : val.toLocaleString('fr-FR'));
            },
            onComplete: () => {
              setDisplayValue(formatter ? formatter(end) : end.toLocaleString('fr-FR'));
            },
          });

          observer.unobserve(el);
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
  }, [end, start, duration, decimals, formatter, threshold]);

  return { ref, displayValue };
}

/**
 * Hook to animate hero elements sequentially with an Anime.js timeline
 */
export function useAnimeHeroSequence() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const runSequence = useCallback(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) return;

    const badge = el.querySelector('[data-anime="hero-badge"]');
    const title = el.querySelector('[data-anime="hero-title"]');
    const subtitle = el.querySelector('[data-anime="hero-subtitle"]');
    const actions = el.querySelector('[data-anime="hero-actions"]');
    const details = el.querySelector('[data-anime="hero-details"]');

    const tl = createTimeline({
      defaults: { ease: 'outExpo' },
    });

    if (badge) {
      tl.add(badge, {
        opacity: [0, 1],
        translateY: [-12, 0],
        duration: 500,
      });
    }

    if (title) {
      tl.add(title, {
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 700,
      }, '-=300');
    }

    if (subtitle) {
      tl.add(subtitle, {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 600,
      }, '-=450');
    }

    if (details) {
      tl.add(details, {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 600,
      }, '-=400');
    }

    if (actions) {
      tl.add(actions, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 500,
      }, '-=350');
    }

    return tl;
  }, []);

  return { containerRef, runSequence };
}
