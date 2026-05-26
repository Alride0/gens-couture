// ═══════════════════════════════════════════════
//  /src/components/Dashboard.jsx — v2
//
//  Nouveautés :
//    - Champ "Catégorie" pour les créations galerie
//      (synchronisé avec les onglets de Gallery)
//    - showConfirm() remplace window.confirm()
//    - Bouton "Publier" réduit (fit-content)
//    - AccountSettings : updateEmail remplacé par
//      verifyBeforeUpdateEmail (API Firebase v9+)
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import {
  updatePassword, verifyBeforeUpdateEmail,
  EmailAuthProvider, reauthenticateWithCredential,
} from 'firebase/auth';
import { db, auth }       from '../firebase/config';
import { useAuth }        from '../context/AuthContext';
import { useApp }         from '../context/AppContext';
import CloudinaryUpload   from './CloudinaryUpload';
import { cldThumb }       from '../utils/cloudinary';
import './Dashboard.css';

const GALLERY_CATEGORIES = [
  { value: '',         label: '— Choisir une catégorie —' },
  { value: 'robe',     label: 'Robe' },
  { value: 'boubou',   label: 'Boubou' },
  { value: 'chemise',  label: 'Chemise' },
  { value: 'broderie', label: 'Broderie seule' },
  { value: 'autre',    label: 'Autre' },
];

// ── Composant principal ────────────────────────────────
const Dashboard = () => {
  const { isAdmin }   = useAuth();
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('couture');

  if (!isAdmin) return null;

  return (
    <section id="dashboard" className="dashboard-section">
      <div className="dash-deco" aria-hidden="true" />

      <div className="reveal">
        <p className="s-tag">Espace Privé</p>
        <h2 className="s-title">Gérer votre atelier</h2>
        <p className="s-desc">
          Publiez et supprimez vos créations couture et vos produits artisanaux.
          Stockage Cloudinary &amp; Firebase Firestore.
        </p>
      </div>

      <div className="dash-tabs reveal" role="tablist">
        <button
          className={`dash-tab-btn ${activeTab === 'couture' ? 'active' : ''}`}
          onClick={() => setActiveTab('couture')}
          role="tab"
          aria-selected={activeTab === 'couture'}
        >
          Galerie Couture
        </button>
        <button
          className={`dash-tab-btn ${activeTab === 'produits' ? 'active' : ''}`}
          onClick={() => setActiveTab('produits')}
          role="tab"
          aria-selected={activeTab === 'produits'}
        >
          Produits Artisanaux
        </button>
      </div>

      {activeTab === 'couture'  && <PanelCouture  showToast={showToast} />}
      {activeTab === 'produits' && <PanelProduits showToast={showToast} />}
    </section>
  );
};

