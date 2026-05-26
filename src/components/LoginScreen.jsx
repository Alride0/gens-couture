// ═══════════════════════════════════════════════
//  /src/components/LoginScreen.jsx
//  Écran de connexion — v3
//
//  Sécurité :
//    - Blocage après 5 tentatives échouées
//    - Timer de 30 secondes avant réessai
//  Nouveautés v3 :
//    - Connexion via Google (popup)
//    - Lien "Mot de passe oublié" (reset Firebase)
//    - Suppression de tous les emojis
// ═══════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp }  from '../context/AppContext';
import './LoginScreen.css';

const MAX_ATTEMPTS  = 5;
const LOCKOUT_SECS  = 30;

const LoginScreen = ({ visible }) => {
  const { login, loginWithGoogle, sendPasswordReset } = useAuth();
  const { closeLogin, showToast }                     = useApp();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [info,     setInfo]     = useState('');
  const [loading,  setLoading]  = useState(false);

  // Vue : 'login' | 'forgot'
  const [view, setView] = useState('login');

  // ── Rate limiting ────────────────────────────
  const [attempts,  setAttempts]  = useState(0);
  const [lockout,   setLockout]   = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (lockout <= 0) return;
    timerRef.current = setInterval(() => {
      setLockout((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setAttempts(0);
          setError('');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [lockout]);

  if (!visible) return null;

  const isLocked = lockout > 0;

  const resetState = () => {
    setError('');
    setInfo('');
    setEmail('');
    setPassword('');
  };

  // ── Connexion email / mot de passe ───────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked || loading) return;

    setError('');
    setLoading(true);
    try {
      await login(email, password);
      showToast('Connexion réussie. Bienvenue dans votre espace.');
      closeLogin();
      setAttempts(0);
      setTimeout(() => {
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    } catch {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockout(LOCKOUT_SECS);
        setError(`Trop de tentatives. Réessayez dans ${LOCKOUT_SECS} secondes.`);
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        setError(
          `Email ou mot de passe incorrect. ${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Connexion Google ─────────────────────────
  const handleGoogle = async () => {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      showToast('Connexion Google réussie. Bienvenue dans votre espace.');
      closeLogin();
      setTimeout(() => {
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('La connexion Google a échoué. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Mot de passe oublié ──────────────────────
  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email ci-dessus.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendPasswordReset(email.trim());
      setInfo('Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.');
    } catch {
      setError("Impossible d'envoyer l'email. Vérifiez l'adresse saisie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="loginScreen"
      className="login-screen"
      role="dialog"
      aria-modal="true"
      aria-label="Connexion espace couturière"
    >
      {/* Décoration SVG de fond */}
      <div className="login-deco" aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <path d="M0,200 Q360,100 720,300 T1440,200" stroke="white" strokeWidth="1" fill="none" opacity=".3"/>
          <path d="M0,400 Q360,300 720,500 T1440,400" stroke="white" strokeWidth="1" fill="none" opacity=".2"/>
          <path d="M0,600 Q360,500 720,700 T1440,600" stroke="white" strokeWidth="1" fill="none" opacity=".15"/>
          <circle cx="200"  cy="200" r="80"  stroke="white" strokeWidth="1" fill="none" opacity=".15"/>
          <circle cx="1200" cy="600" r="120" stroke="white" strokeWidth="1" fill="none" opacity=".1"/>
        </svg>
      </div>

      {/* Boîte de connexion */}
      <div className="login-box">
        <div className="login-logo">
          <div className="login-logo-text">G&apos;ens <span>Couture</span></div>
          <div className="login-logo-sub">Espace Couturière — Connexion sécurisée</div>
        </div>

        <div className="login-divider" />

        {view === 'login' ? (
          <>
            <p className="login-title">Connectez-vous à votre espace</p>

            <form onSubmit={handleLogin} noValidate>
              <div className="login-field">
                <label htmlFor="loginEmail">Adresse email</label>
                <input
                  id="loginEmail"
                  type="email"
                  placeholder="votre@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLocked}
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="loginPass">Mot de passe</label>
                <input
                  id="loginPass"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked}
                  required
                />
              </div>

              {error && (
                <p className={`login-error ${isLocked ? 'login-error--locked' : ''}`} role="alert">
                  {error}
                </p>
              )}

              {isLocked && (
                <div className="login-lockout-bar">
                  <div
                    className="login-lockout-progress"
                    style={{ width: `${(lockout / LOCKOUT_SECS) * 100}%` }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn-login"
                disabled={loading || isLocked}
              >
                {isLocked
                  ? `Attendre ${lockout}s…`
                  : loading
                  ? 'Connexion…'
                  : 'Accéder à mon espace'}
              </button>
            </form>

            {/* Mot de passe oublié */}
            <div className="login-forgot">
              <button
                type="button"
                onClick={() => { resetState(); setView('forgot'); }}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Séparateur */}
            <div className="login-separator">
              <span>ou</span>
            </div>

            {/* Connexion Google */}
            <button
              type="button"
              className="btn-google"
              onClick={handleGoogle}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.2 30.2 0 24 0 14.6 0 6.5 5.4 2.5 13.3l7.9 6.1C12.3 13 17.7 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.7 37.3 46.5 31.3 46.5 24.5z"/>
                <path fill="#FBBC05" d="M10.4 28.6A14.9 14.9 0 019.5 24c0-1.6.3-3.2.8-4.6L2.5 13.3A23.8 23.8 0 000 24c0 3.8.9 7.4 2.5 10.6l7.9-6z"/>
                <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.7-4.2-13.6-10l-7.9 6C6.5 42.6 14.6 48 24 48z"/>
              </svg>
              Continuer avec Google
            </button>
          </>
        ) : (
          <>
            <p className="login-title">Réinitialiser le mot de passe</p>
            <p className="login-subtitle">
              Saisissez votre adresse email. Vous recevrez un lien pour créer un nouveau mot de passe.
            </p>

            <form onSubmit={handleForgot} noValidate>
              <div className="login-field">
                <label htmlFor="forgotEmail">Adresse email</label>
                <input
                  id="forgotEmail"
                  type="email"
                  placeholder="votre@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="login-error" role="alert">{error}</p>
              )}
              {info && (
                <p className="login-info" role="status">{info}</p>
              )}

              <button
                type="submit"
                className="btn-login"
                disabled={loading}
              >
                {loading ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
              </button>
            </form>
          </>
        )}

        <div className="login-back">
          {view === 'forgot' ? (
            <button type="button" onClick={() => { resetState(); setView('login'); }}>
              ← Retour à la connexion
            </button>
          ) : (
            <button type="button" onClick={closeLogin}>
              ← Retour au site
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
