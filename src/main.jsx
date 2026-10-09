import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ROUTES, preloadRoute } from './routes';
// Self-hosted fonts (bundled with the site, no Google Fonts request)
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource/hind-siliguri/400.css';
import '@fontsource/hind-siliguri/600.css';
import '@fontsource/tiro-bangla/400.css';
import './index.css';

const app = (
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

const container = document.getElementById('root');

// Prerendered pages are hydrated once their page chunk is in; `npm run dev` renders from scratch
if (container.hasChildNodes()) {
  preloadRoute(window.location.pathname).then(() => hydrateRoot(container, app));
} else {
  createRoot(container).render(app);
}

// Fetch the other page chunks when the browser is idle, so navigation feels instant
const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
if (!navigator.connection?.saveData) {
  window.addEventListener('load', () => idle(() => ROUTES.forEach((r) => r.Page.preload().catch(() => {}))), { once: true });
}
