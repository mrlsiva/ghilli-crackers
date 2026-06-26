import React, { useEffect, useState } from 'react';
import { getOrderSteps, getContact, resolveAssetUrl } from '../services/api';

const StepIcon = ({ icon }) => {
  if (!icon) return <i className="fas fa-circle" />;
  if (icon.startsWith('/') || icon.startsWith('http')) {
    return <img src={resolveAssetUrl(icon)} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />;
  }
  return <i className={`fas fa-${icon}`} />;
};

const GRADIENTS = [
  'linear-gradient(135deg, #f54b64, #f78361)',
  'linear-gradient(135deg, #9c4fff, #c471ed)',
  'linear-gradient(135deg, #4f8bff, #7b61ff)',
  'linear-gradient(135deg, #00c6a2, #00b4d8)',
  'linear-gradient(135deg, #ff9a3c, #ff6b35)',
  'linear-gradient(135deg, #f9c74f, #f8961e)',
];

const Skeleton = () => (
  <section className="hto-section" id="how-to-order">
    <div className="hto-header">
      <div className="hto-sk-line" style={{ width: 220, height: 38, margin: '0 auto 14px' }} />
      <div className="hto-sk-line" style={{ width: 320, height: 16, margin: '0 auto' }} />
    </div>
    <div className="hto-grid">
      {[...Array(4)].map((_, i) => (
        <div className="hto-card" key={i}>
          <div className="hto-sk-badge" />
          <div className="hto-sk-icon" />
          <div className="hto-sk-line" style={{ width: '60%', height: 18, margin: '18px auto 10px' }} />
          <div className="hto-sk-line" style={{ width: '85%', height: 13, margin: '0 auto 6px' }} />
          <div className="hto-sk-line" style={{ width: '70%', height: 13, margin: '0 auto' }} />
        </div>
      ))}
    </div>
  </section>
);

const HowToOrder = () => {
  const [steps, setSteps] = useState([]);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getOrderSteps(), getContact()])
      .then(([stepsRes, contactRes]) => {
        if (cancelled) return;
        if (stepsRes?.success && stepsRes.data) {
          const d = stepsRes.data;
          setSteps(Array.isArray(d) ? d : (d.steps || []));
        }
        if (contactRes?.success && contactRes.data) setContact(contactRes.data);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Skeleton />;

  return (
    <section className="hto-section" id="how-to-order">
      <div className="hto-header">
        <h2 className="hto-title">How to <span>Order?</span></h2>
        <p className="hto-subtitle">Simple and hassle-free ordering process in just a few steps</p>
      </div>

      {steps.length > 0 && (
        <div className="hto-grid">
          {steps.map((step, idx) => (
            <div className="hto-card" key={step.id || idx}>
              <span className="hto-step-num">{step.step || idx + 1}</span>
              <div
                className="hto-icon-wrap"
                style={{ background: GRADIENTS[idx % GRADIENTS.length] }}
              >
                <StepIcon icon={step.icon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      )}

      {contact && (
        <div className="hto-support">
          <div className="hto-support-left">
            <span className="hto-support-badge">
              <i className="fas fa-clock" /> 24/7 Support Available
            </span>
            <h3>Need Help with Your Order?</h3>
            <p>
              Our dedicated customer support team is available 24/7 to assist you
              with any questions or concerns about your order.
            </p>
            <div className="hto-support-features">
              <span><i className="fas fa-bolt" /> Fast Response</span>
              <span><i className="fas fa-shield-alt" /> Secure Ordering</span>
              <span><i className="fas fa-headset" /> Dedicated Support</span>
              <span><i className="fas fa-check-circle" /> Easy Assistance</span>
            </div>
            <div className="hto-support-actions">
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="btn btn-primary btn-lg">
                  <i className="fas fa-phone" /> Call: {contact.phone}
                </a>
              )}
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                  className="btn btn-outline-gold btn-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-whatsapp" /> WhatsApp Us
                </a>
              )}
            </div>
          </div>

          <div className="hto-support-right">
            <div className="hto-support-card">
              <button className="hto-sparkle" aria-hidden="true">✦</button>

              <div className="hto-headphones-wrap">
                <div className="hto-headphones-glow" />
                <div className="hto-headphones-circle">
                  <i className="fas fa-headphones" />
                </div>
              </div>

              <div className="hto-channels">
                {contact.phone && (
                  <div className="hto-channel">
                    <span className="hto-channel-icon" style={{ background: 'linear-gradient(135deg,#f54b64,#f78361)' }}>
                      <i className="fas fa-phone" />
                    </span>
                    <div className="hto-channel-info">
                      <strong>Phone Support</strong>
                      <span>Instant help via call</span>
                    </div>
                    <i className="far fa-check-circle hto-channel-check" />
                  </div>
                )}
                {contact.whatsapp && (
                  <div className="hto-channel">
                    <span className="hto-channel-icon" style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)' }}>
                      <i className="fab fa-whatsapp" />
                    </span>
                    <div className="hto-channel-info">
                      <strong>WhatsApp Chat</strong>
                      <span>Quick messaging support</span>
                    </div>
                    <i className="far fa-check-circle hto-channel-check" />
                  </div>
                )}
                {contact.email && (
                  <div className="hto-channel">
                    <span className="hto-channel-icon" style={{ background: 'linear-gradient(135deg,#4f8bff,#7b61ff)' }}>
                      <i className="fas fa-envelope" />
                    </span>
                    <div className="hto-channel-info">
                      <strong>Email Support</strong>
                      <span>Detailed assistance</span>
                    </div>
                    <i className="far fa-check-circle hto-channel-check" />
                  </div>
                )}
              </div>

              <div className="hto-stats">
                <div><span>&lt;5min</span><small>Avg Response</small></div>
                <div className="hto-stats-divider" />
                <div><span>99%</span><small>Satisfaction</small></div>
              </div>

              <div className="hto-shield">
                <i className="fas fa-shield-alt" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HowToOrder;
