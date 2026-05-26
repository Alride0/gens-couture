// ═══════════════════════════════════════════════
//  /src/hooks/useCountUp.js
//  Hook — Compteur animé au scroll (CountUp)
//
//  Utilise IntersectionObserver pour déclencher
//  l'animation uniquement quand l'élément est visible.
//  Respecte prefers-reduced-motion.
// ═══════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp
 * @param {number}  end       — valeur finale
 * @param {number}  duration  — durée ms (défaut 2000)
 * @param {number}  start     — valeur de départ (défaut 0)
 * @returns {{ ref, display }} — ref à attacher au conteneur, valeur affichée
 */
export function useCountUp(end, duration = 2000, start = 0) {
  const [display, setDisplay] = useState(start);
  const ref      = useRef(null);
  const started  = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respecte prefers-reduced-motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setDisplay(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;

          const startTime = performance.now();
          const range     = end - start;

          const step = (now) => {
            const elapsed  = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing easeOutExpo
            const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setDisplay(Math.floor(start + range * eased));
            if (progress < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, start, duration]);

  return { ref, display };
}
