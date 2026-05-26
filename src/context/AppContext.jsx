// ═══════════════════════════════════════════════════════
//  /src/context/AppContext.jsx
//  Contexte applicatif global — v2
//
//  Nouveautés :
//    - confirmToast : toast de confirmation annulable
//      (remplace window.confirm partout dans l'app)
//    - showConfirm(message, onConfirm) : API simple
// ═══════════════════════════════════════════════════════

import { createContext, useContext, useState, useCallback, useRef } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Toast info ───────────────────────────────────────
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ visible: true, message });
    toastTimerRef.current = setTimeout(
      () => setToast({ visible: false, message: '' }),
      4000
    );
  }, []);

  // ── Toast de confirmation annulable ─────────────────
  // { visible, message, onConfirm }
  const [confirm, setConfirm] = useState({
    visible:   false,
    message:   '',
    onConfirm: null,
  });

  /**
   * Affiche un toast de confirmation.
   * @param {string}   message    — texte affiché
   * @param {Function} onConfirm  — callback si l'utilisateur confirme
   */
  const showConfirm = useCallback((message, onConfirm) => {
    setConfirm({ visible: true, message, onConfirm });
  }, []);

  const handleConfirmYes = useCallback(() => {
    confirm.onConfirm?.();
    setConfirm({ visible: false, message: '', onConfirm: null });
  }, [confirm]);

  const handleConfirmNo = useCallback(() => {
    setConfirm({ visible: false, message: '', onConfirm: null });
  }, []);

  // ── Écran de connexion ───────────────────────────────
  const [loginVisible, setLoginVisible] = useState(false);
  const openLogin  = () => setLoginVisible(true);
  const closeLogin = () => setLoginVisible(false);

  const value = {
    toast,
    showToast,
    confirm,
    showConfirm,
    handleConfirmYes,
    handleConfirmNo,
    loginVisible,
    openLogin,
    closeLogin,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans un <AppProvider>');
  return ctx;
}
