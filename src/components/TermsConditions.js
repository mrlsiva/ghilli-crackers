import React, { useState, useEffect } from 'react';
import { getContentPage } from '../services/api';
import './InfoPages.css';

const TermsConditions = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentPage(undefined, 'terms-and-conditions')
      .then(res => { if (res?.success && res.data) setContent(res.data); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (

    <div className="tc-page">

      <div className="tc-hero">
        <div className="tc-hero-inner">
          <h1 className="tc-hero-title">
            {content?.title || 'Terms & Conditions'}
          </h1>
          <p className="tc-hero-sub">Please read these terms carefully before using our services.</p>
        </div>
      </div>
      <div className="tc-body">
        {loading ? (
          <div className="tc-skeleton">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="tc-sk-line"
                style={{ width: `${70 + Math.random() * 30}%`, height: i % 4 === 0 ? 20 : 13, marginBottom: i % 4 === 0 ? 20 : 8 }}
              />
            ))}
          </div>
        ) : !content?.body ? (
          <div className="tc-empty">
            <p>Terms & Conditions content coming soon.</p>
          </div>
        ) : (
          <div
            className="tc-content"
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
        )}
      </div>

    </div>
  );
};

export default TermsConditions;
