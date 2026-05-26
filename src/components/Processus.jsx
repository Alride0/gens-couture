// ═══════════════════════════════════════════════
//  /src/components/Processus.jsx
//  Section Processus de commande — timeline 4 étapes
//  Rassure les nouvelles clientes sur le parcours
// ═══════════════════════════════════════════════

import WhatsAppIcon from './WhatsAppIcon';
import './Processus.css';

const STEPS = [
  {
    num:  '01',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: 'Contact',
    sub:   'Via WhatsApp',
    desc:  'Décrivez votre projet — tissu, occasion, couleurs souhaitées. Envoyez des photos d\'inspiration si vous en avez.',
  },
  {
    num:  '02',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    title: 'Devis & Mesures',
    sub:   'Sous 24h',
    desc:  'Nous vous proposons un devis personnalisé. Si vous êtes d\'accord, nous prenons vos mesures ou elles nous sont envoyées.',
  },
  {
    num:  '03',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
    ),
    title: 'Création',
    sub:   '7 à 21 jours',
    desc:  'L\'atelier entre en action. Coupe, assemblage, broderie main. Vous êtes informée à chaque étape importante.',
  },
  {
    num:  '04',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    ),
    title: 'Livraison',
    sub:   'Partout au Bénin',
    desc:  'Votre création est emballée avec soin et livrée chez vous à Porto-Novo ou expédiée partout au Bénin et en diaspora.',
  },
];

const Processus = () => (
  <section className="processus-section" aria-labelledby="processus-title">

    <div className="reveal">
      <p className="s-tag">Comment commander</p>
      <h2 className="s-title" id="processus-title">
        Simple, rapide<br />et entièrement sur-mesure
      </h2>
      <p className="s-desc">
        De votre première idée à la livraison de votre tenue, voici comment
        se déroule chaque commande chez G&apos;ens Couture.
      </p>
    </div>

    {/* Timeline */}
    <div className="processus-timeline reveal">
      {STEPS.map((step, i) => (
        <div className="proc-step" key={step.num}>
          {/* Connecteur */}
          {i < STEPS.length - 1 && (
            <div className="proc-connector" aria-hidden="true">
              <div className="proc-connector-line" />
              <svg className="proc-connector-arrow" width="10" height="10"
                viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          <div className="proc-card">
            {/* Numéro décoratif */}
            <div className="proc-num" aria-hidden="true">{step.num}</div>

            {/* Icône */}
            <div className="proc-icon">{step.icon}</div>

            {/* Texte */}
            <div className="proc-title">{step.title}</div>
            <div className="proc-sub">{step.sub}</div>
            <p className="proc-desc">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>

    {/* CTA */}
    <div className="processus-cta reveal">
      <a
        href={`https://wa.me/2290166313100?text=${encodeURIComponent(
          "Bonjour G'ens Couture, je voudrais commencer une commande sur-mesure."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
      >
        <WhatsAppIcon size={14} />
        Démarrer ma commande
      </a>
    </div>
  </section>
);

export default Processus;
