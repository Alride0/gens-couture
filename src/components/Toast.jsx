// ═══════════════════════════════════════════════
//  /src/components/Toast.jsx
//  Toast info + Toast de confirmation annulable
//
//  Remplace window.confirm() par un toast moderne
//  avec boutons Confirmer / Annuler.
// ═══════════════════════════════════════════════

import { useApp } from '../context/AppContext';
import './Toast.css';

// ── Toast info (notifications simples) ──────────
const InfoToast = () => {
  const { toast } = useApp();
  return (
    <div
      className={`toast toast--info ${toast.visible ? 'show' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {toast.message}
    </div>
  );
};

// ── Toast confirmation (remplace window.confirm) ─
const ConfirmToast = () => {
  const { confirm, handleConfirmYes, handleConfirmNo } = useApp();

  return (
    <div
      className={`toast toast--confirm ${confirm.visible ? 'show' : ''}`}
      role="alertdialog"
      aria-modal="true"
      aria-label="Confirmation requise"
    >
      <p className="toast-confirm-msg">{confirm.message}</p>
      <div className="toast-confirm-actions">
        <button className="toast-btn toast-btn--cancel" onClick={handleConfirmNo}>
          Annuler
        </button>
        <button className="toast-btn toast-btn--confirm" onClick={handleConfirmYes}>
          Supprimer
        </button>
      </div>
    </div>
  );
};

const Toast = () => (
  <>
    <InfoToast />
    <ConfirmToast />
  </>
);

export default Toast;
