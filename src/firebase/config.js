// ═══════════════════════════════════════════════════════
//  /src/firebase/config.js
//  Configuration Firebase — G'ens Couture & Broderie
//
//  ⚠️  En production, déplacez ces clés dans un fichier
//      .env à la racine du projet :
//
//      VITE_FIREBASE_API_KEY=...
//      VITE_FIREBASE_AUTH_DOMAIN=...
//      ...etc.
//
//  Puis remplacez les valeurs ci-dessous par :
//      import.meta.env.VITE_FIREBASE_API_KEY
// ═══════════════════════════════════════════════════════

import { initializeApp } from 'firebase/app';
import { getAuth }       from 'firebase/auth';
import { getFirestore }  from 'firebase/firestore';

/** Configuration de votre projet Firebase */
const firebaseConfig = {
  apiKey:            'AIzaSyCop3796f6JseMXCHRfsN_rC61DWiOERPk',
  authDomain:        'gens-couture.firebaseapp.com',
  projectId:         'gens-couture',
  storageBucket:     'gens-couture.firebasestorage.app',
  messagingSenderId: '602408461667',
  appId:             '1:602408461667:web:27849c28f3e98e32595f56',
};

// Initialisation de l'application Firebase
const app  = initializeApp(firebaseConfig);

// Services exportés — utilisables dans toute l'app
export const auth = getAuth(app);
export const db   = getFirestore(app);

export default app;
