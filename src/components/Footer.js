import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContact, getCategories, getSite, getPriceLists, resolveAssetUrl } from '../services/api';

const Footer = () => {
  const [contact, setContact] = useState(null);
  const [categories, setCategories] = useState([]);
  const [site, setSite] = useState(null);
  const [priceListUrl, setPriceListUrl] = useState('');

  useEffect(() => {
    getContact()
      .then(res => { if (res?.success) setContact(res.data); })
      .catch(() => { });
    getCategories()
      .then(res => { if (res?.success && res.data) setCategories(res.data.slice(0, 8)); })
      .catch(() => { });
    getSite()
      .then(res => { if (res?.success && res.data) setSite(res.data); })
      .catch(() => { });
    getPriceLists()
      .then(res => {
        const url = res?.data?.[0]?.url;
        if (url) setPriceListUrl(resolveAssetUrl(url));
      })
      .catch(() => { });
  }, []);

  const socialLinks = contact?.social_links || [];
  const logo = site?.logo ? resolveAssetUrl(site.logo) : null;
  const siteName = site?.name || 'Ghilli Crackers';

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about-us' },
    { label: 'Categories', to: '/products' },
    { label: 'How to Order', to: '/how-to-order' },
    { label: 'Safety Tips', to: '/safety-tips' },
    { label: 'Price List', to: '/price-list' },
    { label: 'Visit Store', to: '/contact' },
    { label: 'Partner Brands', to: '/#partner-brands' },
  ];

  return (
    <footer className="footer-new">

      <div className="footer-new-content">
        {/* Brand column */}
        <div className="footer-new-brand">
          <div className="footer-new-logo">
            {logo ? (
              <img src={logo} alt={siteName} className="footer-new-logo-img" />
            ) : (
              <span className="footer-new-logo-icon">💥</span>
            )}
            <span className="footer-new-logo-name">{siteName}</span>
          </div>
          <p className="footer-new-desc">
            Your trusted partner for premium quality fireworks and crackers since 1990.
            Making celebrations memorable across India.
          </p>
          {socialLinks.length > 0 && (
            <div className="footer-new-social-wrap">
              <span className="footer-new-social-label">Follow Us</span>
              <div className="footer-new-social-icons">
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.url?.startsWith('http') ? s.url : `https://${s.url}`}
                    title={s.label}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-new-social-link"
                  >
                    {s.icon ? (
                      <img
                        src={resolveAssetUrl(s.icon)}
                        alt={s.label}
                        className="footer-new-social-icon-img"
                      />
                    ) : (
                      <span className="footer-new-social-fallback">{s.label?.charAt(0)}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="footer-new-col">
          <h4 className="footer-new-col-title">Quick Links</h4>
          <ul className="footer-new-list">
            {quickLinks.map((lnk, i) => (
              <li key={i}>
                <Link to={lnk.to} className="footer-new-link">{lnk.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Categories */}
        <div className="footer-new-col">
          <h4 className="footer-new-col-title">Product Categories</h4>
          <ul className="footer-new-list">
            {categories.length > 0 ? (
              categories.map((cat, i) => (
                <li key={i}>
                  <Link to="/products" className="footer-new-link">{cat.name}</Link>
                </li>
              ))
            ) : (
              ['Rockets', 'Ground Chakkars', 'Sparklers', 'Aerial Shots', 'Flower Pots', 'Kids Special', 'Premium Gift Boxes', 'Crackers'].map((c, i) => (
                <li key={i}>
                  <Link to="/products" className="footer-new-link">{c}</Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="footer-new-bottom">
        <span className="footer-new-copy">
          © {new Date().getFullYear()} {siteName}. All rights reserved. | Crafted with premium quality since 1990.
        </span>
        <div className="footer-new-policies">
          <Link to="/terms-conditions" className="footer-new-policy-link">Terms of Service</Link>
          <Link to="/safety-tips" className="footer-new-policy-link">Safety Guide</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
