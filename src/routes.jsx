import React, { lazy } from 'react';
import { matchRoutes } from 'react-router-dom';

// Each page is its own chunk. preload() lets the browser fetch the current page's chunk before
// hydrating, and lets the server render every page synchronously.
function lazyPage(load, file) {
  let Loaded = null;
  const Lazy = lazy(() => load().then((m) => ((Loaded = m.default), m)));
  function Page(props) {
    return Loaded ? <Loaded {...props} /> : <Lazy {...props} />;
  }
  Page.preload = () => (Loaded ? Promise.resolve() : load().then((m) => { Loaded = m.default; }));
  Page.file = file; // source path, used by the prerenderer to add <link rel="modulepreload">
  return Page;
}

const Home = lazyPage(() => import('./pages/Home.jsx'), 'src/pages/Home.jsx');
const PandalsPage = lazyPage(() => import('./pages/PandalsPage.jsx'), 'src/pages/PandalsPage.jsx');
const PandalDetailPage = lazyPage(() => import('./pages/PandalDetailPage.jsx'), 'src/pages/PandalDetailPage.jsx');
const MapPage = lazyPage(() => import('./pages/MapPage.jsx'), 'src/pages/MapPage.jsx');
const RoutesPage = lazyPage(() => import('./pages/RoutesPage.jsx'), 'src/pages/RoutesPage.jsx');
const RouteDetailPage = lazyPage(() => import('./pages/RouteDetailPage.jsx'), 'src/pages/RouteDetailPage.jsx');
const SchedulePage = lazyPage(() => import('./pages/SchedulePage.jsx'), 'src/pages/SchedulePage.jsx');
const MahalayaPage = lazyPage(() => import('./pages/MahalayaPage.jsx'), 'src/pages/MahalayaPage.jsx');
const AreasPage = lazyPage(() => import('./pages/AreasPage.jsx'), 'src/pages/AreasPage.jsx');
const AreaDetailPage = lazyPage(() => import('./pages/AreaDetailPage.jsx'), 'src/pages/AreaDetailPage.jsx');
const BlogPage = lazyPage(() => import('./pages/BlogPage.jsx'), 'src/pages/BlogPage.jsx');
const BlogPostPage = lazyPage(() => import('./pages/BlogPostPage.jsx'), 'src/pages/BlogPostPage.jsx');
const SavedPage = lazyPage(() => import('./pages/SavedPage.jsx'), 'src/pages/SavedPage.jsx');
const AboutPage = lazyPage(() => import('./pages/AboutPage.jsx'), 'src/pages/AboutPage.jsx');
const ContactPage = lazyPage(() => import('./pages/ContactPage.jsx'), 'src/pages/ContactPage.jsx');
const LegalPage = lazyPage(() => import('./pages/LegalPage.jsx'), 'src/pages/LegalPage.jsx');
const PhotoCreditsPage = lazyPage(() => import('./pages/PhotoCreditsPage.jsx'), 'src/pages/PhotoCreditsPage.jsx');
const NotFoundPage = lazyPage(() => import('./pages/NotFoundPage.jsx'), 'src/pages/NotFoundPage.jsx');

// Old and alternate URLs are 308-redirected by vercel.json, so they are not routes here.
export const ROUTES = [
  { path: '/', Page: Home },
  { path: '/siliguri-puja-pandals', Page: PandalsPage },
  { path: '/pandals/:slug', Page: PandalDetailPage },
  { path: '/siliguri-puja-map', Page: MapPage },
  { path: '/siliguri-puja-routes', Page: RoutesPage },
  { path: '/routes/:slug', Page: RouteDetailPage },
  { path: '/puja-schedule', Page: SchedulePage },
  { path: '/mahalaya', Page: MahalayaPage },
  { path: '/areas', Page: AreasPage },
  { path: '/areas/:slug', Page: AreaDetailPage },
  { path: '/blog', Page: BlogPage },
  { path: '/blog/:slug', Page: BlogPostPage },
  { path: '/saved', Page: SavedPage },
  { path: '/about', Page: AboutPage },
  { path: '/contact', Page: ContactPage },
  { path: '/privacy-policy', Page: LegalPage },
  { path: '/terms', Page: LegalPage },
  { path: '/disclaimer', Page: LegalPage },
  { path: '/photo-credits', Page: PhotoCreditsPage },
  { path: '*', Page: NotFoundPage },
];

export const routeFor = (pathname) => matchRoutes(ROUTES, pathname)?.[0]?.route;

export const preloadRoute = (pathname) => routeFor(pathname)?.Page.preload() ?? Promise.resolve();

export const preloadAll = () => Promise.all([...new Set(ROUTES.map((r) => r.Page))].map((P) => P.preload()));
