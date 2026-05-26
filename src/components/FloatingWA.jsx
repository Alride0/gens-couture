// ═══════════════════════════════════════════════
//  /src/components/FloatingWA.jsx
//  Bouton WhatsApp flottant — visible en permanence
//  Apparaît après 2 secondes de scroll ou 3s
// ═══════════════════════════════════════════════

import { useState, useEffect } from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import './FloatingWA.css';

const WA_URL = `https://wa.me/2290166313100?text=${encodeURIComponent(
  "Bonjour G'ens Couture, je souhaite commander une création"
)}`;

const FloatingWA = () => {
  const [visible, setVisible] = useState(false);
  const [pulse,   setPulse]   = useState(false);

  useEffect(() => {
    // Apparaît après 3s ou dès que l'utilisateur scrolle > 300px
    const timer = setTimeout(() => setVisible(true), 3000);

    const onScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Pulse toutes les 8s pour rappeler la présence du bouton
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    }, 8000);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`floating-wa ${visible ? 'visible' : ''} ${pulse ? 'pulse' : ''}`}
      aria-label="Commander sur WhatsApp"
    >
      <span className="floating-wa-ring" aria-hidden="true" />
      <span className="floating-wa-inner">
        <WhatsAppIcon size={22} />
      </span>
      <span className="floating-wa-label">Commander</span>
    </a>
  );
};

export default FloatingWA;
