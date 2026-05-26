// ═══════════════════════════════════════════════
//  /src/components/Testimonials.jsx — v2
//
//  Nouveautés :
//    - onSnapshot() temps réel
//    - showConfirm() remplace window.confirm()
//    - Affichage avatar initiales + ville
//    - Grille enrichie (min 3 colonnes desktop)
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection, addDoc, deleteDoc, doc,
  query, orderBy, serverTimestamp, onSnapshot,
} from 'firebase/firestore';
import { db }         from '../firebase/config';
import { useAuth }    from '../context/AuthContext';
import { useApp }     from '../context/AppContext';
import { useReveal }  from '../hooks/useReveal';
import './Testimonials.css';

// Génère les initiales depuis un nom complet
const getInitials = (name = '') =>
  name.trim().split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');

// Palette de couleurs pour les avatars (basée sur la première lettre)
const AVATAR_COLORS = ['#2d6a4f','#40916c','#1b4332','#52b788','#74c69d'];
const avatarColor = (name = '') =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ── Étoiles interactives ──────────────────────
const StarPicker = ({ value, onChange }) => (
  <div className="star-picker" role="group" aria-label="Note sur 5">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button"
        className={`star-btn ${n <= value ? 'active' : ''}`}
        onClick={() => onChange(n)}
        aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
      >★</button>
    ))}
  </div>
);

// ── Étoiles en lecture ────────────────────────
const Stars = ({ count }) => (
  <div className="stars" aria-label={`${count} étoiles sur 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} aria-hidden="true" className={i < count ? 'star-on' : 'star-off'}>★</span>
    ))}
  </div>
);

// ── Composant principal ───────────────────────
const Testimonials = () => {
  const { isAdmin }               = useAuth();
  const { showConfirm, showToast } = useApp();
  useReveal();

  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const unsubRef = useRef(null);

  const [form, setForm] = useState({ author: '', origin: '', text: '', stars: 5 });

  // ── Temps réel ────────────────────────────────
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    unsubRef.current = onSnapshot(q,
      (snapshot) => {
        setReviews(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => { console.error(err); setLoading(false); }
    );
    return () => unsubRef.current?.();
  }, []);

  // ── Soumission ────────────────────────────────
  const handleSubmit = async () => {
    const { author, text, stars } = form;
    if (!author.trim() || !text.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        author: author.trim(),
        origin: form.origin.trim() || null,
        text:   text.trim(),
        stars,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setShowForm(false);
      setForm({ author: '', origin: '', text: '', stars: 5 });
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  // ── Suppression ───────────────────────────────
  const handleDelete = useCallback((id, author) => {
    showConfirm(`Supprimer l'avis de ${author} ?`, async () => {
      try {
        await deleteDoc(doc(db, 'reviews', id));
        showToast('Avis supprimé.');
      } catch { showToast('Erreur lors de la suppression.'); }
    });
  }, [showConfirm, showToast]);

  return (
    <section id="temoignages" className="testi-section">
      <div className="testi-deco" aria-hidden="true" />

      <div className="reveal" style={{ position: 'relative' }}>
        <p className="s-tag">Avis Clients</p>
        <h2 className="s-title">Ce qu&apos;ils disent de nous</h2>
        <p className="s-desc">
          Chaque retour compte. Partagez votre expérience avec l&apos;atelier.
        </p>

        {!showForm && !submitted && (
          <div className="testi-submit-cta">
            <button className="btn-testi-open" onClick={() => setShowForm(true)}>
              Laisser un avis
            </button>
          </div>
        )}

        {submitted && (
          <div className="testi-thanks">
            Merci pour votre avis — il est maintenant visible.
          </div>
        )}

        {showForm && (
          <div className="testi-form-wrap">
            <h3 className="testi-form-title">Votre avis</h3>
            <div className="testi-form-row">
              <div className="testi-form-field">
                <label htmlFor="testi-author">Prénom &amp; Nom *</label>
                <input id="testi-author" type="text"
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  placeholder="Ex. Aminata K." maxLength={60} />
              </div>
              <div className="testi-form-field">
                <label htmlFor="testi-origin">Ville (optionnel)</label>
                <input id="testi-origin" type="text"
                  value={form.origin}
                  onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                  placeholder="Ex. Cotonou" maxLength={40} />
              </div>
            </div>
            <div className="testi-form-field">
              <label>Note</label>
              <StarPicker value={form.stars} onChange={(n) => setForm((f) => ({ ...f, stars: n }))} />
            </div>
            <div className="testi-form-field">
              <label htmlFor="testi-text">Votre témoignage *</label>
              <textarea id="testi-text" rows={4} maxLength={400}
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                placeholder="Décrivez votre expérience avec G'ens Couture…" />
              <span className="testi-char-count">{form.text.length}/400</span>
            </div>
            <div className="testi-form-actions">
              <button className="btn-testi-cancel" onClick={() => setShowForm(false)} disabled={submitting}>
                Annuler
              </button>
              <button className="btn-testi-submit"
                onClick={handleSubmit}
                disabled={submitting || !form.author.trim() || !form.text.trim()}>
                {submitting ? 'Envoi…' : 'Publier mon avis'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="testi-loading"><div className="gallery-spinner" /></div>
        ) : reviews.length === 0 ? (
          <div className="testi-empty">
            <p>Aucun avis pour le moment — soyez la première à partager votre expérience.</p>
          </div>
        ) : (
          <div className="testi-grid">
            {reviews.map(({ id, text, author, origin, stars }) => (
              <div className="testi-card" key={id}>
                <Stars count={stars} />
                <p className="testi-text">&ldquo;{text}&rdquo;</p>
                <div className="testi-author-row">
                  {/* Avatar initiales */}
                  <div
                    className="testi-avatar"
                    style={{ background: avatarColor(author) }}
                    aria-hidden="true"
                  >
                    {getInitials(author)}
                  </div>
                  <div className="testi-author-wrap">
                    <p className="testi-author">{author}</p>
                    {origin && <p className="testi-origin">{origin}</p>}
                  </div>
                </div>
                {isAdmin && (
                  <button className="testi-del-btn" onClick={() => handleDelete(id, author)}>
                    Supprimer
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
