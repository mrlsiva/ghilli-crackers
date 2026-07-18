import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import HowToOrder from './components/HowToOrder';
import Products from './components/Products';
import QuickEnquiry from './components/QuickEnquiry';
import OrderTrack from './components/OrderTrack';
import Contact from './components/Contact';
import SafetyTips from './components/SafetyTips';
import PriceList from './components/PriceList';
import TermsConditions from './components/TermsConditions';
import UnderMaintenance from './components/UnderMaintenance';
import WelcomePopup from './components/WelcomePopup';
import { getSite, resolveAssetUrl, prefetchAll } from './services/api';

function App() {
  const [site, setSite] = useState(null);
  const [siteLoading, setSiteLoading] = useState(true);
  const [siteError, setSiteError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // prefetchAll fires all static API calls in parallel and populates cache.
    // getSite() resolves instantly from cache since prefetchAll includes it.
    prefetchAll();
    getSite()
      .then((res) => {
        if (cancelled) return;
        if (res?.success && res.data) {
          setSite(res.data);
        } else {
          setSiteError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setSiteError(true);
      })
      .finally(() => {
        if (!cancelled) setSiteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!site) return;

    if (site.title) {
      document.title = site.title;
    }

    if (site.nav_icon) {
      let favicon = document.querySelector("link[rel~='icon']");
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = resolveAssetUrl(site.nav_icon);
    }
  }, [site]);

  if (siteLoading) {
    return (
      <div className="page-loader">
        <span className="firework firework-1" />
        <span className="firework firework-2" />
        <span className="firework firework-3" />
        <span className="firework firework-4" />
        <span className="firework firework-5" />
        <span className="firework firework-6" />
        <img
          src={site?.logo ? resolveAssetUrl(site.logo) : '/images/logo.svg'}
          alt={site?.name || 'Logo'}
          className="page-loader-logo"
        />
        {/* <span className="page-loader-spinner" /> */}
      </div>
    );
  }

  if (siteError) {
    return <UnderMaintenance />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <WelcomePopup />
      <Header site={site} />
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/order" element={<QuickEnquiry />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/how-to-order" element={<HowToOrder />} />
          <Route path="/products" element={<Products />} />
          <Route path="/order-track" element={<OrderTrack />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/safety-tips" element={<SafetyTips />} />
          <Route path="/price-list" element={<PriceList />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
        </Routes>
      </main>
      <Footer />
      <a
        className="whatsapp-float"
        href="https://api.whatsapp.com/send?phone=919486046411"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <i className="fab fa-whatsapp" />
      </a>
    </BrowserRouter>
  );
}

export default App;
