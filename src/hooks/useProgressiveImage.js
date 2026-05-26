// ═══════════════════════════════════════════════
//  /src/hooks/useProgressiveImage.js
//  Hook — chargement progressif avec effet blur-up
//
//  Fonctionnement :
//    1. Affiche immédiatement le placeholder flou (≈2 Ko)
//    2. Charge la vraie image en arrière-plan
//    3. Quand elle est prête, effectue une transition douce
//
//  Usage :
//    const { src, isLoaded } = useProgressiveImage(fullUrl, placeholderUrl);
//    <img src={src} style={{ filter: isLoaded ? 'none' : 'blur(8px)' }} />
// ═══════════════════════════════════════════════

import { useState, useEffect } from 'react';

/**
 * @param {string|null} fullSrc        - URL de la vraie image (ex: cldCard(url))
 * @param {string|null} placeholderSrc - URL du placeholder flou (ex: cldPlaceholder(url))
 * @returns {{ src: string, isLoaded: boolean }}
 */
export function useProgressiveImage(fullSrc, placeholderSrc) {
  // Démarre avec le placeholder (ou fullSrc si pas de placeholder)
  const [src,      setSrc]      = useState(placeholderSrc || fullSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Réinitialise si l'URL change (ex: changement de modèle)
    setSrc(placeholderSrc || fullSrc);
    setIsLoaded(false);

    if (!fullSrc) return;

    // Précharge la vraie image sans bloquer le rendu
    const img = new Image();
    img.src = fullSrc;

    img.onload = () => {
      setSrc(fullSrc);
      setIsLoaded(true);
    };

    img.onerror = () => {
      // En cas d'erreur, garde le placeholder ou l'URL originale
      setSrc(placeholderSrc || fullSrc);
      setIsLoaded(false);
    };

    // Nettoyage si le composant est démonté avant la fin du chargement
    return () => {
      img.onload  = null;
      img.onerror = null;
    };
  }, [fullSrc, placeholderSrc]);

  return { src, isLoaded };
}
