// ═══════════════════════════════════════════════
//  /src/App.jsx
//  Composant racine — v2 avec FloatingWA + Lightbox
// ═══════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider, useAuth }  from './context/AuthContext';
import { AppProvider,  useApp  }  from './context/AppContext';
import { LightboxProvider }       from './context/LightboxContext';

import Loader      from './components/Loader';
import AdminBar    from './components/AdminBar';
import Navbar      from './components/Navbar';
import LoginScreen from './components/LoginScreen';
import Toast       from './components/Toast';
import FloatingWA  from './components/FloatingWA';
import Lightbox    from './components/Lightbox';

import HomePage from './pages/HomePage';

import './styles/globals.css';

const AppShell = () => {
  const { loading: authLoading } = useAuth();
  const { loginVisible }         = useApp();

  const [loaderVisible, setLoaderVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!authLoading) setLoaderVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!authLoading && loaderVisible) {
      const t = setTimeout(() => setLoaderVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [authLoading]); // eslint-disable-line

  return (
    <>
      <Loader      visible={loaderVisible} />
      <LoginScreen visible={loginVisible} />
      <AdminBar />
      <Navbar   />
      <Routes>
        <Route path="/*" element={<HomePage />} />
      </Routes>
      {/* Bouton WhatsApp flottant persistant */}
      <FloatingWA />
      <Toast />
      {/* Lightbox global — s'affiche par-dessus tout */}
      <Lightbox />
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppProvider>
        <LightboxProvider>
          <AppShell />
        </LightboxProvider>
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
