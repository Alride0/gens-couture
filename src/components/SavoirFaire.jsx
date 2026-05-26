// ═══════════════════════════════════════════════
//  /src/components/SavoirFaire.jsx — v2
//
//  Modification :
//    - Remplacement de l'image Unsplash (t-shirt générique)
//      par une illustration SVG artisanale cohérente
//      avec l'univers G'ens Couture
// ═══════════════════════════════════════════════

import { useCountUp } from '../hooks/useCountUp';
import './SavoirFaire.css';

const STATS = [
  { end: 500, suffix: '+', label: 'Créations',       duration: 2000 },
  { end: 16,  suffix: '',  label: "Ans d'expertise", duration: 1600 },
  { end: 98,  suffix: '%', label: 'Satisfaction',    duration: 1800 },
  { end: 12,  suffix: '',  label: 'Pays livrés',     duration: 1400 },
];

const FEATURES = [
  { num: '01', title: 'Broderie Main',      desc: "Chaque motif est tracé point après point, avec des fils de qualité sélectionnés selon votre tissu." },
  { num: '02', title: 'Sur-Mesure',         desc: "Vos mensurations, vos envies. Une pièce qui vous ressemble plutôt qu'une tenue qui vous habille." },
  { num: '03', title: 'Matières Nobles',    desc: "Basin riche, soie, coton égyptien, organza — des étoffes choisies pour tenir dans le temps." },
  { num: '04', title: 'Suivi Personnalisé', desc: "De l'esquisse à la livraison, vous êtes tenue informée à chaque étape de votre commande." },
];

const StatCounter = ({ stat }) => {
  const { ref, display } = useCountUp(stat.end, stat.duration);
  return (
    <div className="savoir-stat" ref={ref}>
      <span className="savoir-stat-num">{display}{stat.suffix}</span>
      <span className="savoir-stat-lbl">{stat.label}</span>
    </div>
  );
};

