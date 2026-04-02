import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import TurnstileGate from './components/TurnstileGate';
import Home from './pages/Home';
import CoursePage from './pages/CoursePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function App() {
  return (
    <TurnstileGate>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/:id" element={<CoursePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </TurnstileGate>
  );
}

export default App;
