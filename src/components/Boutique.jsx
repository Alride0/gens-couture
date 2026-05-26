// ═══════════════════════════════════════════════
//  /src/components/Boutique.jsx — v2
//
//  Nouveautés :
//    - onSnapshot() temps réel
//    - showConfirm() remplace window.confirm()
//    - Empty state amélioré avec illustration SVG
//    - Bouton delete hover-only
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection, deleteDoc, doc,
  query, orderBy, onSnapshot,
} from 'firebase/firestore';
import { db }                                   from '../firebase/config';
import { useAuth }                              from '../context/AuthContext';
import { useApp }                               from '../context/AppContext';
import { useLightbox }                          from '../context/LightboxContext';
import { useReveal }                            from '../hooks/useReveal';
import { useProgressiveImage }                  from '../hooks/useProgressiveImage';
import { cldProduct, cldPlaceholder }           from '../utils/cloudinary';
import WhatsAppIcon                             from './WhatsAppIcon';
import './Boutique.css';

const TABS = [
  { key: 'all',     label: 'Tout voir'        },
  { key: 'savon',   label: 'Savons Liquides'  },
  { key: 'sac',     label: 'Sacs en Pagne'    },
  { key: 'special', label: 'Pièces Spéciales' },
];

const WA_PROD = `https://wa.me/2290166313100?text=${encodeURIComponent(
  "Bonjour G'ens Couture, je suis intéressée par un produit artisanal"
)}`;

// ── Image progressive ──────────────────────────────────
const ProgressiveProductImage = ({ src: rawSrc, alt, onClick }) => {
  const fullSrc        = cldProduct(rawSrc);
  const placeholderSrc = cldPlaceholder(rawSrc);
  const { src, isLoaded } = useProgressiveImage(fullSrc, placeholderSrc);

  return (
    <button
      className="product-img-btn"
      onClick={onClick}
      aria-label={`Agrandir : ${alt}`}
      title="Cliquer pour agrandir"
    >
      <img
        src={src}
        alt={alt}
        className="product-card-img"
        loading="lazy"
        decoding="async"
        style={{
          filter:     isLoaded ? 'none'     : 'blur(6px)',
          transform:  isLoaded ? 'scale(1)' : 'scale(1.02)',
          transition: 'filter 0.4s ease, transform 0.4s ease',
          willChange: 'filter, transform',
        }}
      />
      <span className="product-zoom-hint" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></span>
    </button>
  );
};

// ── Empty state avec illustration SVG ─────────────────
const BoutiqueEmpty = ({ isFiltered }) => (
  <div className="boutique-empty">
    <svg className="boutique-empty-svg" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      {/* Pelote de fil */}
      <circle cx="60" cy="60" r="32" stroke="#2d6a4f" strokeWidth="1.5" opacity=".25"/>
      <circle cx="60" cy="60" r="22" stroke="#2d6a4f" strokeWidth="1" opacity=".18"/>
      <circle cx="60" cy="60" r="12" stroke="#2d6a4f" strokeWidth="1" opacity=".15"/>
      {/* Aiguille */}
      <line x1="82" y1="20" x2="48" y2="68" stroke="#40916c" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
      <ellipse cx="82" cy="19" rx="3" ry="5" transform="rotate(-55 82 19)" stroke="#40916c" strokeWidth="1.2" fill="none" opacity=".5"/>
      {/* Fil qui passe */}
      <path d="M48 68 Q55 80 65 72 Q75 64 72 55" stroke="#40916c" strokeWidth="1" fill="none" strokeDasharray="3 3" opacity=".4"/>
    </svg>
    <p className="boutique-empty-title">
      {isFiltered ? 'Aucun produit dans cette catégorie' : 'La boutique sera bientôt garnie'}
    </p>
    <p className="boutique-empty-sub">
      Nos produits artisanaux arrivent bientôt.<br />
      Contactez-nous directement pour commander.
    </p>
    <a href={WA_PROD} target="_blank" rel="noopener noreferrer" className="btn-primary boutique-empty-cta">
      <WhatsAppIcon size={13} />
      Nous contacter
    </a>
  </div>
);

