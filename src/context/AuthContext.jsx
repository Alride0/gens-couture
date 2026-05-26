// ═══════════════════════════════════════════════════════
//  /src/context/AuthContext.jsx
//  Contexte d'authentification global — v3
//
//  Nouveautés v3 :
//    - loginWithGoogle() : connexion via compte Google
//      (utile si la couturière a oublié son mot de passe)
//    - sendPasswordReset() : envoi d'un email de
//      réinitialisation de mot de passe Firebase
//    - isAdmin : whitelist email inchangée
// ═══════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';

// ── Whitelist des emails administrateurs ──────────────
// Ajoutez ici tous les emails autorisés à accéder au dashboard.
const ADMIN_EMAILS = [
  'genevieveahouassou@gmail.com',
];

const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /** Connexion email + mot de passe */
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  /** Connexion via compte Google (popup) */
  const loginWithGoogle = () =>
    signInWithPopup(auth, googleProvider);

  /** Envoi d'un email de réinitialisation du mot de passe */
  const sendPasswordReset = (email) =>
    sendPasswordResetEmail(auth, email);

  const logout = () => signOut(auth);

  // isAdmin : connecté ET email dans la whitelist
  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email?.toLowerCase());

  const value = { user, isAdmin, loading, login, loginWithGoogle, sendPasswordReset, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un <AuthProvider>');
  return ctx;
}