// ═══════════════════════════════════════════════
//  PANEL 1 — Galerie Couture
// ═══════════════════════════════════════════════
const PanelCouture = ({ showToast }) => {
  const { showConfirm }  = useApp();
  const [title,      setTitle]      = useState('');
  const [category,   setCategory]   = useState('');
  const [desc,       setDesc]       = useState('');
  // Liste d'images (support multi-upload)
  const [imgList,    setImgList]    = useState([]);   // [{ url, publicId, name }]
  const [publishing, setPublishing] = useState(false);
  const [models,     setModels]     = useState([]);
  const [count,      setCount]      = useState(0);

  const loadModels = useCallback(async () => {
    try {
      const q        = query(collection(db, 'models'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data     = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setModels(data.slice(0, 9));
      setCount(snapshot.size);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { loadModels(); }, [loadModels]);

  const handlePublish = async () => {
    if (!title.trim()) { showToast('Veuillez saisir un titre.'); return; }
    if (imgList.length === 0) { showToast('Ajoutez au moins une photo.'); return; }
    setPublishing(true);
    try {
      // Une entrée par image — même titre / catégorie / desc
      for (let i = 0; i < imgList.length; i++) {
        const img = imgList[i];
        const suffix = imgList.length > 1 ? ` (${i + 1}/${imgList.length})` : '';
        await addDoc(collection(db, 'models'), {
          title:        title.trim() + suffix,
          category:     category || null,
          desc:         desc.trim() || '',
          img:          img.url,
          cloudinaryId: img.publicId,
          createdAt:    serverTimestamp(),
        });
      }
      setTitle(''); setCategory(''); setDesc(''); setImgList([]);
      const n = imgList.length;
      showToast(n > 1 ? `${n} créations publiées dans la galerie.` : 'Création publiée dans la galerie avec succès.');
      await loadModels();
    } catch {
      showToast('Erreur de publication. Vérifiez Firebase.');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = (id, titleItem) => {
    showConfirm(`Supprimer "${titleItem}" ?`, async () => {
      try {
        await deleteDoc(doc(db, 'models', id));
        showToast('Création supprimée.');
        await loadModels();
      } catch {
        showToast('Erreur lors de la suppression.');
      }
    });
  };

  return (
    <div className="dash-panel reveal">
      <div className="dash-grid">

        {/* ── Formulaire ──── */}
        <div className="dash-form">
          <p className="dash-form-title">Ajouter une nouvelle création</p>

          <div className="fg">
            <label htmlFor="dashTitle">Titre de la pièce *</label>
            <input
              id="dashTitle"
              type="text"
              placeholder="Ex : Robe Aza — Broderie Florale"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="fg">
            <label htmlFor="dashCat">Catégorie</label>
            <select
              id="dashCat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {GALLERY_CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="fg">
            <label htmlFor="dashDesc">Description</label>
            <textarea
              id="dashDesc"
              placeholder="Matières, techniques, inspirations…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="fg">
            <label>Photos de la création — sélection multiple autorisée</label>
            <CloudinaryUpload
              previews={imgList}
              multiple={true}
              onUpload={(data) => {
                setImgList((prev) => [...prev, data]);
                showToast('Photo uploadée avec succès.');
              }}
              onClear={(i) => setImgList((prev) => prev.filter((_, idx) => idx !== i))}
              label="Cliquez ou glissez vos photos ici"
              sublabel="JPG / PNG — max 5 Mo par image — sélection multiple"
            />
          </div>

          <button
            className="btn-publish"
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? 'Publication…' : imgList.length > 1 ? `Publier ${imgList.length} créations` : 'Publier dans la Galerie'}
          </button>
        </div>

        {/* ── Panneau droit ─ */}
        <div>
          <div className="dash-preview-panel">
            <div className="dash-preview-title">
              Créations en ligne
              <span className="dash-count">{count}</span>
            </div>
            <MiniGrid items={models} onDelete={handleDelete} />
          </div>
          <AccountSettings showToast={showToast} />
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
//  PANEL 2 — Produits Artisanaux
// ═══════════════════════════════════════════════
const PanelProduits = ({ showToast }) => {
  const { showConfirm } = useApp();
  const [title,      setTitle]      = useState('');
  const [cat,        setCat]        = useState('');
  const [desc,       setDesc]       = useState('');
  const [price,      setPrice]      = useState('');
  const [stock,      setStock]      = useState(true);
  const [imgData,    setImgData]    = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [products,   setProducts]   = useState([]);
  const [count,      setCount]      = useState(0);

  const loadProducts = useCallback(async () => {
    try {
      const q        = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data     = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(data.slice(0, 9));
      setCount(snapshot.size);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handlePublish = async () => {
    if (!title.trim()) { showToast('Veuillez saisir un nom.'); return; }
    if (!cat)          { showToast('Veuillez choisir une catégorie.'); return; }
    setPublishing(true);
    try {
      await addDoc(collection(db, 'products'), {
        title:        title.trim(),
        cat,
        desc:         desc.trim() || '',
        price:        price.trim() || null,
        stock,
        img:          imgData?.url      ?? null,
        cloudinaryId: imgData?.publicId ?? null,
        createdAt:    serverTimestamp(),
      });
      setTitle(''); setCat(''); setDesc(''); setPrice(''); setStock(true); setImgData(null);
      showToast('Produit publié dans la boutique avec succès.');
      await loadProducts();
    } catch {
      showToast('Erreur de publication. Vérifiez Firebase.');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = (id, titleItem) => {
    showConfirm(`Supprimer "${titleItem}" ?`, async () => {
      try {
        await deleteDoc(doc(db, 'products', id));
        showToast('Produit supprimé.');
        await loadProducts();
      } catch {
        showToast('Erreur lors de la suppression.');
      }
    });
  };

  return (
    <div className="dash-panel reveal">
      <div className="dash-grid">

        <div className="dash-form">
          <p className="dash-form-title">Ajouter un produit artisanal</p>

          <div className="fg">
            <label htmlFor="prodTitle">Nom du produit *</label>
            <input id="prodTitle" type="text" placeholder="Ex : Savon Karité Vanille — 250ml"
              value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="fg">
            <label htmlFor="prodCat">Catégorie *</label>
            <select id="prodCat" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">— Choisir une catégorie —</option>
              <option value="savon">Savon Liquide Artisanal</option>
              <option value="sac">Sac en Pagne</option>
              <option value="special">Pièce Spéciale</option>
            </select>
          </div>

          <div className="fg">
            <label htmlFor="prodDesc">Description du produit</label>
            <textarea id="prodDesc" placeholder="Ingrédients, utilisation, dimensions, matières…"
              value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>

          <div className="fg">
            <label htmlFor="prodPrice">Prix (ex: 3 500 FCFA)</label>
            <input id="prodPrice" type="text" placeholder="Ex : 3 500 FCFA"
              value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className="fg">
            <label htmlFor="prodStock">Disponibilité</label>
            <select id="prodStock" value={stock ? 'true' : 'false'}
              onChange={(e) => setStock(e.target.value === 'true')}>
              <option value="true">En stock — disponible</option>
              <option value="false">Épuisé — indisponible</option>
            </select>
          </div>

          <div className="fg">
            <label>Photo du produit (Cloudinary)</label>
            <CloudinaryUpload
              previews={imgData ? [imgData] : []}
              multiple={false}
              onUpload={(data) => { setImgData(data); showToast('Photo produit uploadée avec succès.'); }}
              onClear={() => setImgData(null)}
              label="Cliquez ou glissez la photo produit"
              sublabel="JPG / PNG — max 5 Mo"
            />
          </div>

          <button
            className="btn-publish btn-publish--blue"
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? 'Publication…' : 'Publier dans la Boutique'}
          </button>
        </div>

        <div>
          <div className="dash-preview-panel">
            <div className="dash-preview-title">
              Produits en ligne
              <span className="dash-count">{count}</span>
            </div>
            <MiniGrid items={products} onDelete={handleDelete} />
          </div>
          <PublicationTips />
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
//  SOUS-COMPOSANT : Mini-grille
// ═══════════════════════════════════════════════
const MiniGrid = ({ items, onDelete }) => (
  <div className="dash-mini-grid">
    {items.length === 0 && (
      <p className="dash-mini-empty">Aucun élément publié.</p>
    )}
    {items.map((item) => (
      <div className="dash-mini-card" key={item.id}>
        {item.img
          ? <img src={cldThumb(item.img)} alt={item.title} loading="lazy" decoding="async" />
          : (
            <div className="dash-mini-placeholder">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
          )
        }
        <span className="dash-mini-label">{item.title}</span>
        <button
          className="dash-mini-del"
          onClick={() => onDelete(item.id, item.title)}
          aria-label={`Supprimer ${item.title}`}
        >
          ✕
        </button>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════
//  SOUS-COMPOSANT : Paramètres du compte
// ═══════════════════════════════════════════════
const AccountSettings = ({ showToast }) => {
  const [newEmail,    setNewEmail]    = useState('');
  const [repassEmail, setRepassEmail] = useState('');
  const [currPass,    setCurrPass]    = useState('');
  const [newPass,     setNewPass]     = useState('');

  const handleChangeEmail = async () => {
    if (!newEmail || !repassEmail) { showToast(' Remplissez tous les champs.'); return; }
    try {
      const user       = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, repassEmail);
      await reauthenticateWithCredential(user, credential);
      await verifyBeforeUpdateEmail(user, newEmail);
      showToast('Email de vérification envoyé. Confirmez le lien reçu.');
      setNewEmail(''); setRepassEmail('');
    } catch (err) {
      const msgs = {
        'auth/wrong-password':       'Mot de passe incorrect.',
        'auth/email-already-in-use': 'Email déjà utilisé.',
        'auth/invalid-email':        'Email invalide.',
      };
      showToast(msgs[err.code] || 'Erreur lors de la mise à jour.');
    }
  };

  const handleChangePassword = async () => {
    if (!currPass || !newPass) { showToast(' Remplissez tous les champs.'); return; }
    if (newPass.length < 8)   { showToast(' Minimum 8 caractères.'); return; }
    try {
      const user       = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currPass);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPass);
      showToast('Mot de passe mis à jour avec succès.');
      setCurrPass(''); setNewPass('');
    } catch (err) {
      showToast(
        err.code === 'auth/wrong-password'
          ? 'Mot de passe actuel incorrect.'
          : 'Erreur lors de la mise à jour.'
      );
    }
  };

  return (
    <div className="dash-settings">
      <p className="dash-settings-title">⚙️ Paramètres de votre compte</p>
      <div className="settings-grid">

        <div className="settings-block">
          <div className="settings-block-title">Modifier l&apos;email</div>
          <div className="fg">
            <label>Nouvel email</label>
            <input type="email" placeholder="nouveau@email.com"
              value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </div>
          <div className="fg">
            <label>Mot de passe actuel (confirmation)</label>
            <input type="password" placeholder="••••••••"
              value={repassEmail} onChange={(e) => setRepassEmail(e.target.value)} />
          </div>
          <button className="btn-settings" onClick={handleChangeEmail}>
            Changer l&apos;email
          </button>
        </div>

        <div className="settings-block">
          <div className="settings-block-title">Modifier le mot de passe</div>
          <div className="fg">
            <label>Mot de passe actuel</label>
            <input type="password" placeholder="••••••••"
              value={currPass} onChange={(e) => setCurrPass(e.target.value)} />
          </div>
          <div className="fg">
            <label>Nouveau mot de passe</label>
            <input type="password" placeholder="Minimum 8 caractères"
              value={newPass} onChange={(e) => setNewPass(e.target.value)} />
          </div>
          <button className="btn-settings" onClick={handleChangePassword}>
            Changer le mot de passe
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
//  SOUS-COMPOSANT : Conseils de publication
// ═══════════════════════════════════════════════
const TIPS = [
  { icon: '', label: 'Savons',          tip: 'Photo carrée, fond neutre, bonne lumière naturelle.' },
  { icon: '', label: 'Sacs en Pagne',   tip: 'Montrez le motif du pagne et les détails de fabrication.' },
  { icon: '', label: 'Pièces spéciales', tip: "Mettez en valeur l'unicité et le savoir-faire artisanal." },
];

const PublicationTips = () => (
  <div className="dash-settings" style={{ marginTop: '1.5rem' }}>
    <p className="dash-settings-title">Conseils de publication</p>
    <div className="tips-list">
      {TIPS.map(({ icon, label, tip }) => (
        <div className="tip-item" key={label}>
          <span className="tip-icon" aria-hidden="true">{icon}</span>
          <div>
            <div className="tip-label">{label}</div>
            <div className="tip-text">{tip}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;
