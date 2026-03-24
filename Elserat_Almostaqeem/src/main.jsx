import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { registerServiceWorker } from './pwa/registerServiceWorker';

/*
 * © 2026 Sirat Al-Mustaqim
 * All rights reserved.
 * Unauthorized use, copying or rebranding is strictly prohibited.
 * Protected under Egyptian Digital Intellectual Property ITIDA.
 */
console.log(
  "%c© 2026 Sirat Al-Mustaqim. All rights reserved.\nUnauthorized use is prohibited.",
  "color: #0F5A47; font-size: 16px; font-weight: bold; background: #fff; padding: 10px; border: 2px solid #0F5A47; border-radius: 5px;"
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker();