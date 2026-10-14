import { useEffect, useRef } from 'react';

/** Adds `is-visible` to the element the first time it scrolls into view. */
export function useReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const alreadyInView = el.getBoundingClientRect().top < window.innerHeight;
    if (alreadyInView || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          obs.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}
