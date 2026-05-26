// ═══════════════════════════════════════════════
//  /src/utils/cloudinary.js
//  Utilitaires de transformation d'URL Cloudinary
//
//  Toutes les images affichées passent par ces fonctions
//  pour être automatiquement compressées, converties en
//  format moderne (WebP/AVIF) et redimensionnées selon
//  leur contexte d'affichage.
//
//  Impact sur connexions lentes : réduction 60–80% du poids
// ═══════════════════════════════════════════════

const CLOUDINARY_HOST = 'res.cloudinary.com';

/**
 * Vérifie si l'URL est une URL Cloudinary valide
 */
const isCloudinaryUrl = (url) =>
  typeof url === 'string' && url.includes(CLOUDINARY_HOST);

/**
 * Injecte des paramètres de transformation dans une URL Cloudinary.
 *
 * @param {string} url     - URL Cloudinary originale
 * @param {Object} options
 *   @param {number} [options.width=800]      - Largeur max en pixels
 *   @param {string} [options.quality='auto'] - Qualité ('auto', 'auto:low', 1–100)
 *   @param {string} [options.format='auto']  - Format ('auto' = WebP/AVIF si supporté)
 *   @param {string} [options.crop='limit']   - Mode recadrage (limit = ne jamais agrandir)
 *   @param {number} [options.dpr=1]          - Device Pixel Ratio (1 ou 2 pour Retina)
 * @returns {string} URL transformée
 */
export function cldUrl(url, {
  width   = 800,
  quality = 'auto',
  format  = 'auto',
  crop    = 'limit',
  dpr     = 1,
} = {}) {
  if (!isCloudinaryUrl(url)) return url;

  const transforms = [
    `q_${quality}`,
    `f_${format}`,
    `w_${width}`,
    `c_${crop}`,
    dpr > 1 ? `dpr_${dpr}` : null,
  ].filter(Boolean).join(',');

  return url.replace('/upload/', `/upload/${transforms}/`);
}

/**
 * Génère un placeholder ultra-léger (~2 Ko) flou pour l'effet blur-up.
 * S'affiche instantanément pendant que l'image réelle charge.
 *
 * @param {string} url - URL Cloudinary originale
 * @returns {string} URL du placeholder (30px de large, très flouté)
 */
export function cldPlaceholder(url) {
  if (!isCloudinaryUrl(url)) return url;
  return url.replace('/upload/', '/upload/w_30,q_20,e_blur:800,f_auto/');
}

// ── Presets par contexte d'affichage ──────────────────────

/**
 * Image pour une carte galerie (≈ 300–400px affiché)
 * Poids cible : < 30 Ko
 */
export function cldCard(url) {
  return cldUrl(url, { width: 600, quality: 'auto' });
}

/**
 * Image pour une carte produit boutique (≈ 280px affiché)
 * Poids cible : < 25 Ko
 */
export function cldProduct(url) {
  return cldUrl(url, { width: 480, quality: 'auto' });
}

/**
 * Image pleine résolution pour le lightbox
 * Poids cible : < 200 Ko — qualité max pour l'affichage agrandi
 */
export function cldFull(url) {
  return cldUrl(url, { width: 1400, quality: 'auto', format: 'auto' });
}

/**
 * Miniature admin dans le dashboard (≈ 80px affiché)
 * Poids cible : < 5 Ko
 */
export function cldThumb(url) {
  return cldUrl(url, { width: 160, quality: 'auto:low' });
}

/**
 * Preview après upload (aperçu dans le formulaire admin)
 * Poids cible : < 40 Ko
 */
export function cldPreview(url) {
  return cldUrl(url, { width: 500, quality: 'auto' });
}
