// ═══════════════════════════════════════════════
//  /src/pages/HomePage.jsx
//  Page principale — v2 avec toutes les améliorations
//
//  Ordre des sections :
//    Hero
//    → TrustBar        (NOUVEAU — bande de confiance)
//    → Services        (enrichi — image de fond)
//    → Processus       (NOUVEAU — timeline commande)
//    → Gallery
//    → SavoirFaire     (enrichi — CountUp stats)
//    → Boutique
//    → Testimonials
//    → Localisation
//    → CtaBand
//    → Dashboard       (admin only)
//    → Footer          (enrichi — 3 colonnes)
// ═══════════════════════════════════════════════

import { useReveal } from '../hooks/useReveal';

import Hero          from '../components/Hero';
import TrustBar      from '../components/TrustBar';
import Services      from '../components/Services';
import Processus     from '../components/Processus';
import Gallery       from '../components/Gallery';
import SavoirFaire   from '../components/SavoirFaire';
import Boutique      from '../components/Boutique';
import Testimonials  from '../components/Testimonials';
import Localisation  from '../components/Localisation';
import CtaBand       from '../components/CtaBand';
import Dashboard     from '../components/Dashboard';
import Footer        from '../components/Footer';

const HomePage = () => {
  useReveal([]);

  return (
    <main>
      <Hero         />
      <TrustBar     />
      <Services     />
      <Processus    />
      <Gallery      />
      <SavoirFaire  />
      <Boutique     />
      <Testimonials />
      <Localisation />
      <CtaBand      />
      <Dashboard    />
      <Footer       />
    </main>
  );
};

export default HomePage;
