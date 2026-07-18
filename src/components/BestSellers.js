import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, resolveAssetUrl } from '../services/api';
import './BestSellers.css';

const CARD_LIMIT = 4;

const getBadge = (product) => {
  if (product.badge_text) return { text: product.badge_text, kind: 'custom' };

  const mrp = product.pricing?.mrp || 0;
  const ourPrice = product.pricing?.our_price || 0;
  const discountType = product.pricing?.discount_type;
  const discountValue = product.pricing?.discount_value;
  if (discountValue > 0) {
    const text = discountType === 'flat' ? `₹${discountValue} OFF` : `${discountValue}% OFF`;
    return { text, kind: 'discount' };
  }
  const savings = product.pricing?.savings || (mrp > ourPrice ? mrp - ourPrice : 0);
  if (savings > 0 && mrp > 0) {
    return { text: `${Math.round((savings / mrp) * 100)}% OFF`, kind: 'discount' };
  }
  return null;
};

const Skeleton = () => (
  <section className="bs-section">
    <div className="bs-header">
      <span className="bs-tag">Loved by 50,000+ families</span>
      <h2 className="bs-title">This season's <span>best sellers</span></h2>
      <p className="bs-subtitle">Hand-picked combos and classics, quality tested before they leave our warehouse.</p>
    </div>
    <div className="bs-grid">
      {[...Array(CARD_LIMIT)].map((_, i) => (
        <div className="bs-card bs-card-skeleton" key={i}>
          <div className="bs-sk bs-sk-img" />
          <div className="bs-card-body">
            <div className="bs-sk bs-sk-line" style={{ width: '50%', height: 11, marginBottom: 8 }} />
            <div className="bs-sk bs-sk-line" style={{ width: '85%', height: 14, marginBottom: 10 }} />
            <div className="bs-sk bs-sk-line" style={{ width: '40%', height: 18 }} />
          </div>
        </div>
      ))}
    </div>
  </section>
);

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getProducts({ bestseller: true, per_page: CARD_LIMIT }),
      getProducts({ per_page: 1 }),
    ])
      .then(([bestsellerRes, allRes]) => {
        if (cancelled) return;
        if (bestsellerRes?.success) setProducts(bestsellerRes.data || []);
        if (allRes?.success) setTotalCount(allRes.meta?.total ?? null);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Skeleton />;
  if (products.length === 0) return null;

  return (
    <section className="bs-section">
      <div className="bs-header">
        <span className="bs-tag">Loved by 50,000+ families</span>
        <h2 className="bs-title">This season's <span>best sellers</span></h2>
        <p className="bs-subtitle">Hand-picked combos and classics, quality tested before they leave our warehouse.</p>
      </div>

      <div className="bs-grid">
        {products.map((product) => {
          const badge = getBadge(product);
          const mrp = product.pricing?.mrp || 0;
          const ourPrice = product.pricing?.our_price || product.price || 0;

          return (
            <Link
              to={`/products?category=${product.category?.slug || ''}`}
              className="bs-card"
              key={product.id}
            >
              <div className="bs-card-img-wrap">
                {badge && (
                  <span className={`bs-badge bs-badge-${badge.kind}`}>{badge.text}</span>
                )}
                <img src={resolveAssetUrl(product.image)} alt={product.name} className="bs-card-img" loading="lazy" />
              </div>
              <div className="bs-card-body">
                <p className="bs-card-cat">{product.category?.name || ''}</p>
                <h3 className="bs-card-name">{product.name}</h3>
                <div className="bs-card-price-row">
                  <span className="bs-card-price">₹{ourPrice}</span>
                  {mrp > 0 && mrp > ourPrice && <span className="bs-card-mrp">₹{mrp}</span>}
                  <span className="bs-card-cart" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bs-footer">
        <Link to="/products" className="bs-view-all-btn">
          View All{totalCount ? ` ${totalCount}` : ''} Products
        </Link>
      </div>
    </section>
  );
};

export default BestSellers;
