// ═══════════════════════════════════════════════
//  /src/components/Localisation.jsx — v2
//  Section Localisation dynamique :
//    - Carte Google Maps embarquée (iframe)
//    - Bouton "Voir l'itinéraire" → géolocalisation
//      du visiteur → ouvre Google Maps / l'app mobile
//      avec l'itinéraire depuis sa position
//    - Indicateur d'état (permission géoloc)
// ═══════════════════════════════════════════════

import { useState } from 'react';
import './Localisation.css';

// ── Coordonnées de l'atelier ──────────────────────────
const ATELIER = {
  lat:     6.4969407,
  lng:     2.6035156,
  label:   "G'ens Couture & Broderie — Porto-Novo",
  address: 'Porto-Novo, Bénin',
};

const MAPS_DEST = `${ATELIER.lat},${ATELIER.lng}`;

// URL Google Maps vers l'atelier (position utilisateur → atelier)
const buildMapsUrl = (userLat, userLng) => {
  if (userLat && userLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${MAPS_DEST}&travelmode=driving`;
  }
  // Sans géoloc : ouvre la carte centrée sur l'atelier
  return `https://www.google.com/maps/search/?api=1&query=${MAPS_DEST}`;
};

const LOC_ITEMS = [
  {
    label: 'Adresse',
    val:   'Porto-Novo, Bénin',
    sub:   'Atelier de couture & broderie depuis 2009',
    href:  null,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    val:   '+229 01 66 31 31 00',
    sub:   'Commandes & renseignements',
    href:  'https://wa.me/2290166313100',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    val:   'genevieveahouassou@gmail.com',
    sub:   'Devis & commandes spéciales',
    href:  'mailto:genevieveahouassou@gmail.com',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: 'Horaires',
    val:   'Lun – Sam : 8h00 – 18h00',
    sub:   'Dimanche sur rendez-vous uniquement',
    href:  null,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
    ),
  },
];

// ── États du bouton itinéraire ────────────────────────
const GEO_STATE = {
  idle:    'idle',
  loading: 'loading',
  denied:  'denied',
};

const Localisation = () => {
  const [geoState, setGeoState] = useState(GEO_STATE.idle);

  const handleItinerary = () => {
    // Si géolocalisation non supportée ou déjà refusée → ouvre Maps direct
    if (!navigator.geolocation || geoState === GEO_STATE.denied) {
      window.open(buildMapsUrl(), '_blank', 'noopener,noreferrer');
      return;
    }

    setGeoState(GEO_STATE.loading);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoState(GEO_STATE.idle);
        const url = buildMapsUrl(pos.coords.latitude, pos.coords.longitude);
        window.open(url, '_blank', 'noopener,noreferrer');
      },
      () => {
        // Permission refusée ou timeout → ouvre quand même Maps sans origin
        setGeoState(GEO_STATE.denied);
        window.open(buildMapsUrl(), '_blank', 'noopener,noreferrer');
      },
      { timeout: 7000, maximumAge: 300_000 }
    );
  };

  const btnLabel = {
    [GEO_STATE.idle]:    'Voir l\'itinéraire depuis ma position',
    [GEO_STATE.loading]: 'Localisation en cours…',
    [GEO_STATE.denied]:  'Ouvrir dans Google Maps',
  }[geoState];

  return (
    <section id="localisation" className="loc-section">

      <div className="reveal">
        <p className="s-tag">Nous Trouver</p>
        <h2 className="s-title">Venez nous rendre visite</h2>
        <p className="s-desc">Retrouvez notre atelier à Porto-Novo, Bénin.</p>
      </div>

      <div className="loc-grid reveal">

        {/* ── Carte + bouton itinéraire ── */}
        <div className="loc-map-wrap">
          <div className="loc-map">
            <iframe
              src={`https://www.google.com/maps?q=${ATELIER.lat},${ATELIER.lng}&z=15&output=embed`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="G'ens Couture - Atelier localisation Porto-Novo"
            />

            {/* Badge atelier sur la carte */}
            <div className="loc-map-badge">
              <span className="loc-map-badge-dot" />
              <span>{ATELIER.label}</span>
            </div>
          </div>

          {/* Bouton itinéraire */}
          <button
            type="button"
            className={`loc-itinerary-btn ${geoState === GEO_STATE.loading ? 'loading' : ''}`}
            onClick={handleItinerary}
            disabled={geoState === GEO_STATE.loading}
          >
            {geoState === GEO_STATE.loading ? (
              <span className="loc-btn-spinner" aria-hidden="true" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
            )}
            {btnLabel}
            {geoState === GEO_STATE.idle && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                className="loc-btn-arrow" aria-hidden="true">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            )}
          </button>

          {geoState === GEO_STATE.denied && (
            <p className="loc-geo-note">
              Géolocalisation non disponible — itinéraire ouvert depuis Porto-Novo.
            </p>
          )}
        </div>

        {/* ── Infos de contact ── */}
        <div className="loc-info">
          {LOC_ITEMS.map(({ icon, label, val, sub, href }) => (
            <div className="loc-item" key={label}>
              <div className="loc-icon" aria-hidden="true">{icon}</div>
              <div className="loc-text">
                <div className="loc-label">{label}</div>
                <div className="loc-val">
                  {href
                    ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                         rel="noopener noreferrer">{val}</a>
                    : val
                  }
                </div>
                <div className="loc-sub">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Localisation;
