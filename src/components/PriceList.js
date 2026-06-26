import React, { useState, useEffect } from 'react';
import { getPriceLists, resolveAssetUrl } from '../services/api';
import './InfoPages.css';

const openPdf = async (url) => {
  try {
    const res = await fetch(resolveAssetUrl(url));
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  } catch {
    // fallback: open directly
    window.open(resolveAssetUrl(url), '_blank');
  }
};

const PriceList = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(null);

  useEffect(() => {
    getPriceLists()
      .then(res => {
        if (res?.success && res.data) {
          setLists(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = async (item, i) => {
    setOpening(i);
    await openPdf(item.url);
    setOpening(null);
  };

  return (
    <div className="prl-page">
      <div className="prl-hero">
        <div className="prl-hero-inner">
          <span className="prl-hero-badge">Download</span>
          <h1 className="prl-hero-title">Price List</h1>
          <p className="prl-hero-sub">
            Download our latest price lists for all fireworks categories.
          </p>
        </div>
      </div>

      <div className="prl-body">
        {loading ? (
          <div className="prl-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="prl-card prl-skeleton">
                <div className="prl-sk-icon" />
                <div className="prl-sk-line" style={{ width: '70%', height: 18, marginBottom: 10 }} />
                <div className="prl-sk-line" style={{ width: '40%', height: 12 }} />
              </div>
            ))}
          </div>
        ) : lists.length === 0 ? (
          <div className="prl-empty">
            <span>📋</span>
            <p>Price lists coming soon.</p>
          </div>
        ) : (
          <div className="prl-grid">
            {lists.map((item, i) => (
              <div key={i} className="prl-card">
                <div className="prl-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <div className="prl-card-info">
                  <h3 className="prl-card-title">{item.title}</h3>
                  {item.updated_at && (
                    <span className="prl-card-year">Updated: {item.updated_at}</span>
                  )}
                </div>
                {item.url ? (
                  <button
                    onClick={() => handleOpen(item, i)}
                    disabled={opening === i}
                    className="prl-download-btn"
                  >
                    {opening === i ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ animation: 'spin 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        Opening…
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7,10 12,15 17,10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download PDF
                      </>
                    )}
                  </button>
                ) : (
                  <span className="prl-unavailable">Not available</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceList;
