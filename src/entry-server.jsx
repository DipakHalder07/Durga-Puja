// Server entry used only at build time by scripts/prerender.mjs
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { SeoContext } from './lib/seo';
import { preloadAll, routeFor } from './routes';

export { headHtml, buildHead } from './lib/seo';
export { SITE_URL, DATA_UPDATED } from './lib/site';

// Renders one URL to HTML and returns the meta its page registered with useSeo()
export async function render(url) {
  await preloadAll();
  const seo = {};
  const html = renderToString(
    <SeoContext.Provider value={seo}>
      <StaticRouter location={url} future={{ v7_relativeSplatPath: true }}>
        <App />
      </StaticRouter>
    </SeoContext.Provider>
  );
  return { html, meta: seo.meta || {}, file: routeFor(url)?.Page.file };
}
