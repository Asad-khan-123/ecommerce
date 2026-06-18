import React, { useEffect, useState } from 'react';
import type { Product } from '../context/ProductContext';
import ProductCard from './ProductCard';

interface RecentlyViewedProps {
  currentProductId?: string;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId }) => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentlyViewed');
      if (saved) {
        const list: Product[] = JSON.parse(saved);
        // Exclude the current product being viewed if provided
        const filtered = currentProductId
          ? list.filter((p) => p._id !== currentProductId)
          : list;
        // Limit to 4 recently viewed products
        setItems(filtered.slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to read recently viewed from localStorage:', error);
    }
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <div className="bg-white font-['Poppins']">
      <div className="mx-auto w-full">
        {/* Section Heading */}
        <div className="border-t border-[#E8E8E8] py-12 text-center bg-white">
          <h2 className="text-[12px] font-normal tracking-[0.3em] uppercase text-[#212121]">
            Recently Viewed
          </h2>
        </div>
        {/* 4 Products Grid - Zero Gap 431-88 Style */}
        <div className="grid grid-cols-2 gap-0 lg:grid-cols-4 bg-white border-y border-[#E8E8E8]">
          {items.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
