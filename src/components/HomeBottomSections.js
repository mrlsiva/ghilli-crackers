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
      <div className="qe-store-inner">
        <div className="qe-store-header">
          <h2 className="qe-store-title">Visit Our Store</h2>
          <p className="qe-store-subtitle">
            Experience our premium collection in person. Visit us for personalized assistance and expert guidance.
          </p>
        </div>
        <div className="qe-store-body">
          <div className="qe-store-card">
            <div className="qe-store-card-top">
              <div className="qe-store-brand-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              </div>
              <div>
                <div className="qe-store-brand-name">Vigo Crackers</div>
                <div className="qe-store-brand-sub">Premium Fireworks Store</div>
              </div>
            </div>
            <div className="qe-store-divider" />
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
            <div className="qe-store-divider" />
            <div className="qe-store-amenities">
              {['Easy Parking','Genuine Products','Friendly Service','Store Pickup'].map((a, i) => (
                <div key={i} className="qe-store-amenity">
                  <svg viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#F59E0B" strokeWidth="1.2"/>
                    <path d="M5 8l2 2 4-4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {a}
                </div>
              ))}
            </div>
            <a className="qe-store-directions-btn" href={mapDirectionsUrl} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="3,11 22,2 13,21 11,13"/>
              </svg>
              Get Directions
            </a>
          </div>

          <div className="qe-store-map-wrap">
            {mapEmbedSrc ? (
              <>
                <a className="qe-map-directions-btn" href={mapDirectionsUrl} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="3,11 22,2 13,21 11,13"/>
                  </svg>
                  Directions
                </a>
                <iframe
                  className="qe-store-map-iframe"
                  title="Store Location"
                  src={mapEmbedSrc}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </>
            ) : (
              <div className="qe-store-map-fallback">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Map not available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

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
          <section className="stripe-banner">
            <img src="/images/stripe.png" alt="" />
          </section>
          <section className="qe-brands-section">
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
                            <rect x="8" y="2" width="24" height="28" rx="4" fill="#F59E0B" opacity="0.15" stroke="#F59E0B" strokeWidth="1.5"/>
                            <circle cx="20" cy="16" r="8" fill="#F59E0B" opacity="0.2" stroke="#F59E0B" strokeWidth="1.5"/>
                            <path d="M16 16l3 3 5-6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 30l6 4 6-4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <rect x="17" y="30" width="6" height="12" rx="1" fill="#F59E0B" opacity="0.4"/>
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
          <section className="stripe-banner">
            <img src="/images/stripe.png" alt="" />
          </section>
          <VisitStoreSection contact={contact} />
        </>
      )}
    </>
  );
};

export default HomeBottomSections;
