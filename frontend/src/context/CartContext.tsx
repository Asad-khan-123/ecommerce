import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  // Load cart items from localStorage on mount
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

  // Save cart items to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart items to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = newItem.quantity ?? 1;
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item._id === newItem._id &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingItemIndex > -1) {
        // Increment quantity of existing item variant
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += qtyToAdd;
        return updatedItems;
      } else {
        // Add as a new item variant
        return [...prevItems, { ...newItem, quantity: qtyToAdd }];
      }
    });
    // Auto-open drawer when an item is added
    setCartOpen(true);
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item._id === id && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (id: string, size: string, color: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id && item.size === size && item.color === color
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
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
