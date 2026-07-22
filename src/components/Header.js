import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getContentPage, getPriceListDownloadUrl, resolveAssetUrl } from '../services/api';

const DEFAULT_BANNER_TEXT = '🎆 Diwali Booking Started...! | 80% Discount offer 🎆 | Minimum order for Tamil Nadu ₹3,000/- | Other states ₹5,000/-';

const stripHtml = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent?.replace(/\s+/g, ' ').trim() || '';
};

const Header = ({ site }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [bannerText, setBannerText] = useState(DEFAULT_BANNER_TEXT);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [orderLoading, setOrderLoading] = useState(false);
  const [priceListLoading, setPriceListLoading] = useState(false);
  const headerRef = useRef(null);

  const handleOrderClick = (e) => {
    e.preventDefault();
    if (orderLoading) return;
    setOrderLoading(true);
    setTimeout(() => {
      navigate('/order');
      setOrderLoading(false);
    }, 600);
  };

  const handlePriceListClick = (e) => {
    e.preventDefault();
    if (priceListLoading) return;
    setPriceListLoading(true);
    window.location.href = getPriceListDownloadUrl();
    setTimeout(() => setPriceListLoading(false), 1200);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [bannerText]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    let cancelled = false;
    getContentPage(undefined, 'banner-scrolling-text')
      .then((res) => {
        const text = stripHtml(res?.data?.body);
        if (!cancelled && res?.success && text) {
          setBannerText(text);
        }
      })
      .catch(() => { });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="site-header-wrap" ref={headerRef}>
      <div className="header-banner">
        <div className="banner-track">
          <span className="banner-text">{bannerText}</span>
          <span className="banner-text" aria-hidden="true">{bannerText}</span>
        </div>
      </div>
      <header className="header">
        <div className="header-top">
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
            <img src={site?.logo ? resolveAssetUrl(site.logo) : '/images/logo.svg'} alt={site.name || 'Logo'} className="logo-image" />
            <span>{site?.name ? site.name.toUpperCase() : 'GHILLI CREAKERS'}</span>
          </Link>
          <button
            type="button"
            className={`nav-toggle${menuOpen ? ' nav-toggle-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
          <nav
            className={menuOpen ? 'nav-open' : ''}
            style={{ '--header-height': `${headerHeight}px` }}
          >
            <ul className="nav-links">
              <li><Link to="/" className={pathname === '/' ? 'nav-active' : ''}>Home</Link></li>
              <li><Link to="/about-us" className={pathname === '/about-us' ? 'nav-active' : ''}>About</Link></li>
              <li>
                <Link to="/products" className={pathname === '/products' ? 'nav-active' : ''}>
                  Categories
                </Link>
              </li>
              <li><Link to="/how-to-order" className={pathname === '/how-to-order' ? 'nav-active' : ''}>How to Order</Link></li>
              <li><Link to="/safety-tips" className={pathname === '/safety-tips' ? 'nav-active' : ''}>Safety Tips</Link></li>
              <li>
                <Link
                  className="nav-pdf-btn"
                  aria-busy={priceListLoading}
                  onClick={handlePriceListClick}
                >
                  {priceListLoading ? (
                    <span className="btn-order-loading">
                      <span className="btn-cracker-fuse" aria-hidden="true">🧨</span>
                      Generating...
                    </span>
                  ) : (
                    'Price List'
                  )}
                </Link>
              </li>
              <li>
                <Link to="/contact" className={pathname === '/contact' ? 'nav-active' : ''}>Contact</Link>
              </li>
            </ul>
            <div className="header-actions header-actions-mobile">
              <Link to="/order-track" className="call-now">
                <span aria-hidden="true">📦</span> Order Track
              </Link>
              <Link
                to="/order"
                className={`btn btn-order-now${orderLoading ? ' is-loading' : ''}`}
                onClick={handleOrderClick}
                aria-busy={orderLoading}
              >
                <span className="btn-spark btn-spark-1" aria-hidden="true" />
                <span className="btn-spark btn-spark-2" aria-hidden="true" />
                <span className="btn-spark btn-spark-3" aria-hidden="true" />
                <span className="btn-spark btn-spark-4" aria-hidden="true" />
                {orderLoading ? (
                  <span className="btn-order-loading">
                    <span className="btn-cracker-fuse" aria-hidden="true">🧨</span>
                    Booking...
                  </span>
                ) : (
                  'Order Now'
                )}
              </Link>
            </div>
          </nav>
          <div className="header-actions header-actions-desktop">
            <Link to="/order-track" className="call-now">
              Order Track
            </Link>
            <Link
              to="/order"
              className={`btn btn-order-now${orderLoading ? ' is-loading' : ''}`}
              onClick={handleOrderClick}
              aria-busy={orderLoading}
            >
              <span className="btn-spark btn-spark-1" aria-hidden="true" />
              <span className="btn-spark btn-spark-2" aria-hidden="true" />
              <span className="btn-spark btn-spark-3" aria-hidden="true" />
              <span className="btn-spark btn-spark-4" aria-hidden="true" />
              {orderLoading ? (
                <span className="btn-order-loading">
                  <span className="btn-cracker-fuse" aria-hidden="true">🧨</span>
                  Booking...
                </span>
              ) : (
                'Quick Enquiry'
              )}
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
