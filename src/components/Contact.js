import React, { useState, useEffect } from 'react';
import { getContact, resolveAssetUrl } from '../services/api';
import './Contact.css';

const Contact = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContact()
      .then(res => { if (res.success) setContact(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="ct-page">
        <div className="ct-hero">
          <div className="ct-hero-inner">
            <h1 className="ct-hero-title">Contact Us</h1>
          </div>
        </div>
        <div className="ct-loading">
          {[...Array(3)].map((_, i) => <div key={i} className="ct-sk-block" />)}
        </div>
      </div>
    );
  }

  if (!contact) return null;

  const phones      = contact.phones || [];
  const email       = contact.email || null;
  const address     = contact.address || null;
  const openingTime = contact.opening_time || null;
  const socialLinks = contact.social_links || [];
  const mapRaw      = contact.map_embed_url || null;
  // API returns full <iframe> HTML — extract the src attribute
  const mapSrcMatch = mapRaw ? mapRaw.match(/src="([^"]+)"/) : null;
  const mapEmbedSrc = mapSrcMatch ? mapSrcMatch[1] : null;
  const mapUrl      = mapRaw;

  // find whatsapp from social_links
  const waLink = socialLinks.find(s => s.label?.toLowerCase().replace(/\s/g,'').includes('whats'));
  const waNumber = waLink ? waLink.url?.replace(/\D/g,'') : (phones[0] ? phones[0].replace(/\D/g,'') : null);

  return (
    <div className="ct-page" id="contact">
      {/* Hero */}
      <div className="ct-hero">
        <div className="ct-hero-inner">
          <h1 className="ct-hero-title">Contact Us</h1>
          <p className="ct-hero-sub">Reach us through any of the channels below</p>
        </div>
      </div>

      <div className="ct-body">
        {/* Info Cards — only render cards that have data */}
        <div className="ct-cards">
          {phones.length > 0 && (
            <div className="ct-card" style={{ '--card-color': '#3b82f6' }}>
              <div className="ct-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z"/>
                </svg>
              </div>
              <span className="ct-card-label">Phone</span>
              <div className="ct-card-value">
                {phones.map((p, i) => (
                  <a key={i} href={`tel:${p.replace(/\D/g,'')}`} className="ct-link-block">{p}</a>
                ))}
              </div>
            </div>
          )}

          {email && (
            <div className="ct-card" style={{ '--card-color': '#CC0033' }}>
              <div className="ct-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <span className="ct-card-label">Email</span>
              <a className="ct-card-value ct-link-block" href={`mailto:${email}`}>{email}</a>
            </div>
          )}

          {address && (
            <div className="ct-card" style={{ '--card-color': '#f59e0b' }}>
              <div className="ct-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <span className="ct-card-label">Address</span>
              <a
                className="ct-card-value ct-link-block"
                href={mapUrl || `https://maps.google.com/?q=${encodeURIComponent(address)}`}
                target="_blank" rel="noreferrer"
              >
                {address}
              </a>
            </div>
          )}

          {openingTime && (
            <div className="ct-card" style={{ '--card-color': '#22c55e' }}>
              <div className="ct-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <span className="ct-card-label">Working Hours</span>
              <span className="ct-card-value">{openingTime}</span>
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="ct-middle">
          {/* Brand / WhatsApp box */}
          <div className="ct-brand-box">
            <div className="ct-brand-icon">💥</div>
            <p className="ct-brand-tagline">Quality fireworks &amp; crackers for your celebrations</p>
            {waNumber && (
              <a className="ct-whatsapp-btn" href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            )}

            {/* Social links from API */}
            {socialLinks.length > 0 && (
              <div className="ct-social-list">
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    className="ct-social-item"
                    href={s.url?.startsWith('http') ? s.url : `https://${s.url}`}
                    target="_blank"
                    rel="noreferrer"
                    title={s.label}
                  >
                    {s.icon ? (
                      <img
                        src={resolveAssetUrl(s.icon)}
                        alt={s.label}
                        className="ct-social-icon"
                      />
                    ) : (
                      <span>{s.label}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Detail list */}
          <div className="ct-detail-list">
            <h3>Get In Touch</h3>
            {phones.length > 0 && (
              <div className="ct-detail-row">
                <span className="ct-detail-label">Phone</span>
                <div className="ct-detail-val">
                  {phones.map((p, i) => (
                    <a key={i} href={`tel:${p.replace(/\D/g,'')}`} className="ct-tel-link">{p}</a>
                  ))}
                </div>
              </div>
            )}
            {email && (
              <div className="ct-detail-row">
                <span className="ct-detail-label">Email</span>
                <a className="ct-detail-val ct-link" href={`mailto:${email}`}>{email}</a>
              </div>
            )}
            {address && (
              <div className="ct-detail-row">
                <span className="ct-detail-label">Address</span>
                <span className="ct-detail-val">{address}</span>
              </div>
            )}
            {openingTime && (
              <div className="ct-detail-row">
                <span className="ct-detail-label">Hours</span>
                <span className="ct-detail-val">{openingTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Map iframe — only when address or mapUrl available */}
        {mapEmbedSrc && (
          <div className="ct-map-wrap">
            <div className="ct-map-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Our Location</span>
              <a className="ct-map-open" href={mapEmbedSrc} target="_blank" rel="noreferrer">
                Open in Google Maps ↗
              </a>
            </div>
            <iframe
              className="ct-map-iframe"
              title="Location Map"
              src={mapEmbedSrc}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
