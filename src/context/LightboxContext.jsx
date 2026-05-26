// ═══════════════════════════════════════════════
//  /src/context/LightboxContext.jsx
//  État global du lightbox image
//
//  Usage :
//    const { openLightbox } = useLightbox();
//    openLightbox(items, startIndex)
//    // items = [{ img, title, desc }]
// ═══════════════════════════════════════════════

import { createContext, useContext, useState, useCallback } from 'react';

const LightboxContext = createContext(null);

export const LightboxProvider = ({ children }) => {
  const [state, setState] = useState({
    isOpen:  false,
    items:   [],   // [{ img, title, desc }]
    index:   0,
  });

  const openLightbox = useCallback((items, index = 0) => {
    setState({ isOpen: true, items, index });
    document.body.style.overflow = 'hidden'; // bloquer le scroll
  }, []);

  const closeLightbox = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false }));
    document.body.style.overflow = '';
  }, []);

  const goPrev = useCallback(() => {
    setState((s) => ({
      ...s,
      index: (s.index - 1 + s.items.length) % s.items.length,
    }));
  }, []);

  const goNext = useCallback(() => {
    setState((s) => ({
      ...s,
      index: (s.index + 1) % s.items.length,
    }));
  }, []);

  return (
    <LightboxContext.Provider value={{ ...state, openLightbox, closeLightbox, goPrev, goNext }}>
      {children}
    </LightboxContext.Provider>
  );
};

export const useLightbox = () => {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox doit être utilisé dans <LightboxProvider>');
  return ctx;
};
