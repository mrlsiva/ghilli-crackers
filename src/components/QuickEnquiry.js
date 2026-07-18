import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, placeOrder, resolveAssetUrl } from '../services/api';
import './QuickEnquiry.css';

const CART_STORAGE_KEY = 'vigo_qe_cart';

const loadStoredCart = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    return stored && typeof stored === 'object' ? stored : {};
  } catch {
    return {};
  }
};

const QuickEnquiry = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(loadStoredCart); // { productId: qty }
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    customerCity: '',
    customerDistrict: '',
    customerState: '',
    customerPincode: '',
    notes: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({ per_page: 200 });
        if (data.success && data.data) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getQty = (id) => cart[id] || 0;

  const setQty = useCallback((id, val) => {
    const qty = Math.max(0, parseInt(val) || 0);
    setCart(prev => {
      const next = { ...prev };
      if (qty === 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }, []);

  const increment = useCallback((id) => setQty(id, getQty(id) + 1), [cart]);
  const decrement = useCallback((id) => setQty(id, getQty(id) - 1), [cart]);

  const clearCart = () => {
    setCart({});
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const cartItems = products.filter(p => cart[p.id] > 0).map(p => ({
    ...p,
    qty: cart[p.id],
    total: (p.pricing?.our_price || p.price || 0) * cart[p.id],
  }));

  const cartTotal = cartItems.reduce((s, i) => s + i.total, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const orderData = {
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_email: formData.customerEmail,
        customer_address: formData.customerAddress,
        customer_city: formData.customerCity,
        customer_district: formData.customerDistrict,
        customer_state: formData.customerState,
        customer_pincode: formData.customerPincode,
        notes: formData.notes,
        items: cartItems.map(p => ({
          product_id: p.id,
          quantity: p.qty,
        })),
      };
      const res = await placeOrder(orderData);
      if (res.success) {
        const details = res.data || res;
        setOrderNumber(details.order_number || '');
        setOrderDetails({
          order_number: details.order_number || '—',
          order_date: details.created_at || details.order_date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          total: cartTotal,
          status: details.status || 'Processing',
        });
        setSubmitted(true);
        clearCart();
        setFormData({
          customerName: '', customerPhone: '', customerEmail: '',
          customerAddress: '', customerCity: '', customerDistrict: '',
          customerState: '', customerPincode: '', notes: '',
        });
      } else {
        alert(res.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDiscount = (pricing, mrp, ourPrice) => {
  const type = pricing?.discount_type;
  const value = pricing?.discount_value ?? pricing?.discount ?? (mrp - ourPrice);
  if (!value || value <= 0) return null;
  if (type === 'percentage') return `${value}%`;
  return `₹${value}`;
};

const getImage = (product) => {
    const img = product.image || product.thumbnail || (product.images && product.images[0]);
    if (!img) return null;
    return resolveAssetUrl(img);
  };

  return (
    <div className="qe-page" id="quick-enquiry">
      {/* Header */}
      <div className="qe-header">
        <div className="qe-header-inner">
          <div>
            <h2 className="qe-title">Quick Enquiry</h2>
            <p className="qe-subtitle">Add products to your cart and place an order instantly</p>
          </div>
          <div className="qe-search-wrap">
            <svg className="qe-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="qe-search"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {submitted && (
        <div className="qe-success">
          <span className="qe-success-icon">✓</span>
          <div>
            <strong>Order Placed Successfully!</strong>
            {orderNumber && <span> · Order #{orderNumber}</span>}
            <p>We'll contact you shortly with confirmation.</p>
          </div>
          <button className="qe-success-close" onClick={() => setSubmitted(false)}>✕</button>
        </div>
      )}

      {/* Product Table / Cards */}
      <div className="qe-table-wrap" style={{ paddingBottom: cartCount > 0 ? '100px' : '30px' }}>
        {loading ? (
          <div className="qe-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="qe-skeleton-row">
                <div className="qe-skeleton qe-sk-img" />
                <div className="qe-skeleton qe-sk-text" />
                <div className="qe-skeleton qe-sk-sm" />
                <div className="qe-skeleton qe-sk-sm" />
                <div className="qe-skeleton qe-sk-sm" />
                <div className="qe-skeleton qe-sk-sm" />
                <div className="qe-skeleton qe-sk-qty" />
                <div className="qe-skeleton qe-sk-sm" />
              </div>
            ))}
          </div>
        ) : (
          <table className="qe-table">
            <thead>
              <tr>
                <th className="th-preview">Preview</th>
                <th className="th-name">Product Name</th>
                <th className="th-per">Per</th>
                <th className="th-mrp">M.R.P (₹)</th>
                <th className="th-dis">Discount</th>
                <th className="th-price">Our Price (₹)</th>
                <th className="th-qty">Qty</th>
                <th className="th-total">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="qe-empty">No products found</td>
                </tr>
              ) : (() => {
                // Sort by category so same-category products are together
                const sorted = [...filteredProducts].sort((a, b) => {
                  const aName = a.category?.name || a.category_name || '';
                  const bName = b.category?.name || b.category_name || '';
                  return aName.localeCompare(bName);
                });
                const rows = [];
                let lastCatKey = undefined;
                sorted.forEach(product => {
                  const catKey = product.category?.id ?? product.category_id ?? '__none__';
                  const catName = product.category?.name || product.category_name || '';
                  if (catKey !== lastCatKey) {
                    lastCatKey = catKey;
                    if (catName) {
                      rows.push(
                        <tr key={`cat-${catKey}`} className="qe-cat-row">
                          <td colSpan="8">
                            <span className="qe-cat-label">{catName}</span>
                          </td>
                        </tr>
                      );
                    }
                  }

                  const mrp = product.pricing?.mrp || product.mrp || 0;
                  const ourPrice = product.pricing?.our_price || product.price || 0;
                  const discountLabel = formatDiscount(product.pricing, mrp, ourPrice);
                  const per = product.per || product.unit || '1 Pkt';
                  const qty = getQty(product.id);
                  const rowTotal = ourPrice * qty;
                  const imgSrc = getImage(product);

                  rows.push(
                  <tr key={product.id} className={qty > 0 ? 'qe-row-active' : ''}>
                    <td className="td-preview">
                      {imgSrc ? (
                        <img src={imgSrc} alt={product.name} className="qe-product-img" loading="lazy" />
                      ) : (
                        <div className="qe-img-placeholder">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21,15 16,10 5,21"/>
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="td-name">
                      <span className="qe-product-name">{product.name}</span>
                      {product.category_name && (
                        <span className="qe-product-cat">{product.category_name}</span>
                      )}
                    </td>
                    <td className="td-per">{per}</td>
                    <td className="td-mrp">
                      {mrp > 0 ? <span className="qe-mrp">₹{mrp}</span> : <span className="qe-na">—</span>}
                    </td>
                    <td className="td-dis">
                      {discountLabel
                        ? <span className="qe-discount">{discountLabel}</span>
                        : <span className="qe-na">—</span>}
                    </td>
                    <td className="td-price">
                      <span className="qe-our-price">₹{ourPrice}</span>
                    </td>
                    <td className="td-qty">
                      <div className="qe-qty-control">
                        <button
                          className="qe-qty-btn"
                          onClick={() => decrement(product.id)}
                          disabled={qty === 0}
                          aria-label="Decrease"
                        >−</button>
                        <input
                          className="qe-qty-input"
                          type="number"
                          min="0"
                          value={qty === 0 ? '' : qty}
                          placeholder="0"
                          onChange={e => setQty(product.id, e.target.value)}
                        />
                        <button
                          className="qe-qty-btn qe-qty-add"
                          onClick={() => increment(product.id)}
                          aria-label="Increase"
                        >+</button>
                      </div>
                    </td>
                    <td className="td-total">
                      {qty > 0 ? (
                        <span className="qe-row-total">₹{rowTotal}</span>
                      ) : <span className="qe-na">—</span>}
                    </td>
                  </tr>
                  );
                });
                return rows;
              })()}
            </tbody>
          </table>
        )}

        {/* Mobile card view */}
        {!loading && (() => {
          const sorted = [...filteredProducts].sort((a, b) => {
            const aName = a.category?.name || a.category_name || '';
            const bName = b.category?.name || b.category_name || '';
            return aName.localeCompare(bName);
          });
          const cards = [];
          let lastCatKey = undefined;
          sorted.forEach(product => {
            const catKey = product.category?.id ?? product.category_id ?? '__none__';
            const catName = product.category?.name || product.category_name || '';
            if (catKey !== lastCatKey) {
              lastCatKey = catKey;
              if (catName) {
                cards.push(
                  <div key={`mcat-${catKey}`} className="qe-mobile-cat">
                    {catName}
                  </div>
                );
              }
            }
            const mrp = product.pricing?.mrp || product.mrp || 0;
            const ourPrice = product.pricing?.our_price || product.price || 0;
            const discountLabel = formatDiscount(product.pricing, mrp, ourPrice);
            const per = product.per || product.unit || '1 Pkt';
            const qty = getQty(product.id);
            const rowTotal = ourPrice * qty;
            const imgSrc = getImage(product);
            cards.push(
              <div key={`mc-${product.id}`} className={`qe-mobile-card${qty > 0 ? ' qe-mobile-card-active' : ''}`}>
                <div className="qe-mc-top">
                  <div className="qe-mc-img-wrap">
                    {imgSrc ? (
                      <img src={imgSrc} alt={product.name} className="qe-mc-img" loading="lazy" />
                    ) : (
                      <div className="qe-mc-img-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21,15 16,10 5,21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="qe-mc-info">
                    <span className="qe-mc-name">{product.name}</span>
                    <span className="qe-mc-per">Per: {per}</span>
                  </div>
                </div>
                <div className="qe-mc-pricing">
                  {mrp > 0 && <div className="qe-mc-price-item"><span>MRP</span><span className="qe-mrp">₹{mrp}</span></div>}
                  {discountLabel && <div className="qe-mc-price-item"><span>Discount</span><span className="qe-discount">{discountLabel}</span></div>}
                  <div className="qe-mc-price-item"><span>Price</span><span className="qe-our-price">₹{ourPrice}</span></div>
                </div>
                <div className="qe-mc-footer">
                  <div className="qe-qty-control">
                    <button className="qe-qty-btn" onClick={() => decrement(product.id)} disabled={qty === 0} aria-label="Decrease">−</button>
                    <input
                      className="qe-qty-input"
                      type="number" min="0"
                      value={qty === 0 ? '' : qty}
                      placeholder="0"
                      onChange={e => setQty(product.id, e.target.value)}
                    />
                    <button className="qe-qty-btn qe-qty-add" onClick={() => increment(product.id)} aria-label="Increase">+</button>
                  </div>
                  {qty > 0 && <span className="qe-mc-total">₹{rowTotal}</span>}
                </div>
              </div>
            );
          });
          return <div className="qe-mobile-list">{cards}</div>;
        })()}
      </div>

      {/* Fixed Bottom Cart Bar */}
      {cartCount > 0 && (
        <div className="qe-cart-bar">
          {cartTotal < 3000 && (
            <div className="qe-min-order-warn">
              Minimum order ₹3,000 — add ₹{(3000 - cartTotal).toLocaleString('en-IN')} more to checkout
            </div>
          )}
          <div className="qe-cart-bar-inner">
            <div className="qe-cart-info">
              <span className="qe-cart-badge">{cartCount}</span>
              <span className="qe-cart-label">
                {cartItems.length} Product{cartItems.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="qe-cart-total-wrap">
              <span className="qe-cart-total-label">Total</span>
              <span className="qe-cart-total-amount">₹{cartTotal.toLocaleString('en-IN')}</span>
              {cartTotal < 3000 && (
                <span className="qe-cart-min-label">Min ₹3,000</span>
              )}
            </div>
            <div className="qe-cart-actions">
              <button className="qe-btn-clear" onClick={clearCart}>Clear</button>
              <button
                className="qe-btn-checkout"
                onClick={() => setShowCheckout(true)}
                disabled={cartTotal < 3000}
                title={cartTotal < 3000 ? 'Minimum order amount is ₹3,000' : ''}
              >
                Checkout
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="qe-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowCheckout(false); setOrderDetails(null); setSubmitted(false); } }}>
          <div className="qe-modal">
            <div className="qe-modal-header">
              <h3>{submitted ? 'Order Confirmed' : 'Complete Your Order'}</h3>
              <button className="qe-modal-close" onClick={() => { setShowCheckout(false); setOrderDetails(null); setSubmitted(false); }}>✕</button>
            </div>
            <div className="qe-modal-body">
              {submitted && orderDetails ? (
                /* ── Success Screen ── */
                <div className="qe-success-screen">
                  <div className="qe-tick-wrap">
                    <svg className="qe-tick-svg" viewBox="0 0 80 80" fill="none">
                      <circle cx="40" cy="40" r="38" stroke="#22c55e" strokeWidth="4" fill="#f0fdf4"/>
                      <path d="M22 41l13 13 23-26" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className="qe-thankyou-title">Thank you for your order!</h2>
                  <p className="qe-thankyou-sub">Your order was successfully placed and is being processed.</p>
                  <div className="qe-order-details-card">
                    <h4>Order Details</h4>
                    <div className="qe-detail-row">
                      <span>Order Number</span>
                      <strong>{orderDetails.order_number}</strong>
                    </div>
                    <div className="qe-detail-row">
                      <span>Order Date</span>
                      <strong>{orderDetails.order_date}</strong>
                    </div>
                    <div className="qe-detail-row">
                      <span>Total</span>
                      <strong>₹{orderDetails.total.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="qe-detail-row">
                      <span>Status</span>
                      <span className="qe-status-badge">{orderDetails.status}</span>
                    </div>
                  </div>
                  <button
                    className="qe-btn-done"
                    onClick={() => { setShowCheckout(false); setOrderDetails(null); setSubmitted(false); }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Order Summary */}
                  <div className="qe-order-summary">
                    <h4>Order Summary</h4>
                    <div className="qe-summary-list">
                      {cartItems.map(item => (
                        <div key={item.id} className="qe-summary-row">
                          <span className="qe-summary-name">{item.name}</span>
                          <span className="qe-summary-qty">× {item.qty}</span>
                          <span className="qe-summary-price">₹{item.total}</span>
                        </div>
                      ))}
                    </div>
                    <div className="qe-summary-total">
                      <span>Grand Total</span>
                      <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {/* Customer Form */}
                  <form onSubmit={handleSubmit} className="qe-checkout-form">
                    <h4>Your Details</h4>
                    <div className="qe-form-grid">
                      <div className="qe-field">
                        <label>Name *</label>
                        <input name="customerName" value={formData.customerName} onChange={handleFormChange} required placeholder="Full Name" />
                      </div>
                      <div className="qe-field">
                        <label>Phone *</label>
                        <input name="customerPhone" value={formData.customerPhone} onChange={handleFormChange} required placeholder="9876543210" type="tel" />
                      </div>
                      <div className="qe-field qe-field-full">
                        <label>Email</label>
                        <input name="customerEmail" value={formData.customerEmail} onChange={handleFormChange} placeholder="your@email.com" type="email" />
                      </div>
                      <div className="qe-field qe-field-full">
                        <label>Address *</label>
                        <textarea name="customerAddress" value={formData.customerAddress} onChange={handleFormChange} required placeholder="House No., Street, Area" rows={2} />
                      </div>
                      <div className="qe-field">
                        <label>City *</label>
                        <input name="customerCity" value={formData.customerCity} onChange={handleFormChange} required placeholder="Chennai" />
                      </div>
                      <div className="qe-field">
                        <label>District</label>
                        <input name="customerDistrict" value={formData.customerDistrict} onChange={handleFormChange} placeholder="District" />
                      </div>
                      <div className="qe-field">
                        <label>State</label>
                        <input name="customerState" value={formData.customerState} onChange={handleFormChange} placeholder="Tamil Nadu" />
                      </div>
                      <div className="qe-field">
                        <label>Pincode *</label>
                        <input name="customerPincode" value={formData.customerPincode} onChange={handleFormChange} required placeholder="600001" />
                      </div>
                      <div className="qe-field qe-field-full">
                        <label>Special Instructions</label>
                        <textarea name="notes" value={formData.notes} onChange={handleFormChange} placeholder="Any special delivery instructions..." rows={2} />
                      </div>
                    </div>
                    <button type="submit" className="qe-btn-place-order" disabled={submitting}>
                      {submitting ? (
                        <><span className="qe-spinner" /> Placing Order...</>
                      ) : (
                        <>Place Order · ₹{cartTotal.toLocaleString('en-IN')}</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickEnquiry;
