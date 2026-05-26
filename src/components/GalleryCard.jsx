import { useCallback } from 'react';
import { useProgressiveImage } from '../hooks/useProgressiveImage';
import { cldCard, cldPlaceholder } from '../utils/cloudinary';
import './GalleryCard.css';

const GalleryCard = ({ model, isAdmin, onDelete, onImageClick }) => {
  const { id, title, desc, img } = model;

  const fullSrc        = cldCard(img || '');
  const placeholderSrc = cldPlaceholder(img || '');
  const { src, isLoaded } = useProgressiveImage(fullSrc, placeholderSrc);

  const handleDelete = useCallback(() => onDelete(id, title), [id, title, onDelete]);

  return (
    <article className={`card reveal ${isAdmin ? 'admin-mode' : ''}`}>
      <div className="card-inner">
        {img ? (
          <img
            src={src}
            alt={title}
            className="card-img"
            loading="lazy"
            decoding="async"
            onClick={onImageClick}
            style={{
              filter:     isLoaded ? 'none'     : 'blur(6px)',
              transform:  isLoaded ? 'scale(1)' : 'scale(1.02)',
              transition: 'filter 0.4s ease, transform 0.4s ease',
              cursor:     onImageClick ? 'pointer' : 'default',
            }}
          />
        ) : (
          <div className="card-placeholder">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
              stroke="#6b5d4f" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <span>Photo bientôt disponible</span>
          </div>
        )}

        {isAdmin && (
          <button className="card-del-btn" onClick={handleDelete}
            aria-label={`Supprimer "${title}"`}>
            ✕ Supprimer
          </button>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        {desc && <p className="card-desc">{desc}</p>}
      </div>
    </article>
  );
};

export default GalleryCard;
