import React, { useEffect, useState } from 'react';
import { useProducts, type Product } from '../context/ProductContext';
import ProductCard from './ProductCard';

interface RecentlyViewedProps {
  currentProductId?: string;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { fetchProductBySlug } = useProducts();

  useEffect(() => {
    const loadAndValidate = async () => {
      try {
        const saved = localStorage.getItem('recentlyViewed');
        if (saved) {
          const list: Product[] = JSON.parse(saved);
          // Exclude the current product being viewed if provided
          const filtered = currentProductId
            ? list.filter((p) => p._id !== currentProductId)
            : list;
          
          const recentItems = filtered.slice(0, 4);
          
          // Validate that each product still exists in the database
          const validatedItems: Product[] = [];
          
          const validationPromises = recentItems.map(async (item) => {
            const exists = await fetchProductBySlug(item.slug);
            if (exists) {
              validatedItems.push(exists);
            }
          });
          
          await Promise.all(validationPromises);
          
          // Keep the original order of items
          const orderedValidatedItems = recentItems
            .map(item => validatedItems.find(vi => vi._id === item._id))
            .filter(Boolean) as Product[];

          setItems(orderedValidatedItems);

          // Update localStorage if some items were deleted
          if (orderedValidatedItems.length !== recentItems.length) {
            const updatedFullList = list.filter(item => 
              orderedValidatedItems.some(vi => vi._id === item._id) || (currentProductId && item._id === currentProductId)
            );
            localStorage.setItem('recentlyViewed', JSON.stringify(updatedFullList));
          }
        }
      } catch (error) {
        console.error('Failed to read/validate recently viewed from localStorage:', error);
      }
    };

    loadAndValidate();
  }, [currentProductId, fetchProductBySlug]);

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
