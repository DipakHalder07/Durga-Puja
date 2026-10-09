import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { PlanProvider } from './context/PlanContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import PandalsPage from './pages/PandalsPage';
import PandalDetailPage from './pages/PandalDetailPage';
import MapPage from './pages/MapPage';
import RoutesPage from './pages/RoutesPage';
import RouteDetailPage from './pages/RouteDetailPage';
import SchedulePage from './pages/SchedulePage';
import MahalayaPage from './pages/MahalayaPage';
import AreasPage from './pages/AreasPage';
import AreaDetailPage from './pages/AreaDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import { LEGACY_GUIDE_REDIRECTS } from './data/blog';
import SavedPage from './pages/SavedPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import PhotoCreditsPage from './pages/PhotoCreditsPage';
import MandalaDecorations from './components/MandalaDecorations';

function LegacyGuideRedirect() {
  const { slug } = useParams();
  const target = LEGACY_GUIDE_REDIRECTS[slug];
  return <Navigate to={target ? `/blog/${target}` : '/blog'} replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <PlanProvider>
      <Router>
        <ScrollToTop />
        <div className="relative min-h-screen flex flex-col text-brand-primary selection:bg-brand-gold selection:text-brand-primary overflow-x-hidden">
          <MandalaDecorations />
          <div className="relative z-10 flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:pt-6 lg:pb-12">
            <Routes>
              {/* Home & Alternate landing routes */}
              <Route path="/" element={<Home />} />
              <Route path="/siliguri-durga-puja-guide" element={<Home />} />
              <Route path="/siliguri-puja" element={<Home />} />

              {/* Pandals Directory & Detail */}
              <Route path="/siliguri-puja-pandals" element={<PandalsPage />} />
              <Route path="/best-puja-pandals-in-siliguri" element={<PandalsPage />} />
              <Route path="/pandal-hopping-in-siliguri" element={<PandalsPage />} />
              <Route path="/pandals/:slug" element={<PandalDetailPage />} />

              {/* Interactive Map */}
              <Route path="/siliguri-puja-map" element={<MapPage />} />

              {/* Routes & Circuit details */}
              <Route path="/siliguri-puja-routes" element={<RoutesPage />} />
              <Route path="/routes/:slug" element={<RouteDetailPage />} />

              {/* Festival Schedule & Mahalaya */}
              <Route path="/puja-schedule" element={<SchedulePage />} />
              <Route path="/puja-schedule/2026" element={<SchedulePage />} />
              <Route path="/mahalaya" element={<MahalayaPage />} />
              <Route path="/mahalaya/2026" element={<MahalayaPage />} />

              {/* Areas & Neighborhoods */}
              <Route path="/areas" element={<AreasPage />} />
              <Route path="/areas/:slug" element={<AreaDetailPage />} />

              {/* Blog (old /guides URLs redirect here) */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/guides" element={<Navigate to="/blog" replace />} />
              <Route path="/guides/:slug" element={<LegacyGuideRedirect />} />

              {/* Saved Plan */}
              <Route path="/saved" element={<SavedPage />} />

              {/* Information & Legal */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<LegalPage />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/disclaimer" element={<LegalPage />} />
              <Route path="/photo-credits" element={<PhotoCreditsPage />} />

              {/* Fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <BottomNav />
        </div>
      </div>
    </Router>
    </PlanProvider>
  );
}