// ── Illustration SVG atelier ───────────────────
const AtelierIllustration = () => (
  <svg
    viewBox="0 0 400 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Illustration de l'atelier G'ens Couture"
    role="img"
    style={{ width: '100%', height: '100%', display: 'block' }}
  >
    {/* Fond */}
    <rect width="400" height="500" fill="#f0faf2"/>

    {/* Motif de fond — tissu pagne stylisé */}
    {[0,40,80,120,160,200,240,280,320,360,400].map((x) =>
      [0,40,80,120,160,200,240,280,320,360,400,440,480].map((y) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="#2d6a4f" opacity=".06"/>
      ))
    )}

    {/* Tissu drapé principal */}
    <path d="M80 80 Q120 40 200 60 Q280 80 320 80 L340 420 Q300 460 200 460 Q100 460 60 420 Z"
      fill="#d8f3dc" stroke="#40916c" strokeWidth="1.5" opacity=".7"/>

    {/* Broderie centrale — motif floral */}
    <g transform="translate(200,270)" opacity=".9">
      {/* Fleur centrale */}
      <circle cx="0" cy="0" r="8" fill="#2d6a4f" opacity=".6"/>
      {/* Pétales */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 22;
        const y = Math.sin(rad) * 22;
        return (
          <ellipse key={i}
            cx={x} cy={y} rx="7" ry="5"
            transform={`rotate(${angle}, ${x}, ${y})`}
            fill="#40916c" opacity=".55"/>
        );
      })}
      {/* Feuilles */}
      <path d="M0,-55 Q10,-40 0,-30 Q-10,-40 0,-55" fill="#52b788" opacity=".7"/>
      <path d="M0,55 Q10,40 0,30 Q-10,40 0,55" fill="#52b788" opacity=".7"/>
      <path d="M-55,0 Q-40,10 -30,0 Q-40,-10 -55,0" fill="#52b788" opacity=".7"/>
      <path d="M55,0 Q40,10 30,0 Q40,-10 55,0" fill="#52b788" opacity=".7"/>
      {/* Points de broderie autour */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <circle key={i}
            cx={Math.cos(rad) * 42} cy={Math.sin(rad) * 42}
            r="2.5" fill="#1b4332" opacity=".4"/>
        );
      })}
    </g>

    {/* Coutures décoratives sur les bords du tissu */}
    <path d="M100 100 L100 400" stroke="#2d6a4f" strokeWidth="1" strokeDasharray="6 4" opacity=".3"/>
    <path d="M300 100 L300 400" stroke="#2d6a4f" strokeWidth="1" strokeDasharray="6 4" opacity=".3"/>

    {/* Aiguille et fil */}
    <g transform="translate(310, 140) rotate(-35)">
      <rect x="-2" y="-60" width="4" height="120" rx="2" fill="#888" opacity=".7"/>
      <ellipse cx="0" cy="-60" rx="4" ry="7" fill="#aaa" opacity=".8"/>
      <rect x="-1" y="-50" width="2" height="12" fill="white" opacity=".9"/>
    </g>

    {/* Fil qui se déroule depuis l'aiguille */}
    <path d="M318 102 Q290 160 200 200 Q130 230 160 290"
      stroke="#40916c" strokeWidth="1.5" fill="none"
      strokeDasharray="4 3" opacity=".5"/>

    {/* Pelote de fil en bas à gauche */}
    <g transform="translate(95, 390)">
      <circle cx="0" cy="0" r="28" fill="#d8f3dc" stroke="#40916c" strokeWidth="1.5" opacity=".8"/>
      <circle cx="0" cy="0" r="20" stroke="#40916c" strokeWidth="1" opacity=".4" fill="none"/>
      <circle cx="0" cy="0" r="12" stroke="#2d6a4f" strokeWidth="1" opacity=".3" fill="none"/>
      <circle cx="0" cy="0" r="5"  fill="#2d6a4f" opacity=".5"/>
    </g>

    {/* Badge 100% fait main */}
    <g transform="translate(40, 120)">
      <rect x="0" y="0" width="90" height="44" rx="8"
        fill="#2d6a4f" opacity=".92"/>
      <text x="45" y="16" textAnchor="middle"
        fontFamily="'Playfair Display', serif"
        fontSize="14" fontWeight="500" fill="white" opacity=".95">100%</text>
      <text x="45" y="32" textAnchor="middle"
        fontFamily="'DM Sans', sans-serif"
        fontSize="9" letterSpacing="2" fill="rgba(255,255,255,0.75)">FAIT MAIN</text>
    </g>

    {/* Points de broderie décoratifs dispersés */}
    {[[160,130],[240,130],[170,380],[230,380],[150,200],[250,200]].map(([x,y], i) => (
      <g key={i} transform={`translate(${x},${y})`} opacity=".35">
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="0" y1="-6" x2="0" y2="6" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    ))}
  </svg>
);

const SavoirFaire = () => (
  <section id="savoir" className="savoir-section">
    <div className="savoir-grid">

      {/* Colonne illustration */}
      <div className="savoir-img-col reveal">
        <div className="savoir-img-wrap savoir-img-wrap--svg">
          <AtelierIllustration />
          <div className="savoir-img-badge">
            <div className="sib-num">100%</div>
            <div className="sib-lbl">Fait main</div>
          </div>
        </div>

        <div className="savoir-stats-strip">
          {STATS.map((stat) => (
            <StatCounter key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      {/* Colonne texte */}
      <div className="reveal">
        <p className="s-tag">Notre Savoir-Faire</p>
        <h2 className="s-title">La couture comme<br />un art de vivre</h2>
        <p className="s-desc">
          Notre atelier perpétue des techniques transmises avec soin : broderie au tambour,
          points de satin, smocks et finitions précieuses. Chaque commande est une conversation
          entre vos envies et notre expertise.
        </p>

        <div className="features">
          {FEATURES.map(({ num, title, desc }) => (
            <div className="feat" key={title}>
              <div className="feat-num">{num}</div>
              <div className="feat-title">{title}</div>
              <div className="feat-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SavoirFaire;
