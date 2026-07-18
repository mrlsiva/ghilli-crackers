import React, { useState } from 'react';
import { trackOrders } from '../services/api';
import './OrderTrack.css';

const detectType = (val) => {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'email';
  if (/^\d{7,15}$/.test(val.replace(/\s/g, ''))) return 'phone';
  return 'order';
};

const formatDate = (raw) => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const STATUS_COLOR = {
  processing:  { bg: '#fef9c3', text: '#854d0e', dot: '#eab308' },
  confirmed:   { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  shipped:     { bg: '#e0f2fe', text: '#075985', dot: '#0ea5e9' },
  delivered:   { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
  cancelled:   { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
};

const statusStyle = (status = '') => STATUS_COLOR[status.toLowerCase()] || { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af' };

const OrderTrack = () => {
  const [query, setQuery]     = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders]   = useState(null);
  const [error, setError]     = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const val = query.trim();
    if (!val) return;

    setLoading(true);
    setError('');
    setOrders(null);

    const type = detectType(val);
    const filters = {
      ...(type === 'email' ? { customer_email: val } : {}),
      ...(type === 'phone' ? { customer_phone: val } : {}),
      ...(type === 'order' ? { order_number: val } : {}),
    };

    try {
      const res = await trackOrders(filters);
      if (res.success) {
        const data = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
        if (data.length === 0) {
          setError('No orders found. Please check your details and try again.');
        } else {
          setOrders(data);
        }
      } else {
        setError(res.message || 'No orders found.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ot-page">
      {/* Hero */}
      <div className="ot-hero">
        <div className="ot-hero-inner">
          <div className="ot-hero-icon">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.12)"/>
              <path d="M14 20h20M14 24h14M14 28h10" stroke="#0051A7" strokeWidth="2.5" strokeLinecap="round"/>
              <rect x="10" y="12" width="28" height="24" rx="3" stroke="#fff" strokeWidth="2.5"/>
              <circle cx="36" cy="36" r="8" fill="#22c55e"/>
              <path d="M32.5 36l2.5 2.5 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="ot-hero-title">Track Your Order</h1>
          <p className="ot-hero-sub">Enter your mobile number, order ID, or email address to track your order</p>

          <form className="ot-form" onSubmit={handleSearch}>
            <div className="ot-input-wrap">
              <svg className="ot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="ot-input"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Mobile / Order ID / Email"
                autoFocus
              />
              {query && (
                <button type="button" className="ot-input-clear" onClick={() => { setQuery(''); setOrders(null); setError(''); }}>✕</button>
              )}
            </div>
            <button type="submit" className="ot-btn-track" disabled={loading || !query.trim()}>
              {loading ? <><span className="ot-spinner" /> Searching…</> : 'Track Order'}
            </button>
          </form>

          <div className="ot-hints">
            <span>📱 Mobile number</span>
            <span>🔖 Order ID</span>
            <span>📧 Email address</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="ot-results-wrap">
        {error && (
          <div className="ot-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {orders && orders.map((order, i) => {
          const st = statusStyle(order.status);
          const items = order.items || order.order_items || [];
          return (
            <div key={order.id || order.order_number || i} className="ot-card">
              {/* Card Header */}
              <div className="ot-card-header">
                <div>
                  <span className="ot-card-label">Order Number</span>
                  <span className="ot-card-num">#{order.order_number || order.id}</span>
                </div>
                <span className="ot-status-badge" style={{ background: st.bg, color: st.text }}>
                  <span className="ot-status-dot" style={{ background: st.dot }} />
                  {order.status || 'Processing'}
                </span>
              </div>

              {/* Order Meta */}
              <div className="ot-card-meta">
                <div className="ot-meta-item">
                  <span className="ot-meta-label">Order Date</span>
                  <span className="ot-meta-value">{formatDate(order.created_at || order.order_date)}</span>
                </div>
                <div className="ot-meta-item">
                  <span className="ot-meta-label">Customer</span>
                  <span className="ot-meta-value">{order.customer_name || '—'}</span>
                </div>
                <div className="ot-meta-item">
                  <span className="ot-meta-label">Phone</span>
                  <span className="ot-meta-value">{order.customer_phone || '—'}</span>
                </div>
                <div className="ot-meta-item">
                  <span className="ot-meta-label">City</span>
                  <span className="ot-meta-value">{order.customer_city || '—'}</span>
                </div>
              </div>

              {/* Items */}
              {items.length > 0 && (
                <div className="ot-items">
                  <h4 className="ot-items-title">Items Ordered</h4>
                  <div className="ot-items-list">
                    {items.map((item, j) => (
                      <div key={j} className="ot-item-row">
                        <span className="ot-item-name">{item.product_name || item.name || `Product #${item.product_id}`}</span>
                        <span className="ot-item-qty">× {item.quantity}</span>
                        {item.price && <span className="ot-item-price">₹{item.price * item.quantity}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              {(order.total_amount || order.total) && (
                <div className="ot-card-total">
                  <span>Total Amount</span>
                  <strong>₹{Number(order.total_amount || order.total).toLocaleString('en-IN')}</strong>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty placeholder before search */}
        {!orders && !error && !loading && (
          <div className="ot-placeholder">
            <svg viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="36" fill="#f3f4f6"/>
              <rect x="24" y="22" width="32" height="36" rx="3" fill="#e5e7eb"/>
              <rect x="29" y="30" width="22" height="3" rx="1.5" fill="#9ca3af"/>
              <rect x="29" y="37" width="16" height="3" rx="1.5" fill="#9ca3af"/>
              <rect x="29" y="44" width="19" height="3" rx="1.5" fill="#9ca3af"/>
            </svg>
            <p>Enter your details above to see your order status</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrack;
