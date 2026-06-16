import React, { useEffect, useState } from 'react';
import type { Product } from '../context/ProductContext';
import ProductCard from './ProductCard';

interface RecentlyViewedProps {
  currentProductId: string;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId }) => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentlyViewed');
      if (saved) {
        const list: Product[] = JSON.parse(saved);
        // Exclude the current product being viewed
        setItems(list.filter((p) => p._id !== currentProductId));
      }
    } catch (error) {
      console.error('Failed to read recently viewed from localStorage:', error);
    }
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <div className="border-t border-[#E8E8E8] px-6 py-16 lg:px-[80px] font-['Poppins']">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="text-center text-[13px] font-medium tracking-[0.25em] uppercase text-[#212121] mb-10">
          Recently Viewed
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {items.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default RecentlyViewed;
