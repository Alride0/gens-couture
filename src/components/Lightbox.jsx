import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLightbox }  from '../context/LightboxContext';
import { cldFull }      from '../utils/cloudinary';
import './Lightbox.css';

const Lightbox = () => {
  const { isOpen, items, index, closeLightbox, goPrev, goNext } = useLightbox();
  const [closing,   setClosing]   = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const touchStartX = useRef(null);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setClosing(false); closeLightbox(); }, 220);
  }, [closeLightbox]);

  useEffect(() => { setImgLoaded(false); }, [index]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape')     handleClose();
      if (e.key === 'ArrowLeft')  goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose, goPrev, goNext]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
    touchStartX.current = null;
  };

  if (!isOpen && !closing) return null;

  const current  = items[index] ?? {};
  const fullSrc  = cldFull(current.img);
  const hasMany  = items.length > 1;

  return createPortal(
    <div
      className={`lb-backdrop ${closing ? 'lb-closing' : ''}`}
      onClick={handleClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
    >
      {/* Bouton fermer */}
      <button className="lb-close" onClick={handleClose} aria-label="Fermer">✕</button>

      {/* Navigation précédent */}
      {hasMany && (
        <button className="lb-nav lb-prev"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          aria-label="Précédent">‹</button>
      )}

      {/* Image centrée — stoppe la propagation pour ne pas fermer en cliquant dessus */}
      <div className="lb-container" onClick={(e) => e.stopPropagation()}>
        {hasMany && (
          <span className="lb-counter">{index + 1} / {items.length}</span>
        )}

        <div className="lb-img-wrap">
          {current.img && (
            <img
              key={fullSrc}
              src={fullSrc}
              alt={current.title || "Création G'ens Couture"}
              className={`lb-img ${imgLoaded ? 'lb-img-ready' : 'lb-img-loading'}`}
              onLoad={() => setImgLoaded(true)}
              draggable={false}
            />
          )}
          {!imgLoaded && (
            <div className="lb-spinner-wrap">
              <div className="lb-spinner" />
            </div>
          )}
        </div>

        {current.title && (
          <div className="lb-caption">
            <span className="lb-caption-title">{current.title}</span>
            {current.desc && <span className="lb-caption-desc">{current.desc}</span>}
          </div>
        )}
      </div>

      {/* Navigation suivant */}
      {hasMany && (
        <button className="lb-nav lb-next"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          aria-label="Suivant">›</button>
      )}
    </div>,
    document.body
  );
};

export default Lightbox;
