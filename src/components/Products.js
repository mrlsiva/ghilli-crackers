import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getProducts, resolveAssetUrl } from '../services/api';
import './Products.css';

const getImage = (product) => {
  const img = product.image || product.thumbnail || (product.images && product.images[0]);
  if (!img) return null;
  return resolveAssetUrl(img);
};

const getDiscountBadge = (product) => {
  const mrp = product.pricing?.mrp || 0;
  const ourPrice = product.pricing?.our_price || product.price || 0;
  const savings = product.pricing?.savings || (mrp > ourPrice ? mrp - ourPrice : 0);
  const discountType = product.pricing?.discount_type;
  const discountValue = product.pricing?.discount_value;
  if (discountValue > 0) {
    return discountType === 'flat' ? `₹${discountValue} OFF` : `${discountValue}% OFF`;
  }
  return savings > 0 && mrp > 0 ? `${Math.round((savings / mrp) * 100)}% OFF` : null;
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category'));
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    getCategories()
      .then(data => { if (data.success) setCategories(data.data || []); })
      .catch(() => {});
  }, []);

  // Most common discount badge among currently loaded products, e.g. "75% OFF"
  const mostUsedOffer = useMemo(() => {
    const counts = {};
    products.forEach(product => {
      const badge = getDiscountBadge(product);
      if (badge) counts[badge] = (counts[badge] || 0) + 1;
    });
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    return entries.reduce((best, entry) => (entry[1] > best[1] ? entry : best))[0];
  }, [products]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await getProducts({
          category: selectedCategory,
          search: searchTerm,
          per_page: 100,
        });
        if (data.success) setProducts(data.data || []);
        setError(null);
      } catch {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  const selectCategory = (slug) => {
    setSelectedCategory(prev => prev === slug ? null : slug);
    searchRef.current?.focus();
  };

  return (
    <div className="pl-page" id="products-page">
      {/* Page Header */}
      <div className="pl-hero">
        <div className="pl-hero-inner">
          <h1 className="pl-hero-title">Our Products</h1>
          <p className="pl-hero-sub">Browse our premium collection of fireworks &amp; crackers</p>
          <div className="pl-search-wrap">
            <svg className="pl-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={searchRef}
              className="pl-search"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="pl-search-clear" onClick={() => setSearchTerm('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: horizontal category pills */}
      <div className="pl-cat-pills">
        <button
          className={`pl-pill ${selectedCategory === null ? 'pl-pill-active' : ''}`}
          onClick={() => selectCategory(null)}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`pl-pill ${selectedCategory === cat.slug ? 'pl-pill-active' : ''}`}
            onClick={() => selectCategory(cat.slug)}
          >
            {cat.name}
            {cat.products_count > 0 && (
              <span className="pl-pill-count">{cat.products_count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="pl-body">
        {/* Sidebar */}
        <aside className="pl-sidebar">
          <div className="pl-sidebar-inner">
            <h3 className="pl-sidebar-title">Categories</h3>
            <ul className="pl-cat-list">
              <li>
                <button
                  className={`pl-cat-btn ${selectedCategory === null ? 'active' : ''}`}
                  onClick={() => selectCategory(null)}
                >
                  <span className="pl-cat-name">All Products</span>
                  <span className="pl-cat-arrow">›</span>
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    className={`pl-cat-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => selectCategory(cat.slug)}
                  >
                    <span className="pl-cat-name">{cat.name}</span>
                    {cat.products_count > 0 && (
                      <span className="pl-cat-count">{cat.products_count}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {mostUsedOffer && (
              <div className="pl-sidebar-offer">
                <div className="pl-offer-badge">{mostUsedOffer}</div>
                <p className="pl-offer-text">On selected products this Diwali season!</p>
                <div className="pl-offer-min">
                  <span>Min Order</span>
                  <strong>TN ₹3,000 · Others ₹5,000</strong>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="pl-main">
          {/* Toolbar */}
          <div className="pl-toolbar">
            <span className="pl-count">
              {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
              {selectedCategory && categories.find(c => c.slug === selectedCategory) && (
                <span className="pl-active-cat">
                  &nbsp;in {categories.find(c => c.slug === selectedCategory).name}
                </span>
              )}
            </span>
            {(selectedCategory || searchTerm) && (
              <button className="pl-clear-filters" onClick={() => { setSelectedCategory(null); setSearchTerm(''); }}>
                Clear filters ✕
              </button>
            )}
          </div>

          {error && <div className="pl-error">{error}</div>}

          {loading ? (
            <div className="pl-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="pl-card pl-card-skeleton">
                  <div className="pl-sk pl-sk-img" />
                  <div className="pl-sk-body">
                    <div className="pl-sk pl-sk-title" />
                    <div className="pl-sk pl-sk-line" />
                    <div className="pl-sk pl-sk-price" />
                    <div className="pl-sk pl-sk-btn" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="pl-empty">
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="32" cy="32" r="28"/>
                <path d="M20 32h24M32 20v24"/>
              </svg>
              <p>No products found</p>
              <small>Try a different search term or category</small>
            </div>
          ) : (
            <div className="pl-grid">
              {products.map(product => {
                const mrp = product.pricing?.mrp || 0;
                const ourPrice = product.pricing?.our_price || product.price || 0;
                const savings = product.pricing?.savings || (mrp > ourPrice ? mrp - ourPrice : 0);
                const discountType = product.pricing?.discount_type;
                const discountValue = product.pricing?.discount_value;
                const discountBadge = getDiscountBadge(product);
                const imgSrc = getImage(product);

                return (
                  <div key={product.id} className="pl-card">
                    <div className="pl-card-img-wrap">
                      {imgSrc ? (
                        <img src={imgSrc} alt={product.name} className="pl-card-img" loading="lazy" />
                      ) : (
                        <div className="pl-card-no-img">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21,15 16,10 5,21"/>
                          </svg>
                        </div>
                      )}
                      {discountBadge && (
                        <span className="pl-discount-badge">{discountBadge}</span>
                      )}
                    </div>
                    <div className="pl-card-body">
                      <p className="pl-card-cat">{product.category?.name || product.category_name || ''}</p>
                      <h3 className="pl-card-name">{product.name}</h3>
                      <p className="pl-card-per">{product.per || product.unit || '1 Pkt'}</p>
                      <div className="pl-card-pricing">
                        <div className="pl-card-price-row">
                          <span className="pl-card-price">₹{ourPrice}</span>
                          {mrp > 0 && <span className="pl-card-mrp">₹{mrp}</span>}
                        </div>
                        {savings > 0 && <span className="pl-card-save">Save ₹{savings}</span>}
                        {discountType === 'flat' && discountValue > 0 && savings === 0 && (
                          <span className="pl-card-save">Save ₹{discountValue}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
