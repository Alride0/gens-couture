// ═══════════════════════════════════════════════════════
//  /src/hooks/useScrolled.js
//  Hook : Détection du scroll pour la navbar
//
//  Retourne `true` dès que l'utilisateur a scrollé
//  de plus de 60px vers le bas.
// ═══════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

/**
 * useScrolled
 * @returns {boolean} scrolled — true si window.scrollY > 60
 */
export function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    // Vérification initiale (page déjà scrollée au montage)
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
}
