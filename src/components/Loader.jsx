// ═══════════════════════════════════════════════
//  /src/components/Loader.jsx
//  Loader — animation d'entrée plein écran
//
//  Affiché pendant le chargement initial Firebase.
//  Reçoit `visible` : false → déclenche le fade-out.
// ═══════════════════════════════════════════════

import './Loader.css';

const Loader = ({ visible }) => (
  <div className={`app-loader ${!visible ? 'fade-out' : ''}`} aria-hidden={!visible}>
    <div className="loader-inner">
      <div className="loader-logo">
        G&apos;ens <span>Couture</span>
      </div>
      <div className="loader-bar" />
    </div>
  </div>
);

export default Loader;