// ── Composant principal ────────────────────────────────
const Boutique = () => {
  const { isAdmin }               = useAuth();
  const { showToast, showConfirm } = useApp();
  const { openLightbox }          = useLightbox();

  const [products,  setProducts]  = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading,   setLoading]   = useState(true);
  const unsubRef = useRef(null);

  // Temps réel
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    unsubRef.current = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProducts(data);
        setLoading(false);
      },
      (err) => {
        console.error('Erreur Firestore boutique:', err);
        setLoading(false);
      }
    );
    return () => unsubRef.current?.();
  }, []);

  useReveal([products, activeTab]);

  const handleDelete = useCallback((id, title) => {
    if (!isAdmin) return;
    showConfirm(`Supprimer "${title}" de la boutique ?`, async () => {
      try {
        await deleteDoc(doc(db, 'products', id));
        showToast('Produit supprimé.');
      } catch {
        showToast('Erreur lors de la suppression.');
      }
    });
  }, [isAdmin, showConfirm, showToast]);

  const filtered = activeTab === 'all'
    ? products
    : products.filter((p) => p.cat === activeTab);

  const handleImageClick = useCallback((index) => {
    const items = filtered
      .filter((p) => p.img)
      .map((p) => ({ img: p.img, title: p.title, desc: p.desc }));
    const imgOnlyIndex = filtered.slice(0, index).filter((p) => p.img).length;
    openLightbox(items, imgOnlyIndex);
  }, [filtered, openLightbox]);

  return (
    <section id="boutique" className="boutique-section">

      <div className="reveal">
        <p className="s-tag">Créations Artisanales</p>
        <h2 className="s-title">
          Boutique &amp; Cosmétique<br />
          <em>de l&apos;Atelier</em>
        </h2>
        <p className="s-desc">
          Savons liquides naturels, sacs en pagne et pièces artisanales d&apos;exception —
          chaque produit porte l&apos;âme de G&apos;ens Couture.
        </p>

        <div className="boutique-tabs" role="tablist" aria-label="Filtrer par catégorie">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              className={`boutique-tab ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
              role="tab"
              aria-selected={activeTab === key}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="boutique-grid reveal">

        {loading && (
          <div className="boutique-loading">
            <div className="gallery-spinner" />
            <p>Chargement des produits…</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <BoutiqueEmpty isFiltered={activeTab !== 'all'} />
        )}

        {!loading && filtered.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onImageClick={product.img ? () => handleImageClick(i) : null}
          />
        ))}
      </div>

      <div className="reveal boutique-cta-wrap">
        <p className="boutique-cta-hint">
          Vous ne trouvez pas ce que vous cherchez ? Contactez-nous directement.
        </p>
        <a href={WA_PROD} target="_blank" rel="noopener noreferrer" className="btn-primary">
          <WhatsAppIcon size={14} />
          Commander un produit
        </a>
      </div>
    </section>
  );
};

// ── Product Card ───────────────────────────────────────
const ProductCard = ({ product, isAdmin, onDelete, onImageClick }) => {
  const { id, title, desc, img, cat, price, stock } = product;

  const catLabels = {
    savon:   'Savon Liquide',
    sac:     'Sac en Pagne',
    special: 'Pièce Spéciale',
  };

  const isInStock = stock !== false;

  const waUrl = `https://wa.me/2290166313100?text=${encodeURIComponent(
    `Bonjour G'ens Couture, je suis intéressée par votre produit : ${title}`
  )}`;

  return (
    <article className={`product-card ${isAdmin ? 'admin-mode' : ''}`}>
      <div className="product-card-img-wrap">

        {img ? (
          <ProgressiveProductImage src={img} alt={title} onClick={onImageClick} />
        ) : (
          <div className="product-card-placeholder" aria-hidden="true" />
        )}

        {cat && (
          <span className="product-cat-badge">{catLabels[cat] || cat}</span>
        )}

        <span className={`product-stock-badge ${isInStock ? 'in-stock' : 'out-stock'}`}>
          {isInStock ? 'En stock' : 'Épuisé'}
        </span>

        {isInStock && (
          <div className="product-overlay">
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="product-overlay-wa">
              <WhatsAppIcon size={13} />
              Commander
            </a>
          </div>
        )}

        {/* Bouton supprimer — hover seulement */}
        {isAdmin && (
          <button
            className="card-del-btn"
            onClick={() => onDelete(id, title)}
            aria-label={`Supprimer "${title}"`}
          >
            ✕ Supprimer
          </button>
        )}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{title}</h3>
        {desc && <p className="product-card-desc">{desc}</p>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.6rem', flexWrap: 'wrap', gap: '.4rem' }}>
          {price && <p className="product-card-price">{price}</p>}
          <span className={`product-card-stock ${isInStock ? 'in' : 'out'}`}>
            {isInStock ? 'Disponible' : 'Épuisé'}
          </span>
        </div>
      </div>
    </article>
  );
};

export default Boutique;
