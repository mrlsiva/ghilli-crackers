import React from 'react';
import { Link } from 'react-router-dom';
import './BrowseByCategory.css';

const TILES = [
  { label: 'Rockets', count: '52 products', href: '/products', icon: '/images/festival/1.png' },
  { label: 'Flower Pots & Fountains', count: '34 products', href: '/products', icon: '/images/festival/2.png' },
  { label: 'Aerial Show Crackers', count: '18 products', href: '/products', icon: '/images/festival/3.png' },
  { label: 'Kids-Safe Crackers', count: '12 products', href: '/products', icon: '/images/festival/4.png' },
  { label: 'Gift Boxes & Combos', count: '14 products', href: '/products', icon: '/images/festival/5.png' },
  { label: 'Wholesale Bulk Orders', count: 'Best rates', href: '/contact', icon: '/images/festival/6.png' },
];

const BrowseByCategory = () => (
  <section className="bbc-section">
    <div className="bbc-header">
      <span className="bbc-tag">Browse by Category</span>
      <h2 className="bbc-title">Everything you need for <span>the festival</span></h2>
      <p className="bbc-subtitle">Six curated categories, quality-checked and ready for family celebrations or wholesale orders.</p>
    </div>

    <div className="bbc-grid">
      {TILES.map((tile) => (
        <Link to={tile.href} className="bbc-tile" key={tile.label}>
          <span className="bbc-tile-icon">
            <img src={tile.icon} alt="" />
          </span>
          <span className="bbc-tile-label">{tile.label}</span>
          <span className="bbc-tile-count">{tile.count}</span>
        </Link>
      ))}
    </div>
  </section>
);

export default BrowseByCategory;
