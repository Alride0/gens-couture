// ═══════════════════════════════════════════════
//  /src/components/Hero.jsx
//  Hero — avec compteurs animés + scroll indicator
// ═══════════════════════════════════════════════

import { useCountUp } from '../hooks/useCountUp';
import WhatsAppIcon   from './WhatsAppIcon';
import './Hero.css';

const WA_CMD = `https://wa.me/2290166313100?text=${encodeURIComponent(
  "Bonjour G'ens Couture, je souhaite commander une création"
)}`;

// Stat individuelle avec CountUp
const HeroStat = ({ num, lbl, duration = 1800 }) => {
  // Parse num: "500+" → end=500, suffix="+"
  const isNum = /^\d+/.test(num);
  if (!isNum) return (
    <div className="stat-item">
      <div className="stat-num">{num}</div>
      <div className="stat-lbl">{lbl}</div>
    </div>
  );

  const suffix  = num.replace(/^\d+/, '');
  const endVal  = parseInt(num, 10);
  const { ref, display } = useCountUp(endVal, duration);

  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-num">{display}{suffix}</div>
      <div className="stat-lbl">{lbl}</div>
    </div>
  );
};

const Hero = () => (
  <header className="hero" id="accueil">
    <div className="hero-bg" aria-hidden="true" />

    <div className="hero-content">
      <p className="hero-badge">Atelier artisanal — Porto-Novo, Bénin</p>

      <h1 className="hero-title">
        L&apos;art de broder<br />
        <em>chaque rêve</em><br />
        en fil de soie
      </h1>

      <p className="hero-desc">
        Depuis plus de seize ans, notre atelier crée des pièces sur-mesure qui
        portent votre histoire. Couture et broderie main, avec l&apos;exigence
        d&apos;un métier transmis avec passion.
      </p>

      <p className="hero-address">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        Porto-Novo, Bénin — Commandes via WhatsApp
      </p>

      <div className="hero-actions">
        <a href={WA_CMD} target="_blank" rel="noopener noreferrer" className="btn-primary">
          <WhatsAppIcon size={13} />
          Commander sur WhatsApp
        </a>
        <a href="#galerie" className="btn-secondary">Voir la Galerie</a>
      </div>
    </div>

    <div className="hero-right">
      <div className="hero-card-float">
        <p className="hcf-title">L&apos;atelier en chiffres</p>

        <div className="stats-row">
          {[
            { num: '500+', lbl: 'Créations',       duration: 2000 },
            { num: '16',   lbl: "Ans d'atelier",   duration: 1500 },
            { num: '98%',  lbl: 'Satisfaction',     duration: 1800 },
          ].map(({ num, lbl, duration }) => (
            <HeroStat key={lbl} num={num} lbl={lbl} duration={duration} />
          ))}
        </div>

        <div className="hcf-divider" />

        <div className="hcf-services">
          {[
            'Création complète — couture & broderie sur pagne',
            'Broderie seule sur tenue déjà cousue',
            'Tenues de cérémonie et de mariage',
            'Boubous et tenues africaines brodées',
            'Accessoires artisanaux en pagne',
          ].map((service) => (
            <div className="hcf-service" key={service}>{service}</div>
          ))}
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="hero-scroll-hint" aria-hidden="true">
      <div className="scroll-hint-line" />
    </div>
  </header>
);

export default Hero;
