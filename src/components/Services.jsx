// ═══════════════════════════════════════════════
//  /src/components/Services.jsx
//  Section Services — cartes visuellement enrichies
// ═══════════════════════════════════════════════

import WhatsAppIcon from './WhatsAppIcon';
import './Services.css';

const SERVICES = [
  {
    id: 'complete',
    label: '01',
    name: 'Création Complète',
    tag: 'Couture & broderie sur pagne',
    desc: 'Apportez votre pagne, nous prenons en charge le reste. De la coupe à la broderie finale, chaque pièce est pensée sur-mesure : vos mensurations, vos envies, votre style. Un suivi attentif, de l\'esquisse à la livraison.',
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=70',
    waText: "Bonjour G'ens Couture, je souhaite une création complète (couture + broderie) sur mon pagne",
    highlight: 'Le plus populaire',
  },
  {
    id: 'broderie',
    label: '02',
    name: 'Broderie Seule',
    tag: 'Sur tenue déjà cousue',
    desc: 'Votre tenue est prête et vous souhaitez l\'enrichir ? Nous y ajoutons une broderie entièrement à la main — motifs floraux, géométriques, initiales personnalisées — pour en faire une pièce unique.',
    img: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&q=70',
    waText: "Bonjour G'ens Couture, je souhaite une broderie main sur ma tenue déjà cousue",
    highlight: null,
  },
];

const Services = () => (
  <section id="services" className="services-section">
    <div className="services-intro reveal">
      <p className="s-tag">Nos Prestations</p>
      <h2 className="s-title">Deux savoir-faire,<br />un seul souci du détail</h2>
      <p className="s-desc">
        Que vous arriviez avec un pagne brut ou une tenue cousue,
        G&apos;ens Couture vous accompagne jusqu&apos;à la pièce qui vous ressemble.
      </p>
    </div>

    <div className="services-cards reveal">
      {SERVICES.map((s) => (
        <article className="service-card" key={s.id}>

          {/* En-tête avec image de fond */}
          <div className="service-card-head">
            {/* Image de fond floue */}
            <div
              className="sc-bg"
              style={{ backgroundImage: `url(${s.img})` }}
              aria-hidden="true"
            />
            {/* Overlay vert */}
            <div className="sc-overlay" aria-hidden="true" />

            {/* Contenu */}
            <div className="sc-head-content">
              {s.highlight && (
                <span className="sc-badge">{s.highlight}</span>
              )}
              <div className="service-card-label">{s.label}</div>
              <div className="service-card-name">{s.name}</div>
              <div className="service-card-tag">{s.tag}</div>
            </div>
          </div>

          <div className="service-card-body">
            <p className="service-card-desc">{s.desc}</p>
            <a
              href={`https://wa.me/2290166313100?text=${encodeURIComponent(s.waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="service-card-cta"
            >
              <WhatsAppIcon size={13} />
              Demander le tarif
            </a>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default Services;
