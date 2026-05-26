// ═══════════════════════════════════════════════
//  /src/main.jsx
//  Point d'entrée Vite — montage React
// ═══════════════════════════════════════════════

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Montage de l'application dans #root (index.html)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
