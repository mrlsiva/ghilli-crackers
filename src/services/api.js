import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';
const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
const SITE_SLUG = 'ghilli';

export const resolveAssetUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSET_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const CACHE_PREFIX = 'crk_';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in localStorage
const mem = {};                    // in-memory: survives navigation, cleared on page refresh

const lsRead = (key) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) { localStorage.removeItem(CACHE_PREFIX + key); return null; }
    return data;
  } catch { return null; }
};

const lsWrite = (key, data, ttl = CACHE_TTL) => {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, expiresAt: Date.now() + ttl }));
  } catch {} // ignore storage quota errors
};

const cached = async (key, fetcher, ttl = CACHE_TTL) => {
  // 1. memory hit (fastest — survives in-app navigation)
  if (mem[key]) return mem[key];
  // 2. localStorage hit (survives page refresh)
  const stored = lsRead(key);
  if (stored) { mem[key] = stored; return stored; }
  // 3. fetch from API, then persist both layers
  const data = await fetcher();
  mem[key] = data;
  lsWrite(key, data, ttl);
  return data;
};

export const clearCache = (key) => {
  if (key) {
    delete mem[key];
    localStorage.removeItem(CACHE_PREFIX + key);
  } else {
    Object.keys(mem).forEach((k) => delete mem[k]);
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  }
};

// Sites
export const getSites = () =>
  cached('sites', () => api.get('/sites').then((r) => r.data));

export const getSite = (slug = SITE_SLUG) =>
  cached(`site:${slug}`, () => api.get(`/${slug}`).then((r) => r.data));

// Home Banner
export const getHomeBanner = (slug = SITE_SLUG) =>
  cached(`home-banner:${slug}`, () => api.get(`/${slug}/home-banner`).then((r) => r.data));

// Festival Offers
export const getFestivalOffer = (slug = SITE_SLUG) =>
  cached(`festival-offer:${slug}`, () => api.get(`/${slug}/festival-offer`).then((r) => r.data));

// Categories — short TTL since product counts change with new products
export const getCategories = (slug = SITE_SLUG) =>
  cached(`categories:${slug}`, () => api.get(`/${slug}/categories`).then((r) => r.data), 2 * 60 * 1000);

// Products — always fresh, never cached
export const getProducts = (filters = {}, slug = SITE_SLUG) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.per_page) params.append('per_page', filters.per_page);
  if (filters.bestseller) params.append('bestseller', '1');
  return api.get(`/${slug}/products?${params.toString()}`).then((r) => r.data);
};

export const getProduct = (slug, productSlug = '') =>
  api.get(`/${slug}/products/${productSlug}`).then((r) => r.data);

export const getCategoryProducts = (slug = SITE_SLUG, categorySlug = '', filters = {}) => {
  const params = new URLSearchParams();
  if (filters.per_page) params.append('per_page', filters.per_page);
  return api.get(`/${slug}/categories/${categorySlug}/products?${params.toString()}`).then((r) => r.data);
};

// Orders
export const placeOrder = async (orderData, slug = SITE_SLUG) => {
  try {
    const response = await api.post(`/${slug}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const trackOrders = async (filters = {}, slug = SITE_SLUG) => {
  try {
    const params = new URLSearchParams();
    if (filters.order_number) params.append('order_number', filters.order_number);
    if (filters.customer_email) params.append('customer_email', filters.customer_email);
    if (filters.customer_phone) params.append('customer_phone', filters.customer_phone);

    const response = await api.get(`/${slug}/orders/track?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error tracking orders:', error);
    throw error;
  }
};

export const getOrder = async (slug = SITE_SLUG, orderNumber = '') => {
  try {
    const response = await api.get(`/${slug}/orders/${orderNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Contact Info
export const getContact = (slug = SITE_SLUG) =>
  cached(`contact:${slug}`, () => api.get(`/${slug}/contact`).then((r) => r.data));

// Content Pages
export const getContentPages = (slug = SITE_SLUG) =>
  cached(`content:${slug}`, () => api.get(`/${slug}/content`).then((r) => r.data));

export const getContentPage = (slug = SITE_SLUG, key = '') =>
  cached(`content:${slug}:${key}`, () =>
    api.get(`/${slug}/content/${key}`).then((r) => r.data)
  );

// Client Logos
export const getClientLogos = (slug = SITE_SLUG) =>
  cached(`client-logos:${slug}`, () => api.get(`/${slug}/client-logos`).then((r) => r.data));

// Order Steps
export const getOrderSteps = (slug = SITE_SLUG) =>
  cached(`order-steps:${slug}`, () => api.get(`/${slug}/order-steps`).then((r) => r.data));

// Safety Tips
export const getSafetyTips = (slug = SITE_SLUG) =>
  cached(`safety-tips:${slug}`, () => api.get(`/${slug}/safety-tips`).then((r) => r.data));

// Price Lists
export const getPriceLists = (slug = SITE_SLUG) =>
  cached(`price-lists:${slug}`, () => api.get(`/${slug}/price-lists`).then((r) => r.data));

// Always hits the backend fresh — generates a branded PDF live from current product/price data.
export const getPriceListDownloadUrl = (slug = SITE_SLUG) =>
  `${API_BASE_URL}/${slug}/price-list/download`;

// FAQs
export const getFaqs = (slug = SITE_SLUG) =>
  cached(`faqs:${slug}`, () => api.get(`/${slug}/faqs`).then((r) => r.data));

// Prefetch all static data in one parallel burst.
// Call once on app startup — populates both memory + localStorage so
// every page/component gets instant data with no individual loading waits.
export const prefetchAll = (slug = SITE_SLUG) =>
  Promise.allSettled([
    getSite(slug),
    getHomeBanner(slug),
    getFestivalOffer(slug),
    getCategories(slug),
    getContact(slug),
    getClientLogos(slug),
    getOrderSteps(slug),
    getFaqs(slug),
    getContentPage(slug, 'about-us'),
    getContentPage(slug, 'banner-scrolling-text'),
  ]);

export const syncData = async (slug = SITE_SLUG) => {
  clearCache();
  return prefetchAll(slug);
};

export default api;
