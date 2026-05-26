import WhatsAppIcon from './WhatsAppIcon';
import './CtaBand.css';

const CtaBand = () => (
  <div className="cta-band">
    <div className="cta-band-inner">
      <div className="cta-band-text">
        <p className="cta-band-label">Prête à commencer ?</p>
        <h2 className="cta-band-title">
          Votre prochaine tenue<br />commence ici
        </h2>
        <p className="cta-band-desc">
          Décrivez-nous votre projet sur WhatsApp. Nous vous répondons 
          personnellement et rapidement pour donner vie à votre idée.
        </p>
      </div>
      <div className="cta-band-actions">
        <a
          href={`https://wa.me/2290166313100?text=${encodeURIComponent(
            "Bonjour G'ens Couture, je voudrais commander une création sur-mesure."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-wa-btn"
        >
          <WhatsAppIcon size={15} />
          <span>
            <strong>WhatsApp</strong>
            <em>+229 01 66 31 31 00</em>
          </span>
        </a>
        <a href="#galerie" className="btn-secondary">Voir nos créations</a>
      </div>
    </div>
  </div>
);

export default CtaBand;
