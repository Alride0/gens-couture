// ═══════════════════════════════════════════════
//  /src/components/TrustBar.jsx
//  Bande de confiance — entre Hero et Services
//  Marqueurs de crédibilité + avatars clients
// ═══════════════════════════════════════════════

import './TrustBar.css';

const ITEMS = [
  { icon: '✓', text: 'Livraison partout au Bénin' },
  { icon: '✓', text: 'Broderie 100% main' },
  { icon: '✓', text: 'Sur-mesure garanti' },
  { icon: '✓', text: 'Plus de 500 clientes satisfaites' },
  { icon: '✓', text: '16 ans d\'expérience' },
];

// Initiales pour avatars factices (look naturel)
const AVATARS = [
  { initials: 'AF', bg: '#d8f3dc', color: '#2d6a4f' },
  { initials: 'MK', bg: '#c7e8d4', color: '#1e5c40' },
  { initials: 'SR', bg: '#b7e0c8', color: '#2d6a4f' },
  { initials: 'DL', bg: '#e8f7ec', color: '#40916c' },
  { initials: 'BN', bg: '#d0eeda', color: '#1e5c40' },
];

const TrustBar = () => (
  <div className="trust-bar">
    <div className="trust-bar-inner">

      {/* Avatars clients */}
      <div className="trust-avatars">
        <div className="trust-avatar-stack">
          {AVATARS.map((a, i) => (
            <div
              key={i}
              className="trust-avatar"
              style={{ background: a.bg, color: a.color, zIndex: AVATARS.length - i }}
            >
              {a.initials}
            </div>
          ))}
        </div>
        <div className="trust-avatar-text">
          <strong>+500 clientes</strong>
          <span>Porto-Novo &amp; diaspora</span>
        </div>
      </div>

      <div className="trust-divider" aria-hidden="true" />

      {/* Items de confiance */}
      <div className="trust-items">
        {ITEMS.map(({ icon, text }) => (
          <div className="trust-item" key={text}>
            <span className="trust-check" aria-hidden="true">{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TrustBar;
