// ═══════════════════════════════════════════════
//  /src/components/Footer.jsx
//  Footer enrichi — 3 colonnes + réseaux sociaux
// ═══════════════════════════════════════════════


import WhatsAppIcon from './WhatsAppIcon';
import './Footer.css';

const NAV_LINKS = [
  { href: '#galerie',      label: 'Galerie'       },
  { href: '#services',     label: 'Services'      },
  { href: '#savoir',       label: 'Savoir-Faire'  },
  { href: '#boutique',     label: 'Boutique'      },
  { href: '#temoignages',  label: 'Avis clients'  },
  { href: '#localisation', label: 'Nous trouver'  },
];

const SOCIALS = [
  {
    label: 'WhatsApp',
    href:  'https://wa.me/2290166313100',
    icon: <WhatsAppIcon size={16} />,
  },
  {
    label: 'Facebook',
    href:  '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href:  '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">

        {/* Colonne 1 — Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            G&apos;ens <span>Couture</span> &amp; Broderie
          </div>
          <p className="footer-tagline">
            Atelier artisanal de couture et broderie main,
            depuis 2009 à Porto-Novo, Bénin.
          </p>
          <p className="footer-tagline footer-tagline--sub">
            Chaque tenue est une histoire,<br />
            chaque broderie, une signature.
          </p>

          {/* Réseaux sociaux */}
          <div className="footer-socials">
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Colonne 2 — Navigation */}
        <div className="footer-nav-col">
          <p className="footer-col-title">Navigation</p>
          <ul className="footer-links">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne 3 — Contact */}
        <div className="footer-contact-col">
          <p className="footer-col-title">Nous contacter</p>

          <div className="footer-contact-items">
            <a
              href="https://wa.me/2290166313100"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-item"
            >
              <span className="fci-icon">
                <WhatsAppIcon size={14} />
              </span>
              <span>
                <strong>+229 01 66 31 31 00</strong>
                <em>Commandes &amp; renseignements</em>
              </span>
            </a>

            <a
              href="mailto:genevieveahouassou@gmail.com"
              className="footer-contact-item"
            >
              <span className="fci-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <span>
                <strong>Email</strong>
                <em>genevieveahouassou@gmail.com</em>
              </span>
            </a>

            <div className="footer-contact-item footer-contact-item--plain">
              <span className="fci-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </span>
              <span>
                <strong>Lun – Sam : 8h – 18h</strong>
                <em>Dim sur rendez-vous</em>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          © {new Date().getFullYear()} G&apos;ens Couture &amp; Broderie — Porto-Novo, Bénin
        </p>
        <p className="footer-copy footer-copy--right">
          Artisanat &amp; broderie main depuis 2009
        </p>

      </div>
    </footer>
  );
};

export default Footer;
