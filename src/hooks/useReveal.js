// ═══════════════════════════════════════════════════════
//  /src/hooks/useReveal.js
//  Hook : Scroll Reveal — animation d'apparition
//
//  Observe les éléments avec la classe "reveal" via
//  IntersectionObserver. Ajoute "visible" quand ils
//  entrent dans le viewport.
// ═══════════════════════════════════════════════════════

import { useEffect } from 'react';

/**
 * useReveal
 * Appeler dans un composant parent pour activer
 * les animations .reveal → .reveal.visible sur
 * tous les éléments enfants.
 *
 * @param {any[]} deps — dépendances (re-observer si la liste change)
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal:not(.visible)');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Délai progressif pour les animations en cascade
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, i * 75);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
