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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
// Initialisation de l'application Firebase
const app  = initializeApp(firebaseConfig);

// Services exportés — utilisables dans toute l'app
export const auth = getAuth(app);
export const db   = getFirestore(app);

export default app;
