'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

/**
 * Fetch helper for cart API calls
 * Extracts the common pattern of getting token and parsing response
 */
async function cartFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (res.ok) {
    return { success: true, data: data.data };
  }
  throw new Error(data.message || 'Request failed');
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'user') {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const result = await cartFetch('/api/customer/cart', { method: 'GET' });
      if (result.success) {
        setCart(result.data);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const result = await cartFetch('/api/customer/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
      setCart(result.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const result = await cartFetch(`/api/customer/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
      setCart(result.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const result = await cartFetch(`/api/customer/cart/${itemId}`, {
        method: 'DELETE',
      });
      setCart(result.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
    try {
      const result = await cartFetch('/api/customer/cart', {
        method: 'DELETE',
      });
      setCart(result.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const cartItemsCount = cart?.items?.length || 0;
  const cartTotal = cart?.total || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartItemsCount,
        cartTotal,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
