// ═══════════════════════════════════════════════
//  /src/components/Navbar.jsx
//  Barre de navigation — v2
//  Nouveautés v2 :
//    - Bouton "Espace Couturière" visible dans la nav
//      (retiré du footer où il était transparent)
// ═══════════════════════════════════════════════

import { useState } from 'react';
import { useScrolled } from '../hooks/useScrolled';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import WhatsAppIcon from './WhatsAppIcon';
import './Navbar.css';

const WA_NUMBER = '2290166313100';
const WA_BASE = `https://wa.me/${WA_NUMBER}`;

const Navbar = () => {
  const scrolled            = useScrolled(60);
  const { isAdmin }         = useAuth();
  const { openLogin }       = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      id="navbar"
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      aria-label="Navigation principale"
    >
      <a href="#accueil" className="nav-logo" onClick={closeMenu}>
        G&apos;ens <span>Couture</span>
      </a>

      <button
        className={`nav-burger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menu principal"
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {[
          { href: '#services',     label: 'Services'     },
          { href: '#galerie',      label: 'Galerie'      },
          { href: '#savoir',       label: 'Savoir-Faire' },
          { href: '#temoignages',  label: 'Avis'         },
          { href: '#localisation', label: 'Nous Trouver' },
          { href: '#boutique',     label: 'Boutique'     },
        ].map(({ href, label }) => (
          <li key={href}>
            <a href={href} onClick={closeMenu}>{label}</a>
          </li>
        ))}

        {isAdmin && (
          <li id="navDashboard">
            <a href="#dashboard" onClick={closeMenu}>Mon Espace</a>
          </li>
        )}

        <li>
          <a
            href={`${WA_BASE}?text=${encodeURIComponent(
              "Bonjour, je souhaite commander une création G'ens Couture"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
            onClick={closeMenu}
          >
            <WhatsAppIcon size={11} />
            Commander
          </a>
        </li>

        {/* Bouton Espace Couturière — visible uniquement si non connectée */}
        {!isAdmin && (
          <li>
            <button
              className="nav-couturiere-btn"
              onClick={() => { closeMenu(); openLogin(); }}
              aria-label="Accéder à l'espace couturière"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Espace Couturière
            </button>
          </li>
        )}
      </ul>

      {menuOpen && (
        <div className="nav-overlay" onClick={closeMenu} aria-hidden="true" />
      )}
    </nav>
  );
};

export default Navbar;
