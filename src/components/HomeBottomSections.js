import React, { useState, useEffect } from 'react';
import { getClientLogos, getContact, resolveAssetUrl } from '../services/api';

const VisitStoreSection = ({ contact }) => {
  const phones      = contact.phones || [];
  const email       = contact.email || null;
  const address     = contact.address || null;
  const openingTime = contact.opening_time || null;
  const mapRaw      = contact.map_embed_url || null;
  const mapSrcMatch = mapRaw ? mapRaw.match(/src="([^"]+)"/) : null;
  const mapEmbedSrc = mapSrcMatch ? mapSrcMatch[1] : null;
  const mapDirectionsUrl = address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : '#';

  return (
    <section className="qe-store-section">
      <div className="qe-store-map-wrap">
        {mapEmbedSrc ? (
          <iframe
            className="qe-store-map-iframe"
            title="Store Location"
            src={mapEmbedSrc}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="qe-store-map-fallback">
            <svg viewBox="0 0 24 24" fill="none" stroke="#02DBB8" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Map not available</span>
          </div>
        )}
      </div>

      <div className="qe-store-inner">
        <div className="qe-store-card">
          <span className="qe-store-badge">Store</span>
          <div className="qe-store-header">
            <h2 className="qe-store-title">
              Visit Our <span className="qe-store-title-accent">Store</span>
            </h2>
            <p className="qe-store-subtitle">
              Experience our premium collection in person.
              Visit us for personalized assistance and expert guidance.
            </p>
          </div>
            <div className="qe-store-card-top">
              <div className="qe-store-brand-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              </div>
              <div>
                <div className="qe-store-brand-name">Ghilli Crackers</div>
                <div className="qe-store-brand-sub">Premium Fireworks Store</div>
              </div>
            </div>
            <div className="qe-store-info-list">
              {address && (
                <div className="qe-store-info-row">
                  <div className="qe-store-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <div className="qe-store-info-label">Store Address</div>
                    <div className="qe-store-info-val">{address}</div>
                  </div>
                </div>
              )}
              {phones.length > 0 && (
                <div className="qe-store-info-row">
                  <div className="qe-store-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 16z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="qe-store-info-label">Contact Number</div>
                    <div className="qe-store-info-val">
                      {phones.map((p, i) => (
                        <a key={i} href={`tel:${p.replace(/\D/g,'')}`} className="qe-store-tel">
                          {p}{i < phones.length - 1 && ', '}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {email && (
                <div className="qe-store-info-row">
                  <div className="qe-store-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <div className="qe-store-info-label">Email Address</div>
                    <a href={`mailto:${email}`} className="qe-store-info-val qe-store-tel">{email}</a>
                  </div>
                </div>
              )}
              {openingTime && (
                <div className="qe-store-info-row">
                  <div className="qe-store-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                  </div>
                  <div>
                    <div className="qe-store-info-label">Business Hours</div>
                    <div className="qe-store-info-val">{openingTime}</div>
                  </div>
                </div>
              )}
            </div>
            <a className="qe-store-directions-btn" href={mapDirectionsUrl} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="3,11 22,2 13,21 11,13"/>
              </svg>
              Get Directions
            </a>
        </div>
      </div>
    </section>
  );
};

const WHY_CHOOSE_ITEMS = [
  {
    title: '100% Original & Safe',
    desc: 'Every product is sourced from licensed Sivakasi manufacturers and checked before packing.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    title: 'On-Time Doorstep Delivery',
    desc: 'Fast, reliable delivery across India so your fireworks arrive well before the celebration.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="7" width="14" height="10"/>
        <path d="M15 10h4l3 3v4h-7z"/>
        <circle cx="6" cy="19" r="2"/>
        <circle cx="18" cy="19" r="2"/>
      </svg>
    ),
  },
  {
    title: 'Best Wholesale Pricing',
    desc: 'Direct sourcing lets us offer factory-level pricing on every category, big or small.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.6 12.6L12.9 20.3a2 2 0 0 1-2.8 0l-7-7a2 2 0 0 1 0-2.8L10.8 2.8A2 2 0 0 1 12.2 2H19a2 2 0 0 1 2 2v6.8a2 2 0 0 1-.4 1.8z"/>
        <circle cx="15" cy="7" r="1.2" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    title: '50,000+ Happy Families',
    desc: 'Trusted by families across the country for safe, joyful celebrations every festival season.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const WhyChooseSection = () => (
  <section className="qe-why-section">
    <div className="qe-why-inner">
      <span className="qe-why-tag">Why Choose Us</span>
      <h2 className="qe-why-title">
        The <span>Ghilli Crackers</span> Promise
      </h2>
      <p className="qe-why-subtitle">Every order backed by quality, speed and trust you can count on.</p>

      <div className="qe-why-grid">
        {WHY_CHOOSE_ITEMS.map((item, i) => (
          <div key={i} className="qe-why-card">
            <div className="qe-why-icon">{item.icon}</div>
            <h3 className="qe-why-card-title">{item.title}</h3>
            <span className="qe-why-underline" />
            <p className="qe-why-card-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HomeBottomSections = () => {
  const [brands, setBrands] = useState([]);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    getClientLogos()
      .then(res => { if (res?.success && res.data) setBrands(res.data); })
      .catch(() => {});
    getContact()
      .then(res => { if (res?.success && res.data) setContact(res.data); })
      .catch(() => {});
  }, []);

  return (
    <>
      {brands.length > 0 && (
        <>
          <section className="qe-brands-section" id="partner-brands">
            <div className="qe-brands-inner">
              <h2 className="qe-brands-title">
                Authorized Partner of <span>Top Brands</span>
              </h2>
              <div className="qe-brands-track-wrap">
                <div className="qe-brands-track">
                  {brands.map((brand, i) => (
                    <div key={i} className="qe-brand-tile">
                      {(brand.logo || brand.image) ? (
                        <img
                          src={resolveAssetUrl(brand.logo || brand.image)}
                          alt={brand.name}
                          className="qe-brand-img"
                        />
                      ) : (
                        <div className="qe-brand-icon-wrap">
                          <svg viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="2" width="24" height="28" rx="4" fill="#0051A7" opacity="0.15" stroke="#0051A7" strokeWidth="1.5"/>
                            <circle cx="20" cy="16" r="8" fill="#0051A7" opacity="0.2" stroke="#0051A7" strokeWidth="1.5"/>
                            <path d="M16 16l3 3 5-6" stroke="#0051A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 30l6 4 6-4" stroke="#0051A7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <rect x="17" y="30" width="6" height="12" rx="1" fill="#0051A7" opacity="0.4"/>
                          </svg>
                        </div>
                      )}
                      <span className="qe-brand-name">{brand.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {contact && (
        <>
      <WhyChooseSection />

          <VisitStoreSection contact={contact} />
        </>
      )}

    </>
  );
};

export default HomeBottomSections;
