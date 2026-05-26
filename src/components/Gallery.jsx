import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection, deleteDoc, doc,
  query, orderBy, onSnapshot,
} from 'firebase/firestore';
import { db }          from '../firebase/config';
import { useAuth }     from '../context/AuthContext';
import { useApp }      from '../context/AppContext';
import { useLightbox } from '../context/LightboxContext';
import { useReveal }   from '../hooks/useReveal';
import GalleryCard     from './GalleryCard';
import './Gallery.css';

const CATEGORY_TABS = [
  { key: 'all',      label: 'Tout voir'  },
  { key: 'robe',     label: 'Robes'      },
  { key: 'boubou',   label: 'Boubous'    },
  { key: 'chemise',  label: 'Chemises'   },
  { key: 'broderie', label: 'Broderies'  },
  { key: 'autre',    label: 'Autres'     },
];

const Gallery = () => {
  const { isAdmin }                = useAuth();
  const { showToast, showConfirm } = useApp();
  const { openLightbox }           = useLightbox();

  const [models,    setModels]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const unsubRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'models'), orderBy('createdAt', 'desc'));
    unsubRef.current = onSnapshot(q,
      (snap) => {
        setModels(snap.docs.map((d) => ({ id: d.id, ...d.data() })).slice(0, 20));
        setLoading(false);
      },
      (err) => { console.error(err); setLoading(false); }
    );
    return () => unsubRef.current?.();
  }, []);

  const filtered = activeTab === 'all'
    ? models
    : models.filter((m) => m.category === activeTab);

  useReveal([filtered, activeTab]);

  const handleDelete = useCallback((id, title) => {
    if (!isAdmin) return;
    showConfirm(`Supprimer "${title}" de la galerie ?`, async () => {
      try {
        await deleteDoc(doc(db, 'models', id));
        showToast('Création supprimée.');
      } catch { showToast('Erreur lors de la suppression.'); }
    });
  }, [isAdmin, showConfirm, showToast]);

  // Ouvre le lightbox sur l'image cliquée, avec toutes les images comme liste
  const handleImageClick = useCallback((clickedModel) => {
    const items = filtered
      .filter((m) => m.img)
      .map((m) => ({ img: m.img, title: m.title, desc: m.desc }));
    const idx = items.findIndex((item) => item.img === clickedModel.img);
    openLightbox(items, idx >= 0 ? idx : 0);
  }, [filtered, openLightbox]);

  return (
    <section id="galerie" className="gallery-section">
      <div className="reveal">
        <p className="s-tag">Nos Créations</p>
        <h2 className="s-title">Chaque point, une histoire</h2>
        <p className="s-desc">
          Des robes de cérémonie aux tenues du quotidien, chaque pièce est brodée à la main.
          Cliquez sur une création pour la voir en grand.
        </p>
        <div className="gallery-tabs" role="tablist">
          {CATEGORY_TABS.map(({ key, label }) => (
            <button key={key}
              className={`gallery-tab ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
              role="tab" aria-selected={activeTab === key}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="gallery-grid reveal" id="galleryGrid">
        {loading && (
          <div className="gallery-loading">
            <div className="gallery-spinner" />
            <p>Chargement des créations…</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="gallery-empty">
            <h3 className="gallery-empty-title">
              {activeTab === 'all' ? 'La galerie sera bientôt garnie' : 'Aucune création dans cette catégorie'}
            </h3>
            <p className="gallery-empty-sub">
              Les créations de G&apos;ens Couture apparaîtront ici.<br />
              Revenez bientôt ou contactez-nous directement sur WhatsApp.
            </p>
          </div>
        )}

        {!loading && filtered.map((model) => (
          <GalleryCard
            key={model.id}
            model={model}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onImageClick={model.img ? () => handleImageClick(model) : null}
          />
        ))}
      </div>
    </section>
  );
};

export default Gallery;
