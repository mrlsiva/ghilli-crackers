import React, { useState, useEffect } from 'react';
import { getHomeBanner, getFestivalOffer, resolveAssetUrl } from '../services/api';
import AboutSection from './AboutSection';
import HowToOrder from './HowToOrder';
import HomeBottomSections from './HomeBottomSections';

const MOBILE_QUERY = '(max-width: 768px)';

const getTimeLeft = (endsAt) => {
  if (!endsAt) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diff = Math.max(0, new Date(endsAt).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const isOfferExpired = (endsAt) => {
  if (!endsAt) return false;
  return new Date(endsAt).getTime() <= Date.now();
};

const DEFAULT_BANNER = {
  image: '',
  mobile_image: '',
  title: 'Ghilli Crackers',
  second_title: 'Light Up Your Celebrations',
  description: 'Experience the finest selection of premium fireworks and crackers. Safe, certified, and delivered to your doorstep.',
  top_small_description: 'Premium Quality Fireworks Since 1990',
  buttons: [
    { label: 'Shop Now', url: '#products-page', open_in_new_tab: false },
    { label: 'View Catalog', url: '#catalog', open_in_new_tab: false },
  ],
};

const pad = (n) => String(n).padStart(2, '0');

const Home = () => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(null));
  const [banner, setBanner] = useState(DEFAULT_BANNER);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [festivalOffer, setFestivalOffer] = useState(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const handleChange = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getHomeBanner()
      .then((res) => {
        if (!cancelled && res?.success && res.data) {
          setBanner(res.data);
        }
      })
      .catch(() => { })
      .finally(() => {
        if (!cancelled) setBannerLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getFestivalOffer()
      .then((res) => {
        if (!cancelled && res?.success && res.data) {
          setFestivalOffer(res.data);
        }
      })
      .catch(() => { });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!festivalOffer || !festivalOffer.ends_at || isOfferExpired(festivalOffer.ends_at)) {
      setTimeLeft(getTimeLeft(null));
      return undefined;
    }

    setTimeLeft(getTimeLeft(festivalOffer.ends_at));
    const tick = setInterval(() => {
      setTimeLeft(getTimeLeft(festivalOffer.ends_at));
    }, 1000);

    return () => clearInterval(tick);
  }, [festivalOffer]);

  const heroImage = (isMobile && banner.mobile_image) ? banner.mobile_image : banner.image;

  if (bannerLoading) {
    return (
      <div className="page-loader">
        <span className="page-loader-icon">💥</span>
        <span className="page-loader-spinner" />
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section
        className="hero"
        style={heroImage ? { backgroundImage: `url(${resolveAssetUrl(heroImage)})` } : undefined}
      >
        <div className="hero-content">
          <span className="hero-badge">✨ {banner.top_small_description}</span>
          <h1>{banner.title}</h1>
          <h2 className="hero-subtitle">{banner.second_title}</h2>
          <p>{banner.description}</p>
          <div className="hero-cta">
            {banner.buttons?.map((btn, idx) => (
              <a
                key={idx}
                href={btn.url}
                target={btn.open_in_new_tab ? '_blank' : undefined}
                rel={btn.open_in_new_tab ? 'noopener noreferrer' : undefined}
                className={`btn ${idx === 0 ? 'btn-primary' : 'btn-outline-gold'} btn-lg`}
              >
                {btn.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="stripe-banner">
        <img src="/images/stripe.png" alt="Stripe banner" />
      </section>

      {festivalOffer && !isOfferExpired(festivalOffer.ends_at) && (
        <section className="festival-offer">
          <div className="festival-offer-card">
            <div className="festival-offer-info">
              <h2>{festivalOffer.title || 'Festival Special Offer'}</h2>
              {festivalOffer.sub_title && <p>{festivalOffer.sub_title}</p>}
              {festivalOffer.button_url && festivalOffer.button_label && (
                <a
                  href={festivalOffer.button_url}
                  target={festivalOffer.button_open_in_new_tab ? '_blank' : undefined}
                  rel={festivalOffer.button_open_in_new_tab ? 'noopener noreferrer' : undefined}
                  className="btn btn-primary btn-lg"
                >
                  {festivalOffer.button_label}
                </a>
              )}
            </div>
            {festivalOffer.ends_at && (
              <div className="countdown">
                <div className="countdown-item">
                  <span className="countdown-value">{pad(timeLeft.days)}</span>
                  <span className="countdown-label">Days</span>
                </div>
                <span className="countdown-sep">:</span>
                <div className="countdown-item">
                  <span className="countdown-value">{pad(timeLeft.hours)}</span>
                  <span className="countdown-label">Hours</span>
                </div>
                <span className="countdown-sep">:</span>
                <div className="countdown-item">
                  <span className="countdown-value">{pad(timeLeft.minutes)}</span>
                  <span className="countdown-label">Minutes</span>
                </div>
                <span className="countdown-sep">:</span>
                <div className="countdown-item">
                  <span className="countdown-value">{pad(timeLeft.seconds)}</span>
                  <span className="countdown-label">Seconds</span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      <section className="stripe-banner">
        <img src="/images/stripe.png" alt="Stripe banner" />
      </section>
      <AboutSection teaser />

      <section className="stripe-banner">
        <img src="/images/stripe.png" alt="Stripe banner" />
      </section>
      <HowToOrder />
      <HomeBottomSections />
    </div>
  );
};

export default Home;
