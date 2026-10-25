import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import TurnstileGate from './components/TurnstileGate';
import Home from './pages/Home';

// Pages are split into their own chunks; the course page carries the markdown + highlighter stack.
const CoursePage = lazy(() => import('./pages/CoursePage'));
const Playground = lazy(() => import('./pages/Playground'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

const PageFallback = () => (
  <div className="page-fallback" aria-busy="true">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-line" />
    <div className="skeleton skeleton-line short" />
  </div>
);

function App() {
  return (
    <TurnstileGate>
      <Router>
        <div className="app-container">
          <a className="skip-link" href="#main">Skip to content</a>
          <Header />
          <main className="main-content" id="main">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/:id" element={<CoursePage />} />
                <Route path="/:id/:section" element={<CoursePage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </TurnstileGate>
  );
}

export default App;
