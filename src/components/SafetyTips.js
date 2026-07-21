import React, { useState, useEffect } from 'react';
import { getSafetyTips, resolveAssetUrl } from '../services/api';
import './SafetyTips.css';

const SafetyTips = () => {
  const [images, setImages] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSafetyTips()
      .then(res => {
        if (res?.success && res.data) {
          setImages(Array.isArray(res.data.images) ? res.data.images : []);
          setTips(Array.isArray(res.data.tips) ? res.data.tips : []);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const isEmpty = !loading && images.length === 0 && tips.length === 0;

  return (
    <div className="st-page">
      {/* Hero */}
      <div className="st-hero">
        <div className="st-hero-inner">
          <span className="st-hero-badge">Stay Safe</span>
          <h1 className="st-hero-title">Safety Tips</h1>
          <p className="st-hero-sub">
            Fireworks are fun — but safety comes first. Follow these guidelines for a safe celebration.
          </p>
        </div>
      </div>

      <div className="st-body">
        {loading ? (
          <div className="st-skeleton-wrap">
            <div className="st-sk-banner" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="st-sk-row">
                <div className="st-sk-cell st-sk" style={{ width: 160, height: 18 }} />
                <div className="st-sk-cell-desc">
                  <div className="st-sk" style={{ width: '90%', height: 13, marginBottom: 8 }} />
                  <div className="st-sk" style={{ width: '75%', height: 13 }} />
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="st-empty">
            <span>🧨</span>
            <p>Safety tips coming soon.</p>
          </div>
        ) : (
          <>
            {/* Wide image gallery */}
            {images.length > 0 && (
              <div className="st-images-wrap">
                <div className="st-images-track">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={resolveAssetUrl(img.image)}
                      alt={`Safety tip ${i + 1}`}
                      className="st-banner-img"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tips table */}
            {tips.length > 0 && (
              <div className="st-tips-section">
                <h2 className="st-tips-heading">
                  You can ensure that this Diwali is a &lsquo;Safe Diwali&rsquo; with these tips
                </h2>
                <div className="st-tips-table">
                  {tips.map((tip, i) => (
                    <div key={i} className="st-tip-row">
                      <div className="st-tip-title">
                        {/* <span className="st-tip-num">{String(i + 1).padStart(2, '0')}</span> */}
                        {tip.title}
                      </div>
                      <div className="st-tip-desc">
                        {tip.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SafetyTips;
