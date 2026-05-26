// ═══════════════════════════════════════════════
//  /src/components/AdminBar.jsx
//  Barre Admin — visible uniquement si connecté
//
//  Affiche :
//    - Badge "Mode Couturière"
//    - Email de l'admin connecté
//    - Bouton Déconnexion
// ═══════════════════════════════════════════════

import { useAuth } from '../context/AuthContext';
import { useApp }  from '../context/AppContext';
import './AdminBar.css';

const AdminBar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { showToast }             = useApp();

  if (!isAdmin) return null;

  const handleLogout = async () => {
    await logout();
    showToast('Déconnexion réussie.');
  };

  return (
    <div id="adminBar" className="admin-bar" role="banner" aria-label="Espace administrateur">
      <div className="admin-bar-left">
        <span className="admin-badge">Mode Couturière</span>
        <span className="admin-bar-text">{user?.email}</span>
      </div>
      <button className="btn-logout" onClick={handleLogout}>
        Déconnexion
      </button>
    </div>
  );
};

export default AdminBar;
