import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '../utils/api';

export interface CartItem {
  _id: string; // Product ID
  title: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to map populated backend cart structure to frontend flat CartItem structure
const mapBackendCartToFrontend = (backendCart: any): CartItem[] => {
  if (!backendCart || !backendCart.items) return [];
  return backendCart.items.map((item: any) => ({
    _id: item.product?._id || '',
    title: item.product?.title || 'Unknown Product',
    slug: item.product?.slug || '',
    price: item.product?.price || 0,
    image: item.product?.images?.[0] || '',
    size: item.size,
    color: item.color,
    quantity: item.quantity
  }));
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const { token } = useAuth();

  // Load cached cart items from localStorage on mount (for instant UI display on refresh)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart items from localStorage:', error);
    }
  }, []);

  // Save cart items to localStorage on every change (cache mechanism)
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart items to localStorage:', error);
    }
  }, [cartItems]);

  // Sync cart items with backend database on login status change
  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const res = await cartApi.getCart();
          if (res.success && res.data) {
            setCartItems(mapBackendCartToFrontend(res.data));
          }
        } catch (error) {
          console.error('Failed to fetch cart from database:', error);
        }
      } else {
        setCartItems([]);
      }
    };

    fetchCart();
  }, [token]);

  const addToCart = async (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = newItem.quantity ?? 1;
    // Auto-open drawer when adding
    setCartOpen(true);

    if (token) {
      try {
        const res = await cartApi.addToCart({
          productId: newItem._id,
          size: newItem.size,
          color: newItem.color,
          quantity: qtyToAdd
        });
        if (res.success && res.data) {
          setCartItems(mapBackendCartToFrontend(res.data));
        }
      } catch (error) {
        console.error('Failed to add to cart on backend:', error);
      }
    } else {
      // Local fallback (though gated, useful for testing or robust handling)
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) =>
            item._id === newItem._id &&
            item.size === newItem.size &&
            item.color === newItem.color
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += qtyToAdd;
          return updatedItems;
        } else {
          return [...prevItems, { ...newItem, quantity: qtyToAdd }];
        }
      });
    }
  };

  const removeFromCart = async (id: string, size: string, color: string) => {
    if (token) {
      try {
        const res = await cartApi.removeFromCart({ productId: id, size, color });
        if (res.success && res.data) {
          setCartItems(mapBackendCartToFrontend(res.data));
        }
      } catch (error) {
        console.error('Failed to remove from cart on backend:', error);
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) => !(item._id === id && item.size === size && item.color === color)
        )
      );
    }
  };

  const updateQuantity = async (id: string, size: string, color: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    if (token) {
      try {
        const res = await cartApi.updateQuantity({
          productId: id,
          size,
          color,
          quantity: qty
        });
        if (res.success && res.data) {
          setCartItems(mapBackendCartToFrontend(res.data));
        }
      } catch (error) {
        console.error('Failed to update quantity on backend:', error);
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id && item.size === size && item.color === color
            ? { ...item, quantity: qty }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (token) {
      try {
        const res = await cartApi.clearCart();
        if (res.success) {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Failed to clear cart on backend:', error);
      }
    } else {
      setCartItems([]);
    }
  };

  // Memoize counts and subtotals to avoid redundant calculations
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
