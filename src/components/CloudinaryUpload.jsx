// ═══════════════════════════════════════════════
//  /src/components/CloudinaryUpload.jsx  — v3
//
//  Upload direct vers l'API Cloudinary (sans widget CDN).
//  - Fonctionne sur mobile (Android / iOS) et desktop
//  - Sélection multiple si prop multiple=true
//  - Progress par fichier
//  - Aucune dépendance externe (juste fetch + FormData)
//
//  Props :
//    onUpload({ url, publicId, name }) — callback par image
//    onClear(index?)                  — retirer une preview
//    previews                         — tableau d'objets { url, name }
//    multiple                         — autoriser plusieurs fichiers
//    aspectRatio                      — non utilisé (recadrage côté widget supprimé)
//    label / sublabel                 — textes de la zone
// ═══════════════════════════════════════════════

import { useRef, useState } from 'react';
import { cldPreview }       from '../utils/cloudinary';
import './CloudinaryUpload.css';

const CLOUD_NAME    = 'dmphvajhm';
const UPLOAD_PRESET = 'gens_couture';
const UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const CloudinaryUpload = ({
  onUpload,
  onClear,
  previews   = [],          // tableau de { url, publicId, name }
  multiple   = false,
  label      = 'Cliquez ou glissez vos photos ici',
  sublabel   = 'JPG / PNG — max 5 Mo par image',
}) => {
  const inputRef                    = useRef(null);
  const [progresses, setProgresses] = useState({}); // { fileName: 0–100 }
  const [errors,     setErrors]     = useState({}); // { fileName: msg }

  // ── Upload d'un seul fichier vers Cloudinary ──
  const uploadFile = (file) =>
    new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('file',         file);
      form.append('upload_preset', UPLOAD_PRESET);
      form.append('folder',        'gens-couture');

      const xhr = new XMLHttpRequest();
      xhr.open('POST', UPLOAD_URL);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setProgresses((p) => ({ ...p, [file.name]: pct }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url:      data.secure_url,
            publicId: data.public_id,
            name:     file.name,
          });
        } else {
          reject(new Error(`Échec upload (${xhr.status})`));
        }
      };

      xhr.onerror = () => reject(new Error('Erreur réseau'));
      xhr.send(form);
    });

  // ── Traitement des fichiers sélectionnés ──────
  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    const list = Array.from(files);
    const newErrors = {};

    // Réinitialiser les progressions
    const initProg = {};
    list.forEach((f) => (initProg[f.name] = 0));
    setProgresses(initProg);
    setErrors({});

    for (const file of list) {
      if (file.size > 5_000_000) {
        newErrors[file.name] = `${file.name} dépasse 5 Mo`;
        setErrors((e) => ({ ...e, [file.name]: newErrors[file.name] }));
        setProgresses((p) => { const n = { ...p }; delete n[file.name]; return n; });
        continue;
      }
      try {
        const result = await uploadFile(file);
        onUpload(result);
        // Retirer la barre de progression une fois terminé
        setProgresses((p) => { const n = { ...p }; delete n[file.name]; return n; });
      } catch (err) {
        newErrors[file.name] = `Erreur : ${err.message}`;
        setErrors((e) => ({ ...e, [file.name]: newErrors[file.name] }));
        setProgresses((p) => { const n = { ...p }; delete n[file.name]; return n; });
      }
    }
  };

  // ── Drag & drop ───────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  };

  const isUploading = Object.keys(progresses).length > 0;

  return (
    <div className="cld-upload">
      {/* Zone de dépôt / clic */}
      <button
        type="button"
        className={`cloudinary-zone ${isUploading ? 'uploading' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
        onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
        onDrop={handleDrop}
        disabled={isUploading}
        aria-label={label}
      >
        {/* Icône nuage SVG */}
        <div className="cloudinary-zone-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <p className="cloudinary-zone-text">
          <strong>{isUploading ? 'Upload en cours…' : label}</strong>
          <small>{sublabel}{multiple ? ' · Sélection multiple autorisée' : ''}</small>
        </p>
      </button>

      {/* Input caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
        onClick={(e) => { e.target.value = ''; }} // réinitialise pour re-sélectionner le même fichier
      />

      {/* Barres de progression */}
      {Object.entries(progresses).map(([name, pct]) => (
        <div key={name} className="cld-progress-wrap">
          <span className="cld-progress-name">{name}</span>
          <div className="cld-progress-bar">
            <div className="cld-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="cld-progress-pct">{pct}%</span>
        </div>
      ))}

      {/* Erreurs */}
      {Object.values(errors).map((msg, i) => (
        <p key={i} className="cld-error">{msg}</p>
      ))}

      {/* Previews des images uploadées */}
      {previews.length > 0 && (
        <div className="preview-list">
          {previews.map((item, i) => (
            <div key={i} className="preview-strip show">
              <img
                src={cldPreview(item.url)}
                alt={`Aperçu ${i + 1}`}
                className="preview-img"
              />
              <div className="preview-strip-info">
                <span className="preview-strip-name">{item.name || `Image ${i + 1}`}</span>
              </div>
              <button
                type="button"
                className="preview-strip-clear"
                onClick={() => onClear(i)}
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
