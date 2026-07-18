import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, resolveAssetUrl } from '../services/api';
import './ExclusiveCategories.css';

const CARD_LIMIT = 8;

const Skeleton = () => (
  <section className="exc-section">
    <div className="exc-header">
      <span className="exc-tag">Our Products</span>
      <h2 className="exc-title">Our Exclusive <span>Categories</span></h2>
      <p className="exc-subtitle">Explore our wide range of premium fireworks and crackers for every celebration</p>
    </div>
    <div className="exc-grid">
      {[...Array(CARD_LIMIT)].map((_, i) => (
        <div className="exc-card exc-card-skeleton" key={i}>
          <div className="exc-sk exc-sk-img" />
          <div className="exc-card-body">
            <div className="exc-sk exc-sk-line" style={{ width: '60%', height: 16, marginBottom: 8 }} />
            <div className="exc-sk exc-sk-line" style={{ width: '80%', height: 12 }} />
          </div>
        </div>
      ))}
    </div>
  </section>
);

const ExclusiveCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((res) => {
        if (!cancelled && res?.success && res.data) {
          setCategories(res.data.filter((cat) => cat.is_exclusive).slice(0, CARD_LIMIT));
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Skeleton />;
  if (categories.length === 0) return null;

  return (
    <section className="exc-section">
      <div className="exc-header">
        <span className="exc-tag">Our Products</span>
        <h2 className="exc-title">Our Exclusive <span>Categories</span></h2>
        <p className="exc-subtitle">Explore our wide range of premium fireworks and crackers for every celebration</p>
      </div>

      <div className="exc-grid">
        {categories.map((cat) => (
          <Link to={`/products?category=${cat.slug}`} className="exc-card" key={cat.id}>
            <div className="exc-card-img-wrap">
              <img src={resolveAssetUrl(cat.image)} alt={cat.name} className="exc-card-img" loading="lazy" />
            </div>
            <div className="exc-card-body">
              <h3 className="exc-card-title">{cat.name}</h3>
              <p className="exc-card-desc">
                {cat.products_count} product{cat.products_count === 1 ? '' : 's'} available
              </p>
              <span className="exc-card-link">Explore →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="exc-footer">
        <Link to="/products" className="exc-view-all-btn">View All Products</Link>
      </div>
    </section>
  );
};

export default ExclusiveCategories;
