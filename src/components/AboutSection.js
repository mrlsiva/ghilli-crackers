import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContentPage, resolveAssetUrl } from '../services/api';

const getBodyParagraphs = (html, limit = 2) => {
  if (!html) return [];
  return [...html.matchAll(/<p>([\s\S]*?)<\/p>/gi)]
    .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim())
    .filter(Boolean)
    .slice(0, limit);
};

const Skeleton = () => (
  <section className="about-us" id="about">
    <div className="about-us-inner">
      <div className="about-us-content">
        <div className="about-sk-line" style={{ width: '40%', height: 14, marginBottom: 18 }} />
        <div className="about-sk-line" style={{ width: '70%', height: 32, marginBottom: 18 }} />
        <div className="about-sk-line" style={{ width: '100%', height: 14, marginBottom: 10 }} />
        <div className="about-sk-line" style={{ width: '90%', height: 14, marginBottom: 10 }} />
        <div className="about-sk-line" style={{ width: '80%', height: 14, marginBottom: 28 }} />
        <div className="about-us-features">
          {[0, 1].map((i) => (
            <div className="about-us-feature" key={i}>
              <div className="about-sk-circle" />
              <div style={{ flex: 1 }}>
                <div className="about-sk-line" style={{ width: '60%', height: 14, marginBottom: 8 }} />
                <div className="about-sk-line" style={{ width: '80%', height: 12 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="about-us-media">
        <div className="about-sk-image" />
      </div>
    </div>
  </section>
);

const AboutSection = ({ teaser = false }) => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getContentPage(undefined, 'about-us')
      .then((res) => {
        if (!cancelled && res?.success && res.data) setAbout(res.data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Skeleton />;
  if (!about) return null;

  return (
    <section className="about-us" id="about">
      <div className="about-us-inner">
        <div className="about-us-content">
          {about.tag && <span className="about-us-tag">{about.tag}</span>}
          <h2 className="about-us-title">{about.title || 'About Us'}</h2>

          {teaser ? (
            getBodyParagraphs(about.body).map((para, idx) => <p key={idx}>{para}</p>)
          ) : (
            <div
              className="about-us-body"
              dangerouslySetInnerHTML={{ __html: about.body || '' }}
            />
          )}

          {Array.isArray(about.features) && about.features.length > 0 && (
            <div className="about-us-features">
              {about.features.map((feature, idx) => (
                <div className="about-us-feature" key={idx}>
                  <span className="about-us-feature-icon">
                    <i className={`fas fa-${feature.icon}`} />
                  </span>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {teaser && about.button_url && (
            <Link to={about.button_url} className="btn btn-primary btn-lg"
              target={about.button_open_in_new_tab ? '_blank' : undefined}
              rel={about.button_open_in_new_tab ? 'noopener noreferrer' : undefined}
            >
              {about.button_label || 'Learn More About Us'}
            </Link>
          )}
        </div>

        {about.image && (
          <div className="about-us-media">
            <img src={resolveAssetUrl(about.image)} alt={about.title || 'About Us'} />
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
