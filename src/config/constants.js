export const APP_NAME = 'EasyShop';
export const APP_DESCRIPTION = 'Modern e-commerce store';

// API_URL must be set via NEXT_PUBLIC_APP_URL in production.
// In development, fallback to localhost.
// NEXT_PUBLIC_APP_URL is required in Vercel for client-side API calls to work.
export const API_URL = process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : '');

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_APP_URL) {
  console.error('[ERROR] CRITICAL: NEXT_PUBLIC_APP_URL is not set. API calls will fail in production.');
}

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: (id) => `/orders/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_DASHBOARD: '/admin/dashboard',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
  COD: 'cod',
  CARD: 'card',
  EASYPAISA: 'easypaisa',
  JAZZCASH: 'jazzcash',
};

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home',
  'Sports',
  'Beauty',
  'Toys',
  'Food',
  'Fashion',
  'Health',
  'Automotive',
  'Garden',
  'Music',
  'Office Supplies',
  'Pet Supplies',
];

export const FREE_SHIPPING_THRESHOLD = 1500; // Free shipping above Rs. 1500
export const TAX_RATE = 0.1; // 10% tax
