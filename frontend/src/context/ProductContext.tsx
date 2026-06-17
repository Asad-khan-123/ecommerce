import React, { createContext, useContext, useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000/api';

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  inventory: number;
  isActive: boolean;
  menuItem?: { _id: string; title: string; slug: string } | null;
  columnId?: string | null;
  subMenuItemId?: string | null;
  tag?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductFilters {
  menuItem?: string;
  columnId?: string;
  subMenuItemId?: string;
  page?: number;
  limit?: number;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<Product | null>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (filters: ProductFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.menuItem) params.append('menuItem', filters.menuItem);
      if (filters.columnId) params.append('columnId', filters.columnId);
      if (filters.subMenuItemId) params.append('subMenuItemId', filters.subMenuItemId);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));

      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${API_BASE_URL}/products${query}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data || []);
      } else {
        setError(data.message || 'Failed to load products.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductBySlug = useCallback(async (slug: string): Promise<Product | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/slug/${slug}`);
      const data = await res.json();
      if (data.success) return data.data as Product;
      return null;
    } catch {
      return null;
    }
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error, fetchProducts, fetchProductBySlug }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
};
